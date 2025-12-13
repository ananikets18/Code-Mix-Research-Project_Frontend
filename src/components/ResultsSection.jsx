import React, { Suspense } from "react";
import ExportButton from "./ExportButton";

/**
 * Results Section Component
 * Displays the full analysis or translation results
 */
const ResultsSection = ({ result, activeTab, AnalyzeResults, TranslateResults, compactMode, originalText }) => {
    if (!result) return null;

    return (
        <div
            id="results-section"
            className="scroll-mt-4 sm:scroll-mt-5 md:scroll-mt-6"
        >
            <div
                className="bg-white dark:bg-gray-800/90 
          border border-gray-200 dark:border-gray-700 
          shadow-md sm:shadow-lg md:shadow-xl 
          rounded-lg sm:rounded-xl md:rounded-2xl
          p-3 sm:p-4 md:p-6 lg:p-7 xl:p-8"
            >
                <div className="flex items-center justify-between mb-4 sm:mb-5 md:mb-6 lg:mb-7">
                    <h2
                        className="font-bold 
           text-gray-800 dark:text-gray-200 
           flex items-center 
           gap-2 sm:gap-2.5 md:gap-3 lg:gap-3
           text-lg sm:text-xl md:text-2xl lg:text-2xl xl:text-3xl"
                    >
                        <span
                            className="text-2xl sm:text-2xl md:text-3xl lg:text-3xl xl:text-4xl 
               flex-shrink-0"
                            aria-hidden="true"
                        >
                            📋
                        </span>
                        <span className="leading-tight sm:leading-snug">
                            Detailed Analysis Results
                        </span>
                    </h2>
                    <ExportButton result={result} originalText={originalText} />
                </div>

                <Suspense
                    fallback={
                        <div
                            className="flex justify-center items-center 
              py-8 sm:py-10 md:py-12 lg:py-14"
                        >
                            <div
                                className="animate-spin rounded-full 
                border-b-2 
                border-primary-600 dark:border-primary-400
                w-8 h-8 
                sm:w-10 sm:h-10 
                md:w-12 md:h-12 
                lg:w-14 lg:h-14"
                                role="status"
                                aria-label="Loading results"
                            ></div>
                        </div>
                    }
                >
                    {activeTab === "analyze" && (
                        <AnalyzeResults result={result} compactMode={compactMode} />
                    )}
                    {activeTab === "translate" && <TranslateResults result={result} />}
                </Suspense>
            </div>
        </div>
    );
};

export default ResultsSection;
