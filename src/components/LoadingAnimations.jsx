import React from 'react';

/**
 * Spinner Loading Animation
 */
export const Spinner = ({ size = 'md', color = 'primary' }) => {
    const sizes = {
        sm: 'w-4 h-4',
        md: 'w-8 h-8',
        lg: 'w-12 h-12',
        xl: 'w-16 h-16',
    };

    const colors = {
        primary: 'border-primary-500',
        secondary: 'border-secondary-500',
        white: 'border-white',
    };

    return (
        <div
            className={`${sizes[size]} border-4 ${colors[color]} border-t-transparent rounded-full animate-spin`}
        />
    );
};

/**
 * Dots Loading Animation
 */
export const DotsLoader = ({ color = 'primary' }) => {
    const colors = {
        primary: 'bg-primary-500',
        secondary: 'bg-secondary-500',
        white: 'bg-white',
    };

    return (
        <div className="flex gap-2">
            <div className={`w-3 h-3 ${colors[color]} rounded-full animate-bounce`} style={{ animationDelay: '0ms' }} />
            <div className={`w-3 h-3 ${colors[color]} rounded-full animate-bounce`} style={{ animationDelay: '150ms' }} />
            <div className={`w-3 h-3 ${colors[color]} rounded-full animate-bounce`} style={{ animationDelay: '300ms' }} />
        </div>
    );
};

/**
 * Pulse Loading Animation
 */
export const PulseLoader = ({ size = 'md' }) => {
    const sizes = {
        sm: 'w-8 h-8',
        md: 'w-12 h-12',
        lg: 'w-16 h-16',
    };

    return (
        <div className="relative flex items-center justify-center">
            <div className={`${sizes[size]} bg-primary-500 rounded-full animate-ping absolute`} />
            <div className={`${sizes[size]} bg-primary-600 rounded-full`} />
        </div>
    );
};

/**
 * Progress Bar Loading Animation
 */
export const ProgressBar = ({ progress = 0, showPercentage = true }) => {
    return (
        <div className="w-full">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                <div
                    className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 transition-all duration-300 ease-out"
                    style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
                />
            </div>
            {showPercentage && (
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 text-center">
                    {Math.round(progress)}%
                </p>
            )}
        </div>
    );
};

/**
 * Skeleton Loading Animation
 */
export const Skeleton = ({ width = '100%', height = '1rem', className = '' }) => {
    return (
        <div
            className={`bg-gray-200 dark:bg-gray-700 rounded animate-pulse ${className}`}
            style={{ width, height }}
        />
    );
};

/**
 * Card Skeleton Loading
 */
export const CardSkeleton = () => {
    return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 sm:p-6 space-y-4">
            <Skeleton height="1.5rem" width="60%" />
            <Skeleton height="1rem" width="100%" />
            <Skeleton height="1rem" width="80%" />
            <div className="flex gap-2">
                <Skeleton height="2rem" width="5rem" />
                <Skeleton height="2rem" width="5rem" />
            </div>
        </div>
    );
};

/**
 * Text Skeleton Loading
 */
export const TextSkeleton = ({ lines = 3 }) => {
    return (
        <div className="space-y-2">
            {Array.from({ length: lines }).map((_, index) => (
                <Skeleton
                    key={index}
                    height="1rem"
                    width={index === lines - 1 ? '70%' : '100%'}
                />
            ))}
        </div>
    );
};

/**
 * Circular Progress Loading
 */
export const CircularProgress = ({ progress = 0, size = 'md', showPercentage = true }) => {
    const sizes = {
        sm: { width: 40, stroke: 3 },
        md: { width: 60, stroke: 4 },
        lg: { width: 80, stroke: 5 },
    };

    const { width, stroke } = sizes[size];
    const radius = (width - stroke) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (progress / 100) * circumference;

    return (
        <div className="relative inline-flex items-center justify-center">
            <svg width={width} height={width} className="transform -rotate-90">
                {/* Background circle */}
                <circle
                    cx={width / 2}
                    cy={width / 2}
                    r={radius}
                    stroke="currentColor"
                    strokeWidth={stroke}
                    fill="none"
                    className="text-gray-200 dark:text-gray-700"
                />
                {/* Progress circle */}
                <circle
                    cx={width / 2}
                    cy={width / 2}
                    r={radius}
                    stroke="currentColor"
                    strokeWidth={stroke}
                    fill="none"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    className="text-primary-500 transition-all duration-300 ease-out"
                    strokeLinecap="round"
                />
            </svg>
            {showPercentage && (
                <span className="absolute text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {Math.round(progress)}%
                </span>
            )}
        </div>
    );
};

/**
 * Ripple Loading Animation
 */
export const RippleLoader = () => {
    return (
        <div className="relative w-16 h-16">
            <div className="absolute inset-0 border-4 border-primary-500 rounded-full animate-ping" />
            <div className="absolute inset-2 border-4 border-primary-400 rounded-full animate-ping" style={{ animationDelay: '0.2s' }} />
            <div className="absolute inset-4 border-4 border-primary-300 rounded-full animate-ping" style={{ animationDelay: '0.4s' }} />
        </div>
    );
};

export default {
    Spinner,
    DotsLoader,
    PulseLoader,
    ProgressBar,
    Skeleton,
    CardSkeleton,
    TextSkeleton,
    CircularProgress,
    RippleLoader,
};
