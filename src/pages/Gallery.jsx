import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useConnection } from '../context/ConnectionContext';
import { listFiles, isImageFile } from '../services/connectionService';
import GalleryGrid from '../components/Gallery/GalleryGrid';
import ImageViewer from '../components/Gallery/ImageViewer';
import * as Sentry from '@sentry/browser';
import { FiArrowLeft, FiFolder, FiRefreshCw, FiArrowUp, FiEdit } from 'react-icons/fi';

export default function Gallery() {
  const { connectionId } = useParams();
  const navigate = useNavigate();
  const { getConnection } = useConnection();
  
  const [connection, setConnection] = useState(null);
  const [currentPath, setCurrentPath] = useState('');
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [breadcrumbs, setBreadcrumbs] = useState([{ name: 'Home', path: '' }]);
  
  useEffect(() => {
    const conn = getConnection(connectionId);
    if (!conn) {
      navigate('/');
      return;
    }
    setConnection(conn);
  }, [connectionId, getConnection, navigate]);
  
  useEffect(() => {
    if (!connection) return;
    
    const loadFiles = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log(`Loading files for connection: ${connection.name}, path: ${currentPath}`);
        const filesList = await listFiles(connection, currentPath);
        console.log('Files loaded:', filesList);
        setFiles(filesList);
      } catch (err) {
        console.error('Error loading files:', err);
        Sentry.captureException(err);
        setError('Failed to load files. Please check your connection settings.');
      } finally {
        setLoading(false);
      }
    };
    
    loadFiles();
  }, [connection, currentPath]);
  
  useEffect(() => {
    if (!currentPath) {
      setBreadcrumbs([{ name: 'Home', path: '' }]);
      return;
    }
    
    const paths = currentPath.split('/').filter(Boolean);
    const crumbs = [{ name: 'Home', path: '' }];
    
    let cumulativePath = '';
    paths.forEach(part => {
      cumulativePath += `/${part}`;
      crumbs.push({
        name: part,
        path: cumulativePath,
      });
    });
    
    setBreadcrumbs(crumbs);
  }, [currentPath]);
  
  const handleFileClick = (file) => {
    if (file.isDirectory) {
      const newPath = currentPath ? `${currentPath}/${file.name}` : file.name;
      setCurrentPath(newPath);
    } else if (isImageFile(file.name)) {
      setSelectedImage(file);
    }
  };
  
  const handleNavigateUp = () => {
    if (!currentPath) return;
    
    const parts = currentPath.split('/').filter(Boolean);
    parts.pop();
    setCurrentPath(parts.join('/'));
  };
  
  const handleBreadcrumbClick = (path) => {
    setCurrentPath(path);
  };
  
  const handleRefresh = () => {
    if (!connection) return;
    
    setLoading(true);
    setError(null);
    
    listFiles(connection, currentPath)
      .then(filesList => {
        setFiles(filesList);
      })
      .catch(err => {
        console.error('Error refreshing files:', err);
        Sentry.captureException(err);
        setError('Failed to refresh files. Please try again.');
      })
      .finally(() => {
        setLoading(false);
      });
  };
  
  if (!connection) {
    return (
      <div className="text-center p-12">
        <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p>Loading connection...</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800 truncate flex-grow">{connection.name}</h1>
        <div className="flex space-x-2">
          <button 
            onClick={() => navigate(`/connection/${connectionId}`)}
            className="flex items-center px-3 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition cursor-pointer"
          >
            <FiEdit className="mr-2" />
            Edit
          </button>
          <button 
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center px-3 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition cursor-pointer"
          >
            <FiRefreshCw className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button 
            onClick={() => navigate('/')}
            className="flex items-center px-3 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition cursor-pointer"
          >
            <FiArrowLeft className="mr-2" />
            Back
          </button>
        </div>
      </div>
      
      {/* Breadcrumbs and Up Navigation */}
      <div className="flex items-center overflow-x-auto whitespace-nowrap pb-2 border-b border-gray-200">
        {currentPath && (
          <button
            onClick={handleNavigateUp}
            className="mr-3 flex items-center px-2 py-1 bg-gray-100 rounded hover:bg-gray-200 transition cursor-pointer"
          >
            <FiArrowUp className="mr-1" />
            Up
          </button>
        )}
        
        {breadcrumbs.map((crumb, index) => (
          <React.Fragment key={crumb.path}>
            {index > 0 && <span className="mx-2 text-gray-500">/</span>}
            <button
              onClick={() => handleBreadcrumbClick(crumb.path)}
              className={`text-sm ${
                index === breadcrumbs.length - 1
                  ? 'font-semibold text-blue-600'
                  : 'text-gray-600 hover:text-blue-600'
              } transition cursor-pointer`}
            >
              {crumb.name}
            </button>
          </React.Fragment>
        ))}
      </div>
      
      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      {loading ? (
        <div className="text-center p-12">
          <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading files...</p>
        </div>
      ) : files.length === 0 ? (
        <div className="text-center p-12 bg-white rounded-lg shadow">
          <FiFolder className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">No files found</h3>
          <p className="mt-1 text-sm text-gray-500">
            This directory is empty or you don't have permission to view its contents.
          </p>
          {currentPath && (
            <div className="mt-6">
              <button
                onClick={handleNavigateUp}
                className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition cursor-pointer"
              >
                <FiArrowUp className="mr-2" /> Go Up
              </button>
            </div>
          )}
        </div>
      ) : (
        <GalleryGrid 
          files={files} 
          onFileClick={handleFileClick}
          connection={connection}
        />
      )}
      
      {selectedImage && (
        <ImageViewer
          image={selectedImage}
          connection={connection}
          onClose={() => setSelectedImage(null)}
        />
      )}
    </div>
  );
}