import React from "react";
import DigitalOceanLogo from "../DigitalOcean.svg";

const Footer = () => {
  return (
    <footer className="mt-12 pb-10 border-t-2 border-t-gray-300 dark:border-t-gray-700 pt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center text-gray-500 dark:text-gray-400 space-y-2">
          {/* DigitalOcean Logo section */}
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 py-2">
            <img
              src={DigitalOceanLogo}
              alt="DigitalOcean"
              className="h-10 sm:h-12 md:h-14 lg:h-16 w-auto"
              title="DigitalOcean"
            />
            <p className="text-sm sm:text-base md:text-lg font-semibold text-gray-600 dark:text-gray-400 text-left">
              Backend infrastructure running <br className="hidden sm:inline"></br> on DigitalOcean
            </p>
          </div>

          {/* Title with responsive font size */}
          {/* <p className="text-sm md:text-base font-semibold">
            Multilingual NLP Analysis System v1.0.0
          </p> */}

          {/* API info with DigitalOcean url */}
          <p className="text-xs md:text-sm">
            API running on{" "}
            <code className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 text-primary-600 dark:text-primary-400 border border-gray-300 dark:border-gray-700 break-words">
              159-89-161-139.nip.io
            </code>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
