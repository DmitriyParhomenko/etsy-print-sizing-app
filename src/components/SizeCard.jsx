import React from 'react';
import { Download, Crop, Eye } from 'lucide-react';
import { formatFileSize, estimateFileSize } from '../utils/sizeCalculations.js';

const SizeCard = ({ 
  imageData, 
  onDownload, 
  onCrop, 
  onPreview, 
  isProcessing = false 
}) => {
  const { size, blob, pixelDimensions, url } = imageData;
  const fileSize = blob ? blob.size : estimateFileSize(pixelDimensions.width, pixelDimensions.height);

  return (
    <div className="card p-4 hover:shadow-md transition-shadow duration-200">
      {/* Preview Image */}
      <div className="aspect-square bg-gray-100 rounded-lg mb-3 overflow-hidden relative">
        {url ? (
          <img 
            src={url} 
            alt={`${size.label} preview`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            {isProcessing ? (
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            ) : (
              <div className="text-gray-400 text-sm">Processing...</div>
            )}
          </div>
        )}
        
        {/* Preview overlay button */}
        {url && (
          <button
            onClick={() => onPreview(imageData)}
            className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center opacity-0 hover:opacity-100"
          >
            <Eye className="w-6 h-6 text-white" />
          </button>
        )}
      </div>

      {/* Size Info */}
      <div className="space-y-2">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-gray-900">{size.label}</h3>
            <p className="text-sm text-gray-500">
              {pixelDimensions.width} × {pixelDimensions.height}px
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">300 DPI</p>
            <p className="text-xs text-gray-500">{formatFileSize(fileSize)}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2 pt-2">
          <button
            onClick={() => onCrop(imageData)}
            disabled={!url}
            className="flex-1 flex items-center justify-center space-x-1 py-2 px-3 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-md transition-colors duration-200"
          >
            <Crop className="w-4 h-4" />
            <span>Crop</span>
          </button>
          
          <button
            onClick={() => onDownload(imageData)}
            disabled={!blob}
            className="flex-1 flex items-center justify-center space-x-1 py-2 px-3 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-md transition-colors duration-200"
          >
            <Download className="w-4 h-4" />
            <span>Download</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SizeCard;
