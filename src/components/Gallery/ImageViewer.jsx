import React, { useState, useEffect } from 'react';
import { getServiceForConnection } from '../../services/connectionService';
import * as Sentry from '@sentry/browser';
import { FiX, FiDownload, FiZoomIn, FiZoomOut } from 'react-icons/fi';

export default function ImageViewer({ image, connection, onClose }) {
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [scale, setScale] = useState(1);
  
  useEffect(() => {
    let mounted = true;
    
    const loadImage = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const service = getServiceForConnection(connection);
        
        // If the service has a direct URL method (like HTTP), use it
        if (service.getImageUrl) {
          const url = service.getImageUrl(image.path);
          if (mounted) {
            setImageUrl(url);
            setLoading(false);
          }
          return;
        }
        
        // Otherwise, fetch the content and create a blob URL
        const url = await service.getFileContent(image.path);
        if (mounted) {
          setImageUrl(url);
          setLoading(false);
        }
      } catch (err) {
        console.error('Error loading image:', err);
        Sentry.captureException(err);
        if (mounted) {
          setError('Failed to load image');
          setLoading(false);
        }
      }
    };
    
    loadImage();
    
    return () => {
      mounted = false;
      // Clean up any object URLs to prevent memory leaks
      if (imageUrl && imageUrl.startsWith('blob:')) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [image.path, connection]);
  
  const handleDownload = () => {
    if (!imageUrl) return;
    
    const a = document.createElement('a');
    a.href = imageUrl;
    a.download = image.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };
  
  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.2, 3));
  };
  
  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.2, 0.5));
  };
  
  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === '+') handleZoomIn();
      if (e.key === '-') handleZoomOut();
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="absolute top-4 right-4 flex space-x-2 z-10">
        <button
          onClick={handleZoomIn}
          className="p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-75 transition cursor-pointer"
          title="Zoom In"
        >
          <FiZoomIn size={24} />
        </button>
        <button
          onClick={handleZoomOut}
          className="p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-75 transition cursor-pointer"
          title="Zoom Out"
        >
          <FiZoomOut size={24} />
        </button>
        <button
          onClick={handleDownload}
          className="p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-75 transition cursor-pointer"
          title="Download"
        >
          <FiDownload size={24} />
        </button>
        <button
          onClick={onClose}
          className="p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-75 transition cursor-pointer"
          title="Close"
        >
          <FiX size={24} />
        </button>
      </div>
      
      {loading ? (
        <div className="bg-black p-16 rounded-lg flex flex-col items-center justify-center">
          <div className="animate-spin h-16 w-16 border-4 border-white border-t-transparent rounded-full mb-4"></div>
          <p className="text-white">Loading image...</p>
        </div>
      ) : error ? (
        <div className="bg-black p-16 rounded-lg">
          <p className="text-white text-center">{error}</p>
        </div>
      ) : (
        <div className="overflow-auto max-w-[95vw] max-h-[90vh]">
          <img
            src={imageUrl}
            alt={image.name}
            className="transition-transform duration-200 ease-in-out object-contain"
            style={{ transform: `scale(${scale})` }}
          />
        </div>
      )}
      
      <div className="absolute bottom-4 left-0 right-0 text-center">
        <div className="inline-block bg-black bg-opacity-70 text-white px-4 py-2 rounded-lg">
          {image.name}
        </div>
      </div>
    </div>
  );
}