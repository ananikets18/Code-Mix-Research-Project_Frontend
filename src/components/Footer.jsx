import React from "react";
import AzureLogo from "../Azure.svg";

const Footer = () => {
  return (
    <footer className="mt-12 pb-10 border-t-2 border-t-gray-300 dark:border-t-gray-700 pt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center text-gray-500 dark:text-gray-400 space-y-2">
          {/* Azure Logo section */}
          <div className="flex items-center gap-3 py-2">
            <img
              src={AzureLogo}
              alt="Microsoft Azure"
              className="h-8 md:h-10 w-auto"
              title="Microsoft Azure"
            />
            <p className="text-sm md:text-base font-semibold text-gray-500 dark:text-gray-500">
              Backend infrastructure running <br></br> on Microsoft Azure
            </p>
          </div>

          {/* Title with responsive font size */}
          {/* <p className="text-sm md:text-base font-semibold">
            Multilingual NLP Analysis System v1.0.0
          </p> */}

          {/* API info with Microsoft Azure url */}
          <p className="text-xs md:text-sm">
            API running on{" "}
            <code className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 text-primary-600 dark:text-primary-400 border border-gray-300 dark:border-gray-700 break-words">
              thequoteshub.info
            </code>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
