import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { faTimes, faStar, faCodeBranch, faCode } from "@fortawesome/free-solid-svg-icons";

const GitHubFloatingModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  // Repository URLs
  const frontendRepo = "https://github.com/ananikets18/Code-Mix-for-social-media---Frontend";
  const backendRepo = "https://github.com/ananikets18/code-mix-social-media-python-backend";

  return (
    <>
      {/* Floating GitHub Icon Button - Fully Responsive */}
      <button
        onClick={toggleModal}
        className="opacity-60 hover:opacity-100 fixed  bottom-3 right-3 xs:bottom-3 xs:right-3 lg:top-5 lg:right-5 z-50 
                   w-9 h-9 xs:w-8 xs:h-8 sm:w-9 sm:h-9 md:w-10 md:h-10
                   bg-gray-900 dark:bg-gray-600 hover:bg-gray-800 dark:hover:bg-gray-700 
                   text-white rounded-full shadow-lg hover:shadow-xl 
                   transform hover:scale-110 transition-all duration-300 
                   group hidden xs:flex items-center justify-center"
        aria-label="View GitHub Repositories"
        title="View GitHub Repositories"
      >
        <FontAwesomeIcon 
          icon={faGithub} 
          className="w-4 h-4 xs:w-5 xs:h-5 sm:w-5 sm:h-5 md:w-6 md:h-6 
                     rounded-full group-hover:rotate-12 transition-transform duration-300" 
        />
      </button>

      {/* Modal Overlay - Fully Responsive */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center 
                     px-3 py-3 xs:px-4 xs:py-4 sm:p-4 md:p-6 
                     bg-black/60 backdrop-blur-sm animate-fade-in"
          onClick={closeModal}
        >
          {/* Modal Content - Optimized for Small Devices */}
          <div
            className="relative w-full 
                       max-w-[96vw] xs:max-w-[92vw] sm:max-w-xl md:max-w-2xl lg:max-w-3xl 
                       bg-white dark:bg-gray-800 
                       rounded-lg sm:rounded-xl md:rounded-2xl 
                       shadow-2xl overflow-hidden overflow-y-auto 
                       max-h-[92vh] xs:max-h-[94vh] sm:max-h-[95vh]
                       transform animate-scale-in mx-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header - Compact on Mobile */}
            <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 
                           dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 
                           p-3 xs:p-4 sm:p-5 md:p-6 
                           relative overflow-hidden">
              {/* Decorative background pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                  backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                  backgroundSize: '32px 32px'
                }}></div>
              </div>

              <div className="relative flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 xs:gap-2.5 sm:gap-3">
                  <div className="p-1.5 xs:p-2 sm:p-2.5 md:p-3 
                                 bg-white/10 rounded-md sm:rounded-lg 
                                 backdrop-blur-sm">
                    <FontAwesomeIcon 
                      icon={faGithub} 
                      className="w-5 h-5 xs:w-6 xs:h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" 
                    />
                  </div>
                  <div>
                    <h2 className="text-base xs:text-lg sm:text-xl md:text-2xl 
                                  font-bold text-white leading-tight">
                      GitHub Repositories
                    </h2>
                    <p className="text-[10px] xs:text-xs sm:text-sm 
                                 text-gray-300 mt-0.5 xs:mt-1">
                      Explore our open-source project
                    </p>
                  </div>
                </div>
                <button
                  onClick={closeModal}
                  className="p-1.5 xs:p-2 hover:bg-white/10 rounded-md sm:rounded-lg 
                            transition-colors flex-shrink-0"
                  aria-label="Close modal"
                >
                  <FontAwesomeIcon 
                    icon={faTimes} 
                    className="w-4 h-4 xs:w-4 xs:h-4 sm:w-5 sm:h-5 text-white" 
                  />
                </button>
              </div>
            </div>

            {/* Body - Responsive Spacing */}
            <div className="p-3 xs:p-4 sm:p-5 md:p-6 space-y-3 xs:space-y-3.5 sm:space-y-4">
              {/* CTA Message - Compact on Mobile */}
              <div className="bg-gradient-to-r from-primary-50 to-secondary-50 
                             dark:from-primary-950/30 dark:to-secondary-950/30 
                             border-l-2 sm:border-l-4 border-primary-500 
                             p-2.5 xs:p-3 sm:p-3.5 md:p-4 
                             rounded-md sm:rounded-lg">
                <p className="text-[11px] xs:text-xs sm:text-sm md:text-base 
                             text-gray-800 dark:text-gray-600 font-medium 
                             leading-relaxed">
                  ⭐ <strong>Love this project?</strong> Give us a star on GitHub and help us grow! Your support means everything to our open-source community.
                </p>
              </div>

              {/* Repository Cards - Mobile Optimized */}
              <div className="space-y-2.5 xs:space-y-3">
                {/* Frontend Repository */}
                <a
                  href={frontendRepo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block group"
                >
                  <div className="p-3 xs:p-3.5 sm:p-4 
                                 border-2 border-gray-200 dark:border-gray-700 
                                 rounded-lg sm:rounded-xl 
                                 hover:border-primary-500 dark:hover:border-primary-500 
                                 hover:shadow-lg transition-all duration-300 
                                 bg-gradient-to-br from-white to-gray-50 
                                 dark:from-gray-800 dark:to-gray-850">
                    <div className="flex items-start justify-between gap-2 xs:gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 xs:gap-2 mb-1.5 xs:mb-2">
                          <FontAwesomeIcon 
                            icon={faCode} 
                            className="text-primary-600 dark:text-primary-400 
                                      w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4 flex-shrink-0" 
                          />
                          <h3 className="text-sm xs:text-base sm:text-lg 
                                       font-bold text-gray-900 dark:text-white 
                                       group-hover:text-primary-600 dark:group-hover:text-primary-400 
                                       transition-colors leading-tight truncate">
                            Frontend Repository
                          </h3>
                        </div>
                        <p className="text-[10px] xs:text-xs sm:text-sm 
                                     text-gray-600 dark:text-gray-400 
                                     mb-2 xs:mb-2.5 sm:mb-3 
                                     leading-relaxed line-clamp-2">
                          React + TailwindCSS frontend for the multilingual NLP analysis system
                        </p>
                        <div className="flex flex-wrap gap-1.5 xs:gap-2">
                          <span className="inline-flex items-center gap-1 
                                         px-1.5 xs:px-2 py-0.5 xs:py-1 
                                         bg-blue-100 dark:bg-blue-900/30 
                                         text-blue-700 dark:text-blue-300 
                                         rounded text-[9px] xs:text-[10px] sm:text-xs 
                                         font-medium">
                            <FontAwesomeIcon icon={faCode} className="w-2 h-2 xs:w-2.5 xs:h-2.5 sm:w-3 sm:h-3" />
                            React
                          </span>
                          <span className="inline-flex items-center gap-1 
                                         px-1.5 xs:px-2 py-0.5 xs:py-1 
                                         bg-cyan-100 dark:bg-cyan-900/30 
                                         text-cyan-700 dark:text-cyan-300 
                                         rounded text-[9px] xs:text-[10px] sm:text-xs 
                                         font-medium">
                            <FontAwesomeIcon icon={faCode} className="w-2 h-2 xs:w-2.5 xs:h-2.5 sm:w-3 sm:h-3" />
                            TailwindCSS
                          </span>
                        </div>
                      </div>
                      <div className="ml-2 xs:ml-3 sm:ml-4 flex-shrink-0">
                        <div className="p-1.5 xs:p-2 
                                       bg-gray-100 dark:bg-gray-700 
                                       rounded-md sm:rounded-lg 
                                       group-hover:bg-primary-100 dark:group-hover:bg-primary-900/30 
                                       transition-colors">
                          <svg className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-5 sm:h-5 
                                        text-gray-600 dark:text-gray-400 
                                        group-hover:text-primary-600 dark:group-hover:text-primary-400" 
                               fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </a>

                {/* Backend Repository */}
                <a
                  href={backendRepo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block group"
                >
                  <div className="p-3 xs:p-3.5 sm:p-4 
                                 border-2 border-gray-200 dark:border-gray-700 
                                 rounded-lg sm:rounded-xl 
                                 hover:border-secondary-500 dark:hover:border-secondary-500 
                                 hover:shadow-lg transition-all duration-300 
                                 bg-gradient-to-br from-white to-gray-50 
                                 dark:from-gray-800 dark:to-gray-850">
                    <div className="flex items-start justify-between gap-2 xs:gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 xs:gap-2 mb-1.5 xs:mb-2">
                          <FontAwesomeIcon 
                            icon={faCodeBranch} 
                            className="text-secondary-600 dark:text-secondary-400 
                                      w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4 flex-shrink-0" 
                          />
                          <h3 className="text-sm xs:text-base sm:text-lg 
                                       font-bold text-gray-900 dark:text-white 
                                       group-hover:text-secondary-600 dark:group-hover:text-secondary-400 
                                       transition-colors leading-tight truncate">
                            Backend Repository
                          </h3>
                        </div>
                        <p className="text-[10px] xs:text-xs sm:text-sm 
                                     text-gray-600 dark:text-gray-400 
                                     mb-2 xs:mb-2.5 sm:mb-3 
                                     leading-relaxed line-clamp-2">
                          Python FastAPI backend with transformer models for NLP analysis
                        </p>
                        <div className="flex flex-wrap gap-1.5 xs:gap-2">
                          <span className="inline-flex items-center gap-1 
                                         px-1.5 xs:px-2 py-0.5 xs:py-1 
                                         bg-yellow-100 dark:bg-yellow-900/30 
                                         text-yellow-700 dark:text-yellow-300 
                                         rounded text-[9px] xs:text-[10px] sm:text-xs 
                                         font-medium">
                            <FontAwesomeIcon icon={faCode} className="w-2 h-2 xs:w-2.5 xs:h-2.5 sm:w-3 sm:h-3" />
                            Python
                          </span>
                          <span className="inline-flex items-center gap-1 
                                         px-1.5 xs:px-2 py-0.5 xs:py-1 
                                         bg-green-100 dark:bg-green-900/30 
                                         text-green-700 dark:text-green-300 
                                         rounded text-[9px] xs:text-[10px] sm:text-xs 
                                         font-medium">
                            <FontAwesomeIcon icon={faCodeBranch} className="w-2 h-2 xs:w-2.5 xs:h-2.5 sm:w-3 sm:h-3" />
                            FastAPI
                          </span>
                          <span className="inline-flex items-center gap-1 
                                         px-1.5 xs:px-2 py-0.5 xs:py-1 
                                         bg-purple-100 dark:bg-purple-900/30 
                                         text-purple-700 dark:text-purple-300 
                                         rounded text-[9px] xs:text-[10px] sm:text-xs 
                                         font-medium">
                            🤖
                            <span className="hidden xs:inline">AI/ML</span>
                            <span className="xs:hidden">ML</span>
                          </span>
                        </div>
                      </div>
                      <div className="ml-2 xs:ml-3 sm:ml-4 flex-shrink-0">
                        <div className="p-1.5 xs:p-2 
                                       bg-gray-100 dark:bg-gray-700 
                                       rounded-md sm:rounded-lg 
                                       group-hover:bg-secondary-100 dark:group-hover:bg-secondary-900/30 
                                       transition-colors">
                          <svg className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-5 sm:h-5 
                                        text-gray-600 dark:text-gray-400 
                                        group-hover:text-secondary-600 dark:group-hover:text-secondary-400" 
                               fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </a>
              </div>

              {/* Action Buttons - Responsive */}
              <div className="flex flex-col xs:flex-row gap-2 xs:gap-2.5 sm:gap-3 pt-1 xs:pt-1.5 sm:pt-2">
                <a
                  href={frontendRepo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-1.5 xs:gap-2 
                            px-3 xs:px-4 py-2 xs:py-2.5 sm:py-3 
                            bg-gray-900 hover:bg-gray-800 
                            dark:bg-gray-700 dark:hover:bg-gray-600 
                            text-white rounded-md sm:rounded-lg 
                            text-xs xs:text-sm sm:text-base 
                            font-semibold transition-all hover:shadow-lg 
                            transform hover:scale-105 active:scale-95"
                >
                  <FontAwesomeIcon icon={faStar} className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4" />
                  <span>Star Frontend</span>
                </a>
                <a
                  href={backendRepo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-1.5 xs:gap-2 
                            px-3 xs:px-4 py-2 xs:py-2.5 sm:py-3 
                            bg-gray-900 hover:bg-gray-800 
                            dark:bg-gray-700 dark:hover:bg-gray-600 
                            text-white rounded-md sm:rounded-lg 
                            text-xs xs:text-sm sm:text-base 
                            font-semibold transition-all hover:shadow-lg 
                            transform hover:scale-105 active:scale-95"
                >
                  <FontAwesomeIcon icon={faStar} className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4" />
                  <span>Star Backend</span>
                </a>
              </div>

              {/* Footer Note - Responsive */}
              <div className="text-center pt-1 xs:pt-1.5 sm:pt-2">
                <p className="text-[9px] xs:text-[10px] sm:text-xs 
                             text-gray-500 dark:text-gray-400 
                             leading-relaxed">
                  Built with ❤️ by NMITD College Research Team
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Animations */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }

        .animate-scale-in {
          animation: scale-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
      `}</style>
    </>
  );
};

export default GitHubFloatingModal;
