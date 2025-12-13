import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';

const StatusContext = createContext();

/**
 * Hook to access status context
 */
export const useStatus = () => {
  const context = useContext(StatusContext);
  if (!context) {
    throw new Error('useStatus must be used within a StatusProvider');
  }
  return context;
};

/**
 * StatusProvider - Centralized status management
 * Prevents race conditions and inconsistent state between components
 */
export const StatusProvider = ({ children }) => {
  const [statusData, setStatusData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  
  // Use ref to track if component is mounted
  const isMountedRef = useRef(true);
  const fetchTimeoutRef = useRef(null);

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';
  const POLL_INTERVAL = 10000; // Poll every 10 seconds

  const fetchStatus = useCallback(async (isInitial = false) => {
    // Clear any pending timeout
    if (fetchTimeoutRef.current) {
      clearTimeout(fetchTimeoutRef.current);
    }

    try {
      if (isInitial) {
        setLoading(true);
      }
      setError(null);

      const response = await axios.get(`${API_BASE_URL}/status`, {
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json',
        },
        // Add cache busting to prevent stale data
        params: {
          t: Date.now()
        }
      });

      if (response.data && isMountedRef.current) {
        setStatusData(response.data);
        setLastUpdated(new Date());
        setLoading(false);
        setError(null);
      }
    } catch (err) {
      console.error('Failed to fetch backend status:', err);
      if (isMountedRef.current) {
        setError(err.message || 'Failed to connect to backend');
        setLoading(false);
      }
    }
  }, [API_BASE_URL]);

  useEffect(() => {
    isMountedRef.current = true;

    // Initial fetch
    fetchStatus(true);

    // Set up polling interval
    const interval = setInterval(() => {
      fetchStatus(false);
    }, POLL_INTERVAL);

    return () => {
      isMountedRef.current = false;
      clearInterval(interval);
      if (fetchTimeoutRef.current) {
        clearTimeout(fetchTimeoutRef.current);
      }
    };
  }, [fetchStatus]);

  const value = {
    statusData,
    loading,
    error,
    lastUpdated,
    fetchStatus: () => fetchStatus(false),
    API_BASE_URL
  };

  return (
    <StatusContext.Provider value={value}>
      {children}
    </StatusContext.Provider>
  );
};

export default StatusContext;
