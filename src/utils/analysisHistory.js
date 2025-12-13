/**
 * Analysis History Management
 * Stores and retrieves analysis history from localStorage
 */

const HISTORY_KEY = 'nlp_analysis_history';
const MAX_HISTORY_ITEMS = 50;
const DUPLICATE_WINDOW_MS = 60000; // 60 seconds (1 minute) to detect duplicates

/**
 * Generate a unique ID based on content and timestamp
 * @param {string} text - Text content
 * @param {string} type - Analysis type
 * @returns {string} Unique ID
 */
const generateUniqueId = (text, type) => {
    const hash = simpleHash(text + type);
    return `${Date.now()}-${hash}`;
};

/**
 * Simple hash function for deduplication
 * @param {string} str - String to hash
 * @returns {number} Hash value
 */
const simpleHash = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
};

/**
 * Check if this analysis is a duplicate of a recent entry
 * Prevents saving the same text multiple times within the duplicate window
 * @param {Array} history - Existing history
 * @param {string} text - Text to check
 * @param {string} type - Analysis type
 * @returns {boolean} True if duplicate
 */
const isDuplicate = (history, text, type) => {
    if (!history || history.length === 0) return false;
    
    const now = Date.now();
    const normalizedText = text.trim().toLowerCase();
    
    // Check if same text exists in recent history
    return history.some(item => {
        // Must be same text and type
        const isSameText = item.text && item.text.trim().toLowerCase() === normalizedText;
        const isSameType = item.type === type;
        
        if (!isSameText || !isSameType) return false;
        
        // Check if within duplicate detection window
        try {
            const itemTime = new Date(item.timestamp).getTime();
            const timeDiff = now - itemTime;
            const isRecent = timeDiff < DUPLICATE_WINDOW_MS;
            
            if (isRecent) {
                console.log(`Duplicate detected: Same text analyzed ${Math.round(timeDiff / 1000)}s ago`);
            }
            
            return isRecent;
        } catch (error) {
            console.error('Error checking timestamp:', error);
            return false;
        }
    });
};

/**
 * Save analysis to history
 * @param {Object} analysis - Analysis result object
 */
export const saveToHistory = (analysis) => {
    try {
        const history = getHistory();
        const text = analysis.original_text || analysis.text;
        const type = analysis.type || 'analyze';

        // Check for duplicates to prevent redundant entries
        if (isDuplicate(history, text, type)) {
            console.log('Duplicate analysis detected, skipping save');
            return null;
        }

        const historyItem = {
            id: generateUniqueId(text, type),
            timestamp: new Date().toISOString(),
            text: text,
            type: type,
            result: analysis,
            sentiment: analysis.sentiment?.label,
            language: analysis.language?.name || analysis.language?.language_info?.language_name,
            toxicity: analysis.toxicity ? calculateMaxToxicity(analysis.toxicity) : null,
            profanity: analysis.profanity?.has_profanity || false,
        };

        // Add to beginning of array
        history.unshift(historyItem);

        // Keep only MAX_HISTORY_ITEMS
        const trimmedHistory = history.slice(0, MAX_HISTORY_ITEMS);

        localStorage.setItem(HISTORY_KEY, JSON.stringify(trimmedHistory));

        return historyItem;
    } catch (error) {
        console.error('Error saving to history:', error);
        return null;
    }
};

/**
 * Get all history items
 * @returns {Array} Array of history items
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
 * Get filtered history
 * @param {Object} filters - Filter criteria
 * @returns {Array} Filtered history items
 */
export const getFilteredHistory = (filters = {}) => {
    const history = getHistory();

    return history.filter(item => {
        // Filter by type (analyze/translate)
        if (filters.type && item.type !== filters.type) {
            return false;
        }

        // Filter by sentiment
        if (filters.sentiment && item.sentiment !== filters.sentiment) {
            return false;
        }

        // Filter by language
        if (filters.language && item.language !== filters.language) {
            return false;
        }

        // Filter by toxicity
        if (filters.toxicOnly && (!item.toxicity || item.toxicity < 0.7)) {
            return false;
        }

        // Filter by profanity
        if (filters.profaneOnly && !item.profanity) {
            return false;
        }

        // Filter by date range
        if (filters.startDate && new Date(item.timestamp) < new Date(filters.startDate)) {
            return false;
        }

        if (filters.endDate && new Date(item.timestamp) > new Date(filters.endDate)) {
            return false;
        }

        // Search in text
        if (filters.searchText) {
            const searchLower = filters.searchText.toLowerCase();
            return item.text.toLowerCase().includes(searchLower);
        }

        return true;
    });
};

/**
 * Delete history item by ID
 * @param {string|number} id - Item ID
 */
export const deleteHistoryItem = (id) => {
    try {
        const history = getHistory();
        const filtered = history.filter(item => item.id != id); // Use loose equality to handle both string and number IDs
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
 * Remove duplicate entries from history
 * Keeps the most recent entry for each unique text+type combination
 * @returns {number} Number of duplicates removed
 */
export const removeDuplicates = () => {
    try {
        const history = getHistory();
        const seen = new Map();
        const cleaned = [];
        
        // Iterate through history (newest first)
        history.forEach(item => {
            const key = `${item.text.trim().toLowerCase()}-${item.type}`;
            
            // Keep only the first occurrence (most recent due to order)
            if (!seen.has(key)) {
                seen.set(key, true);
                cleaned.push(item);
            }
        });
        
        const duplicatesRemoved = history.length - cleaned.length;
        
        if (duplicatesRemoved > 0) {
            localStorage.setItem(HISTORY_KEY, JSON.stringify(cleaned));
            console.log(`Removed ${duplicatesRemoved} duplicate entries from history`);
        }
        
        return duplicatesRemoved;
    } catch (error) {
        console.error('Error removing duplicates:', error);
        return 0;
    }
};

/**
 * Get history statistics
 * @returns {Object} Statistics object
 */
export const getHistoryStats = () => {
    const history = getHistory();

    const stats = {
        total: history.length,
        byType: {
            analyze: 0,
            translate: 0,
        },
        bySentiment: {
            positive: 0,
            neutral: 0,
            negative: 0,
        },
        byLanguage: {},
        toxic: 0,
        profane: 0,
        averageToxicity: 0,
    };

    let toxicitySum = 0;
    let toxicityCount = 0;

    history.forEach(item => {
        // Count by type
        stats.byType[item.type] = (stats.byType[item.type] || 0) + 1;

        // Count by sentiment
        if (item.sentiment) {
            const sentiment = item.sentiment.toLowerCase();
            stats.bySentiment[sentiment] = (stats.bySentiment[sentiment] || 0) + 1;
        }

        // Count by language
        if (item.language) {
            stats.byLanguage[item.language] = (stats.byLanguage[item.language] || 0) + 1;
        }

        // Count toxic
        if (item.toxicity && item.toxicity > 0.7) {
            stats.toxic++;
        }

        // Count profane
        if (item.profanity) {
            stats.profane++;
        }

        // Sum toxicity
        if (item.toxicity) {
            toxicitySum += item.toxicity;
            toxicityCount++;
        }
    });

    // Calculate average toxicity
    stats.averageToxicity = toxicityCount > 0 ? toxicitySum / toxicityCount : 0;

    return stats;
};

/**
 * Export history to JSON
 * @returns {string} JSON string
 */
export const exportHistoryJSON = () => {
    const history = getHistory();
    return JSON.stringify(history, null, 2);
};

/**
 * Export history to CSV
 * @returns {string} CSV string
 */
export const exportHistoryCSV = () => {
    const history = getHistory();

    const headers = ['ID', 'Timestamp', 'Type', 'Text', 'Language', 'Sentiment', 'Toxicity', 'Profanity'];
    const rows = history.map(item => [
        item.id,
        new Date(item.timestamp).toLocaleString(),
        item.type,
        `"${item.text.replace(/"/g, '""')}"`, // Escape quotes
        item.language || 'N/A',
        item.sentiment || 'N/A',
        item.toxicity ? (item.toxicity * 100).toFixed(2) + '%' : 'N/A',
        item.profanity ? 'Yes' : 'No',
    ]);

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    return csv;
};

/**
 * Calculate maximum toxicity score
 * @param {Object} toxicity - Toxicity object
 * @returns {number} Max toxicity score
 */
const calculateMaxToxicity = (toxicity) => {
    if (!toxicity) return 0;
    const scores = Object.values(toxicity).filter(v => typeof v === 'number');
    return scores.length > 0 ? Math.max(...scores) : 0;
};

export default {
    saveToHistory,
    getHistory,
    getFilteredHistory,
    deleteHistoryItem,
    clearHistory,
    removeDuplicates,
    getHistoryStats,
    exportHistoryJSON,
    exportHistoryCSV,
};
