# Multilingual Code-Mix NLP Analyzer – Frontend

A modern **React + TailwindCSS** web interface for interacting with a Multilingual NLP Analysis API focused on **code-mixed Indian social media text**.

This frontend provides an intuitive UI to test and visualize NLP outputs such as sentiment, toxicity, profanity, translation, and language detection.
**All model inference is handled by the backend API** — this project does not perform NLP locally.

👉 Backend repository:
[https://github.com/ananikets18/code-mix-social-media-python-backend](https://github.com/ananikets18/code-mix-social-media-python-backend)

This project was bootstrapped with Create React App.

---

## 🎯 Project Overview

Code-mixed and romanized Indic languages (e.g., Hinglish) are common on social media but poorly supported by standard NLP pipelines.
This frontend bridges that gap by offering a clean interface to explore multilingual NLP outputs powered by fine-tuned transformer models.

---

## ⚙️ Prerequisites

* Node.js (v16+ recommended)
* npm
* Python backend API running locally

---

## 🚀 Quick Start

### 1. Start the Backend API

**IMPORTANT:** The backend must be running before launching the frontend.

```bash
# From the backend or parent project directory
python api.py
```

The API should be available at:
`http://localhost:8000`

---

### 2. Run the Frontend

```bash
# Install dependencies
npm install

# Start the development server
npm start
```

Open `http://localhost:3000` in your browser to view the application.

---

## ✨ Features

### 🌐 Language & Text Analysis

* Language detection (60+ languages)
* Code-mixed and romanized text identification
* Native script detection (Devanagari, etc.)

### 😊 Sentiment Analysis

* Positive, Negative, Neutral classification
* Confidence scores for predictions

### 🚫 Profanity Detection

* Multi-language profanity coverage
* Severity level classification

### ⚠️ Toxicity Analysis

* Detection across 6 toxicity categories
* Useful for moderation and content filtering

### 🌍 Translation

* Automatic source language detection
* Translation across supported languages

### 🔤 Romanized Text Conversion

* Converts romanized Indic text to native scripts

### 📊 Domain Detection

* Identifies Technical, Financial, and Medical content

---

## 🎨 User Interface

### Main Sections

#### 📊 Analyze

Provides a full NLP breakdown for input text:

* Language detection (including code-mix flags)
* Sentiment analysis
* Profanity and toxicity scoring
* Automatic translation
* Compact and verbose output modes

#### 🌍 Translate

Dedicated translation interface:

* Auto-detect source language
* Multiple target language options
* Romanized text support

---

## ⚡ Quick Examples

Use built-in examples to instantly test features:

* **English** — Clean English input
* **Hinglish** — Hindi-English code-mixed text
* **Romanized** — Romanized Indic text
* **Profanity** — Profanity detection test
* **Marathi** — Native Devanagari script

---

## 📡 API Integration

The frontend communicates with the backend using the following endpoints:

* `POST /analyze` — Run full NLP analysis
* `POST /translate` — Translation service
* `POST /convert` — Romanized to native script conversion

---

## 📌 Notes

* This repository is intended as a **frontend client** for NLP experimentation and visualization.
* All ML models and inference logic live in the backend.
* Designed for research, demos, and educational use.


