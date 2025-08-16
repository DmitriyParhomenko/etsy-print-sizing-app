import { useState } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { generateFilename } from '../utils/sizeCalculations.js';

export const useFileDownload = () => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);

  const downloadSingle = (imageData, originalFileName) => {
    if (!imageData.blob) return;
    
    const filename = generateFilename(originalFileName, imageData.size, 'jpeg');
    saveAs(imageData.blob, filename);
  };

  const downloadAll = async (processedImages, originalFileName) => {
    if (processedImages.length === 0) return;
    
    setIsDownloading(true);
    setDownloadProgress(0);

    try {
      const zip = new JSZip();
      const baseName = originalFileName.replace(/\.[^/.]+$/, '');

      // Add each processed image to the zip
      for (let i = 0; i < processedImages.length; i++) {
        const imageData = processedImages[i];
        if (imageData.blob) {
          const filename = generateFilename(originalFileName, imageData.size, 'jpeg');
          zip.file(filename, imageData.blob);
        }
        setDownloadProgress((i + 1) / processedImages.length * 50);
      }

      // Generate zip file
      const zipBlob = await zip.generateAsync(
        { type: 'blob' },
        (metadata) => {
          setDownloadProgress(50 + (metadata.percent * 0.5));
        }
      );

      // Download zip file
      saveAs(zipBlob, `${baseName}_AllSizes_300DPI.zip`);
      setDownloadProgress(100);
      
      // Reset progress after a short delay
      setTimeout(() => {
        setDownloadProgress(0);
        setIsDownloading(false);
      }, 1000);

    } catch (error) {
      console.error('Error creating zip file:', error);
      setIsDownloading(false);
      setDownloadProgress(0);
    }
  };

  return {
    downloadSingle,
    downloadAll,
    isDownloading,
    downloadProgress
  };
};
