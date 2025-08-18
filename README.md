# Etsy Print Sizing App

A professional web application designed for Etsy sellers to generate properly sized digital prints in multiple aspect ratios and dimensions, all optimized at 300 DPI for high-quality printing.

## 🚀 Features

### Core Functionality
- **Upload & Process**: Drag & drop or browse to upload your artwork (JPG, PNG, SVG)
- **Multiple Sizes**: Automatically generate all standard print sizes
- **300 DPI Quality**: Professional resolution for high-quality printing
- **Real-time Preview**: See how your artwork looks in each size
- **Batch Download**: Download all sizes as a convenient ZIP file
- **Individual Downloads**: Download specific sizes as needed

### Supported Print Sizes
- **2:3 Ratio**: 4×6", 8×12", 12×18", 20×30"
- **3:4 Ratio**: 6×8", 9×12", 12×16", 18×24"
- **4:5 Ratio**: 8×10", 11×14", 16×20"
- **5:7 Ratio**: 5×7", 10×14", 15×21"
- **Custom**: 11×14" (popular US frame size)

### Advanced Features
- **Smart Cropping**: Automatic crop optimization for each aspect ratio
- **Crop Editor**: Manual crop adjustment with zoom and positioning controls
- **Progress Tracking**: Real-time processing progress indicators
- **Error Handling**: Comprehensive validation and error messages
- **Responsive Design**: Works perfectly on desktop and mobile devices

## 🛠 Tech Stack

- **Frontend**: React 18 with Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Image Processing**: HTML5 Canvas API
- **File Handling**: react-dropzone
- **Downloads**: JSZip + file-saver
- **Icons**: Lucide React

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd etsy-print-sizing-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:3000`

## 🎯 Usage

### Step 1: Upload Your Artwork
- Drag and drop your image file or click to browse
- Supports JPG, PNG, and SVG files up to 50MB
- Files are processed entirely in your browser (no server upload)

### Step 2: Preview All Sizes
- View automatically generated previews for all print sizes
- Filter by aspect ratio to focus on specific formats
- Switch between grid and list view modes

### Step 3: Customize (Optional)
- Click "Crop" on any size to open the crop editor
- Adjust positioning and zoom to perfect your composition
- Each size maintains its proper aspect ratio

### Step 4: Download
- Download individual sizes or all sizes as a ZIP file
- Files are named with dimensions and DPI information
- All outputs are optimized at 300 DPI for professional printing

## 📁 Project Structure

```
src/
├── components/
│   ├── FileUpload.jsx          # Drag & drop file upload
│   ├── PreviewGrid.jsx         # Grid of size previews
│   ├── SizeCard.jsx           # Individual size preview card
│   ├── CropEditor.jsx         # Manual crop adjustment tool
│   ├── DownloadManager.jsx    # Download interface
│   └── ErrorBoundary.jsx      # Error handling wrapper
├── hooks/
│   └── useFileDownload.js     # Download functionality
├── store/
│   └── useAppStore.js         # Zustand state management
├── utils/
│   ├── constants.js           # Print sizes and settings
│   ├── sizeCalculations.js    # Size conversion utilities
│   └── imageUtils.js          # Image processing functions
├── App.jsx                    # Main application component
├── main.jsx                   # React entry point
└── index.css                  # Global styles
```

## 🔧 Configuration

### Print Sizes
Edit `src/utils/constants.js` to modify supported print sizes:

```javascript
export const PRINT_SIZES = {
  '2:3': [
    { width: 4, height: 6, label: '4×6"' },
    // Add more sizes...
  ],
  // Add more aspect ratios...
};
```

### Quality Settings
Adjust image quality in `src/utils/constants.js`:

```javascript
export const QUALITY_SETTINGS = {
  jpeg: 1.0,  // 100% quality for JPEG
  png: 1.0     // 100% quality for PNG
};
```

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy Options
- **Netlify**: Connect your Git repository for automatic deployments
- **Vercel**: Import project and deploy with zero configuration
- **GitHub Pages**: Use `gh-pages` package for static hosting
- **Any Static Host**: Upload the `dist` folder contents

## 🎨 Customization

### Styling
- Built with Tailwind CSS for easy customization
- Modify `tailwind.config.js` for theme changes
- Update `src/index.css` for global styles

### Branding
- Update colors in `tailwind.config.js`
- Modify header and footer in `src/App.jsx`
- Replace icons and logos as needed

## 📱 Browser Support

- **Chrome**: 90+
- **Firefox**: 88+
- **Safari**: 14+
- **Edge**: 90+

## 🔒 Privacy & Security

- **Client-Side Processing**: All image processing happens in your browser
- **No Server Upload**: Images never leave your device
- **No Data Collection**: No analytics or tracking
- **Secure**: Uses modern web standards and security practices

## 📊 Performance

- **Fast Processing**: Optimized algorithms for quick image generation
- **Memory Efficient**: Proper cleanup of image resources
- **Progressive Loading**: Lazy loading for better UX
- **Responsive**: Smooth performance on all device sizes

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built for the Etsy seller community
- Inspired by the need for professional print preparation tools
- Thanks to the open-source React ecosystem

## 👨‍💻 Author

**Dmitriy Parhomenko**
- Website: [devraiks.com](https://devraiks.com/)
- GitHub: [@DmitriyParhomenko](https://github.com/DmitriyParhomenko)
- Project Repository: [etsy-print-sizing-app](https://github.com/DmitriyParhomenko/etsy-print-sizing-app)

## 📞 Support

For support, feature requests, or bug reports:
- Create an issue on [GitHub](https://github.com/DmitriyParhomenko/etsy-print-sizing-app/issues)
- Check the documentation
- Review the code comments for implementation details

---

**Made with ❤️ by [Dmitriy Parhomenko](https://devraiks.com/) for Etsy sellers who want professional-quality prints**
