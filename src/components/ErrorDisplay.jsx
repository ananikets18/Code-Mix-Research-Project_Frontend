import React from "react";

const ErrorDisplay = ({ error }) => {
  if (!error) return null;

  return (
    <div
      className="mt-2 sm:mt-3 md:mt-4 lg:mt-4 xl:mt-4 
              border-2 rounded-lg sm:rounded-lg md:rounded-xl lg:rounded-xl 
              p-3 sm:p-3 md:p-4 lg:p-5 
              bg-error-50 dark:bg-error-900/40 
              border-error-300 dark:border-error-700 
              shadow-sm sm:shadow-md md:shadow-md lg:shadow-lg 
              animate-shake"
    >
      <div className="flex items-start gap-2 sm:gap-3 md:gap-3 lg:gap-4">
        {/* Icon Container */}
        <div className="flex-shrink-0 pt-0.5 sm:pt-0.5 md:pt-1 lg:pt-1">
          <svg
            className="w-4 h-4 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 
                   text-error-600 dark:text-error-400"
            fill="currentColor"
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        </div>

        {/* Content Container */}
        <div className="flex-1 min-w-0">
          <p
            className="text-xs sm:text-xs md:text-sm lg:text-sm 
                    font-semibold 
                    text-error-700 dark:text-error-300
                    leading-tight sm:leading-snug"
          >
            Error
          </p>
          <p
            className="text-xs sm:text-xs md:text-sm lg:text-sm 
                    text-error-600 dark:text-error-400 
                    mt-0.5 sm:mt-1 md:mt-1 lg:mt-1.5
                    leading-relaxed sm:leading-relaxed md:leading-snug
                    break-words"
          >
            {error}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ErrorDisplay;
