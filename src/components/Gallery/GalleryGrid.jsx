import React from 'react';
import Thumbnail from './Thumbnail';
import { FiFolder, FiFile } from 'react-icons/fi';
import { isImageFile } from '../../services/connectionService';

export default function GalleryGrid({ files, onFileClick, connection }) {
  // Sort files: directories first, then alphabetically
  const sortedFiles = [...files].sort((a, b) => {
    if (a.isDirectory && !b.isDirectory) return -1;
    if (!a.isDirectory && b.isDirectory) return 1;
    return a.name.localeCompare(b.name);
  });
  
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {sortedFiles.map((file) => (
        <div
          key={file.path}
          onClick={() => onFileClick(file)}
          className="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition cursor-pointer"
        >
          {file.isDirectory ? (
            <div className="p-4 flex flex-col items-center">
              <FiFolder className="w-16 h-16 text-yellow-400 mb-2" />
              <p className="text-sm text-center truncate w-full">{file.name}</p>
            </div>
          ) : isImageFile(file.name) ? (
            <Thumbnail file={file} connection={connection} />
          ) : (
            <div className="p-4 flex flex-col items-center">
              <FiFile className="w-16 h-16 text-gray-400 mb-2" />
              <p className="text-sm text-center truncate w-full">{file.name}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}