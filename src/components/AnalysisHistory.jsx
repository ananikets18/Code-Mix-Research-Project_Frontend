import React, { useState, useEffect } from "react";
import {
    getHistory,
    getFilteredHistory,
    deleteHistoryItem,
    clearHistory,
    getHistoryStats,
} from "../utils/analysisHistory";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faTrash,
    faSearch,
    faFilter,
    faDownload,
    faChartBar,
} from "@fortawesome/free-solid-svg-icons";

/**
 * Analysis History Component
 * Displays history of analyses with filtering and search
 */
const AnalysisHistory = ({ onSelectItem }) => {
    const [history, setHistory] = useState([]);
    const [filteredHistory, setFilteredHistory] = useState([]);
    const [filters, setFilters] = useState({});
    const [searchText, setSearchText] = useState("");
    const [showFilters, setShowFilters] = useState(false);
    const [showStats, setShowStats] = useState(false);
    const [stats, setStats] = useState(null);

    // Load history on mount
    useEffect(() => {
        loadHistory();
    }, []);

    // Apply filters when they change
    useEffect(() => {
        applyFilters();
    }, [filters, searchText, history]);

    const loadHistory = () => {
        const data = getHistory();
        setHistory(data);
        setFilteredHistory(data);
        setStats(getHistoryStats());
    };

    const applyFilters = () => {
        const filtered = getFilteredHistory({ ...filters, searchText });
        setFilteredHistory(filtered);
    };

    const handleDelete = (id) => {
        if (window.confirm("Delete this analysis from history?")) {
            deleteHistoryItem(id);
            loadHistory();
        }
    };

    const handleClearAll = () => {
        if (window.confirm("Clear all history? This cannot be undone.")) {
            clearHistory();
            loadHistory();
        }
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({
            ...prev,
            [key]: value === "all" ? undefined : value,
        }));
    };

    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return "Just now";
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        if (days < 7) return `${days}d ago`;
        return date.toLocaleDateString();
    };

    const getSentimentColor = (sentiment) => {
        if (!sentiment) return "gray";
        const s = sentiment.toLowerCase();
        if (s === "positive") return "green";
        if (s === "negative") return "red";
        return "yellow";
    };

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                    📜 Analysis History
                </h3>
                <div className="flex gap-2">
                    <button
                        onClick={() => setShowStats(!showStats)}
                        className="px-3 py-1.5 text-sm bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                        title="Show Statistics"
                    >
                        <FontAwesomeIcon icon={faChartBar} className="mr-1" />
                        Stats
                    </button>
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="px-3 py-1.5 text-sm bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                        title="Toggle Filters"
                    >
                        <FontAwesomeIcon icon={faFilter} className="mr-1" />
                        Filters
                    </button>
                    <button
                        onClick={handleClearAll}
                        className="px-3 py-1.5 text-sm bg-error-500 text-white rounded-lg hover:bg-error-600 transition-colors"
                        title="Clear All History"
                    >
                        <FontAwesomeIcon icon={faTrash} className="mr-1" />
                        Clear All
                    </button>
                </div>
            </div>

            {/* Statistics Panel */}
            {showStats && stats && (
                <div className="bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 border border-primary-200 dark:border-primary-700 rounded-xl p-4">
                    <h4 className="font-semibold text-gray-800 dark:text-white mb-3">
                        📊 Statistics
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                                {stats.total}
                            </div>
                            <div className="text-xs text-gray-600 dark:text-gray-400">
                                Total Analyses
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-success-600 dark:text-success-400">
                                {stats.bySentiment.positive || 0}
                            </div>
                            <div className="text-xs text-gray-600 dark:text-gray-400">
                                Positive
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-error-600 dark:text-error-400">
                                {stats.toxic}
                            </div>
                            <div className="text-xs text-gray-600 dark:text-gray-400">
                                Toxic
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-warning-600 dark:text-warning-400">
                                {Object.keys(stats.byLanguage).length}
                            </div>
                            <div className="text-xs text-gray-600 dark:text-gray-400">
                                Languages
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Filters Panel */}
            {showFilters && (
                <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Type Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Type
                            </label>
                            <select
                                value={filters.type || "all"}
                                onChange={(e) => handleFilterChange("type", e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            >
                                <option value="all">All Types</option>
                                <option value="analyze">Analyze</option>
                                <option value="translate">Translate</option>
                            </select>
                        </div>

                        {/* Sentiment Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Sentiment
                            </label>
                            <select
                                value={filters.sentiment || "all"}
                                onChange={(e) => handleFilterChange("sentiment", e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            >
                                <option value="all">All Sentiments</option>
                                <option value="positive">Positive</option>
                                <option value="neutral">Neutral</option>
                                <option value="negative">Negative</option>
                            </select>
                        </div>

                        {/* Special Filters */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Special
                            </label>
                            <div className="space-y-2">
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={filters.toxicOnly || false}
                                        onChange={(e) => handleFilterChange("toxicOnly", e.target.checked)}
                                        className="mr-2"
                                    />
                                    <span className="text-sm text-gray-700 dark:text-gray-300">
                                        Toxic Only
                                    </span>
                                </label>
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={filters.profaneOnly || false}
                                        onChange={(e) => handleFilterChange("profaneOnly", e.target.checked)}
                                        className="mr-2"
                                    />
                                    <span className="text-sm text-gray-700 dark:text-gray-300">
                                        Profane Only
                                    </span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Search Bar */}
            <div className="relative">
                <FontAwesomeIcon
                    icon={faSearch}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
                <input
                    type="text"
                    placeholder="Search in history..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
            </div>

            {/* History List */}
            <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredHistory.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        {history.length === 0
                            ? "No analysis history yet. Start analyzing!"
                            : "No results match your filters."}
                    </div>
                ) : (
                    filteredHistory.map((item) => (
                        <div
                            key={item.id}
                            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 hover:shadow-md transition-shadow cursor-pointer"
                            onClick={() => onSelectItem && onSelectItem(item)}
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span
                                            className={`px-2 py-0.5 text-xs rounded-full bg-${getSentimentColor(
                                                item.sentiment
                                            )}-100 dark:bg-${getSentimentColor(
                                                item.sentiment
                                            )}-900/30 text-${getSentimentColor(
                                                item.sentiment
                                            )}-700 dark:text-${getSentimentColor(item.sentiment)}-300`}
                                        >
                                            {item.sentiment || "N/A"}
                                        </span>
                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                            {item.language}
                                        </span>
                                        <span className="text-xs text-gray-400 dark:text-gray-500">
                                            {formatDate(item.timestamp)}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                                        {item.text}
                                    </p>
                                </div>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDelete(item.id);
                                    }}
                                    className="ml-2 text-error-500 hover:text-error-600 transition-colors"
                                    title="Delete"
                                >
                                    <FontAwesomeIcon icon={faTrash} />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Results Count */}
            <div className="text-sm text-gray-500 dark:text-gray-400 text-center">
                Showing {filteredHistory.length} of {history.length} analyses
            </div>
        </div>
    );
};

export default AnalysisHistory;
