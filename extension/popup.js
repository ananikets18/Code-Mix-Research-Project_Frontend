// Enhanced Popup Script with Modern Features

// DOM Elements
const enableExtension = document.getElementById('enableExtension');
const blurToxic = document.getElementById('blurToxic');
const toxicityThreshold = document.getElementById('toxicityThreshold');
const thresholdValue = document.getElementById('thresholdValue');
const analyzedCount = document.getElementById('analyzedCount');
const toxicCount = document.getElementById('toxicCount');
const safeCount = document.getElementById('safeCount');
const statusDot = document.getElementById('statusDot');
const statusText = document.getElementById('statusText');
const openDashboard = document.getElementById('openDashboard');
const clearStats = document.getElementById('clearStats');
const toxicProgress = document.getElementById('toxicProgress');
const safeProgress = document.getElementById('safeProgress');

// Load settings and stats
function loadSettings() {
    chrome.storage.local.get(
        ['enabled', 'blurToxic', 'toxicityThreshold', 'analyzedCount', 'toxicCount'],
        function (result) {
            enableExtension.checked = result.enabled !== false;
            blurToxic.checked = result.blurToxic !== false;
            toxicityThreshold.value = (result.toxicityThreshold || 0.7) * 100;
            updateThresholdDisplay(toxicityThreshold.value);

            const analyzed = result.analyzedCount || 0;
            const toxic = result.toxicCount || 0;
            const safe = analyzed - toxic;

            updateStats(analyzed, toxic, safe);
            checkAPIStatus();
        }
    );
}

// Update threshold display
function updateThresholdDisplay(value) {
    thresholdValue.textContent = Math.round(value) + '%';
}

// Update statistics with animations
function updateStats(analyzed, toxic, safe) {
    // Animate numbers
    animateValue(analyzedCount, 0, analyzed, 500);
    animateValue(toxicCount, 0, toxic, 500);
    animateValue(safeCount, 0, safe, 500);

    // Update progress bars
    if (analyzed > 0) {
        const toxicPercent = (toxic / analyzed) * 100;
        const safePercent = (safe / analyzed) * 100;

        setTimeout(() => {
            toxicProgress.style.width = toxicPercent + '%';
            safeProgress.style.width = safePercent + '%';
        }, 100);
    }
}

// Animate number counting
function animateValue(element, start, end, duration) {
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
            current = end;
            clearInterval(timer);
        }
        element.textContent = Math.round(current);
    }, 16);
}

// Check API status
function checkAPIStatus() {
    const apiUrl = 'https://thequoteshub.info/';

    fetch(apiUrl, { method: 'HEAD', mode: 'no-cors' })
        .then(() => {
            statusDot.classList.add('connected');
            statusText.textContent = 'Connected';
        })
        .catch(() => {
            statusDot.classList.remove('connected');
            statusText.textContent = 'Offline';
        });
}

// Event Listeners
enableExtension.addEventListener('change', function () {
    chrome.storage.local.set({ enabled: this.checked });

    // Show feedback
    if (this.checked) {
        showToast('✅ Extension enabled');
    } else {
        showToast('⏸️ Extension paused');
    }
});

blurToxic.addEventListener('change', function () {
    chrome.storage.local.set({ blurToxic: this.checked });

    if (this.checked) {
        showToast('🛡️ Blur enabled');
    } else {
        showToast('👁️ Blur disabled');
    }
});

toxicityThreshold.addEventListener('input', function () {
    const value = this.value;
    updateThresholdDisplay(value);
    chrome.storage.local.set({ toxicityThreshold: value / 100 });
});

openDashboard.addEventListener('click', function (e) {
    e.preventDefault();
    chrome.tabs.create({ url: 'https://code-mix-for-social-media-frontend.netlify.app/' });
});

clearStats.addEventListener('click', function () {
    if (confirm('Reset all statistics? This cannot be undone.')) {
        chrome.storage.local.set({ analyzedCount: 0, toxicCount: 0 }, function () {
            updateStats(0, 0, 0);
            showToast('🔄 Statistics reset');
        });
    }
});

// Simple toast notification
function showToast(message) {
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.cssText = `
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 8px 16px;
    border-radius: 20px;
    font-size: 12px;
    z-index: 1000;
    animation: slideUp 0.3s ease-out;
  `;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'slideDown 0.3s ease-out';
        setTimeout(() => toast.remove(), 300);
    }, 2000);
}

// Add CSS for toast animations
const style = document.createElement('style');
style.textContent = `
  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translate(-50%, 20px);
    }
    to {
      opacity: 1;
      transform: translate(-50%, 0);
    }
  }
  
  @keyframes slideDown {
    from {
      opacity: 1;
      transform: translate(-50%, 0);
    }
    to {
      opacity: 0;
      transform: translate(-50%, 20px);
    }
  }
`;
document.head.appendChild(style);

// Listen for storage changes (from content script)
chrome.storage.onChanged.addListener(function (changes, namespace) {
    if (changes.analyzedCount || changes.toxicCount) {
        chrome.storage.local.get(['analyzedCount', 'toxicCount'], function (result) {
            const analyzed = result.analyzedCount || 0;
            const toxic = result.toxicCount || 0;
            const safe = analyzed - toxic;
            updateStats(analyzed, toxic, safe);
        });
    }
});

// Initialize
loadSettings();

// Refresh stats every 5 seconds
setInterval(() => {
    chrome.storage.local.get(['analyzedCount', 'toxicCount'], function (result) {
        const analyzed = result.analyzedCount || 0;
        const toxic = result.toxicCount || 0;
        const safe = analyzed - toxic;

        // Only update if values changed
        if (analyzedCount.textContent != analyzed || toxicCount.textContent != toxic) {
            updateStats(analyzed, toxic, safe);
        }
    });
}, 5000);
