import * as piexif from 'piexifjs';

/**
 * Create JPEG with proper DPI metadata using manual JFIF header manipulation
 * @param {Blob} blob - Original JPEG blob
 * @param {number} dpi - Target DPI
 * @returns {Promise<Blob>} JPEG with DPI metadata
 */
export const embedDPIMetadata = async (blob, dpi) => {
  try {
    const arrayBuffer = await blob.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    
    // Method 1: Try JFIF header modification (more reliable for DPI)
    const jfifBlob = await addJFIFDPI(uint8Array, dpi);
    if (jfifBlob) {
      console.log(`JFIF DPI metadata embedded: ${dpi} DPI`);
      return jfifBlob;
    }
    
    // Method 2: Fallback to EXIF
    return await addEXIFDPI(uint8Array, dpi);
    
  } catch (error) {
    console.warn('All DPI embedding methods failed:', error);
    return blob;
  }
};

/**
 * Add DPI to JFIF header (more compatible with image viewers)
 * @param {Uint8Array} jpegData - JPEG data
 * @param {number} dpi - DPI value
 * @returns {Promise<Blob>} Modified JPEG
 */
const addJFIFDPI = async (jpegData, dpi) => {
  try {
    // Look for JFIF marker (FF E0)
    let jfifIndex = -1;
    for (let i = 0; i < jpegData.length - 1; i++) {
      if (jpegData[i] === 0xFF && jpegData[i + 1] === 0xE0) {
        jfifIndex = i;
        break;
      }
    }
    
    if (jfifIndex === -1) {
      // No JFIF header found, create one
      return createJFIFHeader(jpegData, dpi);
    }
    
    // Modify existing JFIF header
    const newData = new Uint8Array(jpegData);
    
    // JFIF structure: FF E0 [length] JFIF 00 [version] [units] [Xdensity] [Ydensity] [Xthumbnail] [Ythumbnail]
    const jfifStart = jfifIndex + 4; // Skip FF E0 and length
    
    if (newData[jfifStart] === 0x4A && newData[jfifStart + 1] === 0x46) { // "JF"
      // Set density unit to inches (01)
      newData[jfifStart + 7] = 0x01;
      
      // Set X density (DPI) - 2 bytes, big endian
      newData[jfifStart + 8] = (dpi >> 8) & 0xFF;
      newData[jfifStart + 9] = dpi & 0xFF;
      
      // Set Y density (DPI) - 2 bytes, big endian  
      newData[jfifStart + 10] = (dpi >> 8) & 0xFF;
      newData[jfifStart + 11] = dpi & 0xFF;
      
      return new Blob([newData], { type: 'image/jpeg' });
    }
    
    return null;
  } catch (error) {
    console.warn('JFIF DPI embedding failed:', error);
    return null;
  }
};

/**
 * Create new JFIF header with DPI
 * @param {Uint8Array} jpegData - Original JPEG data
 * @param {number} dpi - DPI value
 * @returns {Blob} JPEG with JFIF header
 */
const createJFIFHeader = (jpegData, dpi) => {
  // Find SOI marker (FF D8)
  let soiIndex = -1;
  for (let i = 0; i < jpegData.length - 1; i++) {
    if (jpegData[i] === 0xFF && jpegData[i + 1] === 0xD8) {
      soiIndex = i;
      break;
    }
  }
  
  if (soiIndex === -1) return null;
  
  // Create JFIF header
  const jfifHeader = new Uint8Array([
    0xFF, 0xE0,           // JFIF marker
    0x00, 0x10,           // Length (16 bytes)
    0x4A, 0x46, 0x49, 0x46, 0x00, // "JFIF\0"
    0x01, 0x01,           // Version 1.1
    0x01,                 // Units: inches
    (dpi >> 8) & 0xFF, dpi & 0xFF,  // X density
    (dpi >> 8) & 0xFF, dpi & 0xFF,  // Y density
    0x00, 0x00            // No thumbnail
  ]);
  
  // Combine SOI + JFIF + rest of JPEG
  const result = new Uint8Array(2 + jfifHeader.length + jpegData.length - 2);
  result.set(jpegData.slice(0, 2), 0);           // SOI marker
  result.set(jfifHeader, 2);                     // JFIF header
  result.set(jpegData.slice(2), 2 + jfifHeader.length); // Rest of JPEG
  
  return new Blob([result], { type: 'image/jpeg' });
};

/**
 * Fallback EXIF method
 * @param {Uint8Array} jpegData - JPEG data
 * @param {number} dpi - DPI value
 * @returns {Promise<Blob>} JPEG with EXIF
 */
const addEXIFDPI = async (jpegData, dpi) => {
  try {
    // Convert to base64
    let binary = '';
    for (let i = 0; i < jpegData.length; i++) {
      binary += String.fromCharCode(jpegData[i]);
    }
    const dataURL = `data:image/jpeg;base64,${btoa(binary)}`;
    
    // Create EXIF with DPI
    const exifObj = {
      "0th": {
        [piexif.ImageIFD.XResolution]: [dpi, 1],
        [piexif.ImageIFD.YResolution]: [dpi, 1],
        [piexif.ImageIFD.ResolutionUnit]: 2,
        [piexif.ImageIFD.Software]: "Etsy Print Sizing App"
      }
    };
    
    const exifBytes = piexif.dump(exifObj);
    const newDataURL = piexif.insert(exifBytes, dataURL);
    
    const response = await fetch(newDataURL);
    const resultBlob = await response.blob();
    
    console.log(`EXIF DPI metadata embedded: ${dpi} DPI`);
    return resultBlob;
    
  } catch (error) {
    console.warn('EXIF DPI embedding failed:', error);
    throw error;
  }
};
