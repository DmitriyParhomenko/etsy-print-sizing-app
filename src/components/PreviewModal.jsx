import React from 'react';
import { X, Download } from 'lucide-react';

const PreviewModal = ({ imageData, isOpen, onClose, onDownload }) => {
  if (!isOpen || !imageData) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleDownload = () => {
    onDownload(imageData);
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
      style={{ margin: 0 }}
    >
      <div className="relative max-w-4xl max-h-full bg-white rounded-lg overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-gray-50 border-b">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {imageData.size.label} Preview
            </h3>
            <p className="text-sm text-gray-600">
              {imageData.pixelDimensions.width} × {imageData.pixelDimensions.height} pixels at 300 DPI
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              Download
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Image Container */}
        <div className="p-4 bg-gray-100">
          <div className="flex items-center justify-center">
            <img
              src={imageData.url}
              alt={`${imageData.size.label} preview`}
              className="max-w-full max-h-[70vh] object-contain rounded shadow-lg"
            />
          </div>
        </div>

        {/* Footer Info */}
        <div className="p-4 bg-gray-50 border-t">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>
              Print Size: {imageData.size.width}" × {imageData.size.height}"
            </span>
            <span>
              Aspect Ratio: {imageData.size.aspectRatio}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewModal;
