/**
 * Error Tracking Utility (Sentry-compatible)
 * Captures and reports errors in production
 */

import logger from './logger';

let isInitialized = false;
let errorTracker = null;

/**
 * Initialize error tracking (Sentry or similar)
 */
export const initializeErrorTracking = () => {
  const dsn = process.env.REACT_APP_SENTRY_DSN;
  const environment = process.env.REACT_APP_ENV || process.env.NODE_ENV || 'development';
  
  // Only enable in production or when DSN is provided
  if (!dsn || environment === 'development') {
    logger.log('Error tracking disabled in development mode');
    return;
  }

  try {
    // This is a placeholder for Sentry integration
    // To actually use Sentry, install: npm install @sentry/react
    // Then uncomment and use:
    /*
    import * as Sentry from "@sentry/react";
    
    Sentry.init({
      dsn: dsn,
      environment: environment,
      integrations: [
        new Sentry.BrowserTracing(),
        new Sentry.Replay({
          maskAllText: false,
          blockAllMedia: false,
        }),
      ],
      // Performance Monitoring
      tracesSampleRate: 0.1, // Capture 10% of transactions
      // Session Replay
      replaysSessionSampleRate: 0.1, // Sample 10% of sessions
      replaysOnErrorSampleRate: 1.0, // Sample 100% of sessions with errors
      
      // Filter sensitive data
      beforeSend(event) {
        // Don't send events from localhost
        if (window.location.hostname === 'localhost') {
          return null;
        }
        return event;
      },
      
      // Ignore common errors
      ignoreErrors: [
        'ResizeObserver loop limit exceeded',
        'Non-Error promise rejection captured',
        'Network request failed',
      ],
    });
    
    errorTracker = Sentry;
    */
    
    isInitialized = true;
    logger.log('Error tracking initialized');
  } catch (error) {
    logger.error('Failed to initialize error tracking:', error);
  }
};

/**
 * Capture an exception
 */
export const captureException = (error, context = {}) => {
  // Only log to console in development
  if (process.env.NODE_ENV === 'development') {
    logger.error('Error captured:', error, context);
  }
  
  if (isInitialized && errorTracker) {
    // errorTracker.captureException(error, { extra: context });
  }
  
  // Detailed error logging only in development
  if (process.env.NODE_ENV === 'development') {
    logger.group('🔴 Error Details');
    logger.error('Error:', error);
    logger.log('Context:', context);
    logger.groupEnd();
  }
};

/**
 * Capture a message
 */
export const captureMessage = (message, level = 'info', context = {}) => {
  if (isInitialized && errorTracker) {
    // errorTracker.captureMessage(message, { level, extra: context });
  }
  
  logger.log(`[${level.toUpperCase()}] ${message}`, context);
};

/**
 * Set user context for error tracking
 */
export const setUser = (userData) => {
  if (isInitialized && errorTracker) {
    // errorTracker.setUser(userData);
  }
};

/**
 * Add breadcrumb for debugging
 */
export const addBreadcrumb = (breadcrumb) => {
  if (isInitialized && errorTracker) {
    // errorTracker.addBreadcrumb(breadcrumb);
  }
  
  // Only log breadcrumbs in development
  if (process.env.NODE_ENV === 'development') {
    logger.log('📌 Breadcrumb:', breadcrumb);
  }
};

/**
 * Custom error tracking functions
 */
export const ErrorTracking = {
  // API Errors
  apiError: (endpoint, error, statusCode) => {
    captureException(error, {
      type: 'API_ERROR',
      endpoint,
      statusCode,
      timestamp: new Date().toISOString()
    });
  },

  // Validation Errors
  validationError: (field, value, message) => {
    captureMessage(`Validation failed: ${message}`, 'warning', {
      type: 'VALIDATION_ERROR',
      field,
      value: typeof value === 'string' ? value.substring(0, 100) : value,
      message
    });
  },

  // Network Errors
  networkError: (error) => {
    captureException(error, {
      type: 'NETWORK_ERROR',
      online: navigator.onLine,
      timestamp: new Date().toISOString()
    });
  },

  // Component Errors
  componentError: (componentName, error, errorInfo) => {
    captureException(error, {
      type: 'COMPONENT_ERROR',
      component: componentName,
      componentStack: errorInfo?.componentStack,
      timestamp: new Date().toISOString()
    });
  },

  // User Actions
  userAction: (action, details) => {
    addBreadcrumb({
      category: 'user-action',
      message: action,
      data: details,
      level: 'info'
    });
  },

  // Generic error logging
  logError: (error, context = {}) => {
    captureException(error, {
      type: 'GENERAL_ERROR',
      ...context,
      timestamp: new Date().toISOString()
    });
  }
};

export default ErrorTracking;
