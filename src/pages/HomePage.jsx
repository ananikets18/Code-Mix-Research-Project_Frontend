import React, { useState, lazy, useEffect, useRef } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import NetworkStatus from "../components/NetworkStatus";
import LoadingOverlay from "../components/LoadingOverlay";
import InfoBanner from "../components/InfoBanner";
import GitHubFloatingModal from "../components/GitHubFloatingModal";
import InputSection from "../components/InputSection";
import QuickPreviewPanel from "../components/QuickPreviewPanel";
import ResultsSection from "../components/ResultsSection";
import AnalysisHistory from "../components/AnalysisHistory";
import { useAnalyzeText, useTranslateText } from "../hooks/useApiCalls";
import useKeyboardShortcuts, { KeyboardShortcutsButton } from "../hooks/useKeyboardShortcuts";
import { useToast } from "../context/ToastContext";
import Analytics from "../utils/analytics";
import { ErrorTracking } from "../utils/errorTracking";
import {
  CompactModeStorage,
  LanguageStorage,
  CacheStorage,
} from "../utils/storage";
import { exampleTexts } from "../data/exampleTexts";
import { saveToHistory } from "../utils/analysisHistory";

// Lazy load heavy components
const AnalyzeResults = lazy(() => import("../components/AnalyzeResults"));
const TranslateResults = lazy(() => import("../components/TranslateResults"));

/**
 * HomePage Component
 * Main page for text analysis and translation
 */
function HomePage() {
  // State management
  const [text, setText] = useState("");
  const [activeTab, setActiveTab] = useState("analyze");
  const [compactMode, setCompactMode] = useState(false);
  const [targetLang, setTargetLang] = useState("hi");
  const [sourceLang, setSourceLang] = useState("auto");
  const [showHistory, setShowHistory] = useState(false);

  // Refs
  const textInputRef = useRef(null);

  // Toast notifications
  const { success, error: showError, info } = useToast();

  // Custom hooks for API calls
  const analyzeApi = useAnalyzeText();
  const translateApi = useTranslateText();

  // Determine which API is active based on tab
  const activeApi = activeTab === "analyze" ? analyzeApi : translateApi;
  const { loading, result, error } = activeApi;

  // Loading message based on active tab
  const loadingMessage =
    activeTab === "analyze" ? "Analyzing text..." : "Translating text...";
  const loadingSubMessage =
    activeTab === "analyze"
      ? "Running language detection, sentiment analysis, and safety checks..."
      : "Translating your text to the selected language...";

  // Load preferences from storage on mount
  useEffect(() => {
    const savedCompactMode = CompactModeStorage.get();
    const savedLanguages = LanguageStorage.get();

    setCompactMode(savedCompactMode);
    setSourceLang(savedLanguages.source);
    setTargetLang(savedLanguages.target);

    // Clean expired cache on mount
    CacheStorage.cleanExpired();
  }, []);

  // Save preferences when they change
  useEffect(() => {
    CompactModeStorage.set(compactMode);
  }, [compactMode]);

  useEffect(() => {
    LanguageStorage.set(sourceLang, targetLang);
  }, [sourceLang, targetLang]);

  // Save to history when result changes
  useEffect(() => {
    if (result && text) {
      const historyItem = {
        ...result,
        original_text: text,
        type: activeTab,
      };
      saveToHistory(historyItem);
    }
  }, [result, text, activeTab]);

  // Handle form submission
  const handleSubmit = () => {
    // Check internet connection
    if (!navigator.onLine) {
      Analytics.networkError();
      ErrorTracking.networkError(new Error("No internet connection"));
      return;
    }

    // Validation
    const trimmedText = text.trim();

    if (!trimmedText) {
      Analytics.validationError("empty_text");
      return;
    }

    if (trimmedText.length < 2) {
      Analytics.validationError("text_too_short");
      return;
    }

    if (trimmedText.length > 5000) {
      Analytics.validationError("text_too_long");
      return;
    }

    // Proceed with submission
    if (activeTab === "analyze") {
      analyzeApi.analyzeText(trimmedText, compactMode);
    } else if (activeTab === "translate") {
      translateApi.translateText(trimmedText, sourceLang, targetLang);
    }
  };

  // Handle tab switch with analytics
  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
    // Clear results and errors when switching tabs
    analyzeApi.clearResults();
    translateApi.clearResults();
    Analytics.switchTab(tab);
    ErrorTracking.userAction("tab_switch", { tab });
  };

  // Handle compact mode toggle with analytics
  const handleCompactModeToggle = (enabled) => {
    setCompactMode(enabled);
    Analytics.toggleCompactMode(enabled);
  };

  // Handle history item selection
  const handleHistorySelect = (item) => {
    setText(item.text);
    setActiveTab(item.type);
    setShowHistory(false);
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
    info('History item loaded');
  };

  // Keyboard shortcuts
  const shortcuts = [
    {
      key: 'Enter',
      ctrl: true,
      description: 'Submit analysis',
      action: () => {
        if (text.trim()) {
          handleSubmit();
        }
      },
    },
    {
      key: 'k',
      ctrl: true,
      description: 'Focus text input',
      action: () => {
        textInputRef.current?.focus();
      },
    },
    {
      key: 'h',
      ctrl: true,
      description: 'Toggle history',
      action: () => setShowHistory(!showHistory),
    },
    {
      key: 'Escape',
      description: 'Clear text',
      action: () => {
        setText('');
        info('Text cleared');
      },
    },
    {
      key: '1',
      ctrl: true,
      description: 'Switch to Analyze tab',
      action: () => handleTabSwitch('analyze'),
    },
    {
      key: '2',
      ctrl: true,
      description: 'Switch to Translate tab',
      action: () => handleTabSwitch('translate'),
    },
  ];

  useKeyboardShortcuts(shortcuts);

  return (
    <div className="min-h-screen bg-gradient-light dark:bg-gradient-dark text-gray-900 dark:text-white transition-colors duration-300">
      {/* GitHub Floating Modal */}
      <GitHubFloatingModal />

      {/* Network Status Notification */}
      <NetworkStatus />

      {/* Loading Overlay */}
      <LoadingOverlay
        isLoading={loading}
        message={loadingMessage}
        subMessage={loadingSubMessage}
      />

      <Header />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
        <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
          {/* Top Section - Input Area */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Left: Input and Options - Takes 2 columns */}
            <InputSection
              activeTab={activeTab}
              handleTabSwitch={handleTabSwitch}
              text={text}
              setText={setText}
              exampleTexts={exampleTexts}
              sourceLang={sourceLang}
              setSourceLang={setSourceLang}
              targetLang={targetLang}
              setTargetLang={setTargetLang}
              loading={loading}
              handleSubmit={handleSubmit}
              error={error}
              compactMode={compactMode}
              handleCompactModeToggle={handleCompactModeToggle}
              textInputRef={textInputRef}
            />

            {/* Right: Quick Preview - Takes 1 column */}
            <div className="space-y-4 sm:space-y-6">
              {/* Quick Preview Panel */}
              <div className="bg-white dark:bg-gray-800/90 border border-gray-200 dark:border-gray-700 shadow-card-lg hover:shadow-card-xl transition-shadow duration-300 rounded-xl p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
                  <span className="text-xl sm:text-2xl">📊</span>
                  Quick Preview
                </h3>

                <QuickPreviewPanel
                  result={result}
                  loading={loading}
                  activeTab={activeTab}
                />
              </div>

              {/* Analysis History Panel */}
              <div className="bg-white dark:bg-gray-800/90 border border-gray-200 dark:border-gray-700 shadow-card-lg hover:shadow-card-xl transition-shadow duration-300 rounded-xl p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <span className="text-xl sm:text-2xl">📜</span>
                    History
                  </h3>
                  <button
                    onClick={() => setShowHistory(!showHistory)}
                    className="px-3 py-1.5 text-sm font-medium bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-all shadow-sm hover:shadow-md"
                  >
                    {showHistory ? 'Hide' : 'Show'}
                  </button>
                </div>

                {showHistory && (
                  <AnalysisHistory onSelectItem={handleHistorySelect} />
                )}
              </div>
            </div>
          </div>

          {/* Bottom Section - Full Results (Full Width) */}
          <ResultsSection
            result={result}
            activeTab={activeTab}
            AnalyzeResults={AnalyzeResults}
            TranslateResults={TranslateResults}
            compactMode={compactMode}
          />
        </div>
      </main>

      <Footer />
      {/* Info Banner */}
      <InfoBanner />
      {/* Keyboard Shortcuts */}
      <KeyboardShortcutsButton shortcuts={shortcuts} />
    </div>
  );
}

export default HomePage;
