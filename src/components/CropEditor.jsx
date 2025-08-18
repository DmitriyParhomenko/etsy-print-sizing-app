import React, { useState, useRef, useEffect } from 'react';
import { X, RotateCcw, Check, Move, ZoomIn, ZoomOut } from 'lucide-react';
import useAppStore from '../store/useAppStore.js';
import { calculateCropDimensions } from '../utils/sizeCalculations.js';
import { processImageForSize } from '../utils/imageUtils.js';

const CropEditor = () => {
  const { 
    showCropEditor, 
    selectedImageForCrop, 
    closeCropEditor, 
    originalImage,
    processedImages,
    setProcessedImages,
    setProcessing
  } = useAppStore();

  const [cropArea, setCropArea] = useState({ x: 0, y: 0, width: 100, height: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (showCropEditor && selectedImageForCrop && originalImage) {
      initializeCrop();
      drawCanvas();
    }
  }, [showCropEditor, selectedImageForCrop, originalImage, zoom]);

  useEffect(() => {
    drawCanvas();
  }, [cropArea]);

  const initializeCrop = () => {
    if (!selectedImageForCrop || !originalImage) return;

    // Check if this image already has crop settings stored
    if (selectedImageForCrop.cropSettings) {
      setCropArea(selectedImageForCrop.cropSettings);
    } else {
      // Calculate default crop area based on aspect ratio
      const targetRatio = selectedImageForCrop.size.width / selectedImageForCrop.size.height;
      const cropDimensions = calculateCropDimensions(
        originalImage.width, 
        originalImage.height, 
        targetRatio
      );
      setCropArea(cropDimensions);
    }
  };

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas || !originalImage) return;

    const ctx = canvas.getContext('2d');
    const container = containerRef.current;
    if (!container) return;

    // Set canvas size to fit container with more generous sizing
    const containerRect = container.getBoundingClientRect();
    const maxWidth = Math.max(800, containerRect.width - 40);
    const maxHeight = Math.max(600, containerRect.height - 40);

    const scale = Math.min(
      maxWidth / originalImage.width,
      maxHeight / originalImage.height
    ) * zoom;

    canvas.width = originalImage.width * scale;
    canvas.height = originalImage.height * scale;

    // Clear and draw image
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(originalImage, 0, 0, canvas.width, canvas.height);

    // Draw crop overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Clear crop area
    const cropX = (cropArea.x / originalImage.width) * canvas.width;
    const cropY = (cropArea.y / originalImage.height) * canvas.height;
    const cropWidth = (cropArea.width / originalImage.width) * canvas.width;
    const cropHeight = (cropArea.height / originalImage.height) * canvas.height;

    ctx.clearRect(cropX, cropY, cropWidth, cropHeight);
    ctx.drawImage(
      originalImage,
      cropArea.x, cropArea.y, cropArea.width, cropArea.height,
      cropX, cropY, cropWidth, cropHeight
    );

    // Draw crop border
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    ctx.strokeRect(cropX, cropY, cropWidth, cropHeight);

    // Draw corner handles
    const handleSize = 8;
    ctx.fillStyle = '#3b82f6';
    const corners = [
      [cropX - handleSize/2, cropY - handleSize/2],
      [cropX + cropWidth - handleSize/2, cropY - handleSize/2],
      [cropX - handleSize/2, cropY + cropHeight - handleSize/2],
      [cropX + cropWidth - handleSize/2, cropY + cropHeight - handleSize/2]
    ];

    corners.forEach(([x, y]) => {
      ctx.fillRect(x, y, handleSize, handleSize);
    });
  };

  const handleMouseDown = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsDragging(true);
    setDragStart({ x, y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const deltaX = x - dragStart.x;
    const deltaY = y - dragStart.y;

    const scaleX = originalImage.width / canvas.width;
    const scaleY = originalImage.height / canvas.height;

    const newX = Math.max(0, Math.min(
      originalImage.width - cropArea.width,
      cropArea.x + deltaX * scaleX
    ));
    const newY = Math.max(0, Math.min(
      originalImage.height - cropArea.height,
      cropArea.y + deltaY * scaleY
    ));

    setCropArea(prev => ({ ...prev, x: newX, y: newY }));
    setDragStart({ x, y });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleReset = () => {
    initializeCrop();
  };

  const handleApply = async () => {
    if (!selectedImageForCrop || !originalImage) return;

    try {
      setProcessing(true, 0);
      
      // Reprocess the image with the new crop settings
      const newBlob = await processImageForSize(originalImage, selectedImageForCrop.size, cropArea);
      
      // Update the processed images array with the new cropped version
      const updatedImages = processedImages.map(img => 
        img.size.label === selectedImageForCrop.size.label 
          ? { 
              ...img, 
              blob: newBlob, 
              url: URL.createObjectURL(newBlob),
              cropSettings: cropArea // Store crop settings for future editing
            }
          : img
      );
      
      setProcessedImages(updatedImages);
      setProcessing(false, 100);
      closeCropEditor();
    } catch (error) {
      console.error('Error applying crop:', error);
      setProcessing(false, 0);
    }
  };

  if (!showCropEditor || !selectedImageForCrop) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-7xl w-full max-h-[95vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Crop for {selectedImageForCrop.size.label}
            </h2>
            <p className="text-sm text-gray-500">
              Adjust the crop area to fit your print perfectly
            </p>
          </div>
          
          <button
            onClick={closeCropEditor}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Canvas Container */}
        <div 
          ref={containerRef}
          className="flex-1 p-4 flex items-center justify-center bg-gray-100 overflow-hidden min-h-[600px]"
        >
          <canvas
            ref={canvasRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className="cursor-move border border-gray-300 rounded shadow-lg"
            style={{ maxWidth: '100%', maxHeight: '100%' }}
          />
        </div>

        {/* Controls */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Zoom Controls */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
                  className="p-2 text-gray-600 hover:text-gray-800"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="text-sm text-gray-600 min-w-[60px] text-center">
                  {Math.round(zoom * 100)}%
                </span>
                <button
                  onClick={() => setZoom(Math.min(3, zoom + 0.1))}
                  className="p-2 text-gray-600 hover:text-gray-800"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
              </div>

              {/* Reset Button */}
              <button
                onClick={handleReset}
                className="btn-secondary flex items-center space-x-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset</span>
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-3">
              <button
                onClick={closeCropEditor}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleApply}
                className="btn-primary flex items-center space-x-2"
              >
                <Check className="w-4 h-4" />
                <span>Apply Crop</span>
              </button>
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600 flex items-center justify-center space-x-4">
              <span className="flex items-center space-x-1">
                <Move className="w-4 h-4" />
                <span>Drag to move crop area</span>
              </span>
              <span>•</span>
              <span>Crop maintains {selectedImageForCrop.size.label} aspect ratio</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CropEditor;
