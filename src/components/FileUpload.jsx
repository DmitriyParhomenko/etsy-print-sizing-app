import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Image, AlertCircle } from 'lucide-react';
import useAppStore from '../store/useAppStore.js';
import { loadImage, validateImageFile, createPreviewImage } from '../utils/imageUtils.js';
import { MAX_FILE_SIZE } from '../utils/constants.js';

const FileUpload = () => {
  const { setOriginalFile, setError, clearError } = useAppStore();

  const onDrop = useCallback(async (acceptedFiles, rejectedFiles) => {
    clearError();
    
    if (rejectedFiles.length > 0) {
      const rejection = rejectedFiles[0];
      if (rejection.errors[0]?.code === 'file-too-large') {
        setError('File size must be less than 50MB');
      } else if (rejection.errors[0]?.code === 'file-invalid-type') {
        setError('Please upload a valid image file (JPG, PNG, SVG)');
      } else {
        setError('Invalid file. Please try again.');
      }
      return;
    }

    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    const validation = validateImageFile(file);
    
    if (!validation.isValid) {
      setError(validation.errors.join(', '));
      return;
    }

    try {
      const image = await loadImage(file);
      const previewUrl = createPreviewImage(image);
      setOriginalFile(file, image, previewUrl);
    } catch (error) {
      console.error('Error loading image:', error);
      setError('Failed to load image. Please try a different file.');
    }
  }, [setOriginalFile, setError, clearError]);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/svg+xml': ['.svg']
    },
    maxSize: MAX_FILE_SIZE,
    multiple: false
  });

  const dropzoneClass = `
    border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 cursor-pointer
    ${isDragActive && !isDragReject 
      ? 'border-primary-500 bg-primary-50' 
      : isDragReject 
        ? 'border-red-500 bg-red-50' 
        : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
    }
  `;

  return (
    <div className="max-w-2xl mx-auto">
      <div {...getRootProps()} className={dropzoneClass}>
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center space-y-4">
          {isDragReject ? (
            <AlertCircle className="w-12 h-12 text-red-500" />
          ) : (
            <div className="relative">
              <Upload className="w-12 h-12 text-gray-400" />
              <Image className="w-6 h-6 text-primary-500 absolute -bottom-1 -right-1" />
            </div>
          )}
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {isDragActive 
                ? isDragReject 
                  ? 'Invalid file type' 
                  : 'Drop your image here'
                : 'Upload your artwork'
              }
            </h3>
            
            {!isDragActive && (
              <div className="text-gray-600 space-y-1">
                <p>Drag & drop your image here, or click to browse</p>
                <p className="text-sm">
                  Supports JPG, PNG, SVG • Max 50MB • 300 DPI output
                </p>
              </div>
            )}
          </div>
          
          {!isDragActive && (
            <button className="btn-primary">
              Choose File
            </button>
          )}
        </div>
      </div>
      
      <div className="mt-6 text-center text-sm text-gray-500">
        <p className="mb-2">✨ <strong>What happens next:</strong></p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="flex items-center justify-center space-x-2">
            <span className="w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-semibold">1</span>
            <span>Preview all sizes</span>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <span className="w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-semibold">2</span>
            <span>Adjust crops if needed</span>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <span className="w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-semibold">3</span>
            <span>Download 300 DPI files</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
