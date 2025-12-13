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
        if (s === "positive") return "success";
        if (s === "negative") return "error";
        return "warning";
    };

    return (
        <div className="space-y-2 sm:space-y-3">
            {/* Header */}
            <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-2">
                <div className="flex gap-2">
                    <button
                        onClick={() => setShowStats(!showStats)}
                        className="px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors flex items-center gap-1"
                        title="Statistics"
                    >
                        <FontAwesomeIcon icon={faChartBar} />
                        <span className="hidden sm:inline">Stats</span>
                    </button>
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors flex items-center gap-1"
                        title="Filters"
                    >
                        <FontAwesomeIcon icon={faFilter} />
                        <span className="hidden sm:inline">Filters</span>
                    </button>
                    <button
                        onClick={handleClearAll}
                        className="px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm bg-error-500 text-white rounded-md hover:bg-error-600 transition-colors flex items-center gap-1"
                        title="Clear All"
                    >
                        <FontAwesomeIcon icon={faTrash} />
                        <span className="hidden sm:inline">Clear</span>
                    </button>
                </div>
            </div>

            {/* Statistics Panel */}
            {showStats && stats && (
                <div className="bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 border border-primary-200 dark:border-primary-700 rounded-lg p-3 sm:p-4">
                    <h4 className="text-sm sm:text-base font-semibold text-gray-800 dark:text-white mb-2 sm:mb-3">
                        📊 Statistics
                    </h4>
                    <div className="grid grid-cols-2 gap-2 sm:gap-3">
                        <div className="text-center">
                            <div className="text-lg sm:text-xl md:text-2xl font-bold text-primary-600 dark:text-primary-400">
                                {stats.total}
                            </div>
                            <div className="text-xs text-gray-600 dark:text-gray-400">
                                Total
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-lg sm:text-xl md:text-2xl font-bold text-success-600 dark:text-success-400">
                                {stats.bySentiment.positive || 0}
                            </div>
                            <div className="text-xs text-gray-600 dark:text-gray-400">
                                Positive
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-lg sm:text-xl md:text-2xl font-bold text-error-600 dark:text-error-400">
                                {stats.toxic}
                            </div>
                            <div className="text-xs text-gray-400">
                                Toxic
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-lg sm:text-xl md:text-2xl font-bold text-warning-600 dark:text-warning-400">
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
                <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg p-3 sm:p-4">
                    <div className="grid grid-cols-1 gap-3">
                        {/* Type Filter */}
                        <div>
                            <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Type
                            </label>
                            <select
                                value={filters.type || "all"}
                                onChange={(e) => handleFilterChange("type", e.target.value)}
                                className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            >
                                <option value="all">All Types</option>
                                <option value="analyze">Analyze</option>
                                <option value="translate">Translate</option>
                            </select>
                        </div>

                        {/* Sentiment Filter */}
                        <div>
                            <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Sentiment
                            </label>
                            <select
                                value={filters.sentiment || "all"}
                                onChange={(e) => handleFilterChange("sentiment", e.target.value)}
                                className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            >
                                <option value="all">All Sentiments</option>
                                <option value="positive">Positive</option>
                                <option value="neutral">Neutral</option>
                                <option value="negative">Negative</option>
                            </select>
                        </div>
                    </div>
                </div>
            )}

            {/* Search Bar */}
            <div className="relative">
                <FontAwesomeIcon
                    icon={faSearch}
                    className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs sm:text-sm"
                />
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    className="w-full pl-7 sm:pl-10 pr-3 sm:pr-4 py-1.5 sm:py-2 text-xs sm:text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
            </div>

            {/* History List */}
            <div className="space-y-1.5 sm:space-y-2 max-h-64 sm:max-h-80 overflow-y-auto">
                {filteredHistory.length === 0 ? (
                    <div className="text-center py-6 sm:py-8 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                        {history.length === 0
                            ? "No history yet"
                            : "No results found"}
                    </div>
                ) : (
                    filteredHistory.map((item) => (
                        <div
                            key={item.id}
                            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md p-2 sm:p-3 hover:shadow-md transition-shadow cursor-pointer"
                            onClick={() => onSelectItem && onSelectItem(item)}
                        >
                            <div className="flex items-start justify-between gap-2">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-1.5 sm:gap-2 mb-1 flex-wrap">
                                        <span
                                            className={`px-1.5 sm:px-2 py-0.5 text-xs rounded-full bg-${getSentimentColor(
                                                item.sentiment
                                            )}-100 dark:bg-${getSentimentColor(
                                                item.sentiment
                                            )}-900/30 text-${getSentimentColor(
                                                item.sentiment
                                            )}-700 dark:text-${getSentimentColor(item.sentiment)}-300`}
                                        >
                                            {item.sentiment || "N/A"}
                                        </span>
                                        <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                            {item.language}
                                        </span>
                                        <span className="text-xs text-gray-400 dark:text-gray-500">
                                            {formatDate(item.timestamp)}
                                        </span>
                                    </div>
                                    <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                                        {item.text}
                                    </p>
                                </div>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDelete(item.id);
                                    }}
                                    className="flex-shrink-0 text-error-500 hover:text-error-600 transition-colors p-1"
                                    title="Delete"
                                >
                                    <FontAwesomeIcon icon={faTrash} className="text-xs sm:text-sm" />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Results Count */}
            <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 text-center pt-1">
                Showing {filteredHistory.length} of {history.length}
            </div>
        </div>
    );
};

export default AnalysisHistory;
