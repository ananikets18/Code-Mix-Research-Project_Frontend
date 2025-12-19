# Multilingual Code-Mix NLP Analyzer - [Frontend]

A modern React + TailwindCSS frontend for testing the Multilingual NLP Analysis API.

This project works with a backend API that fine-tunes transformer models for sentiment and toxicity detection in code-mixed Indian social media to address multilingual NLP gaps. You can find the backend repository here: [https://github.com/ananikets18/code-mix-social-media-python-backend](https://github.com/ananikets18/code-mix-social-media-python-backend)

This frontend project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## 🎯 Quick Start

### Prerequisites

**IMPORTANT:** Ensure the backend API is running before starting the frontend.

```
# From the parent directory (NLP-project/)
python api.py
```

The API should be running at `http://localhost:8000` (local development) or `https://159-89-161-139.nip.io` (production).

### Run the Frontend

```
# Install dependencies (first time only)
npm install

# Start the development server
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the app.

## ✨ Features

- 🌐 **Language Detection** — Supports 60+ languages including code-mixed text like [translate:Hinglish]
- 😊 **Sentiment Analysis** — Positive, Negative, and Neutral sentiments with confidence scores
- 🚫 **Profanity Detection** — Covers 10 languages with severity levels
- ⚠️ **Toxicity Analysis** — Detects 6 categories of toxic content
- 🌍 **Translation** — Auto-detects source language and translates between languages
- 🔤 **Romanized Conversion** — Converts romanized Indic text to native scripts
- 📊 **Domain Detection** — Identifies Technical, Financial, and Medical domains

## 🎨 UI Features

### Two Main Tabs:

1. **📊 Analyze** — Comprehensive NLP analysis  
   - Language detection with flags for romanized and code-mixed text  
   - Sentiment analysis  
   - Profanity detection  
   - Toxicity scoring  
   - Automatic translation  
   - Compact and verbose response modes

2. **🌍 Translate** — Translation service  
   - Auto-detect source language  
   - Select from multiple target languages  
   - Automatic romanized conversion support


### Quick Examples

Click any pre-filled example buttons for a quick demo:  
- **English** — Clean English text  
- **[translate:Hinglish]** — Code-mixed Hindi-English text  
- **Romanized** — Romanized Indic text input  
- **Profanity** — Test for profanity filtering  
- **Marathi** — Native Devanagari script text

## 📱 API Endpoints

- `POST /analyze` — Run comprehensive analysis  
- `POST /translate` — Use translation service  
- `POST /convert` — Convert romanized text to native script

## 🛠️ Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in development mode.  
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload if you make edits.  
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in interactive watch mode.  
See [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more info.

### `npm run build`

Builds the app for production to the `build` folder.  
Bundles React in production mode and optimizes the build for best performance.

The build is minified, and filenames include hashes.  
Your app is ready to be deployed!
