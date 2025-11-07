import React from "react";

const TranslateResults = ({ result }) => {
  return (
    <>
      <div className="space-y-5">
        <div className="rounded-lg p-4 bg-primary-50 dark:bg-primary-900/30 border border-primary-200 dark:border-primary-700">
          <h4 className="font-semibold text-primary-700 dark:text-primary-300">
            Original
          </h4>
          <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
            {result.original_text}
          </p>
        </div>

        <div className="rounded-lg p-4 bg-success-50 dark:bg-success-900/30 border border-success-200 dark:border-success-700">
          <h4 className="font-semibold text-success-700 dark:text-success-300">
            Translation
          </h4>
          <p className="text-sm font-medium text-gray-900 dark:text-white mt-2">
            {result.translated_text}
          </p>
        </div>

        {result.romanized_detected && (
          <div className="rounded-lg p-4 bg-warning-50 dark:bg-warning-900/30 border border-warning-200 dark:border-warning-700">
            <h4 className="font-semibold mb-2 text-warning-700 dark:text-warning-300">
              🔤 Romanized Conversion Applied
            </h4>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <strong>Devanagari:</strong> {result.converted_to_devanagari}
            </p>
          </div>
        )}

        <div className="rounded-lg p-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
          <h4 className="font-semibold mb-2 text-gray-700 dark:text-gray-300">
            📄 Full Response
          </h4>
          <pre className="text-xs p-4 rounded overflow-x-auto bg-white dark:bg-gray-950 text-gray-700 dark:text-gray-300">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      </div>
    </>
  );
};

export default TranslateResults;
