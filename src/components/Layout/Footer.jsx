import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 py-4">
      <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
        <div className="mb-2">
          <a href="https://www.zapt.ai" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
            Made on ZAPT
          </a>
        </div>
        <p>&copy; {new Date().getFullYear()} Network Image Gallery. All rights reserved.</p>
      </div>
    </footer>
  );
}