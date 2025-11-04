import React from 'react';
import AnalyzeResults from './AnalyzeResults';
import TranslateResults from './TranslateResults';

const ResultsPanel = ({ result, loading, activeTab, compactMode }) => {
  return (
    <div className="rounded-lg shadow-lg p-6 sticky top-8 transition-colors bg-white">
      <h3 className="text-lg font-semibold mb-4 transition-colors text-gray-900">📋 Results</h3>
      
      {!result && !loading && (
        <div className="text-center py-12 transition-colors text-gray-400">
          <svg className="mx-auto h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p>Results will appear here</p>
        </div>
      )}

      {result && (
        <div className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
          {activeTab === 'analyze' && <AnalyzeResults result={result} compactMode={compactMode} />}
          {activeTab === 'translate' && <TranslateResults result={result} />}
        </div>
      )}
    </div>
  );
};

export default ResultsPanel;
