/**
 * Analysis History Storage Utility
 * Manages localStorage for analysis history
 */

const HISTORY_KEY = 'analysisHistory';
const MAX_HISTORY_ITEMS = 50; // Keep last 50 analyses

/**
 * Save analysis to history
 * @param {string} text - Original text
 * @param {object} result - Analysis result
 * @param {string} type - 'analyze' or 'translate'
 */
export const saveToHistory = (text, result, type = 'analyze') => {
    try {
        const history = getHistory();

        const newItem = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            text: text.substring(0, 200), // Store first 200 chars
            result,
            type,
        };

        // Add to beginning of array
        history.unshift(newItem);

        // Keep only last MAX_HISTORY_ITEMS
        const trimmedHistory = history.slice(0, MAX_HISTORY_ITEMS);

        localStorage.setItem(HISTORY_KEY, JSON.stringify(trimmedHistory));

        return newItem;
    } catch (error) {
        console.error('Error saving to history:', error);
        return null;
    }
};

/**
 * Get all history items
 * @returns {Array} History items
 */
export const getHistory = () => {
    try {
        const history = localStorage.getItem(HISTORY_KEY);
        return history ? JSON.parse(history) : [];
    } catch (error) {
        console.error('Error getting history:', error);
        return [];
    }
};

/**
 * Get history item by ID
 * @param {number} id - Item ID
 * @returns {object|null} History item
 */
export const getHistoryItem = (id) => {
    try {
        const history = getHistory();
        return history.find((item) => item.id === id) || null;
    } catch (error) {
        console.error('Error getting history item:', error);
        return null;
    }
};

/**
 * Delete history item by ID
 * @param {number} id - Item ID
 */
export const deleteHistoryItem = (id) => {
    try {
        const history = getHistory();
        const filtered = history.filter((item) => item.id !== id);
        localStorage.setItem(HISTORY_KEY, JSON.stringify(filtered));
        return true;
    } catch (error) {
        console.error('Error deleting history item:', error);
        return false;
    }
};

/**
 * Clear all history
 */
export const clearHistory = () => {
    try {
        localStorage.removeItem(HISTORY_KEY);
        return true;
    } catch (error) {
        console.error('Error clearing history:', error);
        return false;
    }
};

/**
 * Get history statistics
 * @returns {object} Statistics
 */
export const getHistoryStats = () => {
    try {
        const history = getHistory();

        const stats = {
            total: history.length,
            byType: {
                analyze: history.filter((item) => item.type === 'analyze').length,
                translate: history.filter((item) => item.type === 'translate').length,
            },
            bySentiment: {
                positive: 0,
                neutral: 0,
                negative: 0,
            },
            byLanguage: {},
        };

        history.forEach((item) => {
            // Count sentiments
            const sentiment = item.result?.sentiment?.label?.toLowerCase();
            if (sentiment && stats.bySentiment[sentiment] !== undefined) {
                stats.bySentiment[sentiment]++;
            }

            // Count languages
            const lang = item.result?.language?.name || 'Unknown';
            stats.byLanguage[lang] = (stats.byLanguage[lang] || 0) + 1;
        });

        return stats;
    } catch (error) {
        console.error('Error getting history stats:', error);
        return null;
    }
};

/**
 * Search history
 * @param {string} query - Search query
 * @returns {Array} Matching items
 */
export const searchHistory = (query) => {
    try {
        const history = getHistory();
        const lowerQuery = query.toLowerCase();

        return history.filter((item) =>
            item.text.toLowerCase().includes(lowerQuery) ||
            item.result?.language?.name?.toLowerCase().includes(lowerQuery) ||
            item.result?.sentiment?.label?.toLowerCase().includes(lowerQuery)
        );
    } catch (error) {
        console.error('Error searching history:', error);
        return [];
    }
};

export default {
    saveToHistory,
    getHistory,
    getHistoryItem,
    deleteHistoryItem,
    clearHistory,
    getHistoryStats,
    searchHistory,
};
