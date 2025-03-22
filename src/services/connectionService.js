import httpService from './httpService';
import webdavService from './webdavService';
import ftpService from './ftpService';
import smbService from './smbService';
import * as Sentry from '@sentry/browser';

export const getServiceForConnection = (connection) => {
  try {
    console.log('Creating service client for connection type:', connection.type);
    switch (connection.type) {
      case 'webdav':
        return webdavService.createClient(connection);
      case 'ftp':
        return ftpService.createClient(connection);
      case 'smb':
        return smbService.createClient(connection);
      case 'http':
        return httpService.createClient(connection);
      default:
        throw new Error(`Unsupported connection type: ${connection.type}`);
    }
  } catch (error) {
    console.error('Error creating service client:', error);
    Sentry.captureException(error);
    throw error;
  }
};

export const listFiles = async (connection, path = '') => {
  try {
    const service = getServiceForConnection(connection);
    return await service.listFiles(path);
  } catch (error) {
    console.error('Error listing files:', error);
    Sentry.captureException(error);
    throw error;
  }
};

export const getFileContent = async (connection, path) => {
  try {
    const service = getServiceForConnection(connection);
    return await service.getFileContent(path);
  } catch (error) {
    console.error('Error getting file content:', error);
    Sentry.captureException(error);
    throw error;
  }
};

export const isImageFile = (filename) => {
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg', '.tiff', '.ico'];
  const lowercaseName = filename.toLowerCase();
  return imageExtensions.some(ext => lowercaseName.endsWith(ext));
};

export const formatFileSize = (bytes) => {
  if (!bytes || isNaN(bytes)) return '0 B';
  
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
};