import React, { useState, useEffect } from 'react';
import {
    Chart as ChartJS,
    ArcElement,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
    ArcElement,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

/**
 * Statistics Dashboard Component
 * Displays analytics and statistics from analysis history
 */
const StatsDashboard = () => {
    const [stats, setStats] = useState({
        totalAnalyses: 0,
        sentimentCounts: { positive: 0, neutral: 0, negative: 0 },
        languageCounts: { english: 0, hindi: 0, mixed: 0, other: 0 },
        toxicCount: 0,
        safeCount: 0,
    });

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = () => {
        try {
            const history = JSON.parse(localStorage.getItem('analysisHistory') || '[]');

            const newStats = {
                totalAnalyses: history.length,
                sentimentCounts: { positive: 0, neutral: 0, negative: 0 },
                languageCounts: { english: 0, hindi: 0, mixed: 0, other: 0 },
                toxicCount: 0,
                safeCount: 0,
            };

            history.forEach((item) => {
                // Count sentiments
                const sentiment = item.result?.sentiment?.label?.toLowerCase();
                if (sentiment === 'positive') newStats.sentimentCounts.positive++;
                else if (sentiment === 'negative') newStats.sentimentCounts.negative++;
                else newStats.sentimentCounts.neutral++;

                // Count languages
                const langCode = item.result?.language?.code?.toLowerCase();
                const isCodeMixed = item.result?.language?.is_code_mixed;

                if (isCodeMixed) {
                    newStats.languageCounts.mixed++;
                } else if (langCode === 'en') {
                    newStats.languageCounts.english++;
                } else if (langCode === 'hi') {
                    newStats.languageCounts.hindi++;
                } else {
                    newStats.languageCounts.other++;
                }

                // Count toxicity
                const toxicity = item.result?.toxicity;
                if (toxicity) {
                    const maxToxicity = Math.max(
                        toxicity.toxic || 0,
                        toxicity.severe_toxic || 0,
                        toxicity.obscene || 0,
                        toxicity.threat || 0,
                        toxicity.insult || 0,
                        toxicity.identity_hate || 0
                    );
                    if (maxToxicity > 0.7) {
                        newStats.toxicCount++;
                    } else {
                        newStats.safeCount++;
                    }
                }
            });

            setStats(newStats);
        } catch (error) {
            console.error('Error loading stats:', error);
        }
    };

    // Sentiment Pie Chart Data
    const sentimentData = {
        labels: ['Positive', 'Neutral', 'Negative'],
        datasets: [
            {
                label: 'Sentiment Distribution',
                data: [
                    stats.sentimentCounts.positive,
                    stats.sentimentCounts.neutral,
                    stats.sentimentCounts.negative,
                ],
                backgroundColor: [
                    'rgba(34, 197, 94, 0.8)',   // Green
                    'rgba(234, 179, 8, 0.8)',   // Yellow
                    'rgba(239, 68, 68, 0.8)',   // Red
                ],
                borderColor: [
                    'rgba(34, 197, 94, 1)',
                    'rgba(234, 179, 8, 1)',
                    'rgba(239, 68, 68, 1)',
                ],
                borderWidth: 2,
            },
        ],
    };

    // Language Bar Chart Data
    const languageData = {
        labels: ['English', 'Hindi', 'Code-Mixed', 'Other'],
        datasets: [
            {
                label: 'Language Distribution',
                data: [
                    stats.languageCounts.english,
                    stats.languageCounts.hindi,
                    stats.languageCounts.mixed,
                    stats.languageCounts.other,
                ],
                backgroundColor: 'rgba(59, 130, 246, 0.8)',
                borderColor: 'rgba(59, 130, 246, 1)',
                borderWidth: 2,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    color: 'rgb(107, 114, 128)',
                    font: {
                        size: 12,
                    },
                },
            },
        },
    };

    const barOptions = {
        ...chartOptions,
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    color: 'rgb(107, 114, 128)',
                    stepSize: 1,
                },
                grid: {
                    color: 'rgba(107, 114, 128, 0.1)',
                },
            },
            x: {
                ticks: {
                    color: 'rgb(107, 114, 128)',
                },
                grid: {
                    display: false,
                },
            },
        },
    };

    if (stats.totalAnalyses === 0) {
        return (
            <div className="bg-white dark:bg-gray-800/90 border border-gray-200 dark:border-gray-700 shadow-lg rounded-xl p-6">
                <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white flex items-center gap-2">
                    <span>📊</span>
                    Statistics Dashboard
                </h2>
                <div className="text-center py-12">
                    <p className="text-gray-500 dark:text-gray-400 text-lg">
                        No analysis data yet. Start analyzing text to see statistics!
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-800/90 border border-gray-200 dark:border-gray-700 shadow-lg rounded-xl p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-bold mb-6 text-gray-800 dark:text-white flex items-center gap-2">
                <span>📊</span>
                Statistics Dashboard
            </h2>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
                    <p className="text-xs sm:text-sm text-blue-600 dark:text-blue-400 font-medium">Total Analyses</p>
                    <p className="text-2xl sm:text-3xl font-bold text-blue-700 dark:text-blue-300">{stats.totalAnalyses}</p>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-4 rounded-lg border border-green-200 dark:border-green-700">
                    <p className="text-xs sm:text-sm text-green-600 dark:text-green-400 font-medium">Safe Content</p>
                    <p className="text-2xl sm:text-3xl font-bold text-green-700 dark:text-green-300">{stats.safeCount}</p>
                </div>

                <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 p-4 rounded-lg border border-red-200 dark:border-red-700">
                    <p className="text-xs sm:text-sm text-red-600 dark:text-red-400 font-medium">Toxic Content</p>
                    <p className="text-2xl sm:text-3xl font-bold text-red-700 dark:text-red-300">{stats.toxicCount}</p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-4 rounded-lg border border-purple-200 dark:border-purple-700">
                    <p className="text-xs sm:text-sm text-purple-600 dark:text-purple-400 font-medium">Code-Mixed</p>
                    <p className="text-2xl sm:text-3xl font-bold text-purple-700 dark:text-purple-300">{stats.languageCounts.mixed}</p>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Sentiment Pie Chart */}
                <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-300">
                        Sentiment Distribution
                    </h3>
                    <div className="h-64">
                        <Pie data={sentimentData} options={chartOptions} />
                    </div>
                </div>

                {/* Language Bar Chart */}
                <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-300">
                        Language Distribution
                    </h3>
                    <div className="h-64">
                        <Bar data={languageData} options={barOptions} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StatsDashboard;
