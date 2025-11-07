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
      {/* Floating GitHub Icon Button - Top Right */}
      <button
        onClick={toggleModal}
        className="opacity-70 hover:opacity-100 fixed top-4 right-4 z-50 w-9 h-9 bg-gray-900 dark:bg-gray-600 hover:bg-gray-800 dark:hover:bg-gray-700 text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 group flex items-center justify-center"
        aria-label="View GitHub Repositories"
        title="View GitHub Repositories"
      >
        <FontAwesomeIcon 
          icon={faGithub} 
          className="w-6 h-6 rounded-full group-hover:rotate-12 transition-transform duration-300" 
        />
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
          onClick={closeModal}
        >
          {/* Modal Content */}
          <div
            className="relative w-full max-w-2xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden transform animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 p-6 relative overflow-hidden">
              {/* Decorative background pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                  backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                  backgroundSize: '32px 32px'
                }}></div>
              </div>

              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                    <FontAwesomeIcon icon={faGithub} className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">GitHub Repositories</h2>
                    <p className="text-sm text-gray-300 mt-1">Explore our open-source project</p>
                  </div>
                </div>
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  aria-label="Close modal"
                >
                  <FontAwesomeIcon icon={faTimes} className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4">
              {/* CTA Message */}
              <div className="bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-950/30 dark:to-secondary-950/30 border-l-4 border-primary-500 p-4 rounded-lg">
                <p className="text-sm md:text-base text-gray-800 dark:text-gray-600 font-medium">
                  ⭐ <strong>Love this project?</strong> Give us a star on GitHub and help us grow! Your support means everything to our open-source community.
                </p>
              </div>

              {/* Repository Cards */}
              <div className="space-y-3">
                {/* Frontend Repository */}
                <a
                  href={frontendRepo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block group"
                >
                  <div className="p-4 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-primary-500 dark:hover:border-primary-500 hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-850">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <FontAwesomeIcon icon={faCode} className="text-primary-600 dark:text-primary-400" />
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                            Frontend Repository
                          </h3>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                          React + TailwindCSS frontend for the multilingual NLP analysis system
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-md text-xs font-medium">
                            <FontAwesomeIcon icon={faCode} className="w-3 h-3" />
                            React
                          </span>
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 rounded-md text-xs font-medium">
                            <FontAwesomeIcon icon={faCode} className="w-3 h-3" />
                            TailwindCSS
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg group-hover:bg-primary-100 dark:group-hover:bg-primary-900/30 transition-colors">
                          <svg className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
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
                  <div className="p-4 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-secondary-500 dark:hover:border-secondary-500 hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-850">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <FontAwesomeIcon icon={faCodeBranch} className="text-secondary-600 dark:text-secondary-400" />
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-secondary-600 dark:group-hover:text-secondary-400 transition-colors">
                            Backend Repository
                          </h3>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                          Python FastAPI backend with transformer models for NLP analysis
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 rounded-md text-xs font-medium">
                            <FontAwesomeIcon icon={faCode} className="w-3 h-3" />
                            Python
                          </span>
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-md text-xs font-medium">
                            <FontAwesomeIcon icon={faCodeBranch} className="w-3 h-3" />
                            FastAPI
                          </span>
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-md text-xs font-medium">
                            🤖
                            AI/ML
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg group-hover:bg-secondary-100 dark:group-hover:bg-secondary-900/30 transition-colors">
                          <svg className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-secondary-600 dark:group-hover:text-secondary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </a>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <a
                  href={frontendRepo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-900 hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 text-white rounded-lg font-semibold transition-all hover:shadow-lg transform hover:scale-105"
                >
                  <FontAwesomeIcon icon={faStar} className="w-4 h-4" />
                  Star Frontend
                </a>
                <a
                  href={backendRepo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-900 hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 text-white rounded-lg font-semibold transition-all hover:shadow-lg transform hover:scale-105"
                >
                  <FontAwesomeIcon icon={faStar} className="w-4 h-4" />
                  Star Backend
                </a>
              </div>

              {/* Footer Note */}
              <div className="text-center pt-2">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Built with ❤️ by NMITD College Research Team
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add animations to index.css if not already present */}
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
            transform: scale(0.95);
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
          animation: scale-in 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default GitHubFloatingModal;
