import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useConnection } from '../context/ConnectionContext';
import * as Sentry from '@sentry/browser';
import { FiSave, FiArrowLeft } from 'react-icons/fi';

export default function ConnectionDetails() {
  const { connectionId } = useParams();
  const navigate = useNavigate();
  const { addConnection, updateConnection, getConnection } = useConnection();
  const isNew = connectionId === 'new';

  const [formData, setFormData] = useState({
    name: '',
    type: 'webdav',
    host: '',
    port: '',
    username: '',
    password: '',
    path: '',
    url: '',
    isSecure: true,
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isNew) {
      const connection = getConnection(connectionId);
      if (connection) {
        setFormData(connection);
      } else {
        navigate('/');
      }
    }
  }, [connectionId, getConnection, isNew, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    
    // Validate based on connection type
    switch (formData.type) {
      case 'webdav':
      case 'ftp':
      case 'smb':
        if (!formData.host) newErrors.host = 'Host is required';
        break;
      case 'http':
        if (!formData.url) newErrors.url = 'URL is required';
        break;
      default:
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      console.log('Saving connection:', formData);
      
      if (isNew) {
        const newId = addConnection(formData);
        navigate(`/gallery/${newId}`);
      } else {
        updateConnection(connectionId, formData);
        navigate(`/gallery/${connectionId}`);
      }
    } catch (error) {
      console.error('Error saving connection:', error);
      Sentry.captureException(error);
      setErrors((prev) => ({ ...prev, form: 'Error saving connection. Please try again.' }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{isNew ? 'Add New Connection' : 'Edit Connection'}</h1>
        <button
          onClick={() => navigate('/')}
          className="flex items-center px-3 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition cursor-pointer"
        >
          <FiArrowLeft className="mr-2" />
          Back
        </button>
      </div>
      
      {errors.form && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">{errors.form}</div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
        {/* Name field */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Connection Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`box-border w-full px-3 py-2 border rounded-md shadow-sm ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
        </div>
        
        {/* Connection Type */}
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
            Connection Type
          </label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="box-border w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          >
            <option value="webdav">WebDAV</option>
            <option value="ftp">FTP</option>
            <option value="smb">SMB</option>
            <option value="http">HTTP/HTTPS</option>
          </select>
        </div>
        
        {/* Type-specific fields */}
        {formData.type === 'http' ? (
          <div>
            <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
              URL
            </label>
            <input
              type="text"
              id="url"
              name="url"
              value={formData.url}
              onChange={handleChange}
              placeholder="https://example.com/images/"
              className={`box-border w-full px-3 py-2 border rounded-md shadow-sm ${
                errors.url ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.url && <p className="mt-1 text-sm text-red-500">{errors.url}</p>}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="host" className="block text-sm font-medium text-gray-700 mb-1">
                  Host
                </label>
                <input
                  type="text"
                  id="host"
                  name="host"
                  value={formData.host}
                  onChange={handleChange}
                  className={`box-border w-full px-3 py-2 border rounded-md shadow-sm ${
                    errors.host ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.host && <p className="mt-1 text-sm text-red-500">{errors.host}</p>}
              </div>
              <div>
                <label htmlFor="port" className="block text-sm font-medium text-gray-700 mb-1">
                  Port (Optional)
                </label>
                <input
                  type="text"
                  id="port"
                  name="port"
                  value={formData.port}
                  onChange={handleChange}
                  className="box-border w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="path" className="block text-sm font-medium text-gray-700 mb-1">
                Path (Optional)
              </label>
              <input
                type="text"
                id="path"
                name="path"
                value={formData.path}
                onChange={handleChange}
                placeholder="/path/to/images"
                className="box-border w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                  Username (Optional)
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="box-border w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password (Optional)
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="box-border w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                />
              </div>
            </div>
            
            {formData.type !== 'smb' && (
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isSecure"
                  name="isSecure"
                  checked={formData.isSecure}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
                <label htmlFor="isSecure" className="ml-2 block text-sm text-gray-700">
                  Use secure connection (FTPS/HTTPS)
                </label>
              </div>
            )}
          </>
        )}
        
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition cursor-pointer disabled:opacity-50 flex items-center"
          >
            <FiSave className="mr-2" />
            {isSubmitting ? 'Saving...' : isNew ? 'Add Connection' : 'Update Connection'}
          </button>
        </div>
      </form>
    </div>
  );
}