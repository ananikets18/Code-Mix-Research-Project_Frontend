import React from 'react';
import StatusBadge from './StatusBadge';
import { useStatus } from '../context/StatusContext';

/**
 * BackendStatus component that displays backend status badges
 * Now uses centralized StatusContext to ensure consistent state across the application
 * - Model load status (dynamically shows which models are loaded)
 * - Redis/Upstash ready status
 */
const BackendStatus = () => {
  // Use centralized status from context
  const { statusData, loading, error } = useStatus();

  // Helper to extract model status
  const getModelStatus = () => {
    if (!statusData) {
      return { loaded: 0, total: 0, modelNames: [], percentage: 0 };
    }

    // Check for ml_models structure (new backend format)
    if (statusData.ml_models) {
      const ml = statusData.ml_models;
      const loadedModels = [];
      
      // Extract model names from the models object
      if (ml.models) {
        Object.entries(ml.models).forEach(([key, value]) => {
          if (value && (value.status === 'loaded' || value === 'loaded')) {
            const readableName = key
              .replace(/_/g, ' ')
              .split(' ')
              .map(word => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ');
            loadedModels.push(readableName);
          }
        });
      }
      
      return {
        loaded: ml.loaded_models || 0,
        total: ml.total_models || 0,
        modelNames: loadedModels,
        percentage: ml.readiness_percentage || 0
      };
    }

    // Fallback to old format
    if (statusData.models) {
      const models = statusData.models;
      const loadedModels = [];

      Object.entries(models).forEach(([key, value]) => {
        if (value === true || value === 'loaded' || value === 'ready') {
          const readableName = key
            .replace(/_/g, ' ')
            .replace(/model/gi, '')
            .trim()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
          
          if (readableName) {
            loadedModels.push(readableName);
          }
        }
      });

      return {
        loaded: loadedModels.length,
        total: Object.keys(models).length,
        modelNames: loadedModels,
        percentage: (loadedModels.length / Object.keys(models).length) * 100
      };
    }

    return { loaded: 0, total: 0, modelNames: [], percentage: 0 };
  };

  // Helper to get Redis/Upstash status
  const getRedisStatus = () => {
    if (!statusData) return { ready: false, label: 'Unknown' };

    // Check for redis structure (new backend format)
    if (statusData.redis) {
      const redis = statusData.redis;
      
      if (redis.active === true || redis.status === 'healthy' || redis.status === 'connected') {
        return { ready: true, label: 'Redis Ready' };
      }
      
      return { ready: false, label: 'Redis Offline' };
    }

    // Check for cache structure
    if (statusData.cache) {
      const cache = statusData.cache;
      if (cache.redis_enabled === true) {
        return { ready: true, label: 'Redis Ready' };
      }
    }

    // Fallback to old format
    const redis = statusData.upstash;
    
    if (redis === true || redis === 'ready' || redis === 'connected') {
      return { ready: true, label: 'Redis Ready' };
    }

    if (typeof redis === 'object') {
      if (redis.status === 'ready' || redis.connected === true || redis.ready === true) {
        return { ready: true, label: 'Redis Ready' };
      }
    }

    return { ready: false, label: 'Redis Offline' };
  };

  // If loading initially
  if (loading && !statusData) {
    return (
      <div className="flex items-center gap-2 flex-wrap">
        <StatusBadge 
          label="Checking status..." 
          status="loading" 
          icon="⏳"
        />
      </div>
    );
  }

  // If error and no cached data
  if (error && !statusData) {
    return (
      <div className="flex items-center gap-2 flex-wrap">
        <StatusBadge 
          label="Backend Offline" 
          status="error" 
          icon="🔴"
          tooltip="Unable to connect to backend API"
        />
      </div>
    );
  }

  const modelStatus = getModelStatus();
  const redisStatus = getRedisStatus();

  // Determine model badge status
  const modelBadgeStatus = modelStatus.loaded === modelStatus.total && modelStatus.total > 0
    ? 'success' 
    : modelStatus.loaded > 0 
      ? 'warning' 
      : 'error';

  const modelLabel = modelStatus.total > 0
    ? `${modelStatus.loaded}/${modelStatus.total} Models`
    : 'No Models';

  const modelTooltip = modelStatus.modelNames.length > 0
    ? `Loaded: ${modelStatus.modelNames.join(', ')}`
    : 'No models are currently loaded';

  const modelIcon = modelStatus.loaded === modelStatus.total && modelStatus.total > 0
    ? '🧠'
    : modelStatus.loaded > 0
      ? '⚠️'
      : '❌';

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {/* Model Status Badge */}
      <StatusBadge 
        label={modelLabel}
        status={modelBadgeStatus}
        icon={modelIcon}
        pulse={modelBadgeStatus === 'success'}
        tooltip={modelTooltip}
      />

      {/* Redis/Upstash Status Badge */}
      <StatusBadge 
        label={redisStatus.label}
        status={redisStatus.ready ? 'success' : 'error'}
        icon={redisStatus.ready ? '⚡' : '🔌'}
        pulse={redisStatus.ready}
        tooltip={redisStatus.ready 
          ? 'Redis cache is connected and ready' 
          : 'Redis cache is not available'
        }
      />

      {/* Optional: Overall API Status if needed */}
      {statusData && (statusData.status === 'healthy' || statusData.api?.status === 'operational') && (
        <StatusBadge 
          label="API Online"
          status="success"
          pulse={true}
          tooltip="Backend API is operational"
        />
      )}
    </div>
  );
};

export default BackendStatus;
