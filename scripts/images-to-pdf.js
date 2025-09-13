#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { jsPDF } = require('jspdf');

/**
 * Convert images from a folder to PDF
 * Usage: node scripts/images-to-pdf.js [folder-path] [output-name]
 */

// Configuration
const DEFAULT_FOLDER = './public';
const DEFAULT_OUTPUT = 'images-collection.pdf';
const SUPPORTED_FORMATS = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg'];
const PDF_CONFIG = {
    margin: 20,
    fontSize: 10,
    quality: 0.8, // Image quality (0.1 to 1.0)
    orientation: 'portrait' // 'portrait' or 'landscape'
};

// Get command line arguments
const args = process.argv.slice(2);
const folderPath = args[0] || DEFAULT_FOLDER;
const outputName = args[1] || DEFAULT_OUTPUT;

console.log('🖼️  Netflix Clone - Images to PDF Converter');
console.log('==========================================');

/**
 * Get all image files from the specified folder
 */
function getImageFiles(folderPath) {
    try {
        const files = fs.readdirSync(folderPath);
        const imageFiles = files.filter(file => {
            const ext = path.extname(file).toLowerCase();
            return SUPPORTED_FORMATS.includes(ext);
        });
        
        return imageFiles
            .map(file => ({
                name: file,
                path: path.join(folderPath, file)
            }))
            .sort((a, b) => a.name.localeCompare(b.name)); // Sort alphabetically
    } catch (error) {
        console.error(`❌ Error reading folder: ${error.message}`);
        process.exit(1);
    }
}

/**
 * Convert image to base64 data URL
 */
function imageToBase64(imagePath) {
    try {
        const imageBuffer = fs.readFileSync(imagePath);
        const ext = path.extname(imagePath).toLowerCase();
        let mimeType = 'image/jpeg';
        
        switch (ext) {
            case '.png':
                mimeType = 'image/png';
                break;
            case '.gif':
                mimeType = 'image/gif';
                break;
            case '.bmp':
                mimeType = 'image/bmp';
                break;
            case '.webp':
                mimeType = 'image/webp';
                break;
            case '.svg':
                mimeType = 'image/svg+xml';
                break;
        }
        
        return `data:${mimeType};base64,${imageBuffer.toString('base64')}`;
    } catch (error) {
        console.error(`❌ Error reading image ${imagePath}: ${error.message}`);
        return null;
    }
}

/**
 * Create PDF from images
 */
async function createPDF(imageFiles, outputPath) {
    const pdf = new jsPDF();
    let isFirstPage = true;
    
    console.log(`📄 Creating PDF with ${imageFiles.length} images...`);
    
    for (let i = 0; i < imageFiles.length; i++) {
        const imageFile = imageFiles[i];
        console.log(`   Processing: ${imageFile.name} (${i + 1}/${imageFiles.length})`);
        
        const base64Data = imageToBase64(imageFile.path);
        if (!base64Data) {
            console.log(`   ⚠️  Skipping ${imageFile.name} (conversion failed)`);
            continue;
        }
        
        try {
            // Add new page for each image (except the first one)
            if (!isFirstPage) {
                pdf.addPage();
            }
            isFirstPage = false;
            
            // Get PDF page dimensions
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();
            
            // Calculate proper image dimensions while preserving aspect ratio
            const margin = PDF_CONFIG.margin;
            const maxWidth = pageWidth - (2 * margin);
            const maxHeight = pageHeight - (2 * margin) - 20; // Reserve space for filename
            
            // Position for centering
            const x = margin;
            const y = margin;
            
            // Add the image with proper format detection
            const ext = path.extname(imageFile.path).toLowerCase();
            const format = ext === '.png' ? 'PNG' : 
                          ext === '.gif' ? 'GIF' : 
                          ext === '.bmp' ? 'BMP' : 'JPEG';
            
            // Add image - jsPDF will automatically preserve aspect ratio and fit to bounds
            pdf.addImage(base64Data, format, x, y, maxWidth, maxHeight);
            
            // Add image name as text at the bottom with better formatting
            pdf.setFontSize(PDF_CONFIG.fontSize);
            pdf.setTextColor(100, 100, 100); // Gray color
            const textY = pageHeight - 10;
            pdf.text(imageFile.name, margin, textY);
            
            // Add page number
            pdf.setFontSize(8);
            const pageNum = `${i + 1} / ${imageFiles.length}`;
            const pageNumWidth = pdf.getTextWidth(pageNum);
            pdf.text(pageNum, pageWidth - margin - pageNumWidth, textY);
            
        } catch (error) {
            console.log(`   ⚠️  Error adding ${imageFile.name} to PDF: ${error.message}`);
        }
    }
    
    // Save the PDF
    try {
        pdf.save(outputPath);
        console.log(`✅ PDF created successfully: ${outputPath}`);
    } catch (error) {
        console.error(`❌ Error saving PDF: ${error.message}`);
        process.exit(1);
    }
}

/**
 * Main function
 */
async function main() {
    // Check if folder exists
    if (!fs.existsSync(folderPath)) {
        console.error(`❌ Folder not found: ${folderPath}`);
        process.exit(1);
    }
    
    console.log(`📁 Source folder: ${folderPath}`);
    console.log(`📄 Output file: ${outputName}`);
    console.log('');
    
    // Get image files
    const imageFiles = getImageFiles(folderPath);
    
    if (imageFiles.length === 0) {
        console.log('❌ No supported image files found in the folder.');
        console.log(`   Supported formats: ${SUPPORTED_FORMATS.join(', ')}`);
        process.exit(1);
    }
    
    console.log(`📸 Found ${imageFiles.length} image(s):`);
    imageFiles.forEach((file, index) => {
        console.log(`   ${index + 1}. ${file.name}`);
    });
    console.log('');
    
    // Create PDF
    await createPDF(imageFiles, outputName);
    
    console.log('');
    console.log('🎉 Conversion completed!');
    console.log(`📋 Summary:`);
    console.log(`   - Images processed: ${imageFiles.length}`);
    console.log(`   - Output file: ${outputName}`);
    console.log(`   - File size: ${(fs.statSync(outputName).size / 1024 / 1024).toFixed(2)} MB`);
}

// Show help if requested
if (args.includes('--help') || args.includes('-h')) {
    console.log('');
    console.log('Usage:');
    console.log('  npm run convert-images [folder-path] [output-name]');
    console.log('');
    console.log('Examples:');
    console.log('  npm run convert-images                           # Convert ./public folder to images-collection.pdf');
    console.log('  npm run convert-images ./public                 # Convert ./public folder to images-collection.pdf');
    console.log('  npm run convert-images ./public netflix-images.pdf  # Convert ./public folder to netflix-images.pdf');
    console.log('  npm run convert-images ./src/assets my-images.pdf   # Convert ./src/assets folder to my-images.pdf');
    console.log('');
    console.log('Supported formats: ' + SUPPORTED_FORMATS.join(', '));
    process.exit(0);
}

// Run the main function
main().catch(error => {
    console.error('❌ Unexpected error:', error);
    process.exit(1);
});
