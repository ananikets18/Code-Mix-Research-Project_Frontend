import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faPlus,
    faTrash,
    faPlay,
    faDownload,
    faSpinner,
} from "@fortawesome/free-solid-svg-icons";

/**
 * Batch Analysis Component
 * Allows analyzing multiple texts at once
 */
const BatchAnalysis = ({ onAnalyze, loading }) => {
    const [texts, setTexts] = useState([""]);
    const [results, setResults] = useState([]);
    const [analyzing, setAnalyzing] = useState(false);
    const [progress, setProgress] = useState(0);

    const addTextField = () => {
        setTexts([...texts, ""]);
    };

    const removeTextField = (index) => {
        const newTexts = texts.filter((_, i) => i !== index);
        setTexts(newTexts.length > 0 ? newTexts : [""]);
    };

    const updateText = (index, value) => {
        const newTexts = [...texts];
        newTexts[index] = value;
        setTexts(newTexts);
    };

    const handleBatchAnalyze = async () => {
        const validTexts = texts.filter(t => t.trim().length > 0);

        if (validTexts.length === 0) {
            alert("Please enter at least one text to analyze");
            return;
        }

        setAnalyzing(true);
        setResults([]);
        setProgress(0);

        const batchResults = [];

        for (let i = 0; i < validTexts.length; i++) {
            try {
                const result = await onAnalyze(validTexts[i]);
                batchResults.push({
                    text: validTexts[i],
                    result,
                    status: "success",
                });
            } catch (error) {
                batchResults.push({
                    text: validTexts[i],
                    error: error.message,
                    status: "error",
                });
            }

            setProgress(((i + 1) / validTexts.length) * 100);
        }

        setResults(batchResults);
        setAnalyzing(false);
    };

    const exportToCSV = () => {
        const headers = ["Text", "Language", "Sentiment", "Toxicity", "Profanity", "Status"];
        const rows = results.map(r => [
            `"${r.text.replace(/"/g, '""')}"`,
            r.result?.language?.name || "N/A",
            r.result?.sentiment?.label || "N/A",
            r.result?.toxicity ? `${(Math.max(...Object.values(r.result.toxicity)) * 100).toFixed(2)}%` : "N/A",
            r.result?.profanity?.has_profanity ? "Yes" : "No",
            r.status,
        ]);

        const csv = [headers, ...rows].map(row => row.join(",")).join("\n");

        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `batch-analysis-${Date.now()}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const pasteMultiple = async () => {
        try {
            const clipboardText = await navigator.clipboard.readText();
            const lines = clipboardText.split("\n").filter(line => line.trim().length > 0);

            if (lines.length > 0) {
                setTexts(lines);
            }
        } catch (error) {
            alert("Failed to read from clipboard. Please paste manually.");
        }
    };

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                    📊 Batch Analysis
                </h3>
                <div className="flex gap-2">
                    <button
                        onClick={pasteMultiple}
                        className="px-3 py-1.5 text-sm bg-secondary-500 text-white rounded-lg hover:bg-secondary-600 transition-colors"
                    >
                        Paste Multiple
                    </button>
                    <button
                        onClick={addTextField}
                        className="px-3 py-1.5 text-sm bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                    >
                        <FontAwesomeIcon icon={faPlus} className="mr-1" />
                        Add Text
                    </button>
                </div>
            </div>

            {/* Text Input Fields */}
            <div className="space-y-2 max-h-96 overflow-y-auto">
                {texts.map((text, index) => (
                    <div key={index} className="flex gap-2">
                        <textarea
                            value={text}
                            onChange={(e) => updateText(index, e.target.value)}
                            placeholder={`Text ${index + 1}...`}
                            rows={2}
                            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                        />
                        {texts.length > 1 && (
                            <button
                                onClick={() => removeTextField(index)}
                                className="px-3 text-error-500 hover:text-error-600 transition-colors"
                                title="Remove"
                            >
                                <FontAwesomeIcon icon={faTrash} />
                            </button>
                        )}
                    </div>
                ))}
            </div>

            {/* Analyze Button */}
            <button
                onClick={handleBatchAnalyze}
                disabled={analyzing || loading}
                className="w-full px-4 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold rounded-lg hover:from-primary-600 hover:to-secondary-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {analyzing ? (
                    <>
                        <FontAwesomeIcon icon={faSpinner} className="mr-2 animate-spin" />
                        Analyzing... {progress.toFixed(0)}%
                    </>
                ) : (
                    <>
                        <FontAwesomeIcon icon={faPlay} className="mr-2" />
                        Analyze All ({texts.filter(t => t.trim()).length} texts)
                    </>
                )}
            </button>

            {/* Progress Bar */}
            {analyzing && (
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                        className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            )}

            {/* Results */}
            {results.length > 0 && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h4 className="text-lg font-semibold text-gray-800 dark:text-white">
                            Results ({results.length})
                        </h4>
                        <button
                            onClick={exportToCSV}
                            className="px-3 py-1.5 text-sm bg-success-500 text-white rounded-lg hover:bg-success-600 transition-colors"
                        >
                            <FontAwesomeIcon icon={faDownload} className="mr-1" />
                            Export CSV
                        </button>
                    </div>

                    {/* Results Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-gray-100 dark:bg-gray-800">
                                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 dark:text-gray-300 border-b dark:border-gray-700">
                                        #
                                    </th>
                                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 dark:text-gray-300 border-b dark:border-gray-700">
                                        Text
                                    </th>
                                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 dark:text-gray-300 border-b dark:border-gray-700">
                                        Language
                                    </th>
                                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 dark:text-gray-300 border-b dark:border-gray-700">
                                        Sentiment
                                    </th>
                                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 dark:text-gray-300 border-b dark:border-gray-700">
                                        Toxicity
                                    </th>
                                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 dark:text-gray-300 border-b dark:border-gray-700">
                                        Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {results.map((item, index) => (
                                    <tr
                                        key={index}
                                        className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                                    >
                                        <td className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 border-b dark:border-gray-700">
                                            {index + 1}
                                        </td>
                                        <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 border-b dark:border-gray-700 max-w-xs truncate">
                                            {item.text}
                                        </td>
                                        <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 border-b dark:border-gray-700">
                                            {item.result?.language?.name || "N/A"}
                                        </td>
                                        <td className="px-4 py-2 border-b dark:border-gray-700">
                                            {item.result?.sentiment?.label && (
                                                <span
                                                    className={`px-2 py-1 text-xs rounded-full ${item.result.sentiment.label.toLowerCase() === "positive"
                                                            ? "bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-300"
                                                            : item.result.sentiment.label.toLowerCase() === "negative"
                                                                ? "bg-error-100 dark:bg-error-900/30 text-error-700 dark:text-error-300"
                                                                : "bg-warning-100 dark:bg-warning-900/30 text-warning-700 dark:text-warning-300"
                                                        }`}
                                                >
                                                    {item.result.sentiment.label}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 border-b dark:border-gray-700">
                                            {item.result?.toxicity
                                                ? `${(Math.max(...Object.values(item.result.toxicity)) * 100).toFixed(1)}%`
                                                : "N/A"}
                                        </td>
                                        <td className="px-4 py-2 border-b dark:border-gray-700">
                                            <span
                                                className={`px-2 py-1 text-xs rounded-full ${item.status === "success"
                                                        ? "bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-300"
                                                        : "bg-error-100 dark:bg-error-900/30 text-error-700 dark:text-error-300"
                                                    }`}
                                            >
                                                {item.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Summary */}
                    <div className="bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 border border-primary-200 dark:border-primary-700 rounded-lg p-4">
                        <h5 className="font-semibold text-gray-800 dark:text-white mb-2">
                            Summary
                        </h5>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                            <div>
                                <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                                    {results.filter(r => r.status === "success").length}
                                </div>
                                <div className="text-xs text-gray-600 dark:text-gray-400">
                                    Successful
                                </div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-success-600 dark:text-success-400">
                                    {results.filter(r => r.result?.sentiment?.label?.toLowerCase() === "positive").length}
                                </div>
                                <div className="text-xs text-gray-600 dark:text-gray-400">
                                    Positive
                                </div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-error-600 dark:text-error-400">
                                    {results.filter(r => r.result?.sentiment?.label?.toLowerCase() === "negative").length}
                                </div>
                                <div className="text-xs text-gray-600 dark:text-gray-400">
                                    Negative
                                </div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-warning-600 dark:text-warning-400">
                                    {results.filter(r => r.result?.toxicity && Math.max(...Object.values(r.result.toxicity)) > 0.7).length}
                                </div>
                                <div className="text-xs text-gray-600 dark:text-gray-400">
                                    Toxic
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BatchAnalysis;
