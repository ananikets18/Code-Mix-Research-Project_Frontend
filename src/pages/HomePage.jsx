import React, { useState, lazy, Suspense, useEffect } from "react";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import TabNavigation from "../components/TabNavigation";
import TextInput from "../components/TextInput";
import TranslateOptions from "../components/TranslateOptions";
import SubmitButton from "../components/SubmitButton";
import ErrorDisplay from "../components/ErrorDisplay";
import NetworkStatus from "../components/NetworkStatus";
import LoadingOverlay from "../components/LoadingOverlay";
import InfoBanner from "../components/InfoBanner";
import GitHubFloatingModal from "../components/GitHubFloatingModal";
import { sanitizeTextInput } from "../utils/sanitize";
import Analytics, { trackEvent } from "../utils/analytics";
import { ErrorTracking } from "../utils/errorTracking";
import logger from "../utils/logger";
import {
  CompactModeStorage,
  LanguageStorage,
  CacheStorage,
} from "../utils/storage";

// Lazy load heavy components
const AnalyzeResults = lazy(() => import("../components/AnalyzeResults"));
const TranslateResults = lazy(() => import("../components/TranslateResults"));

// Environment configuration with fallback
const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:8000";

function HomePage() {
  // State management
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("analyze");
  const [compactMode, setCompactMode] = useState(false);
  const [targetLang, setTargetLang] = useState("hi");
  const [sourceLang, setSourceLang] = useState("auto");
  const [loadingMessage, setLoadingMessage] = useState("Processing...");

  // Ref to store cancel token for request cancellation
  const cancelTokenSourceRef = React.useRef(null);

  // Load preferences from storage on mount
  useEffect(() => {
    const savedCompactMode = CompactModeStorage.get();
    const savedLanguages = LanguageStorage.get();

    setCompactMode(savedCompactMode);
    setSourceLang(savedLanguages.source);
    setTargetLang(savedLanguages.target);

    // Clean expired cache on mount
    CacheStorage.cleanExpired();

    // Cleanup function to cancel any pending requests on unmount
    return () => {
      if (cancelTokenSourceRef.current) {
        cancelTokenSourceRef.current.cancel("Component unmounted");
      }
    };
  }, []);

  // Save preferences when they change
  useEffect(() => {
    CompactModeStorage.set(compactMode);
  }, [compactMode]);

  useEffect(() => {
    LanguageStorage.set(sourceLang, targetLang);
  }, [sourceLang, targetLang]);

  // Example texts for quick testing
  const exampleTexts = {
    english: [
      "Hello! How are you doing today? I hope you're having a wonderful day!",
      "The quick brown fox jumps over the lazy dog.",
      "Artificial Intelligence is transforming the way we live and work.",
      "Could you please help me understand this complex scientific theory?",
      "I am planning to travel to Japan next summer for a vacation.",
    ],
    hindi: [
      "नमस्ते! आप कैसे हैं? मुझे आशा है कि आपका दिन अच्छा जा रहा है!",
      "भारत एक विविधतापूर्ण देश है जहाँ कई भाषाएँ बोली जाती हैं।",
      "आज का मौसम बहुत सुहावना है, चलो कहीं घूमने चलते हैं।",
      "मुझे भारतीय खाना बहुत पसंद है, खासकर पनीर बटर मसाला।",
      "क्या आप मुझे निकटतम रेलवे स्टेशन का रास्ता बता सकते हैं?",
    ],
    profane: [
      "This is a test with some inappropriate language that should be detected.",
      "You are such a stupid idiot, I can't believe you did that.",
      "Shut the hell up and get out of my face right now.",
      "This garbage software is completely useless and broken.",
      "I hate you so much, you are the worst person ever.",
    ],
    mixed: [
      "You know, we have to go to college today because आज हमारी रिसर्च प्रेज़ेंटेशन है।",
      "Main aaj bahut busy hoon, so I cannot come to the party tonight.",
      "Please mujhe wo file send kar do, I need it for my project submission.",
      "Zindagi mein ups and downs toh aate rehte hain, just stay positive.",
      "Kya tum kal free ho? We can go for a movie together.",
    ],
  };

  // API Functions
  const analyzeText = async () => {
    const startTime = Date.now();

    // Cancel any pending requests
    if (cancelTokenSourceRef.current) {
      cancelTokenSourceRef.current.cancel("New request initiated");
    }

    // Create new cancel token
    cancelTokenSourceRef.current = axios.CancelToken.source();

    setLoading(true);
    setLoadingMessage("Analyzing text...");
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
          // Force axios to not reuse connections that might be stale
          transformRequest: [(data) => JSON.stringify(data)],
          validateStatus: function (status) {
            return status >= 200 && status < 500; // Resolve for any status less than 500
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

      // Check for minimum required fields
      if (
        !response.data.original_text &&
        process.env.NODE_ENV === "development"
      ) {
        logger.warn("Missing original_text in response");
      }

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
  };

  const translateText = async () => {
    const startTime = Date.now();

    // Cancel any pending requests
    if (cancelTokenSourceRef.current) {
      cancelTokenSourceRef.current.cancel("New request initiated");
    }

    // Create new cancel token
    cancelTokenSourceRef.current = axios.CancelToken.source();

    setLoading(true);
    setLoadingMessage("Translating text...");
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
          // Force axios to not reuse connections that might be stale
          transformRequest: [(data) => JSON.stringify(data)],
          validateStatus: function (status) {
            return status >= 200 && status < 500; // Resolve for any status less than 500
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
  };

  const handleSubmit = () => {
    // Clear previous errors and results to ensure clean state
    setError("");
    setResult(null);

    // Check internet connection
    if (!navigator.onLine) {
      setError(
        "No internet connection. Please check your network and try again"
      );
      Analytics.networkError();
      ErrorTracking.networkError(new Error("No internet connection"));
      return;
    }

    // Validation
    const trimmedText = text.trim();

    if (!trimmedText) {
      setError("Please enter some text to analyze or translate");
      Analytics.validationError("empty_text");
      return;
    }

    if (trimmedText.length < 2) {
      setError("Text is too short. Please enter at least 2 characters");
      Analytics.validationError("text_too_short");
      return;
    }

    if (trimmedText.length > 5000) {
      setError("Text is too long. Maximum 5000 characters allowed");
      Analytics.validationError("text_too_long");
      return;
    }

    // Proceed with submission
    if (activeTab === "analyze") {
      analyzeText();
    } else if (activeTab === "translate") {
      translateText();
    }
  };

  // Handle tab switch with analytics
  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
    // Clear results and errors when switching tabs to prevent stale state
    setResult(null);
    setError("");
    Analytics.switchTab(tab);
    ErrorTracking.userAction("tab_switch", { tab });
  };

  // Handle compact mode toggle with analytics
  const handleCompactModeToggle = (enabled) => {
    setCompactMode(enabled);
    Analytics.toggleCompactMode(enabled);
  };

  return (
    <div className="min-h-screen bg-gradient-light dark:bg-gradient-dark text-gray-900 dark:text-white transition-colors duration-300">
      {/* GitHub Floating Modal */}
      <GitHubFloatingModal />

      {/* Network Status Notification */}
      <NetworkStatus />

      {/* Loading Overlay */}
      <LoadingOverlay
        isLoading={loading}
        message={loadingMessage}
        subMessage={
          activeTab === "analyze"
            ? "Running language detection, sentiment analysis, and safety checks..."
            : "Translating your text to the selected language..."
        }
      />

      <Header />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
        <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
          {/* Top Section - Input Area */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Left: Input and Options - Takes 2 columns */}
            <div className="lg:col-span-2 space-y-4 sm:space-y-6">
              <div className="bg-white dark:bg-gray-800/90 border border-gray-200 dark:border-gray-700 shadow-lg rounded-xl p-3 sm:p-4">
                <TabNavigation
                  activeTab={activeTab}
                  setActiveTab={handleTabSwitch}
                />
              </div>

              <div className="bg-white dark:bg-gray-800/90 border border-gray-200 dark:border-gray-700 shadow-lg rounded-xl p-4 sm:p-6">
                <TextInput
                  text={text}
                  setText={setText}
                  exampleTexts={exampleTexts}
                />
              </div>

              {activeTab === "translate" && (
                <div className="bg-white dark:bg-gray-800/90 border border-gray-200 dark:border-gray-700 shadow-lg rounded-xl p-4 sm:p-6">
                  <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white/90">
                    ⚙️ Options
                  </h3>
                  <TranslateOptions
                    sourceLang={sourceLang}
                    setSourceLang={setSourceLang}
                    targetLang={targetLang}
                    setTargetLang={setTargetLang}
                  />
                </div>
              )}

              <div className="bg-white dark:bg-gray-800/90 border border-gray-200 dark:border-gray-700 shadow-lg rounded-xl p-3 sm:p-4">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
                  <div className="flex-1">
                    <SubmitButton
                      loading={loading}
                      activeTab={activeTab}
                      text={text}
                      handleSubmit={handleSubmit}
                    />
                  </div>

                  {activeTab === "analyze" && (
                    <div className="flex items-center justify-center gap-2 px-3 py-2 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700">
                      <label className="flex items-center gap-2 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={compactMode}
                          onChange={(e) =>
                            handleCompactModeToggle(e.target.checked)
                          }
                          className="rounded border-gray-300 dark:border-gray-600 text-primary-600 dark:text-primary-500 focus:ring-primary-500 bg-gray-50 dark:bg-gray-900/50"
                          aria-label="Toggle compact mode"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors whitespace-nowrap">
                          ⚙️ Compact
                        </span>
                      </label>
                    </div>
                  )}
                </div>
              </div>

              <ErrorDisplay error={error} />
            </div>

            {/* Right: Quick Preview - Takes 1 column */}
            <div className="space-y-4 sm:space-y-6">
              <div className="bg-white dark:bg-gray-800/90 border border-gray-200 dark:border-gray-700 shadow-lg rounded-xl p-4 sm:p-6 lg:sticky lg:top-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200 flex items-center gap-2">
                  <span className="text-xl">📊</span>
                  Quick Preview
                </h3>

                {!result && !loading && (
                  <div className="text-center py-8 text-gray-400 dark:text-gray-500">
                    <svg
                      className="mx-auto h-12 w-12 mb-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <p className="text-sm">Results will appear here</p>
                  </div>
                )}

                {loading && (
                  <div className="text-center py-8">
                    <div
                      className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"
                      role="status"
                      aria-label="Loading"
                    ></div>
                    <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                      Analyzing...
                    </p>
                  </div>
                )}

                {result && !loading && (
                  <div className="space-y-4">
                    {result.language && (
                      <div className="text-sm flex items-center justify-between">
                        <div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                            Language
                          </div>
                          <div className="font-semibold text-gray-800 dark:text-gray-200">
                            {result.language.language_info?.language_name ||
                              result.language.name ||
                              "Unknown"}
                            <span className="text-xs ml-2 text-gray-500">
                              ({(result.language.confidence * 100).toFixed(1)}%)
                            </span>
                          </div>
                        </div>
                        {/* Code-Mixed & Romanized Indicators */}
                        <div className="flex flex-wrap">
                          {(result.language.composition?.is_code_mixed ||
                            result.language.is_code_mixed) && (
                              <span className="text-xs px-2 py-1 rounded-full bg-secondary-100 dark:bg-secondary-900/40 text-secondary-700 dark:text-secondary-300 border border-secondary-300 dark:border-secondary-700">
                                🔄 Code-Mixed
                              </span>
                            )}
                          {(result.language.language_info?.is_romanized ||
                            result.language.is_romanized) && (
                              <span className="text-xs px-2 py-1 rounded-full bg-warning-100 dark:bg-warning-900/40 text-warning-700 dark:text-warning-300 border border-warning-300 dark:border-warning-700">
                                🔤 Romanized
                              </span>
                            )}
                        </div>
                      </div>
                    )}

                    {result.sentiment && (
                      <div className="text-sm">
                        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                          Sentiment
                        </div>
                        <div className="font-semibold text-gray-800 dark:text-gray-200 capitalize">
                          {result.sentiment.label === "positive" &&
                            "😊 Positive"}
                          {result.sentiment.label === "neutral" && "😐 Neutral"}
                          {result.sentiment.label === "negative" &&
                            "😔 Negative"}
                        </div>
                        {result.sentiment.scores && (
                          <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                            {(
                              Math.max(
                                ...Object.values(result.sentiment.scores)
                              ) * 100
                            ).toFixed(1)}
                            % confidence
                          </div>
                        )}
                      </div>
                    )}

                    {result.toxicity && (
                      <div className="text-sm">
                        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                          Safety Score
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            {(() => {
                              // Calculate safety score from toxicity values
                              const toSafe = (v) => {
                                const n = Number(v);
                                return Number.isFinite(n) && n >= 0 && n <= 1
                                  ? n
                                  : 0;
                              };

                              const maxToxicity = Math.max(
                                toSafe(result.toxicity.toxic),
                                toSafe(result.toxicity.severe_toxic),
                                toSafe(result.toxicity.obscene),
                                toSafe(result.toxicity.threat),
                                toSafe(result.toxicity.insult),
                                toSafe(result.toxicity.identity_hate)
                              );

                              const safetyScore = (1 - maxToxicity) * 100;
                              const safetyScoreSafe = Number.isFinite(
                                safetyScore
                              )
                                ? safetyScore
                                : 100;

                              return (
                                <>
                                  <div
                                    className={`h-2 rounded-full ${safetyScoreSafe >= 90
                                      ? "bg-success-500"
                                      : safetyScoreSafe >= 70
                                        ? "bg-warning-500"
                                        : "bg-error-500"
                                      }`}
                                    style={{ width: `${safetyScoreSafe}%` }}
                                  ></div>
                                </>
                              );
                            })()}
                          </div>
                          <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                            {(() => {
                              const toSafe = (v) => {
                                const n = Number(v);
                                return Number.isFinite(n) && n >= 0 && n <= 1
                                  ? n
                                  : 0;
                              };

                              const maxToxicity = Math.max(
                                toSafe(result.toxicity.toxic),
                                toSafe(result.toxicity.severe_toxic),
                                toSafe(result.toxicity.obscene),
                                toSafe(result.toxicity.threat),
                                toSafe(result.toxicity.insult),
                                toSafe(result.toxicity.identity_hate)
                              );

                              const safetyScore = (1 - maxToxicity) * 100;
                              return Number.isFinite(safetyScore)
                                ? safetyScore.toFixed(0)
                                : "100";
                            })()}
                            %
                          </span>
                        </div>
                      </div>
                    )}

                    {result.translations && (
                      <div className="text-sm">
                        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                          Translation
                        </div>
                        <div className="flex items-center gap-2">
                          {result.translations.english ? (
                            <>
                              <span className="text-lg">🇬🇧</span>
                              <span className="font-semibold text-primary-600 dark:text-primary-400">
                                Available
                              </span>
                            </>
                          ) : (
                            <>
                              <span className="text-lg">ℹ️</span>
                              <span className="font-semibold text-gray-600 dark:text-gray-400">
                                Not Available
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    )}

                    {result.profanity && (
                      <div className="text-sm">
                        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                          Profanity Check
                        </div>
                        <div className="flex items-center gap-2">
                          {result.profanity.has_profanity ? (
                            <>
                              <span className="text-lg">⚠️</span>
                              <span className="font-semibold text-error-600 dark:text-error-400">
                                Detected ({result.profanity.word_count || 0}{" "}
                                {result.profanity.word_count === 1
                                  ? "word"
                                  : "words"}
                                )
                              </span>
                            </>
                          ) : (
                            <>
                              <span className="text-lg">✅</span>
                              <span className="font-semibold text-success-600 dark:text-success-400">
                                Clean Content
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                      <button
                        onClick={() =>
                          document
                            .getElementById("results-section")
                            ?.scrollIntoView({ behavior: "smooth" })
                        }
                        className="w-full text-sm font-medium px-4 py-2.5 bg-primary-100 dark:bg-primary-900/30 hover:bg-primary-200 dark:hover:bg-primary-900/50 text-primary-700 dark:text-primary-300 rounded-lg transition-colors flex items-center justify-center gap-2"
                      >
                        View Full Results
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Section - Full Results (Full Width) */}
          {result && (
            <div
              id="results-section"
              className="scroll-mt-4 sm:scroll-mt-5 md:scroll-mt-6"
            >
              <div
                className="bg-white dark:bg-gray-800/90 
                  border border-gray-200 dark:border-gray-700 
                  shadow-md sm:shadow-lg md:shadow-xl 
                  rounded-lg sm:rounded-xl md:rounded-2xl
                  p-3 sm:p-4 md:p-6 lg:p-7 xl:p-8"
              >
                <h2
                  className="font-bold 
                   text-gray-800 dark:text-gray-200 
                   flex items-center 
                   gap-2 sm:gap-2.5 md:gap-3 lg:gap-3
                   mb-4 sm:mb-5 md:mb-6 lg:mb-7
                   text-lg sm:text-xl md:text-2xl lg:text-2xl xl:text-3xl"
                >
                  <span
                    className="text-2xl sm:text-2xl md:text-3xl lg:text-3xl xl:text-4xl 
                       flex-shrink-0"
                    aria-hidden="true"
                  >
                    📋
                  </span>
                  <span className="leading-tight sm:leading-snug">
                    Detailed Analysis Results
                  </span>
                </h2>

                <Suspense
                  fallback={
                    <div
                      className="flex justify-center items-center 
                      py-8 sm:py-10 md:py-12 lg:py-14"
                    >
                      <div
                        className="animate-spin rounded-full 
                        border-b-2 
                        border-primary-600 dark:border-primary-400
                        w-8 h-8 
                        sm:w-10 sm:h-10 
                        md:w-12 md:h-12 
                        lg:w-14 lg:h-14"
                        role="status"
                        aria-label="Loading results"
                      ></div>
                    </div>
                  }
                >
                  {activeTab === "analyze" && (
                    <AnalyzeResults result={result} compactMode={compactMode} />
                  )}
                  {activeTab === "translate" && (
                    <TranslateResults result={result} />
                  )}
                </Suspense>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
      {/* Info Banner */}
      <InfoBanner />
    </div>
  );
}

export default HomePage;
