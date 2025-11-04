import React from 'react';

const TextInput = ({ text, setText, exampleTexts }) => {
  return (
    <>
      {/* Text Input */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium transition-colors text-gray-700">
            Enter Text
          </label>
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type or paste your text here..."
          className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-colors bg-white border-gray-300 text-gray-900"
          rows="8"
        />
      </div>

      {/* Quick Examples */}
      <div className="mb-4">
        <p className="text-sm font-medium mb-2 transition-colors text-gray-700">Quick Examples:</p>
        <div className="flex flex-wrap gap-2">
          {Object.entries(exampleTexts).map(([key, value]) => (
            <button
              key={key}
              onClick={() => setText(value)}
              className="px-3 py-1 text-xs rounded-full transition-colors bg-gray-100 hover:bg-gray-200 text-gray-700"
            >
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

export default TextInput;
