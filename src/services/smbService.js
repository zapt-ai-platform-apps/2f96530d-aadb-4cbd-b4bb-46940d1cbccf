import * as Sentry from '@sentry/browser';

const createClient = (connection) => {
  console.log(`SMB: Creating client for ${connection.host}`);
  
  // SMB is not directly supported in browsers
  // This would require a backend proxy service
  
  const listFiles = async (path = '') => {
    try {
      console.log(`SMB: Attempting to list files at ${path}`);
      
      // This is a mock implementation since SMB requires a backend service
      // In a real implementation, this would make a request to your backend
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
      console.error('Error listing files via SMB:', error);
      Sentry.captureException(error);
      throw new Error(`SMB listing failed: ${error.message}`);
    }
  };
  
  const getFileContent = async (path) => {
    try {
      console.log(`SMB: Getting file content for ${path}`);
      
      // This is a mock implementation
      // In a real implementation, this would make a request to your backend
      
      // Simulate a request delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create a color based on the path to generate different colored images
      const hash = path.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      const color = `hsl(${hash % 360}, 70%, 80%)`;
      
      // Generate a mock image
      const canvas = document.createElement('canvas');
      canvas.width = 800;
      canvas.height = 600;
      const ctx = canvas.getContext('2d');
      
      // Fill with color
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Add text
      ctx.fillStyle = 'black';
      ctx.font = '30px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(`Mock SMB Image: ${path}`, canvas.width / 2, canvas.height / 2);
      
      return new Promise(resolve => {
        canvas.toBlob(blob => {
          resolve(URL.createObjectURL(blob));
        });
      });
    } catch (error) {
      console.error('Error getting file content via SMB:', error);
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