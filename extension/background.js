/* global chrome */
// Background Service Worker for Manifest V3

// Simple Rate Limiter for Extension
class ExtensionRateLimiter {
    constructor(maxRequests, timeWindowMs) {
        this.maxRequests = maxRequests;
        this.timeWindowMs = timeWindowMs;
        this.requests = new Map();
    }

    checkLimit(endpoint) {
        const now = Date.now();
        if (!this.requests.has(endpoint)) {
            this.requests.set(endpoint, []);
        }

        const requestHistory = this.requests.get(endpoint);
        const validRequests = requestHistory.filter(
            (timestamp) => now - timestamp < this.timeWindowMs
        );
        this.requests.set(endpoint, validRequests);

        if (validRequests.length >= this.maxRequests) {
            const oldestRequest = Math.min(...validRequests);
            const retryAfter = Math.ceil((oldestRequest + this.timeWindowMs - now) / 1000);
            return { allowed: false, retryAfter };
        }

        return { allowed: true, retryAfter: null };
    }

    recordRequest(endpoint) {
        const now = Date.now();
        if (!this.requests.has(endpoint)) {
            this.requests.set(endpoint, []);
        }
        const requestHistory = this.requests.get(endpoint);
        requestHistory.push(now);
        const validRequests = requestHistory.filter(
            (timestamp) => now - timestamp < this.timeWindowMs
        );
        this.requests.set(endpoint, validRequests);
    }
}

// Create rate limiter: 100 requests per minute for extension
const rateLimiter = new ExtensionRateLimiter(100, 60 * 1000);

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'analyzeText') {
        // Check rate limit
        const limitCheck = rateLimiter.checkLimit('analyze');
        if (!limitCheck.allowed) {
            sendResponse({
                success: false,
                error: `Rate limit exceeded. Please wait ${limitCheck.retryAfter} seconds.`
            });
            return false; // Synchronous response
        }

        // Handle async operation properly
        (async () => {
            try {
                const result = await analyzeText(request.text);
                rateLimiter.recordRequest('analyze');
                sendResponse({ success: true, data: result });
            } catch (error) {
                sendResponse({ success: false, error: error.message });
            }
        })();
        return true; // Will respond asynchronously
    } else if (request.action === 'translateText') {
        // Check rate limit
        const limitCheck = rateLimiter.checkLimit('translate');
        if (!limitCheck.allowed) {
            sendResponse({
                success: false,
                error: `Rate limit exceeded. Please wait ${limitCheck.retryAfter} seconds.`
            });
            return false; // Synchronous response
        }

        // Handle async operation properly
        (async () => {
            try {
                const result = await translateText(request.text, request.sourceLang, request.targetLang);
                rateLimiter.recordRequest('translate');
                sendResponse({ success: true, data: result });
            } catch (error) {
                sendResponse({ success: false, error: error.message });
            }
        })();
        return true; // Will respond asynchronously
    }
    return false; // No matching action
});

async function analyzeText(text) {
    try {
        // Add timeout to prevent hanging requests
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

        const response = await fetch('https://159-89-161-139.nip.io/analyze', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                text: text,
                compact_mode: true
            }),
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Update stats
        updateStats(data);

        return data;
    } catch (error) {
        if (error.name === 'AbortError') {
            throw new Error('Request timeout - server took too long to respond');
        }
        console.error('Analysis error:', error);
        throw error;
    }
}

async function translateText(text, sourceLang = 'auto', targetLang = 'en') {
    try {
        // Add timeout to prevent hanging requests
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

        const response = await fetch('https://159-89-161-139.nip.io/translate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                text: text,
                source_lang: sourceLang,
                target_lang: targetLang
            }),
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        if (error.name === 'AbortError') {
            throw new Error('Translation timeout - server took too long to respond');
        }
        console.error('Translation error:', error);
        throw error;
    }
}

async function updateStats(data) {
    try {
        // Use a lock pattern to prevent race conditions
        await new Promise((resolve) => {
            chrome.storage.local.get(['analyzedCount', 'toxicCount'], (result) => {
                let analyzedCount = result.analyzedCount || 0;
                let toxicCount = result.toxicCount || 0;

                analyzedCount++;

                if (data.toxicity) {
                    // Check if any toxicity score is high (> 0.7)
                    const isToxic = Object.values(data.toxicity).some(score => score > 0.7);
                    if (isToxic) {
                        toxicCount++;
                    }
                }

                chrome.storage.local.set({
                    analyzedCount: analyzedCount,
                    toxicCount: toxicCount
                }, resolve);
            });
        });
    } catch (error) {
        console.error('Failed to update stats:', error);
    }
}
