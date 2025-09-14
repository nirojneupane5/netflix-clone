import { jsPDF } from 'jspdf';

export interface ImageFile {
  name: string;
  file: File;
  url: string;
}

export interface ConversionProgress {
  current: number;
  total: number;
  percentage: number;
  currentFileName: string;
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
  async convertToPdf(
    images: ImageFile[], 
    filename: string = 'images.pdf',
    onProgress?: (progress: ConversionProgress) => void
  ): Promise<Blob> {
    const pdf = new jsPDF({
      orientation: this.config.orientation,
      unit: 'mm',
      format: this.config.pageSize
    });

    let isFirstPage = true;

    // Process images in smaller batches to avoid memory issues
    const BATCH_SIZE = images.length > 500 ? 10 : 25; // Smaller batches for large sets
    
    for (let batchStart = 0; batchStart < images.length; batchStart += BATCH_SIZE) {
      const batchEnd = Math.min(batchStart + BATCH_SIZE, images.length);
      const batch = images.slice(batchStart, batchEnd);
      
      for (let i = 0; i < batch.length; i++) {
        const globalIndex = batchStart + i;
        const image = batch[i];
        
        // Report progress
        if (onProgress) {
          onProgress({
            current: globalIndex + 1,
            total: images.length,
            percentage: Math.round(((globalIndex + 1) / images.length) * 100),
            currentFileName: image.name
          });
        }
        
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
          const pageNum = `${globalIndex + 1} / ${images.length}`;
          const pageNumWidth = pdf.getTextWidth(pageNum);
          pdf.text(pageNum, pageWidth - margin - pageNumWidth, textY);
          
        } catch (error) {
          console.error(`Error processing image ${image.name}:`, error);
          
          // Report error in progress if callback exists
          if (onProgress) {
            onProgress({
              current: globalIndex + 1,
              total: images.length,
              percentage: Math.round(((globalIndex + 1) / images.length) * 100),
              currentFileName: `❌ Error: ${image.name}`
            });
          }
          
          // Continue with next image - don't fail entire conversion
          continue;
        }
        
        // Allow UI to update and garbage collection between images
        if (globalIndex % 5 === 0) {
          await new Promise(resolve => setTimeout(resolve, 10));
        }
      }
      
      // Force garbage collection and longer pause between batches
      if (batchEnd < images.length) {
        // Longer pause for large batches to allow memory cleanup
        const pauseTime = images.length > 500 ? 500 : 100;
        await new Promise(resolve => setTimeout(resolve, pauseTime));
        
        // Force garbage collection if available
        if (typeof window !== 'undefined' && 'gc' in window) {
          (window as any).gc();
        }
      }
    }

    // Return PDF as blob
    return new Blob([pdf.output('blob')], { type: 'application/pdf' });
  }

  /**
   * Convert images to PDF and download
   */
  async convertAndDownload(
    images: ImageFile[], 
    filename: string = 'images.pdf',
    onProgress?: (progress: ConversionProgress) => void
  ): Promise<void> {
    const pdfBlob = await this.convertToPdf(images, filename, onProgress);
    this.downloadBlob(pdfBlob, filename);
  }

  /**
   * Convert File to base64 with memory optimization
   */
  private imageToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        // Clean up reader immediately
        reader.onload = null;
        reader.onerror = null;
        resolve(result);
      };
      reader.onerror = () => {
        reader.onload = null;
        reader.onerror = null;
        reject(new Error(`Failed to read file: ${file.name}`));
      };
      reader.readAsDataURL(file);
    });
  }

  /**
   * Get image dimensions with memory cleanup
   */
  private getImageDimensions(url: string): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const dimensions = { width: img.width, height: img.height };
        // Clean up image immediately
        img.onload = null;
        img.onerror = null;
        img.src = '';
        resolve(dimensions);
      };
      img.onerror = () => {
        img.onload = null;
        img.onerror = null;
        img.src = '';
        reject(new Error('Failed to load image dimensions'));
      };
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
 * Memory-optimized utility function to convert folder/files to PDF
 */
export async function convertImagesToPdf(
  files: FileList | File[], 
  config?: Partial<PdfConfig>,
  filename?: string,
  onProgress?: (progress: ConversionProgress) => void
): Promise<void> {
  // Filter image files without creating URLs yet
  const imageFilesList: File[] = [];
  const fileArray = Array.from(files);
  
  for (const file of fileArray) {
    if (file.type.startsWith('image/')) {
      // Skip extremely large files that could cause string length issues
      const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB limit per image
      if (file.size > MAX_FILE_SIZE) {
        console.warn(`Skipping large file: ${file.name} (${Math.round(file.size / 1024 / 1024)}MB)`);
        continue;
      }
      imageFilesList.push(file);
    }
  }
  
  if (imageFilesList.length === 0) {
    throw new Error('No valid image files found');
  }
  
  // Sort files alphabetically for consistent ordering
  imageFilesList.sort((a, b) => a.name.localeCompare(b.name));
  
  // Validate large batch processing
  if (imageFilesList.length > 1000) {
    const proceed = confirm(
      `You're about to process ${imageFilesList.length} images. This may take a very long time and use significant memory. Continue?`
    );
    if (!proceed) {
      throw new Error('Conversion cancelled by user');
    }
  }
  
  // Use memory-optimized single PDF approach
  await convertImagesToPdfOptimized(imageFilesList, config, filename, onProgress);
}

/**
 * Memory-optimized PDF conversion that processes images one by one
 */
async function convertImagesToPdfOptimized(
  imageFilesList: File[],
  config?: Partial<PdfConfig>,
  filename: string = 'images.pdf',
  onProgress?: (progress: ConversionProgress) => void
): Promise<void> {
  const pdfConfig = { ...DEFAULT_PDF_CONFIG, ...config };
  
  // Create PDF document once
  const pdf = new jsPDF({
    orientation: pdfConfig.orientation,
    unit: 'mm',
    format: pdfConfig.pageSize
  });
  
  let isFirstPage = true;
  
  try {
    for (let i = 0; i < imageFilesList.length; i++) {
      const file = imageFilesList[i];
      
      // Report progress
      if (onProgress) {
        onProgress({
          current: i + 1,
          total: imageFilesList.length,
          percentage: Math.round(((i + 1) / imageFilesList.length) * 100),
          currentFileName: file.name
        });
      }
      
      let url: string | null = null;
      
      try {
        // Create URL only for current image
        url = URL.createObjectURL(file);
        
        // Add new page for each image (except the first one)
        if (!isFirstPage) {
          pdf.addPage();
        }
        isFirstPage = false;
        
        // Convert image to base64 with compression
        const base64Data = await imageToBase64Optimized(file, pdfConfig.quality);
        
        // Get PDF page dimensions
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        
        // Calculate image dimensions
        const margin = pdfConfig.margin;
        const maxWidth = pageWidth - (2 * margin);
        const maxHeight = pageHeight - (2 * margin) - 20; // Reserve space for filename
        
        // Get image dimensions
        const imgDimensions = await getImageDimensionsOptimized(url);
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
        const format = getImageFormatOptimized(file.type);
        
        // Add image to PDF
        pdf.addImage(base64Data, format, x, y, finalWidth, finalHeight);
        
        // Add image name at the bottom
        pdf.setFontSize(pdfConfig.fontSize);
        pdf.setTextColor(100, 100, 100);
        const textY = pageHeight - 10;
        pdf.text(file.name, margin, textY);
        
        // Add page number
        pdf.setFontSize(8);
        const pageNum = `${i + 1} / ${imageFilesList.length}`;
        const pageNumWidth = pdf.getTextWidth(pageNum);
        pdf.text(pageNum, pageWidth - margin - pageNumWidth, textY);
        
      } catch (error) {
        console.error(`Error processing image ${file.name}:`, error);
        
        // Report error in progress
        if (onProgress) {
          onProgress({
            current: i + 1,
            total: imageFilesList.length,
            percentage: Math.round(((i + 1) / imageFilesList.length) * 100),
            currentFileName: `❌ Error: ${file.name}`
          });
        }
      } finally {
        // Clean up URL immediately
        if (url) {
          try {
            URL.revokeObjectURL(url);
          } catch (error) {
            console.warn('Failed to revoke URL:', error);
          }
        }
      }
      
      // Allow UI to update and garbage collection
      if (i % 5 === 0) {
        await new Promise(resolve => setTimeout(resolve, 50));
      }
    }
    
    // Download the final PDF
    const pdfBlob = new Blob([pdf.output('blob')], { type: 'application/pdf' });
    downloadBlobOptimized(pdfBlob, filename);
    
  } catch (error) {
    console.error('PDF conversion failed:', error);
    throw error;
  }
}

// Optimized helper functions with compression
function imageToBase64Optimized(file: File, quality: number = 0.8): Promise<string> {
  return new Promise((resolve, reject) => {
    // Create image element to load the file
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      reject(new Error('Canvas context not available'));
      return;
    }
    
    img.onload = () => {
      try {
        // Calculate maximum dimensions to prevent string length issues
        // Reduce dimensions further for lower quality settings (large batches)
        const MAX_DIMENSION = quality < 0.5 ? 1536 : 2048;
        let { width, height } = img;
        
        // Scale down if image is too large
        if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
          const ratio = Math.min(MAX_DIMENSION / width, MAX_DIMENSION / height);
          width = Math.floor(width * ratio);
          height = Math.floor(height * ratio);
        }
        
        // Set canvas size
        canvas.width = width;
        canvas.height = height;
        
        // Draw and compress image
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert to base64 with compression
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        
        // Clean up
        img.onload = null;
        img.onerror = null;
        img.src = '';
        canvas.width = 0;
        canvas.height = 0;
        
        resolve(compressedDataUrl);
      } catch (error) {
        // Clean up on error
        img.onload = null;
        img.onerror = null;
        img.src = '';
        canvas.width = 0;
        canvas.height = 0;
        reject(new Error(`Failed to compress image: ${file.name} - ${error}`));
      }
    };
    
    img.onerror = () => {
      img.onload = null;
      img.onerror = null;
      img.src = '';
      reject(new Error(`Failed to load image: ${file.name}`));
    };
    
    // Load image from file
    const reader = new FileReader();
    reader.onload = (e) => {
      img.src = e.target?.result as string;
      reader.onload = null;
      reader.onerror = null;
    };
    reader.onerror = () => {
      reader.onload = null;
      reader.onerror = null;
      reject(new Error(`Failed to read file: ${file.name}`));
    };
    reader.readAsDataURL(file);
  });
}

function getImageDimensionsOptimized(url: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const dimensions = { width: img.width, height: img.height };
      img.onload = null;
      img.onerror = null;
      img.src = '';
      resolve(dimensions);
    };
    img.onerror = () => {
      img.onload = null;
      img.onerror = null;
      img.src = '';
      reject(new Error('Failed to load image dimensions'));
    };
    img.src = url;
  });
}

function getImageFormatOptimized(mimeType: string): string {
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

function downloadBlobOptimized(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
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
