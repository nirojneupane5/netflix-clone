# Images to PDF Converter

This project includes a built-in tool to convert folders containing images into PDF files.

## 🚀 Quick Start

### Method 1: Online Tools (Recommended for Quick Use)

For a quick conversion without any setup, use these online tools:

1. **[Raugen's Images to PDF Converter](https://raugen.com/toolbox/images-to-pdf)**
   - ✅ Browser-based conversion (privacy-friendly)
   - ✅ Supports JPG, PNG, GIF, BMP, WEBP
   - ✅ Free to use
   - ✅ No registration required

2. **[ImageToPdfs.com](https://imagetopdfs.com/)**
   - ✅ Drag and drop multiple images
   - ✅ Customizable PDF settings (page size, orientation, margins)
   - ✅ Supports JPG, PNG, WEBP, GIF, BMP, TIFF

3. **[ImageToolo's Image to PDF Converter](https://www.imagetoolo.com/tools/pdf)**
   - ✅ Supports up to 5,000 images at once
   - ✅ No registration required
   - ✅ Fast conversion

### Method 2: Built-in Script (Programmatic Solution)

This project includes a Node.js script for converting image folders to PDF programmatically.

## 📦 Installation

First, install the required dependencies:

```bash
npm install
```

## 🖼️ Usage

### Basic Usage

Convert all images in the `public` folder to PDF:

```bash
npm run convert-images
```

This will create `images-collection.pdf` with all supported images from the `./public` folder.

### Advanced Usage

```bash
# Convert specific folder
npm run convert-images ./path/to/your/images

# Convert with custom output name
npm run convert-images ./public netflix-images.pdf

# Convert specific folder with custom name
npm run convert-images ./src/assets my-images.pdf
```

### Help

```bash
npm run convert-images -- --help
```

## 📋 Features

- ✅ **Multiple Format Support**: JPG, JPEG, PNG, GIF, BMP
- ✅ **Automatic Sizing**: Images are automatically fitted to PDF pages
- ✅ **Aspect Ratio Preservation**: Images maintain their original proportions
- ✅ **File Naming**: Each image's filename is included in the PDF
- ✅ **Progress Tracking**: Real-time conversion progress display
- ✅ **Error Handling**: Graceful handling of corrupted or unsupported files

## 📁 Current Images in Your Project

Your `public` folder contains these images that can be converted:

- `download-icon.gif`
- `download.jpg`
- `kids.png`
- `Netflix_2015_logo.svg.png`
- `netflixbg.jpg`
- `stranger.png`
- `tv.png`
- `videotv.png`

## 🎯 Examples

### Convert Netflix Images

```bash
# Convert all Netflix-related images to a themed PDF
npm run convert-images ./public netflix-collection.pdf
```

### Convert with Different Folders

```bash
# If you have images in other folders
npm run convert-images ./src/components/images ui-images.pdf
npm run convert-images ./assets/screenshots screenshots.pdf
```

## 🔧 Technical Details

- **PDF Library**: Uses jsPDF for PDF generation
- **Image Processing**: Supports base64 encoding for all major image formats
- **Page Layout**: Each image gets its own page with 10px margins
- **File Size**: Automatically optimized for reasonable file sizes
- **Cross-Platform**: Works on Windows, macOS, and Linux

## 🚨 Troubleshooting

### Common Issues

1. **"No supported image files found"**
   - Check that your folder contains JPG, PNG, GIF, or BMP files
   - Verify the folder path is correct

2. **"Folder not found"**
   - Ensure the folder path exists
   - Use relative paths from the project root

3. **Large file sizes**
   - Consider resizing images before conversion
   - Use JPG format for photographs (smaller file size)

### Getting Help

Run the help command for detailed usage information:

```bash
npm run convert-images -- --help
```

## 📊 Output Information

After conversion, you'll see a summary including:
- Number of images processed
- Output file name and location
- Final PDF file size

Example output:
```
🎉 Conversion completed!
📋 Summary:
   - Images processed: 8
   - Output file: netflix-images.pdf
   - File size: 2.45 MB
```

---

**Note**: For the best results with online tools, ensure you have a stable internet connection and consider the privacy implications of uploading your images to third-party services.
