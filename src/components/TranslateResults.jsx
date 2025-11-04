import React from 'react';

const TranslateResults = ({ result }) => {
  return (
    <>
      <div className="rounded-lg p-4 transition-colors bg-blue-50">
        <h4 className="font-semibold transition-colors text-blue-900">Original</h4>
        <p className="text-sm text-gray-900 mt-2">{result.original_text}</p>
      </div>
      
      <div className="rounded-lg p-4 transition-colors bg-green-50">
        <h4 className="font-semibold transition-colors text-green-900">Translation</h4>
        <p className="text-sm font-medium text-gray-900 mt-2">{result.translated_text}</p>
      </div>
      
      {result.romanized_detected && (
        <div className="rounded-lg p-4 transition-colors bg-yellow-50">
          <h4 className="font-semibold mb-2 transition-colors text-yellow-900">🔤 Romanized Conversion Applied</h4>
          <p className="text-sm text-gray-900">
            <strong>Devanagari:</strong> {result.converted_to_devanagari}
          </p>
        </div>
      )}
      
      <div className="rounded-lg p-4 transition-colors bg-gray-50">
        <h4 className="font-semibold mb-2 transition-colors text-gray-900">📄 Full Response</h4>
        <pre className="text-xs p-4 rounded overflow-x-auto transition-colors bg-white text-gray-900">
          {JSON.stringify(result, null, 2)}
        </pre>
      </div>
    </>
  );
};

export default TranslateResults;
