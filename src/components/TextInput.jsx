import React from 'react';

const TextInput = ({ text, setText, exampleTexts }) => {
  const MAX_LENGTH = 5000;
  const charCount = text.length;
  const isNearLimit = charCount > MAX_LENGTH * 0.9;
  const isOverLimit = charCount > MAX_LENGTH;

  // State to track current index for each example category
  const [exampleIndices, setExampleIndices] = React.useState({});

  // Handle text changes (no debouncing needed as React handles this efficiently)
  const handleChange = (e) => {
    const value = e.target.value;
    if (value.length <= MAX_LENGTH) {
      setText(value);
    }
  };

  const handleExampleClick = (key, values) => {
    // If values is an array, cycle through them
    if (Array.isArray(values)) {
      const currentIndex = exampleIndices[key] || 0;
      const nextIndex = (currentIndex + 1) % values.length;

      setText(values[currentIndex]);

      setExampleIndices(prev => ({
        ...prev,
        [key]: nextIndex
      }));
    } else {
      // Fallback for string values (backward compatibility)
      setText(values);
    }
  };

  return (
    <>
      {/* Text Input */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Enter Text
          </label>
          <span className={`text-xs font-medium ${isOverLimit
            ? 'text-error-600 dark:text-error-400'
            : isNearLimit
              ? 'text-warning-600 dark:text-warning-400'
              : 'text-gray-500 dark:text-gray-400'
            }`}>
            {charCount} / {MAX_LENGTH}
          </span>
        </div>
        <textarea
          value={text}
          onChange={handleChange}
          placeholder="Type or paste your text here..."
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-primary-500 resize-none bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all ${isOverLimit
            ? 'border-error-500 focus:ring-error-500'
            : 'border-gray-300 dark:border-gray-600 focus:ring-primary-500'
            }`}
          rows="8"
          maxLength={MAX_LENGTH}
          aria-label="Text input for analysis or translation"
        />
        {isOverLimit && (
          <p className="mt-1 text-xs text-error-600 dark:text-error-400">
            Text exceeds maximum length of {MAX_LENGTH} characters
          </p>
        )}
      </div>

      {/* Quick Examples */}
      <div className="mb-4">
        <p className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Quick Examples :</p>
        <div className="flex flex-wrap gap-2">
          {Object.entries(exampleTexts).map(([key, value]) => (
            <button
              key={key}
              onClick={() => handleExampleClick(key, value)}
              className="px-3 py-1.5 text-xs rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-primary-100 dark:hover:bg-primary-600 text-gray-700 dark:text-gray-300 hover:text-primary-700 dark:hover:text-white border border-gray-300 dark:border-gray-600 hover:border-primary-400 dark:hover:border-primary-500 transition-all active:scale-95"
              aria-label={`Load ${key} example text`}
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
