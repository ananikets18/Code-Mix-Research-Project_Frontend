import React from 'react';

const TabNavigation = ({ activeTab, setActiveTab }) => {
  return (
    <div className="flex space-x-2 mb-6 border-gray-200 border-b">
      <button
        onClick={() => setActiveTab('analyze')}
        className={`px-4 py-2 font-medium text-sm transition-colors ${
          activeTab === 'analyze'
            ? 'text-blue-600 border-b-2 border-blue-600'
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        📊 Analyze
      </button>
      <button
        onClick={() => setActiveTab('translate')}
        className={`px-4 py-2 font-medium text-sm transition-colors ${
          activeTab === 'translate'
            ? 'text-blue-600 border-b-2 border-blue-600'
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        🌍 Translate
      </button>
    </div>
  );
};

export default TabNavigation;
