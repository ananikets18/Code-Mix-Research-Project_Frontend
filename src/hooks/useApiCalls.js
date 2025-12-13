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

/**
 * Custom hook for text analysis API calls
 * Handles caching, error tracking, analytics, and rate limiting
 */
export const useAnalyzeText = () => {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState("");
    const cancelTokenSourceRef = useRef(null);

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
                    console.log("Using cached result for analyze");
                }
                setResult(cachedResult);
                trackEvent("cache_hit", { endpoint: "/analyze" });
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
                setLoading(false);
                return;
            }

            if (process.env.NODE_ENV === "development") {
                console.log("Making fresh API call to /analyze", {
                    url: `${API_BASE_URL}/analyze`,
                    textLength: sanitizedText.length,
                    compactMode,
                });
            }

            // Create a fresh axios request with cancel token
            const response = await axios.post(
                `${API_BASE_URL}/analyze`,
                {
                    text: sanitizedText,
                    compact_mode: compactMode,
                },
                {
                    timeout: 30000, // 30 second timeout
                    headers: {
                        "Content-Type": "application/json",
                    },
                    cancelToken: cancelTokenSourceRef.current.token,
                    transformRequest: [(data) => JSON.stringify(data)],
                    validateStatus: function (status) {
                        return status >= 200 && status < 500;
                    },
                }
            );

            // Check if we got an error status but axios didn't reject
            if (response.status >= 400) {
                throw new Error(
                    response.data?.detail || `HTTP ${response.status} error`
                );
            }

            // Validate response structure
            if (!response.data) {
                throw new Error("Invalid response from server");
            }

            // Cache the result
            CacheStorage.set(cacheKey, response.data);

            // Record the request for rate limiting
            analyzeRateLimiter.recordRequest("/analyze");

            setResult(response.data);

            // Track success
            const duration = Date.now() - startTime;
            Analytics.analyzeSuccess(
                duration,
                response.data.language?.code || "unknown",
                response.data.sentiment?.label || "unknown"
            );
            Analytics.apiResponseTime("/analyze", duration);
        } catch (err) {
            let errorMessage = "An error occurred during analysis";
            let errorType = "UNKNOWN_ERROR";

            // Check if request was cancelled
            if (axios.isCancel(err)) {
                if (process.env.NODE_ENV === "development") {
                    console.log("Request cancelled:", err.message);
                }
                return; // Don't show error for cancelled requests
            }

            // Log the full error for debugging
            console.error("Analysis error:", err);
            if (process.env.NODE_ENV === "development") {
                console.error("Error details:", {
                    code: err.code,
                    message: err.message,
                    response: err.response,
                    request: err.request,
                });
            }

            if (err.code === "ECONNABORTED") {
                errorMessage = "Request timeout. Please try again";
                errorType = "TIMEOUT";
            } else if (err.response?.status === 422) {
                errorMessage = "Invalid input. Please check your text and try again";
                errorType = "HTTP_422";
            } else if (err.response?.status === 500) {
                errorMessage = "Server error. Please try again later";
                errorType = "HTTP_500";
            } else if (!err.response) {
                errorMessage =
                    "Network error. Please check your connection and ensure the API server is running";
                errorType = "NETWORK_ERROR";
                if (process.env.NODE_ENV === "development") {
                    console.error(
                        "Network error details - no response received. API URL:",
                        API_BASE_URL
                    );
                }
            } else {
                errorMessage =
                    err.response?.data?.detail || err.message || errorMessage;
                errorType = `HTTP_${err.response?.status || "UNKNOWN"}`;
            }

            setError(errorMessage);

            // Track error
            Analytics.analyzeError(errorType, errorMessage);
            ErrorTracking.apiError("/analyze", err, err.response?.status);
        } finally {
            setLoading(false);
            cancelTokenSourceRef.current = null;
        }
    }, []);

    const clearResults = useCallback(() => {
        setResult(null);
        setError("");
    }, []);

    return {
        loading,
        result,
        error,
        analyzeText,
        clearResults,
    };
};

/**
 * Custom hook for text translation API calls
 * Handles caching, error tracking, analytics, and rate limiting
 */
export const useTranslateText = () => {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState("");
    const cancelTokenSourceRef = useRef(null);

    const translateText = useCallback(async (text, sourceLang, targetLang) => {
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

        try {
            // Sanitize input before sending to API
            const sanitizedText = sanitizeTextInput(text);

            // Track analytics
            Analytics.translateText(sanitizedText.length, sourceLang, targetLang);
            ErrorTracking.userAction("translate_text_submitted", {
                textLength: sanitizedText.length,
                sourceLang,
                targetLang,
            });

            // Check cache first
            const cacheKey = CacheStorage.generateKey("/translate", {
                text: sanitizedText,
                source_lang: sourceLang,
                target_lang: targetLang,
            });
            const cachedResult = CacheStorage.get(cacheKey);

            if (cachedResult) {
                if (process.env.NODE_ENV === "development") {
                    console.log("Using cached result for translate");
                }
                setResult(cachedResult);
                trackEvent("cache_hit", { endpoint: "/translate" });
                setLoading(false);
                return;
            }

            // Check rate limit before making API call
            const rateLimitCheck = translateRateLimiter.checkLimit("/translate");
            if (!rateLimitCheck.allowed) {
                const errorMsg = `Rate limit exceeded. Please wait ${rateLimitCheck.retryAfter} seconds before trying again. (${rateLimitCheck.remaining}/${rateLimitCheck.limit} requests remaining)`;
                setError(errorMsg);
                Analytics.validationError("rate_limit_exceeded");
                ErrorTracking.userAction("rate_limit_exceeded", {
                    endpoint: "/translate",
                    retryAfter: rateLimitCheck.retryAfter,
                });
                setLoading(false);
                return;
            }

            if (process.env.NODE_ENV === "development") {
                console.log("Making fresh API call to /translate", {
                    url: `${API_BASE_URL}/translate`,
                    textLength: sanitizedText.length,
                    sourceLang,
                    targetLang,
                });
            }

            // Create a fresh axios request with cancel token
            const response = await axios.post(
                `${API_BASE_URL}/translate`,
                {
                    text: sanitizedText,
                    source_lang: sourceLang,
                    target_lang: targetLang,
                },
                {
                    timeout: 30000, // 30 second timeout
                    headers: {
                        "Content-Type": "application/json",
                    },
                    cancelToken: cancelTokenSourceRef.current.token,
                    transformRequest: [(data) => JSON.stringify(data)],
                    validateStatus: function (status) {
                        return status >= 200 && status < 500;
                    },
                }
            );

            // Check if we got an error status but axios didn't reject
            if (response.status >= 400) {
                throw new Error(
                    response.data?.detail || `HTTP ${response.status} error`
                );
            }

            // Validate response
            if (!response.data) {
                throw new Error("Invalid response from server");
            }

            if (!response.data.translated_text && !response.data.translation) {
                throw new Error("No translation received from server");
            }

            // Cache the result
            CacheStorage.set(cacheKey, response.data);

            // Record the request for rate limiting
            translateRateLimiter.recordRequest("/translate");

            setResult(response.data);

            // Track success
            const duration = Date.now() - startTime;
            Analytics.translateSuccess(duration, sourceLang, targetLang);
            Analytics.apiResponseTime("/translate", duration);
        } catch (err) {
            let errorMessage = "An error occurred during translation";
            let errorType = "UNKNOWN_ERROR";

            // Check if request was cancelled
            if (axios.isCancel(err)) {
                if (process.env.NODE_ENV === "development") {
                    console.log("Request cancelled:", err.message);
                }
                return; // Don't show error for cancelled requests
            }

            // Log the full error for debugging
            console.error("Translation error:", err);
            if (process.env.NODE_ENV === "development") {
                console.error("Error details:", {
                    code: err.code,
                    message: err.message,
                    response: err.response,
                    request: err.request,
                });
            }

            if (err.code === "ECONNABORTED") {
                errorMessage = "Request timeout. Please try again";
                errorType = "TIMEOUT";
            } else if (err.response?.status === 422) {
                errorMessage = "Invalid translation request. Please check your input";
                errorType = "HTTP_422";
            } else if (err.response?.status === 500) {
                errorMessage = "Server error. Please try again later";
                errorType = "HTTP_500";
            } else if (!err.response) {
                errorMessage =
                    "Network error. Please check your connection and ensure the API server is running";
                errorType = "NETWORK_ERROR";
                if (process.env.NODE_ENV === "development") {
                    console.error(
                        "Network error details - no response received. API URL:",
                        API_BASE_URL
                    );
                }
            } else {
                errorMessage =
                    err.response?.data?.detail || err.message || errorMessage;
                errorType = `HTTP_${err.response?.status || "UNKNOWN"}`;
            }

            setError(errorMessage);

            // Track error
            Analytics.translateError(errorType, errorMessage);
            ErrorTracking.apiError("/translate", err, err.response?.status);
        } finally {
            setLoading(false);
            cancelTokenSourceRef.current = null;
        }
    }, []);

    const clearResults = useCallback(() => {
        setResult(null);
        setError("");
    }, []);

    return {
        loading,
        result,
        error,
        translateText,
        clearResults,
    };
};
