import React from 'react';

const SubmitButton = ({ loading, activeTab, text, handleSubmit }) => {
  return (
    <button
      onClick={handleSubmit}
      disabled={loading || !text.trim()}
      className="w-full font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white"
    >
      {loading ? (
        <>
          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Processing...</span>
        </>
      ) : (
        <>
          <span>✨</span>
          <span>
            {activeTab === 'analyze' ? 'Analyze Text' : 'Translate'}
          </span>
        </>
      )}
    </button>
  );
};

export default SubmitButton;
