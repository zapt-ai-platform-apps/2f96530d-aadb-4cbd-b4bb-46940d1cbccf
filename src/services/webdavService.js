import { createClient as createWebDAVClient } from 'webdav';
import * as Sentry from '@sentry/browser';

const createClient = (connection) => {
  const protocol = connection.isSecure ? 'https' : 'http';
  const port = connection.port ? `:${connection.port}` : '';
  const baseUrl = `${protocol}://${connection.host}${port}`;
  
  console.log(`WebDAV: Creating client for ${baseUrl}`);
  
  const client = createWebDAVClient(baseUrl, {
    username: connection.username,
    password: connection.password,
  });
  
  const listFiles = async (path = '') => {
    try {
      const fullPath = connection.path ? `${connection.path}/${path}`.replace(/\/\//g, '/') : path;
      console.log(`WebDAV: Listing files at ${fullPath}`);
      
      const contents = await client.getDirectoryContents(fullPath);
      
      return contents.map(item => ({
        name: item.basename,
        path: item.filename,
        isDirectory: item.type === 'directory',
        size: item.size,
        lastModified: item.lastmod,
      }));
    } catch (error) {
      console.error('Error listing files via WebDAV:', error);
      Sentry.captureException(error);
      throw error;
    }
  };
  
  const getFileContent = async (path) => {
    try {
      console.log(`WebDAV: Getting file content for ${path}`);
      const response = await client.getFileContents(path, { format: 'binary' });
      const blob = new Blob([response]);
      return URL.createObjectURL(blob);
    } catch (error) {
      console.error('Error getting file content via WebDAV:', error);
      Sentry.captureException(error);
      throw error;
    }
  };
  
  return {
    listFiles,
    getFileContent,
  };
};

export default { createClient };