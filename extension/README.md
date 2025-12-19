# 🌐 Code-Mix NLP Analyzer - Browser Extension

A Chrome extension for real-time sentiment analysis, toxicity detection, and translation of social media content across multiple languages.

---

## 📋 Overview

This browser extension integrates with our NLP backend to provide instant analysis of social media posts on platforms like Twitter/X, YouTube, Reddit, LinkedIn, Facebook, and Instagram.

**Key Capabilities:**
- ✅ Real-time sentiment analysis (Positive/Neutral/Negative)
- ⚠️ Toxicity detection with customizable threshold
- 🌐 Multi-language translation (Hindi, English, code-mixed)
- 📊 Detailed analysis breakdown
- 🔧 User-configurable settings

---

## 🏗️ Architecture

### **Components**

```
┌─────────────────────────────────────────────────────┐
│                  User's Browser                      │
├─────────────────────────────────────────────────────┤
│  Content Script (content.js)                        │
│  - Detects posts on social media                    │
│  - Injects UI elements (badges, panels)             │
│  - Handles user interactions                        │
└──────────────────┬──────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────┐
│  Background Script (background.js)                  │
│  - Manages API communication                        │
│  - Handles translation requests                     │
│  - Tracks statistics                                │
└──────────────────┬──────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────┐
│  Backend API (DigitalOcean)                         │
│  https://159-89-161-139.nip.io/                     │
│  - /analyze - NLP analysis                          │
│  - /translate - Translation service                 │
└─────────────────────────────────────────────────────┘
```

### **File Structure**

```
extension/
├── manifest.json          # Extension configuration (Manifest V3)
├── popup.html            # Extension popup UI
├── popup.js              # Popup logic and settings
├── popup.css             # Popup styling
├── content.js            # Main content script (injected into pages)
├── background.js         # Background service worker
├── styles.css            # Injected styles for badges/panels
└── icons/                # Extension icons (16px, 48px, 128px)
```

---

## 🔧 How It Works

### **1. Content Detection**

**Platform-Specific Selectors:**
```javascript
const SELECTORS = {
  twitter: { post: '[data-testid="tweetText"]' },
  youtube: { post: '#content-text' },
  reddit: { post: '[data-test-id="post-content"]' },
  // ... more platforms
};
```

**Process:**
1. Extension loads on supported social media sites
2. `content.js` uses MutationObserver to detect new posts
3. Extracts text content from posts
4. Prevents duplicate analysis using unique element IDs

### **2. Analysis Pipeline**

```
Post Detected → Extract Text → Send to Background Script
                                        ↓
                                  API Request
                                        ↓
                              Backend Analysis
                                        ↓
                    ┌──────────────────┴──────────────────┐
                    ▼                                     ▼
            Sentiment Analysis                   Toxicity Detection
            (IndicBERT/XLM-RoBERTa)             (6 categories)
                    ↓                                     ↓
            Language Detection                   Profanity Check
            (Hindi/English/Mixed)                         ↓
                    └──────────────────┬──────────────────┘
                                       ▼
                              Response to Content Script
                                       ▼
                              UI Update (Badges/Panels)
```

### **3. Sentiment Parsing Logic**

**Challenge:** Different models return different probability array formats.

**Solution:**
```javascript
// IndicBERT-v2 (Hindi): [negative, neutral] (2 elements)
// XLM-RoBERTa (English): [negative, neutral, positive] (3 elements)

if (probs.length === 3) {
  scores.negative = probs[0];
  scores.neutral = probs[1];
  scores.positive = probs[2];
} else if (probs.length === 2) {
  scores.negative = probs[0];
  scores.neutral = probs[1];
  scores.positive = 0;  // IndicBERT doesn't predict positive
}
```

### **4. UI Injection**

**Visual Indicators:**
- ✅ **Green Badge**: Safe content
- ⚠️ **Red Badge**: Toxic content (animated pulse)
- 🌐 **Globe Icon**: Translation available (non-English content)
- ⏳ **Hourglass**: Analysis in progress

**Detailed Panel:**
Clicking a badge opens a modal with:
- Language detection (confidence %)
- Sentiment breakdown (bar charts)
- Toxicity scores (6 categories)
- Profanity detection

**Blur Feature:**
- Toxic content automatically blurred
- Click to reveal/hide
- Configurable threshold (0-100%)

### **5. Translation Feature**

**Trigger:** Appears for any non-English or code-mixed content

**Flow:**
```
User clicks 🌐 → Check cache → If cached: Show tooltip
                              ↓
                         If not cached:
                              ↓
                    Request from backend
                              ↓
                    Display in tooltip
                              ↓
                    Auto-close after 10s
```

---

## ⚙️ Technical Implementation

### **Manifest V3 Configuration**

```json
{
  "manifest_version": 3,
  "permissions": ["storage", "activeTab"],
  "host_permissions": ["https://thequoteshub.info/*"],
  "content_scripts": [{
    "matches": ["*://twitter.com/*", "*://x.com/*", ...],
    "js": ["content.js"],
    "css": ["styles.css"]
  }],
  "background": {
    "service_worker": "background.js"
  }
}
```

### **Key Features**

**1. Deduplication System**
```javascript
const analyzedElements = new Set();
// Prevents analyzing the same post multiple times
```

**2. Dynamic Content Handling**
```javascript
const observer = new MutationObserver((mutations) => {
  // Detects new posts as user scrolls
});
```

**3. Settings Persistence**
```javascript
chrome.storage.local.set({ 
  enabled: true,
  blurToxic: true,
  toxicityThreshold: 0.7 
});
```

**4. Multi-Platform Support**
- Platform detection via hostname
- Platform-specific CSS selectors
- Adaptive UI positioning

---

## 🎨 Styling & UX

**Design Principles:**
- ✨ **Inter font family** for modern typography
- 🎯 **Minimal, non-intrusive** badges
- 🌈 **Color-coded sentiment** (green/yellow/red borders)
- 📱 **Responsive panels** with smooth animations
- ♿ **Accessible** tooltips and labels

**CSS Features:**
```css
/* Global font */
* { font-family: 'Inter', sans-serif; }

/* Sentiment color-coding */
.codemix-sentiment-positive { border-left: 4px solid #28a745; }
.codemix-sentiment-neutral { border-left: 4px solid #ffc107; }
.codemix-sentiment-negative { border-left: 4px solid #dc3545; }

/* Animated pulse for toxic content */
@keyframes pulse { /* ... */ }
```

---

## 🚀 Installation & Usage

### **Installation**

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/your-repo.git
   cd your-repo/extension
   ```

2. **Load in Chrome:**
   - Open `chrome://extensions/`
   - Enable "Developer mode" (top-right toggle)
   - Click "Load unpacked"
   - Select the `extension` folder

3. **Verify installation:**
   - Extension icon appears in toolbar
   - Click icon to see popup

### **Usage**

**Basic Flow:**
1. Navigate to any supported platform (Twitter, YouTube, etc.)
2. Posts are automatically analyzed
3. Click badges (✅/⚠️) to see detailed analysis
4. Click 🌐 to translate non-English content
5. Adjust settings via extension popup

**Settings:**
- **Enable Analysis**: Toggle extension on/off
- **Blur Toxic Content**: Auto-blur toxic posts
- **Toxicity Threshold**: Set sensitivity (0-100%)
- **Statistics**: View analyzed/toxic post counts
- **Open Website**: Link to web application

---

## 🔍 API Integration

### **Endpoints Used**

**1. Analysis Endpoint**
```
POST https://159-89-161-139.nip.io/analyze
Body: { text: "..." }
Response: {
  sentiment: { label, confidence, all_probabilities },
  toxicity: { toxic, severe_toxic, obscene, ... },
  language: { name, confidence, is_code_mixed, ... },
  profanity: { has_profanity, word_count },
  translations: { english, hindi }
}
```

**2. Translation Endpoint**
```
POST https://159-89-161-139.nip.io/translate
Body: { text: "...", source_lang: "auto", target_lang: "en" }
Response: { translated_text: "..." }
```

**3. Health Check**
```
GET https://159-89-161-139.nip.io/health
Response: { status: "ok" }
```

---

## 📊 Performance Optimizations

1. **Deduplication**: Prevents re-analyzing same posts
2. **Lazy Loading**: Only analyzes visible posts
3. **Caching**: Stores analysis results in element data
4. **Debouncing**: Limits API calls during rapid scrolling
5. **Clean Console**: All debug logs removed for production

---

## 🐛 Known Limitations

1. **Platform Coverage**: Limited to 6 major platforms
2. **Model Constraints**: 
   - IndicBERT: No positive sentiment class
   - Toxicity: Lower accuracy for non-English
3. **Rate Limiting**: No built-in API rate limiting
4. **Offline Mode**: Requires active internet connection

---

## 🔮 Future Enhancements

- [ ] Support for more platforms (TikTok, Instagram Stories)
- [ ] Offline mode with local model
- [ ] User feedback mechanism
- [ ] Customizable UI themes
- [ ] Export analysis history
- [ ] Chrome Web Store publication

---

## 🛠️ Development

### **Prerequisites**
- Chrome/Edge browser
- Backend API running at `https://159-89-161-139.nip.io/`

### **Testing**
1. Make changes to extension files
2. Go to `chrome://extensions/`
3. Click refresh icon on extension card
4. Test on social media platforms

### **Debugging**
- **Content Script**: Right-click page → Inspect → Console
- **Background Script**: `chrome://extensions/` → Extension details → Inspect views: service worker
- **Popup**: Right-click extension icon → Inspect popup

---

## 📄 License

This extension is part of the Code-Mix NLP Analyzer project.

---

## 🔗 Links

- **Web Application**: https://code-mix-for-social-media.netlify.app/
- **Backend API**: https://159-89-161-139.nip.io/
- **GitHub Repository**: [Your Repo Link]

---

## 👥 Authors

[Your Name/Team Name]

---

**Built with ❤️ using Chrome Extension APIs, NLP models, and modern web technologies.**
