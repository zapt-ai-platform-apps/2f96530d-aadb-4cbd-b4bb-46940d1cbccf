import React, { useState, useEffect } from 'react';
import { getServiceForConnection } from '../../services/connectionService';
import * as Sentry from '@sentry/browser';
import { FiImage } from 'react-icons/fi';

export default function Thumbnail({ file, connection }) {
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  
  useEffect(() => {
    let mounted = true;
    
    const loadThumbnail = async () => {
      try {
        setLoading(true);
        setError(false);
        
        const service = getServiceForConnection(connection);
        
        // If the service has a direct URL method (like HTTP), use it
        if (service.getImageUrl) {
          const url = service.getImageUrl(file.path);
          if (mounted) {
            setThumbnailUrl(url);
            setLoading(false);
          }
          return;
        }
        
        // Otherwise, fetch the content and create a blob URL
        const url = await service.getFileContent(file.path);
        if (mounted) {
          setThumbnailUrl(url);
          setLoading(false);
        }
      } catch (err) {
        console.error('Error loading thumbnail:', err);
        Sentry.captureException(err);
        if (mounted) {
          setError(true);
          setLoading(false);
        }
      }
    };
    
    loadThumbnail();
    
    return () => {
      mounted = false;
      // Clean up any object URLs to prevent memory leaks
      if (thumbnailUrl && thumbnailUrl.startsWith('blob:')) {
        URL.revokeObjectURL(thumbnailUrl);
      }
    };
  }, [file.path, connection]);
  
  return (
    <div className="relative pb-[100%] w-full h-0">
      {loading ? (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="animate-spin h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full"></div>
        </div>
      ) : error ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 p-2">
          <FiImage className="w-10 h-10 text-gray-400 mb-2" />
          <p className="text-xs text-center text-gray-500 truncate w-full">{file.name}</p>
        </div>
      ) : (
        <>
          <img
            src={thumbnailUrl}
            alt={file.name}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-1 text-xs truncate">
            {file.name}
          </div>
        </>
      )}
    </div>
  );
}