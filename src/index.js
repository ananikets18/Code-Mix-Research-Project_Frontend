import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { StatusProvider } from './context/StatusContext';
import ErrorBoundary from './components/ErrorBoundary';
import { initializeAnalytics } from './utils/analytics';
import { initializeErrorTracking } from './utils/errorTracking';
import { reportWebVitals } from './utils/performance';

// Initialize analytics and error tracking
initializeAnalytics();
initializeErrorTracking();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <ToastProvider>
        <ThemeProvider>
          <StatusProvider>
            <App />
          </StatusProvider>
        </ThemeProvider>
      </ToastProvider>
    </ErrorBoundary>
  </React.StrictMode>
);

// Report Web Vitals for performance monitoring
if (process.env.REACT_APP_ENABLE_PERFORMANCE_MONITORING === 'true') {
  reportWebVitals((metric) => {
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log(metric);
    }

    // Send to analytics in production
    if (typeof window.gtag === 'function') {
      window.gtag('event', metric.name, {
        event_category: 'Web Vitals',
        value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
        event_label: metric.id,
        non_interaction: true,
      });
    }
  });
}
