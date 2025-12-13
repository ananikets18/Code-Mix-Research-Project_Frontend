import React, { createContext, useContext, useState, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCheckCircle,
    faExclamationCircle,
    faInfoCircle,
    faTimes,
} from '@fortawesome/free-solid-svg-icons';

/**
 * Toast Context for global toast notifications
 */
const ToastContext = createContext();

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within ToastProvider');
    }
    return context;
};

/**
 * Toast Provider Component
 */
export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = 'info', duration = 3000) => {
        const id = Date.now();
        const toast = { id, message, type, duration };

        setToasts((prev) => [...prev, toast]);

        if (duration > 0) {
            setTimeout(() => {
                removeToast(id);
            }, duration);
        }

        return id;
    }, []);

    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    const success = useCallback((message, duration) => {
        return addToast(message, 'success', duration);
    }, [addToast]);

    const error = useCallback((message, duration) => {
        return addToast(message, 'error', duration);
    }, [addToast]);

    const info = useCallback((message, duration) => {
        return addToast(message, 'info', duration);
    }, [addToast]);

    const warning = useCallback((message, duration) => {
        return addToast(message, 'warning', duration);
    }, [addToast]);

    return (
        <ToastContext.Provider value={{ success, error, info, warning, removeToast }}>
            {children}
            <ToastContainer toasts={toasts} removeToast={removeToast} />
        </ToastContext.Provider>
    );
};

/**
 * Toast Container Component
 */
const ToastContainer = ({ toasts, removeToast }) => {
    return (
        <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm w-full px-4 sm:px-0">
            {toasts.map((toast) => (
                <Toast key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
            ))}
        </div>
    );
};

/**
 * Individual Toast Component
 */
const Toast = ({ toast, onClose }) => {
    const { type, message } = toast;

    const getToastStyles = () => {
        switch (type) {
            case 'success':
                return {
                    bg: 'bg-success-50 dark:bg-success-900/20',
                    border: 'border-success-500',
                    icon: faCheckCircle,
                    iconColor: 'text-success-500',
                };
            case 'error':
                return {
                    bg: 'bg-error-50 dark:bg-error-900/20',
                    border: 'border-error-500',
                    icon: faExclamationCircle,
                    iconColor: 'text-error-500',
                };
            case 'warning':
                return {
                    bg: 'bg-warning-50 dark:bg-warning-900/20',
                    border: 'border-warning-500',
                    icon: faExclamationCircle,
                    iconColor: 'text-warning-500',
                };
            default:
                return {
                    bg: 'bg-primary-50 dark:bg-primary-900/20',
                    border: 'border-primary-500',
                    icon: faInfoCircle,
                    iconColor: 'text-primary-500',
                };
        }
    };

    const styles = getToastStyles();

    return (
        <div
            className={`${styles.bg} border-l-4 ${styles.border} rounded-lg shadow-lg p-4 flex items-start gap-3 animate-slide-in-right`}
            role="alert"
        >
            <FontAwesomeIcon icon={styles.icon} className={`${styles.iconColor} text-xl flex-shrink-0 mt-0.5`} />
            <p className="flex-1 text-sm text-gray-800 dark:text-gray-200">{message}</p>
            <button
                onClick={onClose}
                className="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                aria-label="Close"
            >
                <FontAwesomeIcon icon={faTimes} />
            </button>
        </div>
    );
};

export default ToastProvider;
