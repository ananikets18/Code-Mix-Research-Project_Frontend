import React, { useMemo } from 'react';

/**
 * Sentiment Text Highlighter Component
 * Highlights text based on sentiment analysis
 */
const SentimentHighlighter = ({ text, sentimentResult }) => {
    const highlightedText = useMemo(() => {
        if (!text || !sentimentResult) return text;

        // Simple word-level sentiment highlighting
        // In a real implementation, you'd use word-level sentiment from the API
        const words = text.split(/(\s+)/); // Split but keep whitespace

        const sentiment = sentimentResult.label?.toLowerCase();
        const confidence = sentimentResult.confidence || 0;

        // Determine highlight color based on overall sentiment
        let highlightClass = '';
        if (sentiment === 'positive' && confidence > 0.6) {
            highlightClass = 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200';
        } else if (sentiment === 'negative' && confidence > 0.6) {
            highlightClass = 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200';
        } else {
            highlightClass = 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200';
        }

        return words.map((word, index) => {
            // Only highlight actual words, not whitespace
            if (word.trim().length > 0) {
                return (
                    <span
                        key={index}
                        className={`${highlightClass} px-1 rounded transition-colors duration-200`}
                    >
                        {word}
                    </span>
                );
            }
            return <span key={index}>{word}</span>;
        });
    }, [text, sentimentResult]);

    return (
        <div className="bg-white dark:bg-gray-800/90 border border-gray-200 dark:border-gray-700 shadow-lg rounded-xl p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                    <span>🎨</span>
                    Sentiment Highlighting
                </h3>
                <div className="flex gap-2 text-xs">
                    <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded">
                        Positive
                    </span>
                    <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 rounded">
                        Neutral
                    </span>
                    <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded">
                        Negative
                    </span>
                </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <p className="text-base sm:text-lg leading-relaxed">
                    {highlightedText}
                </p>
            </div>

            {sentimentResult && (
                <div className="mt-4 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Overall Sentiment:</span>
                    <span className={`px-3 py-1 rounded-full font-semibold ${sentimentResult.label?.toLowerCase() === 'positive'
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                            : sentimentResult.label?.toLowerCase() === 'negative'
                                ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                                : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
                        }`}>
                        {sentimentResult.label} ({(sentimentResult.confidence * 100).toFixed(1)}%)
                    </span>
                </div>
            )}
        </div>
    );
};

export default SentimentHighlighter;
