import React from "react";
import { analyzeRateLimiter, translateRateLimiter } from "../utils/rateLimiter";

/**
 * Rate Limit Status Component
 * Displays current rate limit status for API endpoints
 */
const RateLimitStatus = ({ endpoint = "analyze" }) => {
    const rateLimiter = endpoint === "analyze" ? analyzeRateLimiter : translateRateLimiter;
    const status = rateLimiter.getStatus(`/${endpoint}`);

    // Don't show if plenty of requests remaining
    if (status.remaining > status.limit * 0.5) {
        return null;
    }

    const percentage = (status.remaining / status.limit) * 100;
    const isLow = percentage < 25;
    const isCritical = percentage < 10;

    return (
        <div
            className={`text-xs px-3 py-2 rounded-lg border ${isCritical
                    ? "bg-error-50 dark:bg-error-900/20 border-error-300 dark:border-error-700 text-error-700 dark:text-error-300"
                    : isLow
                        ? "bg-warning-50 dark:bg-warning-900/20 border-warning-300 dark:border-warning-700 text-warning-700 dark:text-warning-300"
                        : "bg-primary-50 dark:bg-primary-900/20 border-primary-300 dark:border-primary-700 text-primary-700 dark:text-primary-300"
                }`}
        >
            <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                    <span className="font-semibold">
                        {isCritical ? "⚠️" : isLow ? "⏰" : "ℹ️"}
                    </span>
                    <span>
                        {status.remaining}/{status.limit} requests remaining
                    </span>
                </div>
                {status.resetAt && (
                    <span className="text-xs opacity-75">
                        Resets: {new Date(status.resetAt).toLocaleTimeString()}
                    </span>
                )}
            </div>

            {/* Progress bar */}
            <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                <div
                    className={`h-1.5 rounded-full transition-all ${isCritical
                            ? "bg-error-500"
                            : isLow
                                ? "bg-warning-500"
                                : "bg-primary-500"
                        }`}
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>
        </div>
    );
};

export default RateLimitStatus;
