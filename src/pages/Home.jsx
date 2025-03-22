import React from 'react';
import { Link } from 'react-router-dom';
import { useConnection } from '../context/ConnectionContext';
import { FiPlus, FiSettings, FiFolder, FiCloud, FiServer, FiGlobe, FiHardDrive, FiTrash2, FiEdit } from 'react-icons/fi';

export default function Home() {
  const { connections, loading, deleteConnection } = useConnection();

  const handleDeleteConnection = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this connection?')) {
      deleteConnection(id);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Network Image Gallery</h1>
        <div className="flex space-x-2">
          <Link
            to="/connection/new"
            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition cursor-pointer"
          >
            <FiPlus className="mr-2" /> New Connection
          </Link>
          <Link
            to="/settings"
            className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition cursor-pointer"
          >
            <FiSettings className="mr-2" /> Settings
          </Link>
        </div>
      </div>

      {connections.length === 0 ? (
        <div className="text-center p-12 bg-white rounded-lg shadow">
          <FiFolder className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">No connections yet</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by creating a new connection to your network source.
          </p>
          <div className="mt-6">
            <Link
              to="/connection/new"
              className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition cursor-pointer"
            >
              <FiPlus className="mr-2" /> New Connection
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {connections.map((connection) => (
            <div key={connection.id} className="relative">
              <Link
                to={`/gallery/${connection.id}`}
                className="block p-6 bg-white rounded-lg shadow hover:shadow-md transition"
              >
                <div className="flex items-center">
                  {getConnectionIcon(connection.type)}
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">{connection.name}</h3>
                    <p className="text-sm text-gray-500">{getConnectionTypeLabel(connection.type)}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {connection.host || connection.url || 'No details available'}
                    </p>
                  </div>
                </div>
              </Link>
              <div className="absolute top-2 right-2 flex space-x-1">
                <Link
                  to={`/connection/${connection.id}`}
                  className="p-2 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition cursor-pointer"
                  title="Edit"
                >
                  <FiEdit size={16} />
                </Link>
                <button
                  onClick={(e) => handleDeleteConnection(e, connection.id)}
                  className="p-2 bg-gray-100 text-red-600 rounded-full hover:bg-gray-200 transition cursor-pointer"
                  title="Delete"
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function getConnectionIcon(type) {
  switch (type) {
    case 'webdav':
      return <div className="p-3 bg-blue-100 text-blue-600 rounded-full"><FiCloud /></div>;
    case 'ftp':
      return <div className="p-3 bg-green-100 text-green-600 rounded-full"><FiServer /></div>;
    case 'smb':
      return <div className="p-3 bg-yellow-100 text-yellow-600 rounded-full"><FiHardDrive /></div>;
    case 'http':
      return <div className="p-3 bg-purple-100 text-purple-600 rounded-full"><FiGlobe /></div>;
    default:
      return <div className="p-3 bg-gray-100 text-gray-600 rounded-full"><FiFolder /></div>;
  }
}

function getConnectionTypeLabel(type) {
  switch (type) {
    case 'webdav':
      return 'WebDAV';
    case 'ftp':
      return 'FTP';
    case 'smb':
      return 'SMB';
    case 'http':
      return 'HTTP/HTTPS';
    default:
      return 'Unknown';
  }
}