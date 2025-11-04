import React from 'react';

const Footer = () => {
  return (
    <footer className="mt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center text-sm transition-colors text-gray-600">
          <p>Multilingual NLP Analysis System v1.0.0</p>
          <p className="mt-1">
            API running on <code className="px-2 py-1 rounded bg-gray-100 text-gray-900">localhost:8000</code>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
