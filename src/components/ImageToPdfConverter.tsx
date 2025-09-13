'use client';

import React, { useState, useRef } from 'react';
import { convertImagesToPdf, convertPublicImagesToPdf, PdfConfig } from '../utils/imagesToPdf';

interface ImageToPdfConverterProps {
  className?: string;
}

export default function ImageToPdfConverter({ className = '' }: ImageToPdfConverterProps) {
  const [isConverting, setIsConverting] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [folderName, setFolderName] = useState<string>('');
  const [config, setConfig] = useState<Partial<PdfConfig>>({
    orientation: 'portrait',
    pageSize: 'a4',
    quality: 0.8
  });
  const [filename, setFilename] = useState('images-collection.pdf');
  const fileInputRef = useRef<HTMLInputElement>(null);


  const handleFolderSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    setSelectedFiles(files);
    
    // Extract folder name from the first file's path
    if (files && files.length > 0) {
      const firstFile = files[0];
      // Get the folder name from webkitRelativePath
      const pathParts = (firstFile as any).webkitRelativePath?.split('/') || [firstFile.name];
      const folder = pathParts.length > 1 ? pathParts[0] : 'Selected Folder';
      setFolderName(folder);
      
      // Auto-generate filename based on folder name
      const cleanFolderName = folder.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
      setFilename(`${cleanFolderName}-images.pdf`);
    }
  };

  const handleConvertFolder = async () => {
    if (!selectedFiles || selectedFiles.length === 0) {
      alert('Please select a folder with images first');
      return;
    }

    setIsConverting(true);
    try {
      await convertImagesToPdf(selectedFiles, config, filename);
      alert(`PDF created successfully from "${folderName}" folder!`);
    } catch (error) {
      console.error('Conversion failed:', error);
      alert('Failed to convert folder images to PDF. Please try again.');
    } finally {
      setIsConverting(false);
    }
  };


  const clearSelection = () => {
    setSelectedFiles(null);
    setFolderName('');
    setFilename('images-collection.pdf');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          📁 Folder to PDF Converter
        </h2>
        <p className="text-gray-600">
          Select a folder containing images and convert all images to a single PDF file
        </p>
      </div>

      {/* Configuration Section */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-3">PDF Settings</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Orientation
            </label>
            <select
              value={config.orientation}
              onChange={(e) => setConfig(prev => ({ ...prev, orientation: e.target.value as 'portrait' | 'landscape' }))}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="portrait">Portrait</option>
              <option value="landscape">Landscape</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Page Size
            </label>
            <select
              value={config.pageSize}
              onChange={(e) => setConfig(prev => ({ ...prev, pageSize: e.target.value as 'a4' | 'letter' | 'legal' }))}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="a4">A4</option>
              <option value="letter">Letter</option>
              <option value="legal">Legal</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quality ({Math.round((config.quality || 0.8) * 100)}%)
            </label>
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.1"
              value={config.quality}
              onChange={(e) => setConfig(prev => ({ ...prev, quality: parseFloat(e.target.value) }))}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filename
            </label>
            <input
              type="text"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="images-collection.pdf"
            />
          </div>
        </div>
      </div>

      {/* Folder Selection Section */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Select Image Folder</h3>
        
        <div className="border-2 border-dashed border-blue-300 rounded-lg p-8 text-center bg-blue-50">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleFolderSelect}
            className="hidden"
            id="folder-upload"
            webkitdirectory=""
            directory=""
          />
          
          <label
            htmlFor="folder-upload"
            className="cursor-pointer flex flex-col items-center"
          >
            <svg className="w-16 h-16 text-blue-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-5l-2-2H5a2 2 0 00-2 2z" />
            </svg>
            <span className="text-xl font-bold text-blue-700 mb-2">
              📁 Click to Select Folder
            </span>
            <span className="text-sm text-blue-600 mb-2">
              Choose a folder containing your images
            </span>
            <span className="text-xs text-gray-500">
              Supports JPG, PNG, GIF, BMP, WEBP, SVG
            </span>
          </label>
        </div>

        {selectedFiles && selectedFiles.length > 0 && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex justify-between items-center mb-3">
              <div>
                <span className="text-green-800 font-bold text-lg">
                  📁 {folderName}
                </span>
                <div className="text-green-700 text-sm">
                  {selectedFiles.length} image(s) found
                </div>
              </div>
              <button
                onClick={clearSelection}
                className="text-red-600 hover:text-red-800 text-sm font-medium"
              >
                ✕ Clear
              </button>
            </div>
            <div className="text-sm text-green-700 max-h-32 overflow-y-auto">
              {Array.from(selectedFiles).slice(0, 10).map((file, index) => (
                <div key={index} className="truncate py-1">
                  {index + 1}. {file.name}
                </div>
              ))}
              {selectedFiles.length > 10 && (
                <div className="text-green-600 font-medium pt-1">
                  ... and {selectedFiles.length - 10} more files
                </div>
              )}
            </div>
          </div>
        )}

        <button
          onClick={handleConvertFolder}
          disabled={!selectedFiles || selectedFiles.length === 0 || isConverting}
          className="mt-4 w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-bold text-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors shadow-lg"
        >
          {isConverting ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Converting Folder to PDF...
            </span>
          ) : (
            '📄 Convert Folder to PDF'
          )}
        </button>
      </div>

      {/* Instructions Section */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold mb-3 text-gray-700">📋 How to Use</h3>
        <div className="bg-gray-50 p-4 rounded-lg">
          <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
            <li>Click the &ldquo;📁 Click to Select Folder&rdquo; button above</li>
            <li>Choose a folder that contains your images</li>
            <li>Adjust PDF settings if needed (orientation, page size, quality)</li>
            <li>Click &ldquo;📄 Convert Folder to PDF&rdquo; to download your PDF</li>
          </ol>
          <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded">
            <p className="text-xs text-blue-700">
              <strong>Note:</strong> The folder selection will include all images in the selected folder. 
              Supported formats: JPG, PNG, GIF, BMP, WEBP, SVG
            </p>
          </div>
        </div>
      </div>

      {/* Supported Formats */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-medium text-blue-800 mb-2">Supported Image Formats:</h4>
        <div className="text-sm text-blue-700">
          JPG, JPEG, PNG, GIF, BMP, WEBP, SVG
        </div>
      </div>
    </div>
  );
}
