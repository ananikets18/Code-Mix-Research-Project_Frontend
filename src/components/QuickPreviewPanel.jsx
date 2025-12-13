import React from "react";
import {
    calculateSafetyScore,
    getSafetyColorClass,
    getSentimentDisplay,
    getMaxSentimentConfidence,
} from "../utils/homePageHelpers";

/**
 * Quick Preview Panel Component
 * Displays a summary of analysis results in the sidebar
 */
const QuickPreviewPanel = ({ result, loading, activeTab }) => {
    if (!result && !loading) {
        return (
            <div className="text-center py-8 text-gray-400 dark:text-gray-500">
                <svg
                    className="mx-auto h-12 w-12 mb-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                </svg>
                <p className="text-sm">Results will appear here</p>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="text-center py-8">
                <div
                    className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"
                    role="status"
                    aria-label="Loading"
                ></div>
                <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                    Analyzing...
                </p>
            </div>
        );
    }

    if (!result) return null;

    return (
        <div className="space-y-4">
            {/* Language Detection */}
            {result.language && (
                <div className="text-sm flex items-center justify-between">
                    <div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                            Language
                        </div>
                        <div className="font-semibold text-gray-800 dark:text-gray-200">
                            {result.language.language_info?.language_name ||
                                result.language.name ||
                                "Unknown"}
                            <span className="text-xs ml-2 text-gray-500">
                                ({(result.language.confidence * 100).toFixed(1)}%)
                            </span>
                        </div>
                    </div>
                    {/* Code-Mixed & Romanized Indicators */}
                    <div className="flex flex-wrap gap-1">
                        {(result.language.composition?.is_code_mixed ||
                            result.language.is_code_mixed) && (
                                <span className="text-xs px-2 py-1 rounded-full bg-secondary-100 dark:bg-secondary-900/40 text-secondary-700 dark:text-secondary-300 border border-secondary-300 dark:border-secondary-700">
                                    🔄 Code-Mixed
                                </span>
                            )}
                        {(result.language.language_info?.is_romanized ||
                            result.language.is_romanized) && (
                                <span className="text-xs px-2 py-1 rounded-full bg-warning-100 dark:bg-warning-900/40 text-warning-700 dark:text-warning-300 border border-warning-300 dark:border-warning-700">
                                    🔤 Romanized
                                </span>
                            )}
                    </div>
                </div>
            )}

            {/* Sentiment Analysis */}
            {result.sentiment && (
                <div className="text-sm">
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                        Sentiment
                    </div>
                    <div className="font-semibold text-gray-800 dark:text-gray-200 capitalize">
                        {getSentimentDisplay(result.sentiment.label)}
                    </div>
                    {result.sentiment.scores && (
                        <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                            {getMaxSentimentConfidence(result.sentiment.scores)}% confidence
                        </div>
                    )}
                </div>
            )}

            {/* Safety Score */}
            {result.toxicity && (
                <div className="text-sm">
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                        Safety Score
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            {(() => {
                                const safetyScore = calculateSafetyScore(result.toxicity);
                                const colorClass = getSafetyColorClass(safetyScore);

                                return (
                                    <div
                                        className={`h-2 rounded-full ${colorClass}`}
                                        style={{ width: `${safetyScore}%` }}
                                    ></div>
                                );
                            })()}
                        </div>
                        <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                            {calculateSafetyScore(result.toxicity).toFixed(0)}%
                        </span>
                    </div>
                </div>
            )}

            {/* Translation Availability */}
            {result.translations && (
                <div className="text-sm">
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                        Translation
                    </div>
                    <div className="flex items-center gap-2">
                        {result.translations.english ? (
                            <>
                                <span className="text-lg">🇬🇧</span>
                                <span className="font-semibold text-primary-600 dark:text-primary-400">
                                    Available
                                </span>
                            </>
                        ) : (
                            <>
                                <span className="text-lg">ℹ️</span>
                                <span className="font-semibold text-gray-600 dark:text-gray-400">
                                    Not Available
                                </span>
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* Profanity Check */}
            {result.profanity && (
                <div className="text-sm">
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                        Profanity Check
                    </div>
                    <div className="flex items-center gap-2">
                        {result.profanity.has_profanity ? (
                            <>
                                <span className="text-lg">⚠️</span>
                                <span className="font-semibold text-error-600 dark:text-error-400">
                                    Detected ({result.profanity.word_count || 0}{" "}
                                    {result.profanity.word_count === 1 ? "word" : "words"})
                                </span>
                            </>
                        ) : (
                            <>
                                <span className="text-lg">✅</span>
                                <span className="font-semibold text-success-600 dark:text-success-400">
                                    Clean Content
                                </span>
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* View Full Results Button */}
            <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                <button
                    onClick={() =>
                        document
                            .getElementById("results-section")
                            ?.scrollIntoView({ behavior: "smooth" })
                    }
                    className="w-full text-sm font-medium px-4 py-2.5 bg-primary-100 dark:bg-primary-900/30 hover:bg-primary-200 dark:hover:bg-primary-900/50 text-primary-700 dark:text-primary-300 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                    View Full Results
                    <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                        />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default QuickPreviewPanel;
