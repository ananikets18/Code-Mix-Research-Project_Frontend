import React from 'react';

const ErrorDisplay = ({ error }) => {
  if (!error) return null;

  return (
    <div className="mt-4 border rounded-lg p-4 transition-colors bg-red-50 border-red-200">
      <p className="text-sm text-red-800">
        <strong>Error:</strong> {error}
      </p>
    </div>
  );
};

export default ErrorDisplay;
