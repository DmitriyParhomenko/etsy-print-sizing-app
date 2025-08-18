import React, { useEffect, useState } from 'react';
import { Download, RefreshCw, Grid, List } from 'lucide-react';
import useAppStore from '../store/useAppStore.js';
import SizeCard from './SizeCard.jsx';
import PreviewModal from './PreviewModal.jsx';
import { processImageForAllSizes } from '../utils/imageUtils.js';
import { getAllSizes } from '../utils/constants.js';

const PreviewGrid = () => {
  const {
    originalImage,
    originalFile,
    processedImages,
    setProcessedImages,
    setProcessing,
    isProcessing,
    processingProgress,
    selectedSizes,
    setSelectedSizes,
    openCropEditor
  } = useAppStore();

  const [viewMode, setViewMode] = useState('grid');
  const [selectedAspectRatio, setSelectedAspectRatio] = useState('all');
  const [previewModal, setPreviewModal] = useState({ isOpen: false, imageData: null });

  useEffect(() => {
    if (originalImage && processedImages.length === 0) {
      processImages();
    }
  }, [originalImage]);

  const processImages = async () => {
    if (!originalImage) return;

    setProcessing(true, 0);
    
    try {
      const results = await processImageForAllSizes(
        originalImage,
        getAllSizes(),
        (progress) => setProcessing(true, progress * 100)
      );
      
      setProcessedImages(results);
    } catch (error) {
      console.error('Error processing images:', error);
      setProcessing(false, 0);
    }
  };

  const handleDownload = (imageData) => {
    if (!imageData.blob) return;
    
    const url = URL.createObjectURL(imageData.blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${originalFile.name.split('.')[0]}_${imageData.size.label}_300DPI.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCrop = (imageData) => {
    openCropEditor(imageData);
  };

  const handlePreview = (imageData) => {
    setPreviewModal({ isOpen: true, imageData });
  };

  const closePreviewModal = () => {
    setPreviewModal({ isOpen: false, imageData: null });
  };

  const filteredImages = processedImages.filter(img => {
    if (selectedAspectRatio === 'all') return true;
    
    const aspectRatio = img.size.width / img.size.height;
    switch (selectedAspectRatio) {
      case '2:3': return Math.abs(aspectRatio - 2/3) < 0.01;
      case '3:4': return Math.abs(aspectRatio - 3/4) < 0.01;
      case '4:5': return Math.abs(aspectRatio - 4/5) < 0.01;
      case '5:7': return Math.abs(aspectRatio - 5/7) < 0.01;
      case 'custom': return Math.abs(aspectRatio - 11/14) < 0.01;
      default: return true;
    }
  });

  if (!originalImage) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Upload an image to see previews</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Print Previews</h2>
          <p className="text-gray-600">
            {isProcessing 
              ? `Processing... ${Math.round(processingProgress)}%`
              : `${filteredImages.length} sizes ready for download`
            }
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* Aspect Ratio Filter */}
          <select
            value={selectedAspectRatio}
            onChange={(e) => setSelectedAspectRatio(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Ratios</option>
            <option value="2:3">2:3 Ratio</option>
            <option value="3:4">3:4 Ratio</option>
            <option value="4:5">4:5 Ratio</option>
            <option value="5:7">5:7 Ratio</option>
            <option value="custom">11×14</option>
          </select>

          {/* View Mode Toggle */}
          <div className="flex border border-gray-300 rounded-md">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${viewMode === 'grid' ? 'bg-primary-100 text-primary-600' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 ${viewMode === 'list' ? 'bg-primary-100 text-primary-600' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {/* Reprocess Button */}
          <button
            onClick={processImages}
            disabled={isProcessing}
            className="btn-secondary flex items-center space-x-2"
          >
            <RefreshCw className={`w-4 h-4 ${isProcessing ? 'animate-spin' : ''}`} />
            <span>Reprocess</span>
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      {isProcessing && (
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-primary-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${processingProgress}%` }}
          ></div>
        </div>
      )}

      {/* Images Grid */}
      <div className={
        viewMode === 'grid' 
          ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          : "space-y-4"
      }>
        {filteredImages.map((imageData, index) => (
          <SizeCard
            key={`${imageData.size.label}-${index}`}
            imageData={imageData}
            onDownload={handleDownload}
            onCrop={handleCrop}
            onPreview={handlePreview}
            isProcessing={isProcessing}
          />
        ))}
      </div>

      {/* Empty State */}
      {!isProcessing && filteredImages.length === 0 && processedImages.length > 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No images match the selected filter</p>
        </div>
      )}

      {/* Preview Modal */}
      <PreviewModal
        imageData={previewModal.imageData}
        isOpen={previewModal.isOpen}
        onClose={closePreviewModal}
        onDownload={handleDownload}
      />
    </div>
  );
};

export default PreviewGrid;
