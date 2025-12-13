import React from "react";
import TabNavigation from "./TabNavigation";
import TextInput from "./TextInput";
import TranslateOptions from "./TranslateOptions";
import SubmitButton from "./SubmitButton";
import ErrorDisplay from "./ErrorDisplay";
import RateLimitStatus from "./RateLimitStatus";

/**
 * Input Section Component
 * Contains the main input area with tabs, text input, options, and submit button
 */
const InputSection = ({
    activeTab,
    handleTabSwitch,
    text,
    setText,
    exampleTexts,
    sourceLang,
    setSourceLang,
    targetLang,
    setTargetLang,
    loading,
    handleSubmit,
    error,
    compactMode,
    handleCompactModeToggle,
    textInputRef,
}) => {
    return (
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Tab Navigation */}
            <div className="bg-white dark:bg-gray-800/90 border border-gray-200 dark:border-gray-700 shadow-lg rounded-xl p-3 sm:p-4">
                <TabNavigation activeTab={activeTab} setActiveTab={handleTabSwitch} />
            </div>

            {/* Text Input */}
            <div className="bg-white dark:bg-gray-800/90 border border-gray-200 dark:border-gray-700 shadow-lg rounded-xl p-4 sm:p-6">
                <TextInput text={text} setText={setText} exampleTexts={exampleTexts} />
            </div>

            {/* Translation Options (only shown in translate tab) */}
            {activeTab === "translate" && (
                <div className="bg-white dark:bg-gray-800/90 border border-gray-200 dark:border-gray-700 shadow-lg rounded-xl p-4 sm:p-6">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white/90">
                        ⚙️ Options
                    </h3>
                    <TranslateOptions
                        sourceLang={sourceLang}
                        setSourceLang={setSourceLang}
                        targetLang={targetLang}
                        setTargetLang={setTargetLang}
                    />
                </div>
            )}

            {/* Submit Button and Compact Mode Toggle */}
            <div className="bg-white dark:bg-gray-800/90 border border-gray-200 dark:border-gray-700 shadow-lg rounded-xl p-3 sm:p-4">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
                    <div className="flex-1">
                        <SubmitButton
                            loading={loading}
                            activeTab={activeTab}
                            text={text}
                            handleSubmit={handleSubmit}
                        />
                    </div>

                    {activeTab === "analyze" && (
                        <div className="flex items-center justify-center gap-2 px-3 py-2 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    checked={compactMode}
                                    onChange={(e) => handleCompactModeToggle(e.target.checked)}
                                    className="rounded border-gray-300 dark:border-gray-600 text-primary-600 dark:text-primary-500 focus:ring-primary-500 bg-gray-50 dark:bg-gray-900/50"
                                    aria-label="Toggle compact mode"
                                />
                                <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors whitespace-nowrap">
                                    ⚙️ Compact
                                </span>
                            </label>
                        </div>
                    )}
                </div>
            </div>

            {/* Rate Limit Status */}
            <RateLimitStatus endpoint={activeTab} />

            {/* Error Display */}
            <ErrorDisplay error={error} />
        </div>
    );
};

export default InputSection;
