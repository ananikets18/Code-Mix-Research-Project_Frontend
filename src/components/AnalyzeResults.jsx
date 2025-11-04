import React from 'react';

const AnalyzeResults = ({ result, compactMode }) => {
  return (
    <>
      {/* Language Info */}
      {result.language && (
        <div className="rounded-lg p-4 transition-colors bg-blue-50">
          <h4 className="font-semibold mb-2 transition-colors text-blue-900">🌐 Language</h4>
          {compactMode ? (
            <div className="space-y-1 text-sm transition-colors text-gray-700">
              <p><strong>Code:</strong> {result.language.code}</p>
              <p><strong>Name:</strong> {result.language.name}</p>
              <p><strong>Confidence:</strong> {(result.language.confidence * 100).toFixed(1)}%</p>
              {result.language.is_romanized && (
                <span className="inline-block text-xs px-2 py-1 rounded bg-yellow-100 text-yellow-800">
                  Romanized
                </span>
              )}
              {result.language.is_code_mixed && (
                <span className="inline-block text-xs px-2 py-1 rounded ml-2 bg-purple-100 text-purple-800">
                  Code-Mixed
                </span>
              )}
            </div>
          ) : (
            <pre className="text-xs p-2 rounded overflow-x-auto transition-colors bg-white text-gray-900">
              {JSON.stringify(result.language, null, 2)}
            </pre>
          )}
        </div>
      )}

      {/* Sentiment */}
      {result.sentiment && (
        <div className="rounded-lg p-4 transition-colors bg-green-50">
          <h4 className="font-semibold mb-2 transition-colors text-green-900">😊 Sentiment</h4>
          {compactMode ? (
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold capitalize text-gray-900">{result.sentiment.label}</span>
              <span className="text-sm text-gray-600">
                {(result.sentiment.score * 100).toFixed(1)}%
              </span>
            </div>
          ) : (
            <pre className="text-xs p-2 rounded overflow-x-auto transition-colors bg-white text-gray-900">
              {JSON.stringify(result.sentiment, null, 2)}
            </pre>
          )}
        </div>
      )}

      {/* Profanity */}
      {result.profanity && (
        <div className={`rounded-lg p-4 transition-colors ${
          result.profanity.detected || result.profanity.has_profanity ? 'bg-red-50' : 'bg-gray-50'
        }`}>
          <h4 className={`font-semibold mb-2 transition-colors ${
            result.profanity.detected || result.profanity.has_profanity ? 'text-red-900' : 'text-gray-900'
          }`}>
            🚫 Profanity
          </h4>
          <p className="text-sm">
            {compactMode ? (
              result.profanity.detected ? (
                <span className="font-semibold text-red-600">Detected - Severity: {result.profanity.severity}</span>
              ) : (
                <span className="text-green-600">No profanity detected</span>
              )
            ) : (
              <pre className="text-xs p-2 rounded overflow-x-auto transition-colors bg-white text-gray-900">
                {JSON.stringify(result.profanity, null, 2)}
              </pre>
            )}
          </p>
        </div>
      )}

      {/* Translation */}
      {result.translation && (
        <div className="rounded-lg p-4 transition-colors bg-indigo-50">
          <h4 className="font-semibold transition-colors text-indigo-900">🌍 Translation</h4>
          <p className="text-sm text-gray-900 mt-2">{result.translation}</p>
        </div>
      )}

      {/* Toxicity Score */}
      {compactMode && result.toxicity_score !== undefined && (
        <div className="rounded-lg p-4 transition-colors bg-orange-50">
          <h4 className="font-semibold mb-2 transition-colors text-orange-900">⚠️ Toxicity</h4>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">Max Score:</span>
            <span className="font-bold text-gray-900">{(result.toxicity_score * 100).toFixed(1)}%</span>
          </div>
        </div>
      )}

      {/* Full JSON for non-compact */}
      {!compactMode && (
        <div className="rounded-lg p-4 transition-colors bg-gray-50">
          <h4 className="font-semibold mb-2 transition-colors text-gray-900">📄 Full Response</h4>
          <pre className="text-xs p-4 rounded overflow-x-auto max-h-96 transition-colors bg-white text-gray-900">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </>
  );
};

export default AnalyzeResults;
