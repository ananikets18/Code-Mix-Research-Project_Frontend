import React, { useEffect, useState } from "react";
import { getHistoryStats } from "../utils/analysisHistory";

/**
 * Statistics Dashboard Component
 * Displays analytics and insights from analysis history
 */
const StatisticsDashboard = () => {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        const data = getHistoryStats();
        setStats(data);
    }, []);

    if (!stats) {
        return <div className="text-center py-8">Loading statistics...</div>;
    }

    if (stats.total === 0) {
        return (
            <div className="text-center py-12">
                <div className="text-6xl mb-4">📊</div>
                <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    No Data Yet
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                    Start analyzing texts to see statistics here!
                </p>
            </div>
        );
    }

    const sentimentPercentages = {
        positive: ((stats.bySentiment.positive / stats.total) * 100).toFixed(1),
        neutral: ((stats.bySentiment.neutral / stats.total) * 100).toFixed(1),
        negative: ((stats.bySentiment.negative / stats.total) * 100).toFixed(1),
    };

    const topLanguages = Object.entries(stats.byLanguage)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5);

    return (
        <div className="space-y-6">
            {/* Overview Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-primary-500 to-primary-600 text-white rounded-xl p-4 shadow-lg">
                    <div className="text-3xl font-bold">{stats.total}</div>
                    <div className="text-sm opacity-90">Total Analyses</div>
                </div>

                <div className="bg-gradient-to-br from-success-500 to-success-600 text-white rounded-xl p-4 shadow-lg">
                    <div className="text-3xl font-bold">{stats.bySentiment.positive}</div>
                    <div className="text-sm opacity-90">Positive</div>
                </div>

                <div className="bg-gradient-to-br from-error-500 to-error-600 text-white rounded-xl p-4 shadow-lg">
                    <div className="text-3xl font-bold">{stats.toxic}</div>
                    <div className="text-sm opacity-90">Toxic Content</div>
                </div>

                <div className="bg-gradient-to-br from-warning-500 to-warning-600 text-white rounded-xl p-4 shadow-lg">
                    <div className="text-3xl font-bold">{stats.profane}</div>
                    <div className="text-sm opacity-90">Profane Content</div>
                </div>
            </div>

            {/* Sentiment Distribution */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                    😊 Sentiment Distribution
                </h3>
                <div className="space-y-3">
                    {/* Positive */}
                    <div>
                        <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-700 dark:text-gray-300">Positive</span>
                            <span className="font-semibold text-success-600 dark:text-success-400">
                                {sentimentPercentages.positive}%
                            </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                            <div
                                className="bg-gradient-to-r from-success-500 to-success-600 h-3 rounded-full transition-all duration-500"
                                style={{ width: `${sentimentPercentages.positive}%` }}
                            />
                        </div>
                    </div>

                    {/* Neutral */}
                    <div>
                        <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-700 dark:text-gray-300">Neutral</span>
                            <span className="font-semibold text-warning-600 dark:text-warning-400">
                                {sentimentPercentages.neutral}%
                            </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                            <div
                                className="bg-gradient-to-r from-warning-500 to-warning-600 h-3 rounded-full transition-all duration-500"
                                style={{ width: `${sentimentPercentages.neutral}%` }}
                            />
                        </div>
                    </div>

                    {/* Negative */}
                    <div>
                        <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-700 dark:text-gray-300">Negative</span>
                            <span className="font-semibold text-error-600 dark:text-error-400">
                                {sentimentPercentages.negative}%
                            </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                            <div
                                className="bg-gradient-to-r from-error-500 to-error-600 h-3 rounded-full transition-all duration-500"
                                style={{ width: `${sentimentPercentages.negative}%` }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Language Distribution */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                    🌍 Top Languages
                </h3>
                <div className="space-y-3">
                    {topLanguages.map(([language, count], index) => {
                        const percentage = ((count / stats.total) * 100).toFixed(1);
                        return (
                            <div key={language}>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-700 dark:text-gray-300">
                                        {language}
                                    </span>
                                    <span className="font-semibold text-primary-600 dark:text-primary-400">
                                        {count} ({percentage}%)
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                    <div
                                        className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full transition-all duration-500"
                                        style={{ width: `${percentage}%` }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Analysis Type Distribution */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                        📝 Analysis Types
                    </h3>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-700 dark:text-gray-300">Analyze</span>
                            <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                                {stats.byType.analyze || 0}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-700 dark:text-gray-300">Translate</span>
                            <span className="text-2xl font-bold text-secondary-600 dark:text-secondary-400">
                                {stats.byType.translate || 0}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                        ⚠️ Safety Metrics
                    </h3>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-700 dark:text-gray-300">
                                Avg. Toxicity
                            </span>
                            <span className="text-2xl font-bold text-error-600 dark:text-error-400">
                                {(stats.averageToxicity * 100).toFixed(1)}%
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-700 dark:text-gray-300">
                                Safe Content
                            </span>
                            <span className="text-2xl font-bold text-success-600 dark:text-success-400">
                                {((stats.total - stats.toxic) / stats.total * 100).toFixed(1)}%
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Summary */}
            <div className="bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 border border-primary-200 dark:border-primary-700 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
                    📊 Summary
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                    <div>
                        <div className="text-gray-600 dark:text-gray-400">Languages Detected</div>
                        <div className="text-xl font-bold text-primary-600 dark:text-primary-400">
                            {Object.keys(stats.byLanguage).length}
                        </div>
                    </div>
                    <div>
                        <div className="text-gray-600 dark:text-gray-400">Most Common</div>
                        <div className="text-xl font-bold text-primary-600 dark:text-primary-400">
                            {topLanguages[0]?.[0] || "N/A"}
                        </div>
                    </div>
                    <div>
                        <div className="text-gray-600 dark:text-gray-400">Safety Rate</div>
                        <div className="text-xl font-bold text-success-600 dark:text-success-400">
                            {((stats.total - stats.toxic) / stats.total * 100).toFixed(0)}%
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StatisticsDashboard;
