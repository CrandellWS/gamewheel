'use client';

import { useState, useRef, DragEvent } from 'react';
import { Upload, X, Image as ImageIcon, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface BackgroundUploadProps {
  label: string;
  currentImage: string | null;
  opacity: number;
  blendMode?: 'source-over' | 'multiply' | 'screen' | 'overlay';
  onImageChange: (dataUri: string | null) => void;
  onOpacityChange: (opacity: number) => void;
  onBlendModeChange?: (mode: 'source-over' | 'multiply' | 'screen' | 'overlay') => void;
  showBlendMode?: boolean;
}

const MAX_SIZE_MB = 1;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

// Compress image to data URI
const compressImage = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = document.createElement('img');
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions to keep file under 1MB
        const maxDimension = 1920;
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = (height / width) * maxDimension;
            width = maxDimension;
          } else {
            width = (width / height) * maxDimension;
            height = maxDimension;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Try different quality levels to get under size limit
        let quality = 0.9;
        let dataUri = canvas.toDataURL('image/jpeg', quality);

        while (dataUri.length > MAX_SIZE_BYTES && quality > 0.1) {
          quality -= 0.1;
          dataUri = canvas.toDataURL('image/jpeg', quality);
        }

        if (dataUri.length > MAX_SIZE_BYTES) {
          // If still too large, reduce dimensions
          canvas.width = width * 0.7;
          canvas.height = height * 0.7;
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          dataUri = canvas.toDataURL('image/jpeg', 0.8);
        }

        resolve(dataUri);
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
};

export function BackgroundUpload({
  label,
  currentImage,
  opacity,
  blendMode = 'source-over',
  onImageChange,
  onOpacityChange,
  onBlendModeChange,
  showBlendMode = false,
}: BackgroundUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    // Validate file size (10MB max before compression)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File too large. Maximum 10MB before compression.');
      return;
    }

    setIsProcessing(true);
    try {
      const dataUri = await compressImage(file);
      const sizeKB = Math.round(dataUri.length / 1024);

      if (dataUri.length > MAX_SIZE_BYTES) {
        toast.error(`Image still too large (${sizeKB}KB). Try a simpler image.`);
        return;
      }

      onImageChange(dataUri);
      toast.success(`Background uploaded (${sizeKB}KB)`);
    } catch (error) {
      toast.error('Failed to process image');
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleUrlSubmit = () => {
    if (!urlInput.trim()) {
      toast.error('Please enter a URL');
      return;
    }

    // Validate URL format
    try {
      new URL(urlInput);
      onImageChange(urlInput);
      toast.success('Background URL set');
      setUrlInput('');
      setShowUrlInput(false);
    } catch {
      toast.error('Invalid URL format');
    }
  };

  const handleClear = () => {
    onImageChange(null);
    setUrlInput('');
    toast.success('Background cleared');
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
        {currentImage && (
          <button
            onClick={handleClear}
            className="text-xs text-red-600 dark:text-red-400 hover:text-red-700
                     dark:hover:text-red-300 flex items-center gap-1"
          >
            <X className="w-3 h-3" />
            Clear
          </button>
        )}
      </div>

      {/* Image Preview */}
      {currentImage && (
        <div className="relative rounded-lg overflow-hidden border-2 border-gray-300
                      dark:border-gray-600 h-32">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${currentImage})`,
              opacity: opacity,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900/50 to-transparent
                        flex items-center justify-center">
            <ImageIcon className="w-8 h-8 text-white" />
          </div>
        </div>
      )}

      {/* Upload Area */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
                   transition-colors ${
                     isDragging
                       ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                       : 'border-gray-300 dark:border-gray-600 hover:border-indigo-400'
                   } ${isProcessing ? 'opacity-50 pointer-events-none' : ''}`}
      >
        <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {isProcessing ? 'Processing...' : 'Drop image here or click to browse'}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
          JPG, PNG, GIF, WEBP (max 10MB, auto-compressed)
        </p>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* URL Input Toggle */}
      <button
        onClick={() => setShowUrlInput(!showUrlInput)}
        className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
      >
        {showUrlInput ? 'Hide' : 'Or enter image URL'}
      </button>

      {/* URL Input */}
      {showUrlInput && (
        <div className="flex gap-2">
          <input
            type="text"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600
                     rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                     dark:bg-gray-700 dark:text-white"
          />
          <button
            onClick={handleUrlSubmit}
            className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg
                     hover:bg-indigo-700 transition-colors"
          >
            Set
          </button>
        </div>
      )}

      {/* Opacity Slider */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm text-gray-700 dark:text-gray-300">
            Opacity
          </label>
          <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
            {Math.round(opacity * 100)}%
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={opacity * 100}
          onChange={(e) => onOpacityChange(parseInt(e.target.value) / 100)}
          className="w-full"
        />
      </div>

      {/* Blend Mode Selector (for wheel only) */}
      {showBlendMode && onBlendModeChange && (
        <div>
          <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
            Blend Mode
          </label>
          <select
            value={blendMode}
            onChange={(e) => onBlendModeChange(e.target.value as any)}
            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600
                     rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                     dark:bg-gray-700 dark:text-white"
          >
            <option value="source-over">Normal</option>
            <option value="multiply">Multiply</option>
            <option value="screen">Screen</option>
            <option value="overlay">Overlay</option>
          </select>
        </div>
      )}

      {/* Storage Warning */}
      <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-900/20
                    rounded-lg border border-amber-200 dark:border-amber-800">
        <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
        <p className="text-xs text-amber-800 dark:text-amber-200">
          Images are stored in browser localStorage. Large images are automatically
          compressed to under {MAX_SIZE_MB}MB.
        </p>
      </div>
    </div>
  );
}
