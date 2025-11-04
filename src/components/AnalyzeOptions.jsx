import React from 'react';

const AnalyzeOptions = ({ compactMode, setCompactMode }) => {
  return (
    <div className="mb-4">
      <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={compactMode}
          onChange={(e) => setCompactMode(e.target.checked)}
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <span className="text-sm transition-colors text-gray-700">Compact Response</span>
      </label>
    </div>
  );
};

export default AnalyzeOptions;
