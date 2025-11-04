import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('analyze');
  const [compactMode, setCompactMode] = useState(false);
  
  // Translation state
  const [targetLang, setTargetLang] = useState('en');
  const [sourceLang, setSourceLang] = useState('auto');
  
  // Conversion state
  const [conversionLang, setConversionLang] = useState('hin');
  const [preserveEnglish, setPreserveEnglish] = useState(true);

  // Dark mode state
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  // Text-to-speech state
  const [speaking, setSpeaking] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);

  const API_BASE_URL = 'http://localhost:8000';

  // Check if speech synthesis is supported
  useEffect(() => {
    if ('speechSynthesis' in window) {
      setSpeechSupported(true);
    }
  }, []);

  // Apply dark mode
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Text-to-speech function
  const speakText = (textToSpeak, lang = 'en-US') => {
    if (!speechSupported) {
      alert('Text-to-speech is not supported in your browser');
      return;
    }

    // Stop any ongoing speech
    window.speechSynthesis.cancel();

    if (speaking) {
      setSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    
    // Set language based on detected language or parameter
    const langMap = {
      'en': 'en-US',
      'hi': 'hi-IN',
      'mr': 'mr-IN',
      'bn': 'bn-IN',
      'ta': 'ta-IN',
      'te': 'te-IN',
      'pa': 'pa-IN',
      'hin': 'hi-IN',
      'mar': 'mr-IN',
      'ben': 'bn-IN',
      'tam': 'ta-IN',
      'tel': 'te-IN',
      'pan': 'pa-IN'
    };

    utterance.lang = langMap[lang] || 'en-US';
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => {
      setSpeaking(false);
      console.error('Speech synthesis error');
    };

    window.speechSynthesis.speak(utterance);
  };

  // Stop speech
  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setSpeaking(false);
  };

  const analyzeText = async () => {
    if (!text.trim()) {
      setError('Please enter some text to analyze');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await axios.post(`${API_BASE_URL}/analyze`, {
        text: text,
        normalization_level: null,
        preserve_emojis: true,
        punctuation_mode: 'preserve',
        check_profanity: true,
        detect_domains: true,
        compact: compactMode
      });
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to analyze text. Make sure the API is running on port 8000.');
    } finally {
      setLoading(false);
    }
  };

  const translateText = async () => {
    if (!text.trim()) {
      setError('Please enter some text to translate');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await axios.post(`${API_BASE_URL}/translate`, {
        text: text,
        target_lang: targetLang,
        source_lang: sourceLang
      });
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Translation failed');
    } finally {
      setLoading(false);
    }
  };

  const convertText = async () => {
    if (!text.trim()) {
      setError('Please enter romanized text to convert');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await axios.post(`${API_BASE_URL}/convert`, {
        text: text,
        language: conversionLang,
        preserve_english: preserveEnglish
      });
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Conversion failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    switch (activeTab) {
      case 'analyze':
        analyzeText();
        break;
      case 'translate':
        translateText();
        break;
      case 'convert':
        convertText();
        break;
      default:
        analyzeText();
    }
  };

  const exampleTexts = {
    english: "This is a wonderful product. I highly recommend it to everyone!",
    hinglish: "Yaar ye movie bahut mast hai! Must watch bro, ekdum zabardast!",
    romanized: "aaj mausam bahut acha hai",
    profanity: "This fucking product is terrible!",
    marathi: "आज हवामान खूप छान आहे"
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
        : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
    }`}>
      {/* Header */}
      <header className={`shadow-md transition-colors duration-300 ${
        darkMode ? 'bg-gray-800 border-b border-gray-700' : 'bg-white'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className={`text-3xl font-bold transition-colors ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                🌐 Multilingual NLP Analyzer
              </h1>
              <p className={`mt-1 text-sm transition-colors ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Comprehensive text analysis for International & Indian languages
              </p>
            </div>
            <div className="flex items-center space-x-4">
              {/* Dark Mode Toggle */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-lg transition-colors ${
                  darkMode 
                    ? 'bg-gray-700 hover:bg-gray-600 text-yellow-400' 
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                }`}
                title={darkMode ? 'Light Mode' : 'Dark Mode'}
              >
                {darkMode ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                )}
              </button>

              {/* TTS Status */}
              {speechSupported && speaking && (
                <button
                  onClick={stopSpeaking}
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 hover:bg-red-200 transition-colors"
                >
                  <span className="w-2 h-2 bg-red-400 rounded-full mr-2 animate-pulse"></span>
                  Stop Speaking
                </button>
              )}

              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                darkMode 
                  ? 'bg-green-900 text-green-300' 
                  : 'bg-green-100 text-green-800'
              }`}>
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                API Online
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Panel - Input */}
          <div className="space-y-6">
            {/* Tabs */}
            <div className={`rounded-lg shadow-lg p-6 transition-colors ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            }`}>
              <div className={`flex space-x-2 mb-6 ${darkMode ? 'border-gray-700' : 'border-gray-200'} border-b`}>
                <button
                  onClick={() => setActiveTab('analyze')}
                  className={`px-4 py-2 font-medium text-sm transition-colors ${
                    activeTab === 'analyze'
                      ? darkMode 
                        ? 'text-blue-400 border-b-2 border-blue-400' 
                        : 'text-blue-600 border-b-2 border-blue-600'
                      : darkMode
                        ? 'text-gray-400 hover:text-gray-200'
                        : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  📊 Analyze
                </button>
                <button
                  onClick={() => setActiveTab('translate')}
                  className={`px-4 py-2 font-medium text-sm transition-colors ${
                    activeTab === 'translate'
                      ? darkMode 
                        ? 'text-blue-400 border-b-2 border-blue-400' 
                        : 'text-blue-600 border-b-2 border-blue-600'
                      : darkMode
                        ? 'text-gray-400 hover:text-gray-200'
                        : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  🌍 Translate
                </button>
                {/* Convert tab hidden for now */}
                {/* <button
                  onClick={() => setActiveTab('convert')}
                  className={`px-4 py-2 font-medium text-sm transition-colors ${
                    activeTab === 'convert'
                      ? darkMode 
                        ? 'text-blue-400 border-b-2 border-blue-400' 
                        : 'text-blue-600 border-b-2 border-blue-600'
                      : darkMode
                        ? 'text-gray-400 hover:text-gray-200'
                        : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  🔤 Convert
                </button> */}
              </div>

              {/* Text Input */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <label className={`block text-sm font-medium transition-colors ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Enter Text
                  </label>
                  {/* Text-to-Speech Button for Input */}
                  {speechSupported && text.trim() && (
                    <button
                      onClick={() => speakText(text)}
                      className={`px-2 py-1 rounded text-xs flex items-center space-x-1 transition-colors ${
                        darkMode
                          ? 'bg-blue-900 hover:bg-blue-800 text-blue-300'
                          : 'bg-blue-100 hover:bg-blue-200 text-blue-700'
                      }`}
                      title="Read input text"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                      </svg>
                      <span>Speak</span>
                    </button>
                  )}
                </div>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Type or paste your text here..."
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-colors ${
                    darkMode
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  rows="8"
                />
              </div>

              {/* Quick Examples */}
              <div className="mb-4">
                <p className={`text-sm font-medium mb-2 transition-colors ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>Quick Examples:</p>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(exampleTexts).map(([key, value]) => (
                    <button
                      key={key}
                      onClick={() => setText(value)}
                      className={`px-3 py-1 text-xs rounded-full transition-colors ${
                        darkMode
                          ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      }`}
                    >
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Options based on active tab */}
              {activeTab === 'analyze' && (
                <div className="mb-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={compactMode}
                      onChange={(e) => setCompactMode(e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className={`text-sm transition-colors ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>Compact Response</span>
                  </label>
                </div>
              )}

              {activeTab === 'translate' && (
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 transition-colors ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Source Language
                    </label>
                    <select
                      value={sourceLang}
                      onChange={(e) => setSourceLang(e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors ${
                        darkMode
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    >
                      <option value="auto">Auto-detect</option>
                      <option value="en">English</option>
                      <option value="hi">Hindi</option>
                      <option value="mr">Marathi</option>
                      <option value="bn">Bengali</option>
                      <option value="ta">Tamil</option>
                      <option value="te">Telugu</option>
                    </select>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 transition-colors ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Target Language
                    </label>
                    <select
                      value={targetLang}
                      onChange={(e) => setTargetLang(e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors ${
                        darkMode
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    >
                      <option value="en">English</option>
                      <option value="hi">Hindi</option>
                      <option value="mr">Marathi</option>
                      <option value="bn">Bengali</option>
                      <option value="ta">Tamil</option>
                      <option value="te">Telugu</option>
                    </select>
                  </div>
                </div>
              )}

              {activeTab === 'convert' && (
                <div className="space-y-4 mb-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 transition-colors ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Target Language
                    </label>
                    <select
                      value={conversionLang}
                      onChange={(e) => setConversionLang(e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors ${
                        darkMode
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    >
                      <option value="hin">Hindi</option>
                      <option value="mar">Marathi</option>
                      <option value="ben">Bengali</option>
                      <option value="tam">Tamil</option>
                      <option value="tel">Telugu</option>
                      <option value="pan">Punjabi</option>
                    </select>
                  </div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={preserveEnglish}
                      onChange={(e) => setPreserveEnglish(e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className={`text-sm transition-colors ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>Preserve English words</span>
                  </label>
                </div>
              )}

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={loading || !text.trim()}
                className={`w-full font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2 ${
                  darkMode
                    ? 'bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white'
                }`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <span>✨</span>
                    <span>
                      {activeTab === 'analyze' ? 'Analyze Text' : 
                       activeTab === 'translate' ? 'Translate' : 'Convert to Native Script'}
                    </span>
                  </>
                )}
              </button>

              {/* Error Display */}
              {error && (
                <div className={`mt-4 border rounded-lg p-4 transition-colors ${
                  darkMode
                    ? 'bg-red-900/30 border-red-700'
                    : 'bg-red-50 border-red-200'
                }`}>
                  <p className={`text-sm ${darkMode ? 'text-red-300' : 'text-red-800'}`}>
                    <strong>Error:</strong> {error}
                  </p>
                </div>
              )}
            </div>

            {/* Features Card */}
            <div className={`rounded-lg shadow-lg p-6 transition-colors ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            }`}>
              <h3 className={`text-lg font-semibold mb-4 transition-colors ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>✨ Features</h3>
              <ul className={`space-y-2 text-sm transition-colors ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Language Detection (60+ languages including code-mixed)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Sentiment Analysis (Positive/Negative/Neutral)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Toxicity Detection (6 categories)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Profanity Filtering (10 languages)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Domain Detection (Technical, Financial, Medical)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Romanized-to-Native Conversion (Hybrid)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Translation with Auto-detection</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">🎙️</span>
                  <span>Text-to-Speech Support (NEW!)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-500 mr-2">🌙</span>
                  <span>Dark Mode Toggle (NEW!)</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Panel - Results */}
          <div>
            <div className={`rounded-lg shadow-lg p-6 sticky top-8 transition-colors ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            }`}>
              <h3 className={`text-lg font-semibold mb-4 transition-colors ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>📋 Results</h3>
              
              {!result && !loading && (
                <div className={`text-center py-12 transition-colors ${
                  darkMode ? 'text-gray-500' : 'text-gray-400'
                }`}>
                  <svg className="mx-auto h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p>Results will appear here</p>
                </div>
              )}

              {result && (
                <div className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
                  {activeTab === 'analyze' && (
                    <>
                      {/* Language Info */}
                      {(result.language || result.language) && (
                        <div className={`rounded-lg p-4 transition-colors ${
                          darkMode ? 'bg-blue-900/30 border border-blue-700' : 'bg-blue-50'
                        }`}>
                          <h4 className={`font-semibold mb-2 transition-colors ${
                            darkMode ? 'text-blue-300' : 'text-blue-900'
                          }`}>🌐 Language</h4>
                          {compactMode ? (
                            <div className={`space-y-1 text-sm transition-colors ${
                              darkMode ? 'text-gray-300' : 'text-gray-700'
                            }`}>
                              <p><strong>Code:</strong> {result.language.code}</p>
                              <p><strong>Name:</strong> {result.language.name}</p>
                              <p><strong>Confidence:</strong> {(result.language.confidence * 100).toFixed(1)}%</p>
                              {result.language.is_romanized && (
                                <span className={`inline-block text-xs px-2 py-1 rounded ${
                                  darkMode ? 'bg-yellow-900/50 text-yellow-300' : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                  Romanized
                                </span>
                              )}
                              {result.language.is_code_mixed && (
                                <span className={`inline-block text-xs px-2 py-1 rounded ml-2 ${
                                  darkMode ? 'bg-purple-900/50 text-purple-300' : 'bg-purple-100 text-purple-800'
                                }`}>
                                  Code-Mixed
                                </span>
                              )}
                            </div>
                          ) : (
                            <pre className={`text-xs p-2 rounded overflow-x-auto transition-colors ${
                              darkMode ? 'bg-gray-900 text-gray-300' : 'bg-white text-gray-900'
                            }`}>
                              {JSON.stringify(result.language, null, 2)}
                            </pre>
                          )}
                        </div>
                      )}

                      {/* Sentiment */}
                      {result.sentiment && (
                        <div className={`rounded-lg p-4 transition-colors ${
                          darkMode ? 'bg-green-900/30 border border-green-700' : 'bg-green-50'
                        }`}>
                          <h4 className={`font-semibold mb-2 transition-colors ${
                            darkMode ? 'text-green-300' : 'text-green-900'
                          }`}>😊 Sentiment</h4>
                          {compactMode ? (
                            <div className="flex items-center justify-between">
                              <span className={`text-lg font-bold capitalize ${
                                darkMode ? 'text-gray-200' : 'text-gray-900'
                              }`}>{result.sentiment.label}</span>
                              <span className={`text-sm ${
                                darkMode ? 'text-gray-400' : 'text-gray-600'
                              }`}>
                                {(result.sentiment.score * 100).toFixed(1)}%
                              </span>
                            </div>
                          ) : (
                            <pre className={`text-xs p-2 rounded overflow-x-auto transition-colors ${
                              darkMode ? 'bg-gray-900 text-gray-300' : 'bg-white text-gray-900'
                            }`}>
                              {JSON.stringify(result.sentiment, null, 2)}
                            </pre>
                          )}
                        </div>
                      )}

                      {/* Profanity */}
                      {result.profanity && (
                        <div className={`rounded-lg p-4 transition-colors ${
                          result.profanity.detected || result.profanity.has_profanity 
                            ? darkMode ? 'bg-red-900/30 border border-red-700' : 'bg-red-50' 
                            : darkMode ? 'bg-gray-700' : 'bg-gray-50'
                        }`}>
                          <h4 className={`font-semibold mb-2 transition-colors ${
                            result.profanity.detected || result.profanity.has_profanity 
                              ? darkMode ? 'text-red-300' : 'text-red-900'
                              : darkMode ? 'text-gray-300' : 'text-gray-900'
                          }`}>
                            🚫 Profanity
                          </h4>
                          <p className="text-sm">
                            {compactMode ? (
                              result.profanity.detected ? (
                                <span className={`font-semibold ${
                                  darkMode ? 'text-red-400' : 'text-red-600'
                                }`}>Detected - Severity: {result.profanity.severity}</span>
                              ) : (
                                <span className={darkMode ? 'text-green-400' : 'text-green-600'}>No profanity detected</span>
                              )
                            ) : (
                              <pre className={`text-xs p-2 rounded overflow-x-auto transition-colors ${
                                darkMode ? 'bg-gray-900 text-gray-300' : 'bg-white text-gray-900'
                              }`}>
                                {JSON.stringify(result.profanity, null, 2)}
                              </pre>
                            )}
                          </p>
                        </div>
                      )}

                      {/* Translation */}
                      {result.translation && (
                        <div className={`rounded-lg p-4 transition-colors ${
                          darkMode ? 'bg-indigo-900/30 border border-indigo-700' : 'bg-indigo-50'
                        }`}>
                          <div className="flex items-center justify-between mb-2">
                            <h4 className={`font-semibold transition-colors ${
                              darkMode ? 'text-indigo-300' : 'text-indigo-900'
                            }`}>🌍 Translation</h4>
                            {speechSupported && (
                              <button
                                onClick={() => speakText(result.translation, 'en')}
                                className={`px-2 py-1 rounded text-xs flex items-center space-x-1 transition-colors ${
                                  darkMode
                                    ? 'bg-indigo-900 hover:bg-indigo-800 text-indigo-300'
                                    : 'bg-indigo-100 hover:bg-indigo-200 text-indigo-700'
                                }`}
                                title="Read translation"
                              >
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                                </svg>
                                <span>Speak</span>
                              </button>
                            )}
                          </div>
                          <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>{result.translation}</p>
                        </div>
                      )}

                      {/* Toxicity Score */}
                      {compactMode && result.toxicity_score !== undefined && (
                        <div className={`rounded-lg p-4 transition-colors ${
                          darkMode ? 'bg-orange-900/30 border border-orange-700' : 'bg-orange-50'
                        }`}>
                          <h4 className={`font-semibold mb-2 transition-colors ${
                            darkMode ? 'text-orange-300' : 'text-orange-900'
                          }`}>⚠️ Toxicity</h4>
                          <div className="flex items-center justify-between">
                            <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Max Score:</span>
                            <span className={`font-bold ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>{(result.toxicity_score * 100).toFixed(1)}%</span>
                          </div>
                        </div>
                      )}

                      {/* Full JSON for non-compact */}
                      {!compactMode && (
                        <div className={`rounded-lg p-4 transition-colors ${
                          darkMode ? 'bg-gray-700' : 'bg-gray-50'
                        }`}>
                          <h4 className={`font-semibold mb-2 transition-colors ${
                            darkMode ? 'text-gray-200' : 'text-gray-900'
                          }`}>📄 Full Response</h4>
                          <pre className={`text-xs p-4 rounded overflow-x-auto max-h-96 transition-colors ${
                            darkMode ? 'bg-gray-900 text-gray-300' : 'bg-white text-gray-900'
                          }`}>
                            {JSON.stringify(result, null, 2)}
                          </pre>
                        </div>
                      )}
                    </>
                  )}

                  {activeTab === 'translate' && (
                    <>
                      <div className={`rounded-lg p-4 transition-colors ${
                        darkMode ? 'bg-blue-900/30 border border-blue-700' : 'bg-blue-50'
                      }`}>
                        <div className="flex items-center justify-between mb-2">
                          <h4 className={`font-semibold transition-colors ${
                            darkMode ? 'text-blue-300' : 'text-blue-900'
                          }`}>Original</h4>
                          {speechSupported && result.original_text && (
                            <button
                              onClick={() => speakText(result.original_text, result.source_language || 'auto')}
                              className={`px-2 py-1 rounded text-xs flex items-center space-x-1 transition-colors ${
                                darkMode
                                  ? 'bg-blue-900 hover:bg-blue-800 text-blue-300'
                                  : 'bg-blue-100 hover:bg-blue-200 text-blue-700'
                              }`}
                              title="Read original text"
                            >
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                              </svg>
                              <span>Speak</span>
                            </button>
                          )}
                        </div>
                        <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>{result.original_text}</p>
                      </div>
                      
                      <div className={`rounded-lg p-4 transition-colors ${
                        darkMode ? 'bg-green-900/30 border border-green-700' : 'bg-green-50'
                      }`}>
                        <div className="flex items-center justify-between mb-2">
                          <h4 className={`font-semibold transition-colors ${
                            darkMode ? 'text-green-300' : 'text-green-900'
                          }`}>Translation</h4>
                          {speechSupported && result.translated_text && (
                            <button
                              onClick={() => speakText(result.translated_text, result.target_language || targetLang)}
                              className={`px-2 py-1 rounded text-xs flex items-center space-x-1 transition-colors ${
                                darkMode
                                  ? 'bg-green-900 hover:bg-green-800 text-green-300'
                                  : 'bg-green-100 hover:bg-green-200 text-green-700'
                              }`}
                              title="Read translation"
                            >
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                              </svg>
                              <span>Speak</span>
                            </button>
                          )}
                        </div>
                        <p className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>{result.translated_text}</p>
                      </div>
                      
                      {result.romanized_detected && (
                        <div className={`rounded-lg p-4 transition-colors ${
                          darkMode ? 'bg-yellow-900/30 border border-yellow-700' : 'bg-yellow-50'
                        }`}>
                          <h4 className={`font-semibold mb-2 transition-colors ${
                            darkMode ? 'text-yellow-300' : 'text-yellow-900'
                          }`}>🔤 Romanized Conversion Applied</h4>
                          <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                            <strong>Devanagari:</strong> {result.converted_to_devanagari}
                          </p>
                        </div>
                      )}
                      
                      <div className={`rounded-lg p-4 transition-colors ${
                        darkMode ? 'bg-gray-700' : 'bg-gray-50'
                      }`}>
                        <h4 className={`font-semibold mb-2 transition-colors ${
                          darkMode ? 'text-gray-200' : 'text-gray-900'
                        }`}>📄 Full Response</h4>
                        <pre className={`text-xs p-4 rounded overflow-x-auto transition-colors ${
                          darkMode ? 'bg-gray-900 text-gray-300' : 'bg-white text-gray-900'
                        }`}>
                          {JSON.stringify(result, null, 2)}
                        </pre>
                      </div>
                    </>
                  )}

                  {activeTab === 'convert' && (
                    <>
                      <div className="bg-blue-50 rounded-lg p-4">
                        <h4 className="font-semibold text-blue-900 mb-2">Original (Romanized)</h4>
                        <p className="text-sm">{result.original_text}</p>
                      </div>
                      <div className="bg-green-50 rounded-lg p-4">
                        <h4 className="font-semibold text-green-900 mb-2">Converted (Native Script)</h4>
                        <p className="text-lg font-medium">{result.converted_text}</p>
                      </div>
                      {result.statistics && (
                        <div className="bg-purple-50 rounded-lg p-4">
                          <h4 className="font-semibold text-purple-900 mb-2">📊 Statistics</h4>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>Total Tokens: {result.statistics.total_tokens}</div>
                            <div>Converted: {result.statistics.converted_tokens}</div>
                            <div>Preserved: {result.statistics.preserved_tokens}</div>
                            <div>Rate: {result.statistics.conversion_rate.toFixed(1)}%</div>
                          </div>
                        </div>
                      )}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-2">📄 Full Response</h4>
                        <pre className="text-xs bg-white p-4 rounded overflow-x-auto max-h-96">
                          {JSON.stringify(result, null, 2)}
                        </pre>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center text-sm transition-colors ${
            darkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            <p>Multilingual NLP Analysis System v1.0.0</p>
            <p className="mt-1">API running on <code className={`px-2 py-1 rounded ${
              darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-900'
            }`}>localhost:8000</code></p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
