import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";

const InfoBanner = () => {
  return (
    <div className="bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-600 text-white shadow-lg relative overflow-hidden px-4 py-1.5 sm:px-6 sm:py-2">
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')]"></div>
      </div>

      {/* Centered content */}
      <div className="relative flex items-center justify-center w-full z-10">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 w-full max-w-4xl">
          <p className="text-xs sm:text-sm md:text-base font-medium flex items-center justify-center gap-1.5 text-center flex-wrap">
            <span className="hidden sm:inline">🚀</span>
            <span className="whitespace-nowrap">
              Curious how it all works? Dive into the code and see the magic on
              our at 
            </span>
            <a
              href="https://github.com/ananikets18/Code-Mix-for-social-media---Frontend"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-white/20 hover:bg-white/30 rounded-md font-semibold transition-all hover:scale-105 backdrop-blur-sm border border-white/30 whitespace-nowrap text-xs sm:text-sm"
            >
              <FontAwesomeIcon icon={faGithub} className="w-4 h-4" />
              <span>GitHub Repo</span>
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default InfoBanner;
