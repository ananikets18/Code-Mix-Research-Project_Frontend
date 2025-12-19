# 🌐 Code-Mix NLP Analyzer - Browser Extension

Real-time sentiment analysis, toxicity detection, and translation for social media content.

---

## 🎯 What It Does

Automatically analyzes posts on Twitter/X, YouTube, Reddit, LinkedIn, Facebook, and Instagram for:
- **Sentiment** (Positive/Neutral/Negative)
- **Toxicity** (6 categories)
- **Language** (Hindi, English, code-mixed)
- **Translation** (Non-English → English)

---

## 🚀 Quick Start

### Install (2 minutes)

1. **Download** this repository
2. Open Chrome → `chrome://extensions/`
3. Enable **"Developer mode"** (top-right toggle)
4. Click **"Load unpacked"** → Select `extension` folder
5. Done! ✅

### Use

1. Visit any supported social media site
2. See badges appear on posts: ✅ (safe) or ⚠️ (toxic)
3. **Click badge** → View detailed analysis
4. **Click 🌐** → Translate to English
5. **Click extension icon** → Adjust settings

---

## 🏗️ How It Works

```
Social Media Post → Extension Detects → Sends to Backend API
                                              ↓
                                    NLP Analysis (DigitalOcean)
                                              ↓
                                    Results Displayed
```

**Key Components:**
- `content.js` - Detects posts, injects UI
- `background.js` - Handles API calls
- `popup.js` - Settings interface

**Backend API:** `https://159-89-161-139.nip.io/`

---

## ⚙️ Features

### Visual Indicators
- ✅ **Green badge** - Safe content
- ⚠️ **Red badge** - Toxic content (with blur option)
- 🌐 **Globe icon** - Translation available

### Detailed Analysis Panel
Click any badge to see:
- Language detection (with confidence %)
- Sentiment breakdown (bar charts)
- Toxicity scores (6 categories)
- Profanity detection

### Settings
- Toggle analysis on/off
- Auto-blur toxic content
- Adjust toxicity threshold (0-100%)
- View statistics

---

## 🔧 Technical Stack

- **Manifest V3** Chrome Extension
- **Chrome APIs**: Storage, ActiveTab, Messaging
- **Backend**: DigitalOcean-hosted NLP API
- **Models**: IndicBERT-v2, XLM-RoBERTa
- **Styling**: Inter font, custom CSS

---

## 📊 Supported Platforms

| Platform | Status |
|----------|--------|
| Twitter/X | ✅ |
| YouTube | ✅ |
| Reddit | ✅ |
| LinkedIn | ✅ |
| Facebook | ✅ |
| Instagram | ✅ |

---

## 🎨 Key Features

### Smart Sentiment Parsing
Handles different model outputs:
- **IndicBERT** (Hindi): 2-element array `[negative, neutral]`
- **XLM-RoBERTa** (English): 3-element array `[negative, neutral, positive]`

### Multi-Language Support
- Detects Hindi, English, code-mixed text
- Automatic translation for non-English content
- Romanized text support

### Performance Optimized
- Deduplication prevents re-analysis
- MutationObserver for dynamic content
- Cached results for instant display

---

## 📁 File Structure

```
extension/
├── manifest.json       # Extension config
├── popup.html/js/css   # Settings UI
├── content.js          # Main logic (400+ lines)
├── background.js       # API handler
├── styles.css          # Injected styles
└── icons/              # Extension icons
```

---

## 🔗 Links

- **Web App**: https://code-mix-for-social-media.netlify.app/
- **API**: https://159-89-161-139.nip.io/
- **Full Documentation**: [README.md](README.md)

---

## 📝 Example Usage

**Scenario 1: English Tweet**
```
Tweet: "This is amazing!"
→ ✅ Badge appears
→ Click: Sentiment: Positive (85%)
```

**Scenario 2: Hindi Tweet**
```
Tweet: "यह बहुत अच्छा है!"
→ ✅ Badge + 🌐 Translation
→ Click 🌐: "This is very good!"
```

**Scenario 3: Toxic Content**
```
Tweet: [toxic content]
→ ⚠️ Badge (pulsing animation)
→ Content auto-blurred
→ Click to reveal/hide
```

---

## 🐛 Troubleshooting

**Extension not working?**
1. Check `chrome://extensions/` - ensure enabled
2. Refresh the page
3. Check backend status (green dot in popup)

**No badges appearing?**
1. Ensure "Enable Analysis" is ON in popup
2. Check if platform is supported
3. Reload extension

**Translation not working?**
1. Only appears for non-English content
2. Check internet connection
3. Verify backend API is online

---

## 🔮 Future Plans

- [ ] Chrome Web Store publication
- [ ] More platforms (TikTok, Threads)
- [ ] Offline mode
- [ ] Custom themes
- [ ] Export analysis history

---

## 👥 Credits

Part of the **Code-Mix NLP Analyzer** project.

Built with Chrome Extension APIs, NLP models, and modern web technologies.

---

**For detailed technical documentation, see [README.md](README.md)**
