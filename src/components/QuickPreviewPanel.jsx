import React from "react";
import { Skeleton } from "./LoadingAnimations";
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
    // Empty State - Improved with friendly copy and suggestions
    if (!result && !loading) {
        return (
            <div className="text-center py-8 px-4">
                <div className="mb-4">
                    <svg
                        className="mx-auto h-16 w-16 text-gray-300 dark:text-gray-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                    </svg>
                </div>
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    No Analysis Yet
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                    {activeTab === 'analyze'
                        ? 'Enter text to analyze language, sentiment, and safety'
                        : 'Enter text to translate to your selected language'}
                </p>
                <div className="bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-700 rounded-lg p-3">
                    <p className="text-xs text-primary-700 dark:text-primary-300 font-medium mb-2">
                        💡 Quick Tip
                    </p>
                    <p className="text-xs text-primary-600 dark:text-primary-400">
                        Try the example buttons below the text area or press <kbd className="px-1.5 py-0.5 text-xs bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded">Ctrl+K</kbd> to focus input
                    </p>
                </div>
            </div>
        );
    }

    // Loading State - Skeleton UI
    if (loading) {
        return (
            <div className="space-y-4 py-2">
                {/* Language Skeleton */}
                <div>
                    <Skeleton height="0.75rem" width="40%" className="mb-2" />
                    <Skeleton height="1.25rem" width="70%" />
                </div>

                {/* Sentiment Skeleton */}
                <div>
                    <Skeleton height="0.75rem" width="35%" className="mb-2" />
                    <Skeleton height="1.25rem" width="60%" />
                </div>

                {/* Safety Score Skeleton */}
                <div>
                    <Skeleton height="0.75rem" width="45%" className="mb-2" />
                    <div className="flex items-center gap-2">
                        <Skeleton height="0.5rem" className="flex-1" />
                        <Skeleton height="0.75rem" width="2rem" />
                    </div>
                </div>

                {/* Button Skeleton */}
                <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                    <Skeleton height="2.5rem" width="100%" />
                </div>
            </div>
        );
    }

    if (!result) return null;

    return (
        <div className="space-y-4">
            {/* Language Detection */}
            {result.language && (
                <div className="text-sm flex items-center justify-between bg-gradient-to-r from-primary-50/50 to-transparent dark:from-primary-900/10 dark:to-transparent p-3 rounded-lg border border-primary-100 dark:border-primary-900/30">
                    <div className="flex-1">
                        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1 font-medium">
                            🌍 Language
                        </div>
                        <div className="font-bold text-gray-900 dark:text-white text-base">
                            {result.language.language_info?.language_name ||
                                result.language.name ||
                                "Unknown"}
                            <span className="text-xs ml-2 text-gray-500 dark:text-gray-400 font-normal">
                                ({(result.language.confidence * 100).toFixed(1)}%)
                            </span>
                        </div>
                    </div>
                    {/* Code-Mixed & Romanized Indicators */}
                    <div className="flex flex-col gap-1">
                        {(result.language.composition?.is_code_mixed ||
                            result.language.is_code_mixed) && (
                                <span className="text-xs px-2 py-1 rounded-full bg-secondary-100 dark:bg-secondary-900/40 text-secondary-700 dark:text-secondary-300 border border-secondary-300 dark:border-secondary-700 font-medium">
                                    🔄 Mixed
                                </span>
                            )}
                        {(result.language.language_info?.is_romanized ||
                            result.language.is_romanized) && (
                                <span className="text-xs px-2 py-1 rounded-full bg-warning-100 dark:bg-warning-900/40 text-warning-700 dark:text-warning-300 border border-warning-300 dark:border-warning-700 font-medium">
                                    🔤 Roman
                                </span>
                            )}
                    </div>
                </div>
            )}

            {/* Sentiment Analysis */}
            {result.sentiment && (
                <div className="text-sm bg-gradient-to-r from-gray-50 to-transparent dark:from-gray-800/50 dark:to-transparent p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-1 font-medium">
                        😊 Sentiment
                    </div>
                    <div className="font-bold text-gray-900 dark:text-white capitalize text-base">
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
                <div className="text-sm bg-gradient-to-r from-success-50/50 to-transparent dark:from-success-900/10 dark:to-transparent p-3 rounded-lg border border-success-200 dark:border-success-900/30">
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-2 font-medium">
                        🛡️ Safety Score
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
                            {(() => {
                                const safetyScore = calculateSafetyScore(result.toxicity);
                                const colorClass = getSafetyColorClass(safetyScore);

                                return (
                                    <div
                                        className={`h-2.5 rounded-full ${colorClass} transition-all duration-500`}
                                        style={{ width: `${safetyScore}%` }}
                                    ></div>
                                );
                            })()}
                        </div>
                        <span className="text-sm font-bold text-gray-900 dark:text-white min-w-[3rem] text-right">
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

            {/* View Full Results Button - Enhanced */}
            <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                <button
                    onClick={() =>
                        document
                            .getElementById("results-section")
                            ?.scrollIntoView({ behavior: "smooth" })
                    }
                    className="w-full text-sm font-semibold px-4 py-3 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-lg transition-all shadow-md hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
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
