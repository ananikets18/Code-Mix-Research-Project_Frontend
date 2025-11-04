import React from 'react';

const Header = () => {
  return (
    <header className="shadow-md transition-colors duration-300 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold transition-colors text-gray-900">
              🌐 Multilingual NLP Analyzer
            </h1>
            <p className="mt-1 text-sm transition-colors text-gray-600">
              Comprehensive text analysis for International & Indian languages
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-colors bg-green-100 text-green-800">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
              API Online
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
