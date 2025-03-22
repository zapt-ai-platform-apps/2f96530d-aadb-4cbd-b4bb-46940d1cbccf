import React from 'react';
import { Link } from 'react-router-dom';
import { FiHome } from 'react-icons/fi';

export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto p-4 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-blue-600">Network Image Gallery</Link>
        <Link to="/" className="p-2 hover:bg-gray-100 rounded-full transition cursor-pointer">
          <FiHome size={24} />
        </Link>
      </div>
    </header>
  );
}