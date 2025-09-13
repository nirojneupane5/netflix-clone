'use client';

import React, { useState, useRef } from 'react';
import { convertImagesToPdf, convertPublicImagesToPdf, PdfConfig } from '../utils/imagesToPdf';

interface ImageToPdfConverterProps {
  className?: string;
}

export default function ImageToPdfConverter({ className = '' }: ImageToPdfConverterProps) {
  const [isConverting, setIsConverting] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [config, setConfig] = useState<Partial<PdfConfig>>({
    orientation: 'portrait',
    pageSize: 'a4',
    quality: 0.8
  });
  const [filename, setFilename] = useState('images-collection.pdf');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Netflix images from public folder
  const netflixImages = [
    '/Netflix_2015_logo.svg.png',
    '/download-icon.gif',
    '/download.jpg',
    '/kids.png',
    '/netflixbg.jpg',
    '/stranger.png',
    '/tv.png',
    '/videotv.png'
  ];

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    setSelectedFiles(files);
  };

  const handleConvertFiles = async () => {
    if (!selectedFiles || selectedFiles.length === 0) {
      alert('Please select image files first');
      return;
    }

    setIsConverting(true);
    try {
      await convertImagesToPdf(selectedFiles, config, filename);
      alert('PDF created and downloaded successfully!');
    } catch (error) {
      console.error('Conversion failed:', error);
      alert('Failed to convert images to PDF. Please try again.');
    } finally {
      setIsConverting(false);
    }
  };

  const handleConvertNetflixImages = async () => {
    setIsConverting(true);
    try {
      await convertPublicImagesToPdf(netflixImages, config, 'netflix-images.pdf');
      alert('Netflix images PDF created and downloaded successfully!');
    } catch (error) {
      console.error('Conversion failed:', error);
      alert('Failed to convert Netflix images to PDF. Please try again.');
    } finally {
      setIsConverting(false);
    }
  };

  const clearSelection = () => {
    setSelectedFiles(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          🖼️ Images to PDF Converter
        </h2>
        <p className="text-gray-600">
          Convert your image folders to PDF files easily
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

      {/* File Upload Section */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Upload Your Images</h3>
        
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            id="file-upload"
          />
          
          <label
            htmlFor="file-upload"
            className="cursor-pointer flex flex-col items-center"
          >
            <svg className="w-12 h-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <span className="text-lg font-medium text-gray-600">
              Click to select images
            </span>
            <span className="text-sm text-gray-500 mt-1">
              Supports JPG, PNG, GIF, BMP, WEBP, SVG
            </span>
          </label>
        </div>

        {selectedFiles && selectedFiles.length > 0 && (
          <div className="mt-4 p-4 bg-green-50 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-green-800 font-medium">
                {selectedFiles.length} file(s) selected
              </span>
              <button
                onClick={clearSelection}
                className="text-red-600 hover:text-red-800 text-sm"
              >
                Clear
              </button>
            </div>
            <div className="text-sm text-green-700">
              {Array.from(selectedFiles).map((file, index) => (
                <div key={index} className="truncate">
                  {index + 1}. {file.name}
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={handleConvertFiles}
          disabled={!selectedFiles || selectedFiles.length === 0 || isConverting}
          className="mt-4 w-full bg-red-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isConverting ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Converting...
            </span>
          ) : (
            'Convert Selected Images to PDF'
          )}
        </button>
      </div>

      {/* Netflix Images Section */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold mb-3">Quick Convert: Netflix Images</h3>
        <p className="text-gray-600 mb-4">
          Convert all Netflix-related images from the public folder to PDF
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
          {netflixImages.slice(0, 4).map((img, index) => (
            <div key={index} className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={img}
                alt={`Netflix image ${index + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            </div>
          ))}
        </div>
        
        <button
          onClick={handleConvertNetflixImages}
          disabled={isConverting}
          className="w-full bg-black text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isConverting ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Converting Netflix Images...
            </span>
          ) : (
            '📄 Convert Netflix Images to PDF'
          )}
        </button>
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
