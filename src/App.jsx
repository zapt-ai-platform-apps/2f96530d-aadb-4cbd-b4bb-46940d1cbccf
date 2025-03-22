import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Gallery from './pages/Gallery';
import Settings from './pages/Settings';
import ConnectionDetails from './pages/ConnectionDetails';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import { ConnectionProvider } from './context/ConnectionContext';

export default function App() {
  return (
    <Router>
      <ConnectionProvider>
        <div className="flex flex-col min-h-screen bg-gray-100 text-gray-800">
          <Header />
          <main className="flex-grow container mx-auto p-4">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/gallery/:connectionId" element={<Gallery />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/connection/:connectionId" element={<ConnectionDetails />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </ConnectionProvider>
    </Router>
  );
}