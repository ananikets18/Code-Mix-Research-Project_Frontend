/**
 * Performance Utilities
 * Helper functions for optimizing React app performance
 */

/**
 * Lazy load images with intersection observer
 * @param {string} selector - CSS selector for images to lazy load
 */
export const lazyLoadImages = (selector = 'img[data-src]') => {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        const images = document.querySelectorAll(selector);
        images.forEach((img) => imageObserver.observe(img));
    } else {
        // Fallback for browsers that don't support IntersectionObserver
        const images = document.querySelectorAll(selector);
        images.forEach((img) => {
            img.src = img.dataset.src;
        });
    }
};

/**
 * Preload critical resources
 * @param {Array} resources - Array of resource URLs to preload
 * @param {string} type - Resource type (script, style, font, image)
 */
export const preloadResources = (resources, type = 'script') => {
    resources.forEach((resource) => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = type;
        link.href = resource;

        if (type === 'font') {
            link.crossOrigin = 'anonymous';
        }

        document.head.appendChild(link);
    });
};

/**
 * Debounce function for performance optimization
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait = 300) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

/**
 * Throttle function for performance optimization
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} Throttled function
 */
export const throttle = (func, limit = 300) => {
    let inThrottle;
    return function executedFunction(...args) {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    };
};

/**
 * Prefetch route data
 * @param {string} route - Route to prefetch
 */
export const prefetchRoute = (route) => {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = route;
    document.head.appendChild(link);
};

/**
 * Check if user prefers reduced motion
 * @returns {boolean} True if user prefers reduced motion
 */
export const prefersReducedMotion = () => {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Get network information
 * @returns {Object} Network information
 */
export const getNetworkInfo = () => {
    const connection =
        navigator.connection ||
        navigator.mozConnection ||
        navigator.webkitConnection;

    if (!connection) {
        return { effectiveType: 'unknown', saveData: false };
    }

    return {
        effectiveType: connection.effectiveType,
        saveData: connection.saveData || false,
        downlink: connection.downlink,
        rtt: connection.rtt,
    };
};

/**
 * Adaptive loading based on network conditions
 * @returns {boolean} True if should load high-quality resources
 */
export const shouldLoadHighQuality = () => {
    const networkInfo = getNetworkInfo();

    // Don't load high quality on slow connections or save-data mode
    if (networkInfo.saveData) return false;
    if (networkInfo.effectiveType === '2g' || networkInfo.effectiveType === 'slow-2g') {
        return false;
    }

    return true;
};

/**
 * Report Web Vitals
 * @param {Function} onPerfEntry - Callback function for performance entries
 */
export const reportWebVitals = (onPerfEntry) => {
    if (onPerfEntry && onPerfEntry instanceof Function) {
        import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
            getCLS(onPerfEntry);
            getFID(onPerfEntry);
            getFCP(onPerfEntry);
            getLCP(onPerfEntry);
            getTTFB(onPerfEntry);
        });
    }
};

const performanceUtils = {
    lazyLoadImages,
    preloadResources,
    debounce,
    throttle,
    prefetchRoute,
    prefersReducedMotion,
    getNetworkInfo,
    shouldLoadHighQuality,
    reportWebVitals,
};

export default performanceUtils;
