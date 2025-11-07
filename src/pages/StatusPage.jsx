import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import InfoBanner from "../components/InfoBanner";
import GitHubFloatingModal from "../components/GitHubFloatingModal";
/**
 * StatusPage - Dedicated page showing backend status, model info, and Redis status
 */
const StatusPage = () => {
  const [statusData, setStatusData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const API_BASE_URL =
    process.env.REACT_APP_API_BASE_URL || "http://localhost:8000";

  const fetchStatus = useCallback(async () => {
    try {
      setError(null);
      const response = await axios.get(`${API_BASE_URL}/status`, {
        timeout: 10000,
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.data) {
        setStatusData(response.data);
        setLastUpdated(new Date());
      }
    } catch (err) {
      console.error("Failed to fetch backend status:", err);
      setError(err.message || "Failed to connect to backend");
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL]);

  useEffect(() => {
    fetchStatus();

    // Auto-refresh every 10 seconds
    const interval = setInterval(fetchStatus, 10000);

    return () => clearInterval(interval);
  }, [fetchStatus]);

  const getModelDetails = () => {
    if (!statusData?.ml_models?.models) return [];

    const models = statusData.ml_models.models;
    return Object.entries(models).map(([key, value]) => {
      const isLoaded = value?.status === "loaded" || value === "loaded";

      return {
        id: key,
        name:
          value?.name ||
          key
            .replace(/_/g, " ")
            .split(" ")
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(" "),
        status: isLoaded ? "loaded" : "not_loaded",
        purpose: value?.purpose || "N/A",
        size: value?.size || "Unknown",
        details: value,
      };
    });
  };

  const getRedisInfo = () => {
    if (!statusData?.redis) {
      return {
        online: false,
        provider: "Unknown",
        message: "Redis information not available",
      };
    }

    const redis = statusData.redis;
    return {
      online: redis.active === true || redis.status === "healthy",
      provider: redis.provider || "Unknown",
      message: redis.message || "No message",
      status: redis.status || "unknown",
    };
  };

  if (loading && !statusData) {
    return (
      <div className="min-h-screen bg-gradient-light dark:bg-gradient-dark flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-primary-500 border-t-transparent mb-4"></div>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Loading backend status...
          </p>
        </div>
      </div>
    );
  }

  const modelDetails = getModelDetails();
  const redisInfo = getRedisInfo();
  const mlModels = statusData?.ml_models || {};

  return (
    <div className="min-h-screen bg-gradient-light dark:bg-gradient-dark text-gray-900 dark:text-white transition-colors duration-300">
      
      {/* GitHub Floating Modal */}
      <GitHubFloatingModal />
      
      <Header />

      <main className="container mx-auto px-4 mt-3 sm:px-3 md:px-5 lg:px-6 py-3 sm:py-4 md:py-6">
        <div className="max-w-7xl mx-auto space-y-3 sm:space-y-4 md:space-y-5">
          {/* Error Alert */}
          {error && (
            <div className="bg-error-100 dark:bg-error-900/30 border border-error-300 dark:border-error-700 rounded-lg p-2.5 sm:p-3 md:p-4">
              <div className="flex items-start gap-1.5 sm:gap-2">
                <span className="text-lg sm:text-xl">❌</span>
                <div className="flex-1">
                  <h3 className="font-semibold text-xs sm:text-sm text-error-800 dark:text-error-300">
                    Connection Error
                  </h3>
                  <p className="text-[11px] sm:text-xs text-error-700 dark:text-error-400 mt-0.5 sm:mt-1">
                    {error}
                  </p>
                  <button
                    onClick={fetchStatus}
                    className="mt-1.5 sm:mt-2 px-2.5 sm:px-3 py-1 sm:py-1.5 bg-error-600 hover:bg-error-700 text-white rounded-lg text-[11px] sm:text-xs transition-colors"
                  >
                    Retry Connection
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Last Updated */}
          {lastUpdated && (
            <div className="text-right text-[11px] sm:text-xs text-gray-500 dark:text-gray-400">
              Last updated: {lastUpdated.toLocaleTimeString()}
              <button
                onClick={fetchStatus}
                className="ml-1.5 sm:ml-2 text-primary-600 dark:text-primary-400 hover:underline"
              >
                🔄 Refresh
              </button>
            </div>
          )}

          {/* ML Models Overview */}
          <div className="bg-white dark:bg-gray-800/90 border border-gray-200 dark:border-gray-700 shadow-lg rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5">
            <div className="flex items-center justify-between mb-3 sm:mb-4 md:mb-5">
              <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-800 dark:text-gray-200 flex items-center gap-1.5 sm:gap-2">
                <span className="text-xl sm:text-2xl">🧠</span>
                <span className="hidden sm:inline">
                  Machine Learning Models
                </span>
                <span className="sm:hidden">ML Models</span>
              </h2>
              <div className="text-right">
                <div className="text-xl sm:text-2xl font-bold text-primary-600 dark:text-primary-400">
                  {mlModels.loaded_models || 0}/{mlModels.total_models || 0}
                </div>
                <div className="text-[9px] sm:text-[10px] text-gray-500 dark:text-gray-400">
                  Models Loaded
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-3 sm:mb-4 md:mb-5">
              <div className="flex items-center justify-between mb-1 sm:mb-1.5">
                <span className="text-[11px] sm:text-xs font-medium text-gray-700 dark:text-gray-300">
                  Overall Readiness
                </span>
                <span className="text-[11px] sm:text-xs font-semibold text-gray-800 dark:text-gray-200">
                  {mlModels.readiness_percentage?.toFixed(0) || 0}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 sm:h-2.5">
                <div
                  className={`h-2 sm:h-2.5 rounded-full transition-all duration-500 ${
                    (mlModels.readiness_percentage || 0) === 100
                      ? "bg-success-500"
                      : (mlModels.readiness_percentage || 0) >= 50
                      ? "bg-warning-500"
                      : "bg-error-500"
                  }`}
                  style={{ width: `${mlModels.readiness_percentage || 0}%` }}
                ></div>
              </div>
            </div>

            {/* Model Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 sm:gap-3">
              {modelDetails.map((model) => (
                <div
                  key={model.id}
                  className={`border rounded-lg p-2.5 sm:p-3 transition-all ${
                    model.status === "loaded"
                      ? "bg-success-50 dark:bg-success-900/20 border-success-300 dark:border-success-700"
                      : "bg-gray-50 dark:bg-gray-900/50 border-gray-300 dark:border-gray-700"
                  }`}
                >
                  <div className="flex items-start justify-between mb-1.5 sm:mb-2">
                    <h3 className="font-semibold text-xs sm:text-sm text-gray-800 dark:text-gray-200 flex items-center gap-1 sm:gap-1.5">
                      {model.status === "loaded" ? "✅" : "⏳"}
                      {model.name}
                    </h3>
                    <span
                      className={`text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded-full font-medium ${
                        model.status === "loaded"
                          ? "bg-success-200 dark:bg-success-800 text-success-800 dark:text-success-200"
                          : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {model.status === "loaded" ? "Loaded" : "Not Loaded"}
                    </span>
                  </div>
                  <p className="text-[11px] sm:text-xs text-gray-600 dark:text-gray-400 mb-1 sm:mb-1.5">
                    <strong>Purpose:</strong> {model.purpose}
                  </p>
                  {model.size && model.size !== "Unknown" && (
                    <p className="text-[9px] sm:text-[10px] text-gray-500 dark:text-gray-500">
                      <strong>Size:</strong> {model.size}
                    </p>
                  )}

                  {/* Additional details for sentiment model */}
                  {model.details?.models && (
                    <div className="mt-1 sm:mt-1.5 pt-1 sm:pt-1.5 border-t border-gray-200 dark:border-gray-700">
                      <p className="text-[9px] sm:text-[10px] text-gray-600 dark:text-gray-400 mb-0.5 sm:mb-1">
                        Sub-models:
                      </p>
                      {Object.entries(model.details.models).map(
                        ([key, val]) => (
                          <span
                            key={key}
                            className="inline-block text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded mr-0.5 mb-0.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                          >
                            {key}: {val}
                          </span>
                        )
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Redis Status */}
          <div className="bg-white dark:bg-gray-800/90 border border-gray-200 dark:border-gray-700 shadow-lg rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5">
            <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-800 dark:text-gray-200 flex items-center gap-1.5 sm:gap-2 mb-3 sm:mb-4 md:mb-5">
              <span className="text-xl sm:text-2xl">⚡</span>
              Redis Cache Status
            </h2>

            <div
              className={`border rounded-lg p-3 sm:p-4 md:p-5 ${
                redisInfo.online
                  ? "bg-success-50 dark:bg-success-900/20 border-success-300 dark:border-success-700"
                  : "bg-error-50 dark:bg-error-900/20 border-error-300 dark:border-error-700"
              }`}
            >
              <div className="flex items-center justify-between mb-2.5 sm:mb-3">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="text-2xl sm:text-3xl">
                    {redisInfo.online ? "🟢" : "🔴"}
                  </span>
                  <div>
                    <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-800 dark:text-gray-200">
                      {redisInfo.online ? "Online" : "Offline"}
                    </h3>
                    <p className="text-[11px] sm:text-xs text-gray-600 dark:text-gray-400">
                      Status: {redisInfo.status}
                    </p>
                  </div>
                </div>
                <div
                  className={`px-2 sm:px-2.5 md:px-3 py-1 sm:py-1.5 rounded-lg text-[11px] sm:text-xs font-semibold ${
                    redisInfo.online
                      ? "bg-success-200 dark:bg-success-800 text-success-800 dark:text-success-200"
                      : "bg-error-200 dark:bg-error-800 text-error-800 dark:text-error-200"
                  }`}
                >
                  {redisInfo.online ? "Connected" : "Disconnected"}
                </div>
              </div>

              <div className="space-y-1 sm:space-y-1.5">
                <p className="text-[11px] sm:text-xs text-gray-700 dark:text-gray-300">
                  <strong>Provider:</strong> {redisInfo.provider}
                </p>
                <p className="text-[11px] sm:text-xs text-gray-700 dark:text-gray-300">
                  <strong>Message:</strong> {redisInfo.message}
                </p>
              </div>
            </div>
          </div>

          {/* Additional Features Info */}
          {statusData?.features && (
            <div className="bg-white dark:bg-gray-800/90 border border-gray-200 dark:border-gray-700 shadow-lg rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5">
              <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-800 dark:text-gray-200 flex items-center gap-1.5 sm:gap-2 mb-3 sm:mb-4 md:mb-5">
                <span className="text-xl sm:text-2xl">⚙️</span>
                Available Features
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-1.5 sm:gap-2">
                {Object.entries(statusData.features).map(([key, enabled]) => (
                  <div
                    key={key}
                    className={`px-1.5 sm:px-2 py-1 sm:py-1.5 rounded-lg text-center text-[11px] sm:text-xs font-medium ${
                      enabled
                        ? "bg-success-100 dark:bg-success-900/30 text-success-800 dark:text-success-300"
                        : "bg-gray-100 dark:bg-gray-900/50 text-gray-600 dark:text-gray-400"
                    }`}
                  >
                    {enabled ? "✅" : "❌"}{" "}
                    <span className="hidden sm:inline">
                      {key
                        .replace(/_/g, " ")
                        .split(" ")
                        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                        .join(" ")}
                    </span>
                    <span className="sm:hidden">
                      {key
                        .split("_")
                        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                        .join(" ")}
                    </span>
                  </div>
                ))}
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
};

export default StatusPage;
