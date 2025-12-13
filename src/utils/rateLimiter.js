/**
 * Rate Limiter Utility
 * Implements client-side rate limiting for API calls
 */

class RateLimiter {
    constructor(maxRequests, timeWindowMs) {
        this.maxRequests = maxRequests;
        this.timeWindowMs = timeWindowMs;
        this.requests = new Map(); // endpoint -> array of timestamps
    }

    /**
     * Check if a request is allowed for a specific endpoint
     * @param {string} endpoint - API endpoint identifier
     * @returns {Object} { allowed: boolean, retryAfter: number|null, remaining: number }
     */
    checkLimit(endpoint) {
        const now = Date.now();

        // Get or initialize request history for this endpoint
        if (!this.requests.has(endpoint)) {
            this.requests.set(endpoint, []);
        }

        const requestHistory = this.requests.get(endpoint);

        // Remove timestamps outside the time window
        const validRequests = requestHistory.filter(
            (timestamp) => now - timestamp < this.timeWindowMs
        );

        // Update the history
        this.requests.set(endpoint, validRequests);

        // Check if limit is exceeded
        if (validRequests.length >= this.maxRequests) {
            const oldestRequest = Math.min(...validRequests);
            const retryAfter = Math.ceil((oldestRequest + this.timeWindowMs - now) / 1000);

            return {
                allowed: false,
                retryAfter,
                remaining: 0,
                limit: this.maxRequests,
            };
        }

        return {
            allowed: true,
            retryAfter: null,
            remaining: this.maxRequests - validRequests.length,
            limit: this.maxRequests,
        };
    }

    /**
     * Record a request for a specific endpoint
     * @param {string} endpoint - API endpoint identifier
     */
    recordRequest(endpoint) {
        const now = Date.now();

        if (!this.requests.has(endpoint)) {
            this.requests.set(endpoint, []);
        }

        const requestHistory = this.requests.get(endpoint);
        requestHistory.push(now);

        // Keep only requests within the time window
        const validRequests = requestHistory.filter(
            (timestamp) => now - timestamp < this.timeWindowMs
        );

        this.requests.set(endpoint, validRequests);
    }

    /**
     * Reset rate limit for a specific endpoint
     * @param {string} endpoint - API endpoint identifier
     */
    reset(endpoint) {
        if (endpoint) {
            this.requests.delete(endpoint);
        } else {
            this.requests.clear();
        }
    }

    /**
     * Get current status for an endpoint
     * @param {string} endpoint - API endpoint identifier
     * @returns {Object} Current rate limit status
     */
    getStatus(endpoint) {
        const now = Date.now();

        if (!this.requests.has(endpoint)) {
            return {
                remaining: this.maxRequests,
                limit: this.maxRequests,
                resetAt: null,
            };
        }

        const requestHistory = this.requests.get(endpoint);
        const validRequests = requestHistory.filter(
            (timestamp) => now - timestamp < this.timeWindowMs
        );

        const remaining = Math.max(0, this.maxRequests - validRequests.length);
        const oldestRequest = validRequests.length > 0 ? Math.min(...validRequests) : null;
        const resetAt = oldestRequest ? new Date(oldestRequest + this.timeWindowMs) : null;

        return {
            remaining,
            limit: this.maxRequests,
            resetAt,
            used: validRequests.length,
        };
    }
}

// Create rate limiter instances for different endpoints
// Analyze endpoint: 30 requests per minute
export const analyzeRateLimiter = new RateLimiter(30, 60 * 1000);

// Translate endpoint: 20 requests per minute
export const translateRateLimiter = new RateLimiter(20, 60 * 1000);

// Extension background requests: 100 requests per minute (more lenient)
export const extensionRateLimiter = new RateLimiter(100, 60 * 1000);

/**
 * Get appropriate rate limiter for an endpoint
 * @param {string} endpoint - API endpoint path
 * @returns {RateLimiter} Rate limiter instance
 */
export const getRateLimiter = (endpoint) => {
    if (endpoint.includes('/analyze')) {
        return analyzeRateLimiter;
    } else if (endpoint.includes('/translate')) {
        return translateRateLimiter;
    } else {
        return extensionRateLimiter;
    }
};

export default RateLimiter;
