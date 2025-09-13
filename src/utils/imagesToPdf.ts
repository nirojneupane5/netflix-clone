import { jsPDF } from 'jspdf';

export interface ImageFile {
  name: string;
  file: File;
  url: string;
}

export interface PdfConfig {
  margin: number;
  fontSize: number;
  quality: number;
  orientation: 'portrait' | 'landscape';
  pageSize: 'a4' | 'letter' | 'legal';
}

export const DEFAULT_PDF_CONFIG: PdfConfig = {
  margin: 20,
  fontSize: 10,
  quality: 0.8,
  orientation: 'portrait',
  pageSize: 'a4'
};

/**
 * Convert multiple image files to a single PDF
 */
export class ImageToPdfConverter {
  private config: PdfConfig;

  constructor(config: Partial<PdfConfig> = {}) {
    this.config = { ...DEFAULT_PDF_CONFIG, ...config };
  }

  /**
   * Convert images to PDF and return as blob
   */
  async convertToPdf(images: ImageFile[], filename: string = 'images.pdf'): Promise<Blob> {
    const pdf = new jsPDF({
      orientation: this.config.orientation,
      unit: 'mm',
      format: this.config.pageSize
    });

    let isFirstPage = true;

    for (let i = 0; i < images.length; i++) {
      const image = images[i];
      
      try {
        // Add new page for each image (except the first one)
        if (!isFirstPage) {
          pdf.addPage();
        }
        isFirstPage = false;

        // Convert image to base64
        const base64Data = await this.imageToBase64(image.file);
        
        // Get PDF page dimensions
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        
        // Calculate image dimensions
        const margin = this.config.margin;
        const maxWidth = pageWidth - (2 * margin);
        const maxHeight = pageHeight - (2 * margin) - 20; // Reserve space for filename
        
        // Get image dimensions
        const imgDimensions = await this.getImageDimensions(image.url);
        const { width: imgWidth, height: imgHeight } = imgDimensions;
        
        // Calculate scaling to maintain aspect ratio
        const scaleX = maxWidth / imgWidth;
        const scaleY = maxHeight / imgHeight;
        const scale = Math.min(scaleX, scaleY);
        
        const finalWidth = imgWidth * scale;
        const finalHeight = imgHeight * scale;
        
        // Center the image
        const x = (pageWidth - finalWidth) / 2;
        const y = margin;
        
        // Determine image format
        const format = this.getImageFormat(image.file.type);
        
        // Add image to PDF
        pdf.addImage(base64Data, format, x, y, finalWidth, finalHeight);
        
        // Add image name at the bottom
        pdf.setFontSize(this.config.fontSize);
        pdf.setTextColor(100, 100, 100);
        const textY = pageHeight - 10;
        pdf.text(image.name, margin, textY);
        
        // Add page number
        pdf.setFontSize(8);
        const pageNum = `${i + 1} / ${images.length}`;
        const pageNumWidth = pdf.getTextWidth(pageNum);
        pdf.text(pageNum, pageWidth - margin - pageNumWidth, textY);
        
      } catch (error) {
        console.error(`Error processing image ${image.name}:`, error);
        // Continue with next image
      }
    }

    // Return PDF as blob
    return new Blob([pdf.output('blob')], { type: 'application/pdf' });
  }

  /**
   * Convert images to PDF and download
   */
  async convertAndDownload(images: ImageFile[], filename: string = 'images.pdf'): Promise<void> {
    const pdfBlob = await this.convertToPdf(images, filename);
    this.downloadBlob(pdfBlob, filename);
  }

  /**
   * Convert File to base64
   */
  private imageToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  /**
   * Get image dimensions
   */
  private getImageDimensions(url: string): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve({ width: img.width, height: img.height });
      img.onerror = reject;
      img.src = url;
    });
  }

  /**
   * Get image format for jsPDF
   */
  private getImageFormat(mimeType: string): string {
    switch (mimeType) {
      case 'image/png':
        return 'PNG';
      case 'image/gif':
        return 'GIF';
      case 'image/bmp':
        return 'BMP';
      case 'image/webp':
        return 'WEBP';
      default:
        return 'JPEG';
    }
  }

  /**
   * Download blob as file
   */
  private downloadBlob(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

/**
 * Utility function to convert folder/files to PDF
 */
export async function convertImagesToPdf(
  files: FileList | File[], 
  config?: Partial<PdfConfig>,
  filename?: string
): Promise<void> {
  const converter = new ImageToPdfConverter(config);
  
  // Convert FileList to ImageFile array
  const imageFiles: ImageFile[] = [];
  const fileArray = Array.from(files);
  
  for (const file of fileArray) {
    if (file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      imageFiles.push({
        name: file.name,
        file: file,
        url: url
      });
    }
  }
  
  if (imageFiles.length === 0) {
    throw new Error('No valid image files found');
  }
  
  // Sort files alphabetically
  imageFiles.sort((a, b) => a.name.localeCompare(b.name));
  
  await converter.convertAndDownload(imageFiles, filename);
  
  // Clean up URLs
  imageFiles.forEach(img => URL.revokeObjectURL(img.url));
}

/**
 * Convert images from public folder (for Next.js)
 */
export async function convertPublicImagesToPdf(
  imagePaths: string[],
  config?: Partial<PdfConfig>,
  filename?: string
): Promise<void> {
  const converter = new ImageToPdfConverter(config);
  const imageFiles: ImageFile[] = [];
  
  for (const path of imagePaths) {
    try {
      const response = await fetch(path);
      const blob = await response.blob();
      const file = new File([blob], path.split('/').pop() || 'image', { type: blob.type });
      
      imageFiles.push({
        name: file.name,
        file: file,
        url: path
      });
    } catch (error) {
      console.error(`Failed to load image: ${path}`, error);
    }
  }
  
  if (imageFiles.length === 0) {
    throw new Error('No images could be loaded');
  }
  
  await converter.convertAndDownload(imageFiles, filename);
}
