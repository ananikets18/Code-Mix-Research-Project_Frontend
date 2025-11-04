import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import TabNavigation from './components/TabNavigation';
import TextInput from './components/TextInput';
import AnalyzeOptions from './components/AnalyzeOptions';
import TranslateOptions from './components/TranslateOptions';
import SubmitButton from './components/SubmitButton';
import ErrorDisplay from './components/ErrorDisplay';
// import FeaturesList from './components/FeaturesList';
import ResultsPanel from './components/ResultsPanel';

const API_BASE_URL = 'http://localhost:8000';

function App() {
  // State management
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('analyze');
  const [compactMode, setCompactMode] = useState(false);
  const [targetLang, setTargetLang] = useState('hi');
  const [sourceLang, setSourceLang] = useState('auto');

  // Example texts for quick testing
  const exampleTexts = {
    english: "Hello! How are you doing today? I hope you're having a wonderful day!",
    hindi: "नमस्ते! आप कैसे हैं? मुझे आशा है कि आपका दिन अच्छा जा रहा है!",
    profane: "This is a test with some inappropriate language that should be detected.",
    mixed: "आज मैं very happy हूँ क्योंकि today is a beautiful day!"
  };

  // API Functions
  const analyzeText = async () => {
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await axios.post(`${API_BASE_URL}/analyze`, {
        text,
        compact_mode: compactMode
      });
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'An error occurred during analysis');
    } finally {
      setLoading(false);
    }
  };

  const translateText = async () => {
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await axios.post(`${API_BASE_URL}/translate`, {
        text,
        source_lang: sourceLang,
        target_lang: targetLang
      });
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'An error occurred during translation');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    if (!text.trim()) {
      setError('Please enter some text');
      return;
    }

    if (activeTab === 'analyze') {
      analyzeText();
    } else if (activeTab === 'translate') {
      translateText();
    }
  };

  return (
    <div className="min-h-screen transition-colors bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Input Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tab Navigation */}
            <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

            {/* Text Input */}
            <TextInput text={text} setText={setText} exampleTexts={exampleTexts} />

            {/* Options Section */}
            <div className="rounded-lg shadow-lg p-6 transition-colors bg-white">
              <h3 className="text-lg font-semibold mb-4 transition-colors text-gray-900">⚙️ Options</h3>
              
              {activeTab === 'analyze' && (
                <AnalyzeOptions compactMode={compactMode} setCompactMode={setCompactMode} />
              )}
              
              {activeTab === 'translate' && (
                <TranslateOptions 
                  sourceLang={sourceLang}
                  setSourceLang={setSourceLang}
                  targetLang={targetLang}
                  setTargetLang={setTargetLang}
                />
              )}
            </div>

            {/* Submit Button */}
            <SubmitButton 
              loading={loading}
              activeTab={activeTab}
              text={text}
              handleSubmit={handleSubmit}
            />

            {/* Error Display */}
            <ErrorDisplay error={error} />
          </div>

          {/* Right Column - Results & Features */}
          <div className="space-y-6">

            {/* Results Panel */}
            <ResultsPanel 
              result={result}
              loading={loading}
              activeTab={activeTab}
              compactMode={compactMode}
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default App;
