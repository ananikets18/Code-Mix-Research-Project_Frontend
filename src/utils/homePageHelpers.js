/**
 * Utility functions for HomePage
 */

/**
 * Calculate safety score from toxicity values
 * @param {number} value - Toxicity value (0-1)
 * @returns {number} Safe value (0-1)
 */
export const toSafeValue = (v) => {
    const n = Number(v);
    return Number.isFinite(n) && n >= 0 && n <= 1 ? n : 0;
};

/**
 * Calculate overall safety score from toxicity object
 * @param {Object} toxicity - Toxicity object with various categories
 * @returns {number} Safety score (0-100)
 */
export const calculateSafetyScore = (toxicity) => {
    if (!toxicity) return 100;

    const maxToxicity = Math.max(
        toSafeValue(toxicity.toxic),
        toSafeValue(toxicity.severe_toxic),
        toSafeValue(toxicity.obscene),
        toSafeValue(toxicity.threat),
        toSafeValue(toxicity.insult),
        toSafeValue(toxicity.identity_hate)
    );

    const safetyScore = (1 - maxToxicity) * 100;
    return Number.isFinite(safetyScore) ? safetyScore : 100;
};

/**
 * Get safety score color class based on score
 * @param {number} score - Safety score (0-100)
 * @returns {string} Tailwind CSS class
 */
export const getSafetyColorClass = (score) => {
    if (score >= 90) return "bg-success-500";
    if (score >= 70) return "bg-warning-500";
    return "bg-error-500";
};

/**
 * Get sentiment emoji based on label
 * @param {string} label - Sentiment label (positive, neutral, negative)
 * @returns {string} Emoji
 */
export const getSentimentEmoji = (label) => {
    const emojiMap = {
        positive: "😊",
        neutral: "😐",
        negative: "😔",
    };
    return emojiMap[label] || "😐";
};

/**
 * Get sentiment display text
 * @param {string} label - Sentiment label
 * @returns {string} Display text with emoji
 */
export const getSentimentDisplay = (label) => {
    const emoji = getSentimentEmoji(label);
    const text = label.charAt(0).toUpperCase() + label.slice(1);
    return `${emoji} ${text}`;
};

/**
 * Get maximum confidence from sentiment scores
 * @param {Object} scores - Sentiment scores object
 * @returns {number} Maximum confidence (0-100)
 */
export const getMaxSentimentConfidence = (scores) => {
    if (!scores) return 0;
    const maxScore = Math.max(...Object.values(scores));
    return (maxScore * 100).toFixed(1);
};
