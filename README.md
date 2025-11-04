# Multilingual NLP Analyzer - Frontend

A modern React + TailwindCSS frontend for testing the Multilingual NLP Analysis API.

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## 🎯 Quick Start

### Prerequisites

**IMPORTANT:** The backend API must be running first!

```bash
# In the parent directory (NLP-project/)
python api.py
```

The API should be running on `http://localhost:8000`

### Run the Frontend

```bash
# Install dependencies (first time only)
npm install

# Start the development server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## ✨ Features

- 🌐 **Language Detection** - 60+ languages including code-mixed (Hinglish, etc.)
- 😊 **Sentiment Analysis** - Positive/Negative/Neutral with confidence scores
- 🚫 **Profanity Detection** - 10 languages with severity levels
- ⚠️ **Toxicity Analysis** - 6 categories of toxic content
- 🌍 **Translation** - Auto-detect and translate between languages
- 🔤 **Romanized Conversion** - Convert romanized Indic text to native script
- 📊 **Domain Detection** - Technical, Financial, Medical domains

## 🎨 UI Features

### Three Tabs:

1. **📊 Analyze** - Comprehensive NLP analysis
   - Language detection with romanized/code-mixed flags
   - Sentiment analysis
   - Profanity detection
   - Toxicity scores
   - Automatic translation
   - Compact/Verbose response modes

2. **🌍 Translate** - Translation service
   - Auto-detect source language
   - Multiple target languages
   - Automatic romanized conversion

3. **🔤 Convert** - Romanized-to-Native conversion
   - Hybrid conversion (preserves English)
   - Token-level statistics
   - 6 Indian languages supported

### Quick Examples

Click pre-filled example buttons:
- **English** - Clean English text
- **Hinglish** - Code-mixed Hindi-English
- **Romanized** - Romanized Indic text
- **Profanity** - Test profanity filtering
- **Marathi** - Native Devanagari script

## 📱 API Endpoints

- `POST /analyze` - Comprehensive analysis
- `POST /translate` - Translation
- `POST /convert` - Romanized-to-native conversion

## 🛠️ Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
