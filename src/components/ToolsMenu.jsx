import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faTools,
    faHistory,
    faLayerGroup,
    faChartBar,
} from "@fortawesome/free-solid-svg-icons";

/**
 * Tools Menu Component
 * Dropdown menu for accessing advanced features
 */
const ToolsMenu = ({ onOpenHistory, onOpenBatch, onOpenStats }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleMenuClick = (action) => {
        action();
        setIsOpen(false);
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="px-4 py-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-lg hover:from-primary-600 hover:to-secondary-600 transition-all flex items-center gap-2 shadow-lg hover:shadow-xl"
                title="Advanced Tools"
            >
                <FontAwesomeIcon icon={faTools} />
                <span className="hidden sm:inline">Tools</span>
            </button>

            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Dropdown Menu */}
                    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-20 overflow-hidden">
                        <div className="py-2">
                            {/* Analysis History */}
                            <button
                                onClick={() => handleMenuClick(onOpenHistory)}
                                className="w-full px-4 py-3 text-left hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors flex items-center gap-3 group"
                            >
                                <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center group-hover:bg-primary-200 dark:group-hover:bg-primary-900/50 transition-colors">
                                    <FontAwesomeIcon
                                        icon={faHistory}
                                        className="text-primary-600 dark:text-primary-400"
                                    />
                                </div>
                                <div className="flex-1">
                                    <div className="font-semibold text-gray-800 dark:text-white">
                                        Analysis History
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                        View past analyses
                                    </div>
                                </div>
                            </button>

                            {/* Batch Analysis */}
                            <button
                                onClick={() => handleMenuClick(onOpenBatch)}
                                className="w-full px-4 py-3 text-left hover:bg-secondary-50 dark:hover:bg-secondary-900/20 transition-colors flex items-center gap-3 group"
                            >
                                <div className="w-10 h-10 bg-secondary-100 dark:bg-secondary-900/30 rounded-lg flex items-center justify-center group-hover:bg-secondary-200 dark:group-hover:bg-secondary-900/50 transition-colors">
                                    <FontAwesomeIcon
                                        icon={faLayerGroup}
                                        className="text-secondary-600 dark:text-secondary-400"
                                    />
                                </div>
                                <div className="flex-1">
                                    <div className="font-semibold text-gray-800 dark:text-white">
                                        Batch Analysis
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                        Analyze multiple texts
                                    </div>
                                </div>
                            </button>

                            {/* Statistics */}
                            <button
                                onClick={() => handleMenuClick(onOpenStats)}
                                className="w-full px-4 py-3 text-left hover:bg-success-50 dark:hover:bg-success-900/20 transition-colors flex items-center gap-3 group"
                            >
                                <div className="w-10 h-10 bg-success-100 dark:bg-success-900/30 rounded-lg flex items-center justify-center group-hover:bg-success-200 dark:group-hover:bg-success-900/50 transition-colors">
                                    <FontAwesomeIcon
                                        icon={faChartBar}
                                        className="text-success-600 dark:text-success-400"
                                    />
                                </div>
                                <div className="flex-1">
                                    <div className="font-semibold text-gray-800 dark:text-white">
                                        Statistics
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                        View usage stats
                                    </div>
                                </div>
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default ToolsMenu;
