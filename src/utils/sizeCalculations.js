import { TARGET_DPI, ASPECT_RATIOS } from './constants.js';

/**
 * Convert inches to pixels at 300 DPI
 * @param {number} inches - Size in inches
 * @returns {number} Size in pixels
 */
export const inchesToPixels = (inches) => {
  return Math.round(inches * TARGET_DPI);
};

/**
 * Convert pixels to inches at 300 DPI
 * @param {number} pixels - Size in pixels
 * @returns {number} Size in inches
 */
export const pixelsToInches = (pixels) => {
  return pixels / TARGET_DPI;
};

/**
 * Calculate pixel dimensions for a print size
 * @param {Object} size - Size object with width and height in inches
 * @returns {Object} Pixel dimensions
 */
export const calculatePixelDimensions = (size) => {
  return {
    width: inchesToPixels(size.width),
    height: inchesToPixels(size.height),
    label: size.label,
    aspectRatio: size.width / size.height
  };
};

/**
 * Determine the best aspect ratio for an image
 * @param {number} imageWidth - Original image width
 * @param {number} imageHeight - Original image height
 * @returns {string} Best matching aspect ratio key
 */
export const getBestAspectRatio = (imageWidth, imageHeight) => {
  const imageRatio = imageWidth / imageHeight;
  let bestMatch = '4:5';
  let smallestDifference = Infinity;

  Object.entries(ASPECT_RATIOS).forEach(([key, ratio]) => {
    const difference = Math.abs(imageRatio - ratio);
    if (difference < smallestDifference) {
      smallestDifference = difference;
      bestMatch = key;
    }
  });

  return bestMatch;
};

/**
 * Calculate crop dimensions to fit aspect ratio
 * @param {number} imageWidth - Original image width
 * @param {number} imageHeight - Original image height
 * @param {number} targetRatio - Target aspect ratio (width/height)
 * @returns {Object} Crop dimensions
 */
export const calculateCropDimensions = (imageWidth, imageHeight, targetRatio) => {
  const imageRatio = imageWidth / imageHeight;
  
  let cropWidth, cropHeight, x, y;

  if (imageRatio > targetRatio) {
    // Image is wider than target ratio - crop width
    cropHeight = imageHeight;
    cropWidth = imageHeight * targetRatio;
    x = (imageWidth - cropWidth) / 2;
    y = 0;
  } else {
    // Image is taller than target ratio - crop height
    cropWidth = imageWidth;
    cropHeight = imageWidth / targetRatio;
    x = 0;
    y = (imageHeight - cropHeight) / 2;
  }

  return {
    x: Math.round(x),
    y: Math.round(y),
    width: Math.round(cropWidth),
    height: Math.round(cropHeight)
  };
};

/**
 * Generate filename for a processed image
 * @param {string} originalName - Original filename
 * @param {Object} size - Size object
 * @param {string} format - File format (jpeg/png)
 * @returns {string} Generated filename
 */
export const generateFilename = (originalName, size, format = 'jpeg') => {
  const baseName = originalName.replace(/\.[^/.]+$/, '');
  const extension = format === 'jpeg' ? 'jpg' : format;
  return `${baseName}_${size.label}_300DPI.${extension}`;
};

/**
 * Calculate file size estimate in bytes
 * @param {number} width - Image width in pixels
 * @param {number} height - Image height in pixels
 * @param {string} format - File format
 * @returns {number} Estimated file size in bytes
 */
export const estimateFileSize = (width, height, format = 'jpeg') => {
  const pixels = width * height;
  // Rough estimates based on typical compression
  const bytesPerPixel = format === 'jpeg' ? 0.5 : 3;
  return Math.round(pixels * bytesPerPixel);
};

/**
 * Format file size for display
 * @param {number} bytes - Size in bytes
 * @returns {string} Formatted size string
 */
export const formatFileSize = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};
