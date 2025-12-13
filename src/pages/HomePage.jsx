import React, { useState, lazy, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import NetworkStatus from "../components/NetworkStatus";
import LoadingOverlay from "../components/LoadingOverlay";
import InfoBanner from "../components/InfoBanner";
import GitHubFloatingModal from "../components/GitHubFloatingModal";
import InputSection from "../components/InputSection";
import QuickPreviewPanel from "../components/QuickPreviewPanel";
import ResultsSection from "../components/ResultsSection";
import Modal from "../components/Modal";
import ToolsMenu from "../components/ToolsMenu";
import AnalysisHistory from "../components/AnalysisHistory";
import BatchAnalysis from "../components/BatchAnalysis";
import StatisticsDashboard from "../components/StatisticsDashboard";
import ExportButton from "../components/ExportButton";
import { useAnalyzeText, useTranslateText } from "../hooks/useApiCalls";
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

  // Modal states
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);

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
    setShowHistoryModal(false);
    // Auto-switch to correct tab
    if (item.type) {
      setActiveTab(item.type);
    }
  };

  // Handle batch analysis
  const handleBatchAnalyze = async (text) => {
    return await analyzeApi.analyzeText(text, false);
  };

  // Save to history when result changes
  useEffect(() => {
    if (result && text) {
      saveToHistory({
        ...result,
        original_text: text,
        type: activeTab,
      });
    }
  }, [result, text, activeTab]);


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

      {/* Tools Menu - Floating Button */}
      <div className="fixed top-20 right-4 z-40">
        <ToolsMenu
          onOpenHistory={() => setShowHistoryModal(true)}
          onOpenBatch={() => setShowBatchModal(true)}
          onOpenStats={() => setShowStatsModal(true)}
        />
      </div>

      {/* Modals */}
      <Modal
        isOpen={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
        title="📜 Analysis History"
        size="xlarge"
      >
        <AnalysisHistory onSelectItem={handleHistorySelect} />
      </Modal>

      <Modal
        isOpen={showBatchModal}
        onClose={() => setShowBatchModal(false)}
        title="📊 Batch Analysis"
        size="xlarge"
      >
        <BatchAnalysis onAnalyze={handleBatchAnalyze} loading={loading} />
      </Modal>

      <Modal
        isOpen={showStatsModal}
        onClose={() => setShowStatsModal(false)}
        title="📈 Statistics Dashboard"
        size="xlarge"
      >
        <StatisticsDashboard />
      </Modal>

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
            />

            {/* Right: Quick Preview - Takes 1 column */}
            <div className="space-y-4 sm:space-y-6">
              <div className="bg-white dark:bg-gray-800/90 border border-gray-200 dark:border-gray-700 shadow-lg rounded-xl p-4 sm:p-6 lg:sticky lg:top-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200 flex items-center gap-2">
                  <span className="text-xl">📊</span>
                  Quick Preview
                </h3>

                <QuickPreviewPanel
                  result={result}
                  loading={loading}
                  activeTab={activeTab}
                />
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
            originalText={text}
          />
        </div>
      </main>

      <Footer />
      {/* Info Banner */}
      <InfoBanner />
    </div>
  );
}

export default HomePage;
