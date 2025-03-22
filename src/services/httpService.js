import axios from 'axios';
import * as Sentry from '@sentry/browser';

const createClient = (connection) => {
  const baseURL = connection.url.endsWith('/') ? connection.url : `${connection.url}/`;
  
  const instance = axios.create({
    baseURL,
    auth: connection.username ? {
      username: connection.username,
      password: connection.password,
    } : undefined,
  });
  
  const listFiles = async (path = '') => {
    try {
      console.log(`HTTP: Listing files at ${baseURL}${path}`);
      
      // Try to get directory listing
      // This is a mock implementation since browsers can't typically list directories via HTTP
      // In a real implementation, this would rely on a server that supports directory listing
      // or a specific API endpoint
      
      // For demonstration purposes, we'll simulate a response
      // In reality, this would likely need a backend service or server directory listing
      return [
        {
          name: 'sample1.jpg',
          path: path ? `${path}/sample1.jpg` : 'sample1.jpg',
          isDirectory: false,
          size: 1024000,
          lastModified: new Date().toISOString(),
        },
        {
          name: 'sample2.png',
          path: path ? `${path}/sample2.png` : 'sample2.png',
          isDirectory: false,
          size: 2048000,
          lastModified: new Date().toISOString(),
        },
        {
          name: 'example_folder',
          path: path ? `${path}/example_folder` : 'example_folder',
          isDirectory: true,
          size: 0,
          lastModified: new Date().toISOString(),
        },
      ];
    } catch (error) {
      console.error('Error listing files via HTTP:', error);
      Sentry.captureException(error);
      throw new Error(`HTTP listing failed: ${error.message}`);
    }
  };
  
  const getFileContent = async (path) => {
    try {
      console.log(`HTTP: Getting file content for ${baseURL}${path}`);
      const response = await instance.get(path, {
        responseType: 'blob',
      });
      return URL.createObjectURL(response.data);
    } catch (error) {
      console.error('Error getting file content via HTTP:', error);
      Sentry.captureException(error);
      throw error;
    }
  };
  
  const getImageUrl = (path) => {
    // For HTTP, we can often directly use the URL
    return `${baseURL}${path}`.replace(/\/\//g, '/');
  };
  
  return {
    listFiles,
    getFileContent,
    getImageUrl,
  };
};

export default { createClient };