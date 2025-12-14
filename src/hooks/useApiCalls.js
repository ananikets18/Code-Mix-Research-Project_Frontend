import { useState, useRef, useCallback } from "react";
import axios from "axios";
import { sanitizeTextInput } from "../utils/sanitize";
import Analytics, { trackEvent } from "../utils/analytics";
import { ErrorTracking } from "../utils/errorTracking";
import { CacheStorage } from "../utils/storage";
import { analyzeRateLimiter, translateRateLimiter } from "../utils/rateLimiter";

// Environment configuration with fallback
const API_BASE_URL =
    process.env.REACT_APP_API_BASE_URL || "http://localhost:8000";

// Debounce helper
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Custom hook for text analysis API calls
 * Handles caching, error tracking, analytics, rate limiting, and performance optimization
 */
export const useAnalyzeText = () => {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState("");
    const [progress, setProgress] = useState(0);
    const cancelTokenSourceRef = useRef(null);
    const progressIntervalRef = useRef(null);

    // Simulate progress for better UX
    const startProgressSimulation = useCallback(() => {
        setProgress(0);
        let currentProgress = 0;

        progressIntervalRef.current = setInterval(() => {
            currentProgress += Math.random() * 15;
            if (currentProgress > 90) {
                currentProgress = 90; // Cap at 90% until real response
            }
            setProgress(currentProgress);
        }, 300);
    }, []);

    const stopProgressSimulation = useCallback(() => {
        if (progressIntervalRef.current) {
            clearInterval(progressIntervalRef.current);
            setProgress(100);
            setTimeout(() => setProgress(0), 500);
        }
    }, []);

    const analyzeText = useCallback(async (text, compactMode) => {
        const startTime = Date.now();

        // Cancel any pending requests
        if (cancelTokenSourceRef.current) {
            cancelTokenSourceRef.current.cancel("New request initiated");
        }

        // Create new cancel token
        cancelTokenSourceRef.current = axios.CancelToken.source();

        setLoading(true);
        setError("");
        setResult(null);
        startProgressSimulation();

        try {
            // Sanitize input before sending to API
            const sanitizedText = sanitizeTextInput(text);

            // Track analytics
            Analytics.analyzeText(sanitizedText.length, "auto", compactMode);
            ErrorTracking.userAction("analyze_text_submitted", {
                textLength: sanitizedText.length,
                compactMode,
            });

            // Check cache first
            const cacheKey = CacheStorage.generateKey("/analyze", {
                text: sanitizedText,
                compact_mode: compactMode,
            });
            const cachedResult = CacheStorage.get(cacheKey);

            if (cachedResult) {
                if (process.env.NODE_ENV === "development") {
                    console.log("✅ Using cached result for analyze");
                }
                setResult(cachedResult);
                trackEvent("cache_hit", { endpoint: "/analyze" });
                stopProgressSimulation();
                return cachedResult; // Return cached result
                setLoading(false);
                return;
            }

            // Check rate limit before making API call
            const rateLimitCheck = analyzeRateLimiter.checkLimit("/analyze");
            if (!rateLimitCheck.allowed) {
                const errorMsg = `Rate limit exceeded. Please wait ${rateLimitCheck.retryAfter} seconds before trying again. (${rateLimitCheck.remaining}/${rateLimitCheck.limit} requests remaining)`;
                setError(errorMsg);
                Analytics.validationError("rate_limit_exceeded");
                ErrorTracking.userAction("rate_limit_exceeded", {
                    endpoint: "/analyze",
                    retryAfter: rateLimitCheck.retryAfter,
                });
                stopProgressSimulation();
                setLoading(false);
                return;
            }

            if (process.env.NODE_ENV === "development") {
                console.log("🚀 Making API call to /analyze", {
                    url: `${API_BASE_URL}/analyze`,
                    textLength: sanitizedText.length,
                    compactMode,
                });
            }

            // Create a fresh axios request with cancel token and optimizations
            const response = await axios.post(
                `${API_BASE_URL}/analyze`,
                {
                    text: sanitizedText,
                    compact_mode: compactMode,
                },
                {
                    timeout: 45000, // Increased to 45 seconds for slow connections
                    headers: {
                        "Content-Type": "application/json",
                    },
                    cancelToken: cancelTokenSourceRef.current.token,
                    // Add retry logic
                    validateStatus: (status) => status >= 200 && status < 500,
                }
            );

            const responseTime = Date.now() - startTime;

            if (process.env.NODE_ENV === "development") {
                console.log(`⏱️ API Response time: ${responseTime}ms`);
            }

            // Track response time
            trackEvent("api_response_time", {
                endpoint: "/analyze",
                time: responseTime,
                textLength: sanitizedText.length,
            });

            if (response.status !== 200) {
                let errorMsg = response.data?.error || `Server returned status ${response.status}`;
                
                // Provide more helpful error messages for common status codes
                if (response.status === 502) {
                    errorMsg = 'Backend server is temporarily unavailable. Please try again in a moment.';
                } else if (response.status === 503) {
                    errorMsg = 'Service temporarily unavailable. The server may be overloaded.';
                } else if (response.status === 504) {
                    errorMsg = 'Gateway timeout. The request took too long to process.';
                }
                
                throw new Error(errorMsg);
            }

            // Cache the successful result
            CacheStorage.set(cacheKey, response.data);

            // Record successful request for rate limiting
            analyzeRateLimiter.recordRequest("/analyze");

            setResult(response.data);
            stopProgressSimulation();

            // Track success
            Analytics.analyzeSuccess(responseTime);
            ErrorTracking.userAction("analyze_text_success", {
                responseTime,
                textLength: sanitizedText.length,
            });

            // Show performance warning if slow
            if (responseTime > 5000) {
                console.warn(`⚠️ Slow API response: ${responseTime}ms`);
                trackEvent("slow_api_response", {
                    endpoint: "/analyze",
                    time: responseTime,
                });
            }
            
            return response.data; // Return the result for caller
        } catch (err) {
            stopProgressSimulation();

            if (axios.isCancel(err)) {
                if (process.env.NODE_ENV === "development") {
                    console.log("Request cancelled:", err.message);
                }
                return null; // Return null on cancellation
            }

            const errorMessage =
                err.response?.data?.error ||
                err.message ||
                "Failed to analyze text. Please try again.";

            setError(errorMessage);

            // Track error
            Analytics.analyzeError(errorMessage);
            
            // Use appropriate error tracking method based on error type
            if (err.response) {
                ErrorTracking.apiError('/analyze', err, err.response.status);
            } else if (err.message?.includes('timeout') || err.code === 'ECONNABORTED') {
                ErrorTracking.networkError(err);
            } else {
                ErrorTracking.logError(err, {
                    context: "analyze_text",
                    textLength: text.length,
                });
            }

            // Log detailed error in development
            if (process.env.NODE_ENV === "development") {
                console.error("❌ Analysis error:", {
                    message: errorMessage,
                    status: err.response?.status,
                    data: err.response?.data,
                });
            }
            
            return null; // Return null on error
        } finally {
            setLoading(false);
        }
    }, [startProgressSimulation, stopProgressSimulation]);

    const clearResults = useCallback(() => {
        setResult(null);
        setError("");
        setProgress(0);
    }, []);

    return { loading, result, error, progress, analyzeText, clearResults };
};

/**
 * Custom hook for translation API calls
 * Similar optimizations as analyze hook
 */
export const useTranslateText = () => {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState("");
    const [progress, setProgress] = useState(0);
    const cancelTokenSourceRef = useRef(null);
    const progressIntervalRef = useRef(null);

    const startProgressSimulation = useCallback(() => {
        setProgress(0);
        let currentProgress = 0;

        progressIntervalRef.current = setInterval(() => {
            currentProgress += Math.random() * 15;
            if (currentProgress > 90) {
                currentProgress = 90;
            }
            setProgress(currentProgress);
        }, 300);
    }, []);

    const stopProgressSimulation = useCallback(() => {
        if (progressIntervalRef.current) {
            clearInterval(progressIntervalRef.current);
            setProgress(100);
            setTimeout(() => setProgress(0), 500);
        }
    }, []);

    const translateText = useCallback(
        async (text, sourceLang, targetLang) => {
            const startTime = Date.now();

            if (cancelTokenSourceRef.current) {
                cancelTokenSourceRef.current.cancel("New request initiated");
            }

            cancelTokenSourceRef.current = axios.CancelToken.source();

            setLoading(true);
            setError("");
            setResult(null);
            startProgressSimulation();

            try {
                const sanitizedText = sanitizeTextInput(text);

                Analytics.translateText(
                    sanitizedText.length,
                    sourceLang,
                    targetLang
                );
                ErrorTracking.userAction("translate_text_submitted", {
                    textLength: sanitizedText.length,
                    sourceLang,
                    targetLang,
                });

                // Check cache
                const cacheKey = CacheStorage.generateKey("/translate", {
                    text: sanitizedText,
                    source_lang: sourceLang,
                    target_lang: targetLang,
                });
                const cachedResult = CacheStorage.get(cacheKey);

                if (cachedResult) {
                    if (process.env.NODE_ENV === "development") {
                        console.log("✅ Using cached result for translate");
                    }
                    setResult(cachedResult);
                    trackEvent("cache_hit", { endpoint: "/translate" });
                    stopProgressSimulation();
                    setLoading(false);
                    return cachedResult; // Return cached result
                }

                // Check rate limit
                const rateLimitCheck =
                    translateRateLimiter.checkLimit("/translate");
                if (!rateLimitCheck.allowed) {
                    const errorMsg = `Rate limit exceeded. Please wait ${rateLimitCheck.retryAfter} seconds. (${rateLimitCheck.remaining}/${rateLimitCheck.limit} requests remaining)`;
                    setError(errorMsg);
                    Analytics.validationError("rate_limit_exceeded");
                    ErrorTracking.userAction("rate_limit_exceeded", {
                        endpoint: "/translate",
                        retryAfter: rateLimitCheck.retryAfter,
                    });
                    stopProgressSimulation();
                    setLoading(false);
                    return null; // Return null on rate limit
                }

                if (process.env.NODE_ENV === "development") {
                    console.log("🚀 Making API call to /translate");
                }

                const response = await axios.post(
                    `${API_BASE_URL}/translate`,
                    {
                        text: sanitizedText,
                        source_lang: sourceLang,
                        target_lang: targetLang,
                    },
                    {
                        timeout: 45000,
                        headers: {
                            "Content-Type": "application/json",
                        },
                        cancelToken: cancelTokenSourceRef.current.token,
                        validateStatus: (status) =>
                            status >= 200 && status < 500,
                    }
                );

                const responseTime = Date.now() - startTime;

                if (process.env.NODE_ENV === "development") {
                    console.log(`⏱️ API Response time: ${responseTime}ms`);
                }

                trackEvent("api_response_time", {
                    endpoint: "/translate",
                    time: responseTime,
                });

                if (response.status !== 200) {
                    throw new Error(
                        response.data?.error ||
                        `Server returned status ${response.status}`
                    );
                }

                CacheStorage.set(cacheKey, response.data);
                translateRateLimiter.recordRequest("/translate");

                setResult(response.data);
                stopProgressSimulation();

                Analytics.translateSuccess(responseTime);
                ErrorTracking.userAction("translate_text_success", {
                    responseTime,
                });

                if (responseTime > 5000) {
                    console.warn(`⚠️ Slow API response: ${responseTime}ms`);
                    trackEvent("slow_api_response", {
                        endpoint: "/translate",
                        time: responseTime,
                    });
                }
                
                return response.data; // Return the result for caller
            } catch (err) {
                stopProgressSimulation();

                if (axios.isCancel(err)) {
                    if (process.env.NODE_ENV === "development") {
                        console.log("Request cancelled");
                    }
                    return null; // Return null on cancellation
                }

                const errorMessage =
                    err.response?.data?.error ||
                    err.message ||
                    "Failed to translate text. Please try again.";

                setError(errorMessage);
                Analytics.translateError(errorMessage);
                
                // Use appropriate error tracking method based on error type
                if (err.response) {\n                    ErrorTracking.apiError('/translate', err, err.response.status);\n                } else if (err.message?.includes('timeout') || err.code === 'ECONNABORTED') {\n                    ErrorTracking.networkError(err);\n                } else {\n                    ErrorTracking.logError(err, {\n                        context: \"translate_text\",\n                    });\n                }

                if (process.env.NODE_ENV === "development") {
                    console.error("❌ Translation error:", errorMessage);
                }
                
                return null; // Return null on error
            } finally {
                setLoading(false);
            }
        },
        [startProgressSimulation, stopProgressSimulation]
    );

    const clearResults = useCallback(() => {
        setResult(null);
        setError("");
        setProgress(0);
    }, []);

    return { loading, result, error, progress, translateText, clearResults };
};
