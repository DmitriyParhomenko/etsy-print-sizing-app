import React from 'react';
import { Palette, AlertCircle, X } from 'lucide-react';
import useAppStore from './store/useAppStore.js';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import FileUpload from './components/FileUpload.jsx';
import PreviewGrid from './components/PreviewGrid.jsx';
import DownloadManager from './components/DownloadManager.jsx';
import CropEditor from './components/CropEditor.jsx';

function App() {
  const { 
    activeTab, 
    setActiveTab, 
    originalFile, 
    error, 
    clearError, 
    reset,
    processedImages 
  } = useAppStore();

  const tabs = [
    { id: 'upload', label: 'Upload', disabled: false },
    { id: 'preview', label: 'Preview', disabled: !originalFile },
    { id: 'download', label: 'Download', disabled: processedImages.length === 0 }
  ];

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                  <Palette className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Etsy Print Sizing</h1>
                  <p className="text-sm text-gray-500">Professional 300 DPI prints</p>
                </div>
              </div>
              
              {originalFile && (
                <button
                  onClick={reset}
                  className="btn-secondary text-sm"
                >
                  New Project
                </button>
              )}
            </div>
          </div>
        </header>

        {/* Error Alert */}
        {error && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-red-800">{error}</p>
              </div>
              <button
                onClick={clearError}
                className="text-red-500 hover:text-red-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <div className="flex space-x-8 border-b border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => !tab.disabled && setActiveTab(tab.id)}
                disabled={tab.disabled}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : tab.disabled
                    ? 'border-transparent text-gray-400 cursor-not-allowed'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </nav>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {activeTab === 'upload' && <FileUpload />}
          {activeTab === 'preview' && <PreviewGrid />}
          {activeTab === 'download' && <DownloadManager />}
        </main>

        {/* Crop Editor Modal */}
        <CropEditor />

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center text-sm text-gray-500">
              <p className="mb-2">
                Built for Etsy sellers • Generate professional 300 DPI prints in seconds
              </p>
              <div className="flex items-center justify-center space-x-6">
                <span>✨ Multiple aspect ratios</span>
                <span>🎨 Auto-crop optimization</span>
                <span>📦 Bulk download</span>
                <span>🚀 Client-side processing</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </ErrorBoundary>
  );
}

export default App;
