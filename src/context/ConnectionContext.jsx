import React, { createContext, useState, useEffect, useContext } from 'react';
import * as Sentry from '@sentry/browser';

const ConnectionContext = createContext();

export const useConnection = () => {
  return useContext(ConnectionContext);
};

export const ConnectionProvider = ({ children }) => {
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load saved connections from localStorage
    try {
      console.log('Loading connections from localStorage');
      const savedConnections = localStorage.getItem('connections');
      if (savedConnections) {
        setConnections(JSON.parse(savedConnections));
      }
    } catch (error) {
      console.error('Error loading connections:', error);
      Sentry.captureException(error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Save connections to localStorage whenever they change
  useEffect(() => {
    try {
      console.log('Saving connections to localStorage:', connections);
      localStorage.setItem('connections', JSON.stringify(connections));
    } catch (error) {
      console.error('Error saving connections:', error);
      Sentry.captureException(error);
    }
  }, [connections]);

  const addConnection = (connection) => {
    console.log('Adding new connection:', connection);
    const newConnection = {
      ...connection,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setConnections((prev) => [...prev, newConnection]);
    return newConnection.id;
  };

  const updateConnection = (id, updatedConnection) => {
    console.log('Updating connection:', id, updatedConnection);
    setConnections((prev) =>
      prev.map((conn) =>
        conn.id === id ? { ...conn, ...updatedConnection, updatedAt: new Date().toISOString() } : conn
      )
    );
  };

  const deleteConnection = (id) => {
    console.log('Deleting connection:', id);
    setConnections((prev) => prev.filter((conn) => conn.id !== id));
  };

  const getConnection = (id) => {
    return connections.find((conn) => conn.id === id);
  };

  const value = {
    connections,
    loading,
    addConnection,
    updateConnection,
    deleteConnection,
    getConnection,
  };

  return <ConnectionContext.Provider value={value}>{children}</ConnectionContext.Provider>;
};