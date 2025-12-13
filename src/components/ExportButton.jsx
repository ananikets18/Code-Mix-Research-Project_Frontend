import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload, faFilePdf, faFileCode, faFileAlt } from "@fortawesome/free-solid-svg-icons";
import { exportPDFReport, exportJSON, exportTXT } from "../utils/exportReport";

/**
 * Export Button Component
 * Provides options to export analysis results in different formats
 */
const ExportButton = ({ result, originalText }) => {
    const [showMenu, setShowMenu] = useState(false);

    const handleExport = (format) => {
        try {
            switch (format) {
                case "pdf":
                    exportPDFReport(result, originalText);
                    break;
                case "json":
                    exportJSON(result);
                    break;
                case "txt":
                    exportTXT(result, originalText);
                    break;
                default:
                    break;
            }
            setShowMenu(false);
        } catch (error) {
            console.error("Export error:", error);
            alert("Failed to export. Please try again.");
        }
    };

    return (
        <div className="relative">
            <button
                onClick={() => setShowMenu(!showMenu)}
                className="px-4 py-2 bg-success-500 text-white rounded-lg hover:bg-success-600 transition-colors flex items-center gap-2"
            >
                <FontAwesomeIcon icon={faDownload} />
                <span>Export Report</span>
            </button>

            {showMenu && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => setShowMenu(false)}
                    />

                    {/* Menu */}
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-20">
                        <button
                            onClick={() => handleExport("pdf")}
                            className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-3 rounded-t-lg"
                        >
                            <FontAwesomeIcon icon={faFilePdf} className="text-error-500" />
                            <span className="text-gray-700 dark:text-gray-300">PDF Report</span>
                        </button>
                        <button
                            onClick={() => handleExport("json")}
                            className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-3"
                        >
                            <FontAwesomeIcon icon={faFileCode} className="text-primary-500" />
                            <span className="text-gray-700 dark:text-gray-300">JSON Data</span>
                        </button>
                        <button
                            onClick={() => handleExport("txt")}
                            className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-3 rounded-b-lg"
                        >
                            <FontAwesomeIcon icon={faFileAlt} className="text-secondary-500" />
                            <span className="text-gray-700 dark:text-gray-300">Text File</span>
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default ExportButton;
