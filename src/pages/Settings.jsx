import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiSave } from 'react-icons/fi';
import * as Sentry from '@sentry/browser';

export default function Settings() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    thumbnailSize: 'medium',
    theme: 'light',
    cacheImages: true,
    showHiddenFiles: false,
  });
  const [saved, setSaved] = useState(false);
  
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem('appSettings');
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      Sentry.captureException(error);
    }
  }, []);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setSaved(false);
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      localStorage.setItem('appSettings', JSON.stringify(settings));
      console.log('Settings saved:', settings);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      Sentry.captureException(error);
    }
  };
  
  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
        <button
          onClick={() => navigate('/')}
          className="flex items-center px-3 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition cursor-pointer"
        >
          <FiArrowLeft className="mr-2" />
          Back
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
        <div>
          <label htmlFor="thumbnailSize" className="block text-sm font-medium text-gray-700 mb-1">
            Thumbnail Size
          </label>
          <select
            id="thumbnailSize"
            name="thumbnailSize"
            value={settings.thumbnailSize}
            onChange={handleChange}
            className="box-border w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          >
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="theme" className="block text-sm font-medium text-gray-700 mb-1">
            Theme
          </label>
          <select
            id="theme"
            name="theme"
            value={settings.theme}
            onChange={handleChange}
            className="box-border w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="system">System Default</option>
          </select>
        </div>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            id="cacheImages"
            name="cacheImages"
            checked={settings.cacheImages}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded"
          />
          <label htmlFor="cacheImages" className="ml-2 block text-sm text-gray-700">
            Cache images for faster loading
          </label>
        </div>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            id="showHiddenFiles"
            name="showHiddenFiles"
            checked={settings.showHiddenFiles}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded"
          />
          <label htmlFor="showHiddenFiles" className="ml-2 block text-sm text-gray-700">
            Show hidden files
          </label>
        </div>
        
        <div className="flex justify-end space-x-3">
          {saved && <span className="text-green-600 py-2">Settings saved!</span>}
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition cursor-pointer flex items-center"
          >
            <FiSave className="mr-2" />
            Save Settings
          </button>
        </div>
      </form>
      
      <div className="mt-6 p-4 bg-gray-100 rounded-lg">
        <h3 className="text-lg font-medium text-gray-800 mb-2">About</h3>
        <p className="text-sm text-gray-600 mb-2">
          Network Image Gallery is a web application that allows you to view images from various network sources.
        </p>
        <p className="text-sm text-gray-600">
          Version: 1.0.0
        </p>
        <div className="mt-3">
          <a href="https://www.zapt.ai" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">
            Made on ZAPT
          </a>
        </div>
      </div>
    </div>
  );
}