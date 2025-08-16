import { create } from 'zustand';
import { getAllSizes } from '../utils/constants.js';

const useAppStore = create((set, get) => ({
  // File upload state
  originalFile: null,
  originalImage: null,
  previewUrl: null,
  
  // Processing state
  isProcessing: false,
  processingProgress: 0,
  processedImages: [],
  
  // UI state
  selectedSizes: getAllSizes(),
  activeTab: 'upload', // 'upload', 'preview', 'download'
  showCropEditor: false,
  selectedImageForCrop: null,
  
  // Error handling
  error: null,
  
  // Actions
  setOriginalFile: (file, image, previewUrl) => set({
    originalFile: file,
    originalImage: image,
    previewUrl,
    error: null,
    activeTab: 'preview'
  }),
  
  setProcessing: (isProcessing, progress = 0) => set({
    isProcessing,
    processingProgress: progress
  }),
  
  setProcessedImages: (images) => set({
    processedImages: images,
    isProcessing: false,
    processingProgress: 100
  }),
  
  setSelectedSizes: (sizes) => set({ selectedSizes: sizes }),
  
  setActiveTab: (tab) => set({ activeTab: tab }),
  
  setError: (error) => set({ error }),
  
  clearError: () => set({ error: null }),
  
  reset: () => set({
    originalFile: null,
    originalImage: null,
    previewUrl: null,
    isProcessing: false,
    processingProgress: 0,
    processedImages: [],
    activeTab: 'upload',
    error: null,
    showCropEditor: false,
    selectedImageForCrop: null
  }),
  
  openCropEditor: (imageData) => set({
    showCropEditor: true,
    selectedImageForCrop: imageData
  }),
  
  closeCropEditor: () => set({
    showCropEditor: false,
    selectedImageForCrop: null
  })
}));

export default useAppStore;
