import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faKeyboard, faTimes } from '@fortawesome/free-solid-svg-icons';

/**
 * Keyboard Shortcuts Hook
 * Manages global keyboard shortcuts
 */
export const useKeyboardShortcuts = (shortcuts) => {
    useEffect(() => {
        const handleKeyDown = (event) => {
            // Check each shortcut
            shortcuts.forEach(({ key, ctrl, shift, alt, action, description }) => {
                const ctrlMatch = ctrl ? (event.ctrlKey || event.metaKey) : !event.ctrlKey && !event.metaKey;
                const shiftMatch = shift ? event.shiftKey : !event.shiftKey;
                const altMatch = alt ? event.altKey : !event.altKey;
                const keyMatch = event.key.toLowerCase() === key.toLowerCase();

                if (ctrlMatch && shiftMatch && altMatch && keyMatch) {
                    event.preventDefault();
                    action();
                }
            });
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [shortcuts]);
};

/**
 * Keyboard Shortcuts Help Modal
 */
const KeyboardShortcutsModal = ({ shortcuts, isOpen, onClose }) => {
    if (!isOpen) return null;

    const formatShortcut = (shortcut) => {
        const keys = [];
        if (shortcut.ctrl) keys.push('Ctrl');
        if (shortcut.shift) keys.push('Shift');
        if (shortcut.alt) keys.push('Alt');
        keys.push(shortcut.key.toUpperCase());
        return keys.join(' + ');
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 z-40 animate-fade-in"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden animate-slide-down">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                            <FontAwesomeIcon icon={faKeyboard} className="text-primary-500" />
                            Keyboard Shortcuts
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                        >
                            <FontAwesomeIcon icon={faTimes} className="text-xl" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-4 sm:p-6 overflow-y-auto max-h-[60vh]">
                        <div className="space-y-3">
                            {shortcuts.map((shortcut, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                >
                                    <span className="text-sm sm:text-base text-gray-700 dark:text-gray-300">
                                        {shortcut.description}
                                    </span>
                                    <kbd className="px-3 py-1.5 text-xs sm:text-sm font-mono bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded shadow-sm text-gray-800 dark:text-gray-200">
                                        {formatShortcut(shortcut)}
                                    </kbd>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="p-4 sm:p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 text-center">
                            Press <kbd className="px-2 py-1 text-xs font-mono bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded">?</kbd> to toggle this help
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

/**
 * Keyboard Shortcuts Button Component
 */
export const KeyboardShortcutsButton = ({ shortcuts }) => {
    const [isOpen, setIsOpen] = useState(false);

    // Add shortcut to open help
    useKeyboardShortcuts([
        {
            key: '?',
            shift: true,
            description: 'Show keyboard shortcuts',
            action: () => setIsOpen(true),
        },
    ]);

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-4 right-4 z-30 p-3 bg-primary-500 text-white rounded-full shadow-lg hover:bg-primary-600 transition-all hover:scale-110"
                title="Keyboard Shortcuts (Shift + ?)"
            >
                <FontAwesomeIcon icon={faKeyboard} className="text-lg" />
            </button>

            <KeyboardShortcutsModal
                shortcuts={shortcuts}
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
            />
        </>
    );
};

export default useKeyboardShortcuts;
