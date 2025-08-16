import React from 'react';
import { Download, Package, FileText, Clock } from 'lucide-react';
import useAppStore from '../store/useAppStore.js';
import { useFileDownload } from '../hooks/useFileDownload.js';
import { formatFileSize } from '../utils/sizeCalculations.js';

const DownloadManager = () => {
  const { processedImages, originalFile } = useAppStore();
  const { downloadSingle, downloadAll, isDownloading, downloadProgress } = useFileDownload();

  if (!originalFile || processedImages.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No files ready</h3>
        <p className="text-gray-500">Upload and process an image to see download options</p>
      </div>
    );
  }

  const totalSize = processedImages.reduce((sum, img) => sum + (img.blob?.size || 0), 0);
  const readyCount = processedImages.filter(img => img.blob).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Download Your Prints</h2>
        <p className="text-gray-600">
          {readyCount} files ready • {formatFileSize(totalSize)} total
        </p>
      </div>

      {/* Bulk Download */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Download All Sizes</h3>
              <p className="text-sm text-gray-500">
                ZIP file with all {readyCount} print sizes at 300 DPI
              </p>
            </div>
          </div>
          
          <button
            onClick={() => downloadAll(processedImages, originalFile.name)}
            disabled={isDownloading || readyCount === 0}
            className="btn-primary flex items-center space-x-2 min-w-[120px]"
          >
            {isDownloading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>{Math.round(downloadProgress)}%</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Download ZIP</span>
              </>
            )}
          </button>
        </div>

        {/* Progress Bar */}
        {isDownloading && (
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${downloadProgress}%` }}
            ></div>
          </div>
        )}
      </div>

      {/* Individual Downloads */}
      <div className="card p-6">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
          <FileText className="w-5 h-5" />
          <span>Individual Downloads</span>
        </h3>
        
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {processedImages.map((imageData, index) => (
            <div key={index} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white rounded border overflow-hidden">
                  {imageData.url ? (
                    <img 
                      src={imageData.url} 
                      alt={imageData.size.label}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Clock className="w-4 h-4 text-gray-400" />
                    </div>
                  )}
                </div>
                
                <div>
                  <p className="font-medium text-gray-900">{imageData.size.label}</p>
                  <p className="text-sm text-gray-500">
                    {imageData.pixelDimensions.width} × {imageData.pixelDimensions.height}px
                    {imageData.blob && ` • ${formatFileSize(imageData.blob.size)}`}
                  </p>
                </div>
              </div>
              
              <button
                onClick={() => downloadSingle(imageData, originalFile.name)}
                disabled={!imageData.blob}
                className="btn-secondary text-sm py-1 px-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* File Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
        <div className="card p-4">
          <div className="text-2xl font-bold text-primary-600 mb-1">{readyCount}</div>
          <div className="text-sm text-gray-600">Files Ready</div>
        </div>
        
        <div className="card p-4">
          <div className="text-2xl font-bold text-primary-600 mb-1">300</div>
          <div className="text-sm text-gray-600">DPI Quality</div>
        </div>
        
        <div className="card p-4">
          <div className="text-2xl font-bold text-primary-600 mb-1">{formatFileSize(totalSize)}</div>
          <div className="text-sm text-gray-600">Total Size</div>
        </div>
      </div>

      {/* Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">💡 Printing Tips</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• All files are optimized at 300 DPI for professional printing</li>
          <li>• Use sRGB color profile for best results</li>
          <li>• Consider paper type when selecting print sizes</li>
          <li>• For Etsy listings, include multiple size options</li>
        </ul>
      </div>
    </div>
  );
};

export default DownloadManager;
