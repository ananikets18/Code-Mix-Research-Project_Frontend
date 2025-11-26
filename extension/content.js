// Content Script - Enhanced with Multiple Features

let isEnabled = true;
let blurToxic = true;
let toxicityThreshold = 0.7;

const analyzedElements = new Set();

// Load settings
chrome.storage.local.get(['enabled', 'blurToxic', 'toxicityThreshold'], function (result) {
    isEnabled = result.enabled !== false;
    blurToxic = result.blurToxic !== false;
    toxicityThreshold = result.toxicityThreshold || 0.7;
});

// Listen for settings changes
chrome.storage.onChanged.addListener(function (changes, namespace) {
    if (changes.enabled) isEnabled = changes.enabled.newValue;
    if (changes.blurToxic) blurToxic = changes.blurToxic.newValue;
    if (changes.toxicityThreshold) toxicityThreshold = changes.toxicityThreshold.newValue;
});

// Updated selectors for multiple platforms
const SELECTORS = {
    twitter: {
        post: '[data-testid="tweetText"]',
        container: 'article[data-testid="tweet"]'
    },
    youtube: {
        post: '#content-text',
        container: 'ytd-comment-thread-renderer'
    },
    reddit: {
        post: '[data-test-id="post-content"], .md',
        container: '[data-testid="post-container"]'
    },
    linkedin: {
        post: '.feed-shared-update-v2__description',
        container: '.feed-shared-update-v2'
    },
    facebook: {
        post: 'div[data-ad-comet-preview="message"]',
        container: 'div[role="article"]'
    },
    instagram: {
        post: 'h1, span._aacl',
        container: 'article'
    }
};

function getPlatform() {
    const host = window.location.hostname;
    if (host.includes('twitter.com') || host.includes('x.com')) return 'twitter';
    if (host.includes('youtube.com')) return 'youtube';
    if (host.includes('reddit.com')) return 'reddit';
    if (host.includes('linkedin.com')) return 'linkedin';
    if (host.includes('facebook.com')) return 'facebook';
    if (host.includes('instagram.com')) return 'instagram';
    return null;
}

function getElementId(element) {
    if (!element.dataset.codemixId) {
        element.dataset.codemixId = 'cm-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    }
    return element.dataset.codemixId;
}

function processNode(node) {
    if (!isEnabled) return;

    const platform = getPlatform();
    if (!platform) return;

    const selector = SELECTORS[platform].post;
    const elements = node.querySelectorAll ? node.querySelectorAll(selector) : [];

    elements.forEach((element) => {
        const elementId = getElementId(element);

        if (analyzedElements.has(elementId)) return;

        analyzedElements.add(elementId);

        const text = element.innerText;

        if (!text || text.length < 5) return;

        addIndicator(element, 'loading');

        chrome.runtime.sendMessage({ action: 'analyzeText', text: text }, response => {
            if (response && response.success) {
                handleAnalysisResult(element, response.data);
            } else {
                addIndicator(element, 'error');
            }
        });
    });
}

function handleAnalysisResult(element, data) {
    let isToxic = false;
    let toxicityScore = 0;

    if (data.toxicity) {
        const scores = Object.values(data.toxicity);
        toxicityScore = Math.max(...scores);
        isToxic = toxicityScore > toxicityThreshold;
    }

    const sentiment = data.sentiment?.label || 'neutral';

    addIndicator(element, isToxic ? 'toxic' : 'safe', data);

    applySentimentStyling(element, sentiment, data.sentiment?.scores);

    if (isToxic && blurToxic) {
        element.style.filter = 'blur(5px)';
        element.style.transition = 'filter 0.3s';
        element.style.cursor = 'pointer';
        element.title = 'Click to reveal toxic content';

        element.addEventListener('click', (e) => {
            e.stopPropagation();
            element.style.filter = element.style.filter === 'none' ? 'blur(5px)' : 'none';
        }, { once: false });
    }
}

function applySentimentStyling(element, sentiment, scores) {
    const container = element.closest('article') || element.parentElement;
    if (!container) return;

    container.classList.remove('codemix-sentiment-positive', 'codemix-sentiment-neutral', 'codemix-sentiment-negative');

    if (sentiment === 'positive') {
        container.classList.add('codemix-sentiment-positive');
    } else if (sentiment === 'negative') {
        container.classList.add('codemix-sentiment-negative');
    } else {
        container.classList.add('codemix-sentiment-neutral');
    }
}

function addIndicator(element, status, data = null) {
    let container = element.parentElement?.querySelector('.codemix-indicator-container');

    if (!container) {
        container = document.createElement('div');
        container.className = 'codemix-indicator-container';
        if (element.parentElement) {
            element.parentElement.style.position = 'relative';
            element.parentElement.appendChild(container);
        } else {
            return;
        }
    }

    container.innerHTML = '';

    const badge = document.createElement('div');
    badge.className = `codemix-indicator ${status}`;

    if (status === 'loading') {
        badge.innerHTML = '⏳';
        badge.title = 'Analyzing...';
    } else if (status === 'safe') {
        badge.innerHTML = '✅';
        badge.title = `Safe Content (${data?.language?.name || data?.language?.language_info?.language_name || 'Unknown'})`;

        badge.style.cursor = 'pointer';
        badge.addEventListener('click', (e) => {
            e.stopPropagation();
            showDetailedPanel(element, data);
        });
    } else if (status === 'toxic') {
        badge.innerHTML = '⚠️';
        badge.title = `Toxic Content Detected!`;

        badge.style.cursor = 'pointer';
        badge.addEventListener('click', (e) => {
            e.stopPropagation();
            showDetailedPanel(element, data);
        });
    } else if (status === 'error') {
        badge.innerHTML = '❓';
        badge.title = 'Analysis Failed';
    }

    container.appendChild(badge);

    const langName = data?.language?.name || data?.language?.language_info?.language_name || '';
    const isNonEnglish = langName && langName.toLowerCase() !== 'english';
    const isCodeMixed = data?.language?.is_code_mixed || data?.language?.composition?.is_code_mixed;

    if (data && (isNonEnglish || isCodeMixed)) {
        const translateBtn = document.createElement('div');
        translateBtn.className = 'codemix-translate-btn';
        translateBtn.innerHTML = '🌐';
        translateBtn.title = 'Translate to English';
        translateBtn.style.cursor = 'pointer';

        translateBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            showTranslation(element, data);
        });

        container.appendChild(translateBtn);
    }
}

function showDetailedPanel(element, data) {
    const existingPanel = document.querySelector('.codemix-detail-panel');
    if (existingPanel) existingPanel.remove();

    const panel = document.createElement('div');
    panel.className = 'codemix-detail-panel';

    let html = `
    <div class="codemix-panel-header">
      <h3>Analysis Details</h3>
      <button class="codemix-panel-close">✕</button>
    </div>
    <div class="codemix-panel-content">
  `;

    if (data.language) {
        const langName = data.language.name || data.language.language_info?.language_name || 'Unknown';
        const confidence = ((data.language.confidence || 0) * 100).toFixed(1);
        html += `
      <div class="codemix-panel-section">
        <h4>Language</h4>
        <p><strong>${langName}</strong> (${confidence}% confidence)</p>
        ${data.language.is_code_mixed ? '<span class="codemix-badge">Code-Mixed</span>' : ''}
        ${data.language.is_romanized || data.language.language_info?.is_romanized ? '<span class="codemix-badge">Romanized</span>' : ''}
      </div>
    `;
    }

    if (data.sentiment) {
        let scores = { positive: 0, neutral: 0, negative: 0 };

        if (data.sentiment.all_probabilities && data.sentiment.all_probabilities.length > 0) {
            const probs = data.sentiment.all_probabilities[0];

            if (probs && probs.length >= 2) {
                if (probs.length === 3) {
                    scores.negative = probs[0] || 0;
                    scores.neutral = probs[1] || 0;
                    scores.positive = probs[2] || 0;
                } else if (probs.length === 2) {
                    scores.negative = probs[0] || 0;
                    scores.neutral = probs[1] || 0;
                    scores.positive = 0;
                }
            }
        } else {
            const label = (data.sentiment.label || 'neutral').toLowerCase();
            scores[label] = data.sentiment.confidence || 0;
        }

        html += `
      <div class="codemix-panel-section">
        <h4>Sentiment: ${data.sentiment.label || 'Unknown'}</h4>
        <div class="codemix-sentiment-bars">
          <div class="codemix-bar">
            <span>Positive</span>
            <div class="codemix-bar-fill codemix-bar-positive" style="width: ${(scores.positive * 100)}%"></div>
            <span>${(scores.positive * 100).toFixed(1)}%</span>
          </div>
          <div class="codemix-bar">
            <span>Neutral</span>
            <div class="codemix-bar-fill codemix-bar-neutral" style="width: ${(scores.neutral * 100)}%"></div>
            <span>${(scores.neutral * 100).toFixed(1)}%</span>
          </div>
          <div class="codemix-bar">
            <span>Negative</span>
            <div class="codemix-bar-fill codemix-bar-negative" style="width: ${(scores.negative * 100)}%"></div>
            <span>${(scores.negative * 100).toFixed(1)}%</span>
          </div>
        </div>
      </div>
    `;
    }

    if (data.toxicity) {
        html += `
      <div class="codemix-panel-section">
        <h4>Toxicity Analysis</h4>
        <div class="codemix-toxicity-grid">
          <div><strong>Toxic:</strong> ${((data.toxicity.toxic || 0) * 100).toFixed(1)}%</div>
          <div><strong>Severe:</strong> ${((data.toxicity.severe_toxic || 0) * 100).toFixed(1)}%</div>
          <div><strong>Obscene:</strong> ${((data.toxicity.obscene || 0) * 100).toFixed(1)}%</div>
          <div><strong>Threat:</strong> ${((data.toxicity.threat || 0) * 100).toFixed(1)}%</div>
          <div><strong>Insult:</strong> ${((data.toxicity.insult || 0) * 100).toFixed(1)}%</div>
          <div><strong>Identity Hate:</strong> ${((data.toxicity.identity_hate || 0) * 100).toFixed(1)}%</div>
        </div>
      </div>
    `;
    }

    if (data.profanity && data.profanity.has_profanity) {
        html += `
      <div class="codemix-panel-section">
        <h4>Profanity Detected</h4>
        <p>${data.profanity.word_count || 0} profane word(s) found</p>
      </div>
    `;
    }

    html += `</div>`;
    panel.innerHTML = html;

    document.body.appendChild(panel);

    panel.querySelector('.codemix-panel-close').addEventListener('click', () => {
        panel.remove();
    });

    setTimeout(() => {
        document.addEventListener('click', function closePanel(e) {
            if (!panel.contains(e.target)) {
                panel.remove();
                document.removeEventListener('click', closePanel);
            }
        });
    }, 100);
}

function showTranslation(element, data) {
    if (data.translations && data.translations.english) {
        displayTranslationTooltip(element, data.translations.english);
    } else {
        const text = element.innerText;
        chrome.runtime.sendMessage({
            action: 'translateText',
            text: text,
            sourceLang: 'auto',
            targetLang: 'en'
        }, response => {
            if (response && response.success) {
                const translation = response.data.translated_text || response.data.translation;
                displayTranslationTooltip(element, translation);
            } else {
                displayTranslationTooltip(element, 'Translation failed');
            }
        });
    }
}

function displayTranslationTooltip(element, translation) {
    const existingTooltip = document.querySelector('.codemix-translation-tooltip');
    if (existingTooltip) existingTooltip.remove();

    const tooltip = document.createElement('div');
    tooltip.className = 'codemix-translation-tooltip';
    tooltip.innerHTML = `
    <div class="codemix-tooltip-header">
      <span>🌐 Translation</span>
      <button class="codemix-tooltip-close">✕</button>
    </div>
    <div class="codemix-tooltip-content">${translation}</div>
  `;

    const rect = element.getBoundingClientRect();
    tooltip.style.top = (rect.bottom + window.scrollY + 10) + 'px';
    tooltip.style.left = (rect.left + window.scrollX) + 'px';

    document.body.appendChild(tooltip);

    tooltip.querySelector('.codemix-tooltip-close').addEventListener('click', () => {
        tooltip.remove();
    });

    setTimeout(() => tooltip.remove(), 10000);
}

const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
            if (node.nodeType === 1) {
                processNode(node);
            }
        });
    });
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});

processNode(document.body);
