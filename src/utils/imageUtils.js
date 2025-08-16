import { TARGET_DPI, QUALITY_SETTINGS } from './constants.js';
import { calculatePixelDimensions, calculateCropDimensions } from './sizeCalculations.js';
import * as piexif from 'piexifjs';

/**
 * Load an image from a file
 * @param {File} file - Image file
 * @returns {Promise<HTMLImageElement>} Loaded image element
 */
export const loadImage = (file) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
};

/**
 * Create a canvas with the specified dimensions
 * @param {number} width - Canvas width
 * @param {number} height - Canvas height
 * @returns {HTMLCanvasElement} Canvas element
 */
export const createCanvas = (width, height) => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  return canvas;
};

/**
 * Resize and crop image to specific print size
 * @param {HTMLImageElement} image - Source image
 * @param {Object} printSize - Target print size
 * @param {Object} cropSettings - Crop settings (optional)
 * @returns {Promise<Blob>} Processed image blob
 */
export const processImageForSize = async (image, printSize, cropSettings = null, format = 'jpeg') => {
  const pixelDimensions = calculatePixelDimensions(printSize);
  const canvas = createCanvas(pixelDimensions.width, pixelDimensions.height);
  const ctx = canvas.getContext('2d');

  // Set high-quality rendering
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  let sourceX = 0, sourceY = 0, sourceWidth = image.width, sourceHeight = image.height;

  if (cropSettings) {
    sourceX = cropSettings.x;
    sourceY = cropSettings.y;
    sourceWidth = cropSettings.width;
    sourceHeight = cropSettings.height;
  } else {
    // Auto-crop to fit aspect ratio
    const targetRatio = printSize.width / printSize.height;
    const cropDimensions = calculateCropDimensions(image.width, image.height, targetRatio);
    sourceX = cropDimensions.x;
    sourceY = cropDimensions.y;
    sourceWidth = cropDimensions.width;
    sourceHeight = cropDimensions.height;
  }

  // Draw the cropped and resized image
  ctx.drawImage(
    image,
    sourceX, sourceY, sourceWidth, sourceHeight,
    0, 0, pixelDimensions.width, pixelDimensions.height
  );

  // Convert to blob with appropriate quality
  const quality = QUALITY_SETTINGS[format] || QUALITY_SETTINGS.jpeg;
  const mimeType = format === 'jpeg' ? 'image/jpeg' : 'image/png';

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (format === 'jpeg') {
        // Add DPI metadata to JPEG
        addDPIMetadata(blob, TARGET_DPI).then(resolve);
      } else {
        resolve(blob);
      }
    }, mimeType, quality);
  });
};

/**
 * Process image for all print sizes
 * @param {HTMLImageElement} image - Source image
 * @param {Array} printSizes - Array of print sizes to generate
 * @param {Function} onProgress - Progress callback
 * @returns {Promise<Array>} Array of processed images with metadata
 */
export const processImageForAllSizes = async (image, printSizes, onProgress = null) => {
  const results = [];
  
  for (let i = 0; i < printSizes.length; i++) {
    const printSize = printSizes[i];
    
    try {
      const blob = await processImageForSize(image, printSize);
      const pixelDimensions = calculatePixelDimensions(printSize);
      
      results.push({
        size: printSize,
        blob,
        pixelDimensions,
        url: URL.createObjectURL(blob)
      });

      if (onProgress) {
        onProgress((i + 1) / printSizes.length);
      }
    } catch (error) {
      console.error(`Error processing size ${printSize.label}:`, error);
    }
  }

  return results;
};

/**
 * Create a preview image for display
 * @param {HTMLImageElement} image - Source image
 * @param {number} maxWidth - Maximum preview width
 * @param {number} maxHeight - Maximum preview height
 * @returns {string} Data URL for preview
 */
export const createPreviewImage = (image, maxWidth = 400, maxHeight = 300) => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  // Calculate preview dimensions maintaining aspect ratio
  const ratio = Math.min(maxWidth / image.width, maxHeight / image.height);
  canvas.width = image.width * ratio;
  canvas.height = image.height * ratio;

  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL('image/jpeg', 0.8);
};

/**
 * Add DPI metadata to JPEG blob
 * @param {Blob} blob - Image blob
 * @param {number} dpi - DPI value to embed
 * @returns {Promise<Blob>} Blob with DPI metadata
 */
const addDPIMetadata = async (blob, dpi) => {
  try {
    const arrayBuffer = await blob.arrayBuffer();
    const dataURL = `data:image/jpeg;base64,${btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)))}`;
    
    // Create EXIF data with DPI information
    const exifObj = {
      "0th": {
        [piexif.ImageIFD.XResolution]: [dpi, 1],
        [piexif.ImageIFD.YResolution]: [dpi, 1],
        [piexif.ImageIFD.ResolutionUnit]: 2, // inches
        [piexif.ImageIFD.Software]: "Etsy Print Sizing App"
      }
    };
    
    const exifBytes = piexif.dump(exifObj);
    const newDataURL = piexif.insert(exifBytes, dataURL);
    
    // Convert back to blob
    const response = await fetch(newDataURL);
    return await response.blob();
  } catch (error) {
    console.warn('Failed to add DPI metadata:', error);
    return blob; // Return original blob if metadata insertion fails
  }
};

/**
 * Validate image file
 * @param {File} file - File to validate
 * @returns {Object} Validation result
 */
export const validateImageFile = (file) => {
  const errors = [];
  
  // Check file type
  if (!file.type.startsWith('image/')) {
    errors.push('File must be an image');
  }

  // Check file size (50MB limit)
  if (file.size > 50 * 1024 * 1024) {
    errors.push('File size must be less than 50MB');
  }

  // Check supported formats
  const supportedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/svg+xml'];
  if (!supportedTypes.includes(file.type)) {
    errors.push('Supported formats: JPG, PNG, SVG');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};
