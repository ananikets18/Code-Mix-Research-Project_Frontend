import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faRocket, faKeyboard, faHistory, faLanguage } from '@fortawesome/free-solid-svg-icons';

/**
 * Welcome Modal Component
 * Shows first-time user tutorial and key features
 */
const WelcomeModal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);

    useEffect(() => {
        // Check if user has seen the welcome modal
        const hasSeenWelcome = localStorage.getItem('hasSeenWelcome');
        if (!hasSeenWelcome) {
            setIsOpen(true);
        }
    }, []);

    const handleClose = () => {
        localStorage.setItem('hasSeenWelcome', 'true');
        setIsOpen(false);
    };

    const handleSkip = () => {
        handleClose();
    };

    const steps = [
        {
            icon: faRocket,
            title: 'Welcome to Code-Mix NLP Analyzer!',
            description: 'Analyze multilingual and code-mixed text with advanced NLP capabilities.',
            features: [
                '🌍 Detect languages with high accuracy',
                '😊 Analyze sentiment (Positive, Neutral, Negative)',
                '🛡️ Check content safety and toxicity',
                '🔤 Translate between multiple languages',
            ],
        },
        {
            icon: faLanguage,
            title: 'How to Use',
            description: 'Get started in 3 simple steps:',
            features: [
                '1️⃣ Enter or paste your text in the input area',
                '2️⃣ Choose Analyze or Translate tab',
                '3️⃣ Click the Analyze button to see results',
                '💡 Try the example buttons for quick demos!',
            ],
        },
        {
            icon: faKeyboard,
            title: 'Keyboard Shortcuts',
            description: 'Work faster with these shortcuts:',
            features: [
                '⌨️ Ctrl + Enter - Submit analysis',
                '⌨️ Ctrl + K - Focus text input',
                '⌨️ Ctrl + H - Toggle history',
                '⌨️ Shift + ? - Show all shortcuts',
            ],
        },
        {
            icon: faHistory,
            title: 'Analysis History',
            description: 'Your analyses are automatically saved!',
            features: [
                '📜 View past analyses in the sidebar',
                '🔍 Search and filter your history',
                '📊 Track your usage statistics',
                '🔄 Click any item to re-analyze',
            ],
        },
    ];

    const currentStepData = steps[currentStep];

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-fade-in"
                onClick={handleSkip}
                aria-hidden="true"
            />

            {/* Modal */}
            <div
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
                role="dialog"
                aria-modal="true"
                aria-labelledby="welcome-modal-title"
            >
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden animate-slide-down">
                    {/* Header */}
                    <div className="relative bg-gradient-to-r from-primary-500 to-secondary-500 p-6 sm:p-8 text-white">
                        <button
                            onClick={handleClose}
                            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
                            aria-label="Close welcome modal"
                        >
                            <FontAwesomeIcon icon={faTimes} className="text-xl" />
                        </button>

                        <div className="flex items-center gap-4 mb-4">
                            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl">
                                <FontAwesomeIcon icon={currentStepData.icon} className="text-4xl" />
                            </div>
                            <div>
                                <h2 id="welcome-modal-title" className="text-2xl sm:text-3xl font-bold">
                                    {currentStepData.title}
                                </h2>
                                <p className="text-white/90 text-sm mt-1">
                                    Step {currentStep + 1} of {steps.length}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 sm:p-8">
                        <p className="text-gray-700 dark:text-gray-300 text-lg mb-6">
                            {currentStepData.description}
                        </p>

                        <div className="space-y-3">
                            {currentStepData.features.map((feature, index) => (
                                <div
                                    key={index}
                                    className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                                >
                                    <span className="text-2xl flex-shrink-0">{feature.split(' ')[0]}</span>
                                    <p className="text-gray-700 dark:text-gray-300 pt-1">
                                        {feature.substring(feature.indexOf(' ') + 1)}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="p-6 sm:p-8 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700">
                        {/* Progress Dots */}
                        <div className="flex justify-center gap-2 mb-6">
                            {steps.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentStep(index)}
                                    className={`h-2 rounded-full transition-all ${index === currentStep
                                            ? 'w-8 bg-primary-500'
                                            : 'w-2 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400'
                                        }`}
                                    aria-label={`Go to step ${index + 1}`}
                                />
                            ))}
                        </div>

                        {/* Navigation Buttons */}
                        <div className="flex items-center justify-between gap-4">
                            <button
                                onClick={handleSkip}
                                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                            >
                                Skip Tutorial
                            </button>

                            <div className="flex gap-3">
                                {currentStep > 0 && (
                                    <button
                                        onClick={() => setCurrentStep(currentStep - 1)}
                                        className="px-6 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors font-medium"
                                    >
                                        Previous
                                    </button>
                                )}

                                {currentStep < steps.length - 1 ? (
                                    <button
                                        onClick={() => setCurrentStep(currentStep + 1)}
                                        className="px-6 py-2.5 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-lg hover:from-primary-600 hover:to-secondary-600 transition-all shadow-md hover:shadow-lg font-medium"
                                    >
                                        Next
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleClose}
                                        className="px-6 py-2.5 bg-gradient-to-r from-success-500 to-success-600 text-white rounded-lg hover:from-success-600 hover:to-success-700 transition-all shadow-md hover:shadow-lg font-medium"
                                    >
                                        Get Started! 🚀
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default WelcomeModal;
