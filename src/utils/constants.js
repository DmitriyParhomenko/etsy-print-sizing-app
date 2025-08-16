// Print sizes organized by aspect ratio
export const PRINT_SIZES = {
  '2:3': [
    { width: 4, height: 6, label: '4×6"' },
    { width: 8, height: 12, label: '8×12"' },
    { width: 12, height: 18, label: '12×18"' },
    { width: 20, height: 30, label: '20×30"' }
  ],
  '3:4': [
    { width: 6, height: 8, label: '6×8"' },
    { width: 9, height: 12, label: '9×12"' },
    { width: 12, height: 16, label: '12×16"' },
    { width: 18, height: 24, label: '18×24"' }
  ],
  '4:5': [
    { width: 8, height: 10, label: '8×10"' },
    { width: 11, height: 14, label: '11×14"' },
    { width: 16, height: 20, label: '16×20"' }
  ],
  '5:7': [
    { width: 5, height: 7, label: '5×7"' },
    { width: 10, height: 14, label: '10×14"' },
    { width: 15, height: 21, label: '15×21"' }
  ],
  'custom': [
    { width: 11, height: 14, label: '11×14"' }
  ]
};

// Standard DPI for high-quality printing
export const TARGET_DPI = 300;

// Maximum file size in bytes (50MB)
export const MAX_FILE_SIZE = 50 * 1024 * 1024;

// Supported file formats
export const SUPPORTED_FORMATS = ['image/jpeg', 'image/jpg', 'image/png', 'image/svg+xml'];

// Color space settings
export const COLOR_SPACE = 'srgb';

// Quality settings for different formats
export const QUALITY_SETTINGS = {
  jpeg: 0.92,
  png: 1.0
};

// Aspect ratio calculations
export const ASPECT_RATIOS = {
  '2:3': 2/3,
  '3:4': 3/4,
  '4:5': 4/5,
  '5:7': 5/7,
  'custom': 11/14
};

// Get all sizes as a flat array
export const getAllSizes = () => {
  return Object.values(PRINT_SIZES).flat();
};

// Get sizes by aspect ratio
export const getSizesByRatio = (ratio) => {
  return PRINT_SIZES[ratio] || [];
};
