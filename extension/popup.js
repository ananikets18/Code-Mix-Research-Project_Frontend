/* global chrome */
// Enhanced Popup Script with Modern Features

// DOM Elements - with null checks
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

// Verify critical elements exist
if (!enableExtension || !analyzedCount || !toxicCount) {
    console.error('Critical DOM elements missing');
}

// Load settings and stats
function loadSettings() {
    if (!enableExtension || !blurToxic || !toxicityThreshold) {
        console.error('Cannot load settings - DOM elements missing');
        return;
    }
    
    chrome.storage.local.get(
        ['enabled', 'blurToxic', 'toxicityThreshold', 'analyzedCount', 'toxicCount'],
        function (result) {
            if (enableExtension) enableExtension.checked = result.enabled !== false;
            if (blurToxic) blurToxic.checked = result.blurToxic !== false;
            if (toxicityThreshold) {
                toxicityThreshold.value = (result.toxicityThreshold || 0.7) * 100;
                updateThresholdDisplay(toxicityThreshold.value);
            }

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
    if (thresholdValue) {
        thresholdValue.textContent = Math.round(value) + '%';
    }
}

// Update statistics with animations
function updateStats(analyzed, toxic, safe) {
    if (!analyzedCount || !toxicCount || !safeCount) return;
    
    // Animate numbers
    animateValue(analyzedCount, 0, analyzed, 500);
    animateValue(toxicCount, 0, toxic, 500);
    animateValue(safeCount, 0, safe, 500);

    // Update progress bars
    if (analyzed > 0 && toxicProgress && safeProgress) {
        const toxicPercent = (toxic / analyzed) * 100;
        const safePercent = (safe / analyzed) * 100;

        setTimeout(() => {
            if (toxicProgress) toxicProgress.style.width = toxicPercent + '%';
            if (safeProgress) safeProgress.style.width = safePercent + '%';
        }, 100);
    }
}

// Animate number counting
function animateValue(element, start, end, duration) {
    if (!element) return;
    
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
            current = end;
            clearInterval(timer);
        }
        if (element) element.textContent = Math.round(current);
    }, 16);
}

// Check API status with better error handling
function checkAPIStatus() {
    if (!statusDot || !statusText) return;
    
    // Use new HTTPS nip.io endpoint
    const apiUrl = 'https://159-89-161-139.nip.io/health';
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // Increased to 15s

    // Set status to checking
    statusText.textContent = 'Checking...';
    statusDot.classList.remove('connected');

    fetch(apiUrl, { 
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        cache: 'no-cache'
    })
        .then(response => {
            clearTimeout(timeoutId);
            if (response.ok) {
                statusDot.classList.add('connected');
                statusText.textContent = 'Connected';
            } else {
                statusDot.classList.remove('connected');
                statusText.textContent = `Error ${response.status}`;
            }
        })
        .catch((error) => {
            clearTimeout(timeoutId);
            statusDot.classList.remove('connected');
            
            // More descriptive error messages
            if (error.name === 'AbortError') {
                statusText.textContent = 'Timeout';
            } else if (error.message.includes('Failed to fetch')) {
                statusText.textContent = 'Network Error';
            } else {
                statusText.textContent = 'Offline';
            }
            
            console.error('Backend status check failed:', error);
        });
}

// Event Listeners
if (enableExtension) {
    enableExtension.addEventListener('change', function () {
    chrome.storage.local.set({ enabled: this.checked });

    // Show feedback
    if (this.checked) {
        showToast('✅ Extension enabled');
    } else {
        showToast('⏸️ Extension paused');
    }
    });
}

if (blurToxic) {
    blurToxic.addEventListener('change', function () {
    chrome.storage.local.set({ blurToxic: this.checked });

    if (this.checked) {
        showToast('🛡️ Blur enabled');
    } else {
        showToast('👁️ Blur disabled');
    }
    });
}

if (toxicityThreshold) {
    toxicityThreshold.addEventListener('input', function () {
    const value = this.value;
    updateThresholdDisplay(value);
    chrome.storage.local.set({ toxicityThreshold: value / 100 });
    });
}

if (openDashboard) {
    openDashboard.addEventListener('click', function (e) {
    e.preventDefault();
    chrome.tabs.create({ url: 'https://code-mix-for-social-media.netlify.app/' });
    });
}

if (clearStats) {
    clearStats.addEventListener('click', function () {
    // Use custom confirmation instead of browser confirm
    showConfirmation('Reset all statistics? This cannot be undone.', function() {
        chrome.storage.local.set({ analyzedCount: 0, toxicCount: 0 }, function () {
            updateStats(0, 0, 0);
            showToast('🔄 Statistics reset');
        });
    });
    });
}

// Custom confirmation dialog
function showConfirmation(message, onConfirm) {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
    `;
    
    const dialog = document.createElement('div');
    dialog.style.cssText = `
        background: white;
        padding: 20px;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
        min-width: 250px;
        max-width: 90%;
    `;
    
    const messageEl = document.createElement('p');
    messageEl.textContent = message;
    messageEl.style.cssText = `
        margin: 0 0 20px 0;
        color: #333;
        font-size: 14px;
    `;
    
    const buttonContainer = document.createElement('div');
    buttonContainer.style.cssText = `
        display: flex;
        gap: 10px;
        justify-content: flex-end;
    `;
    
    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = 'Cancel';
    cancelBtn.style.cssText = `
        padding: 8px 16px;
        border: 1px solid #ddd;
        border-radius: 6px;
        background: white;
        cursor: pointer;
        font-size: 13px;
    `;
    
    const confirmBtn = document.createElement('button');
    confirmBtn.textContent = 'Confirm';
    confirmBtn.style.cssText = `
        padding: 8px 16px;
        border: none;
        border-radius: 6px;
        background: #ef4444;
        color: white;
        cursor: pointer;
        font-size: 13px;
    `;
    
    cancelBtn.addEventListener('click', () => overlay.remove());
    confirmBtn.addEventListener('click', () => {
        overlay.remove();
        onConfirm();
    });
    
    buttonContainer.appendChild(cancelBtn);
    buttonContainer.appendChild(confirmBtn);
    dialog.appendChild(messageEl);
    dialog.appendChild(buttonContainer);
    overlay.appendChild(dialog);
    document.body.appendChild(overlay);
}

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
    if (!analyzedCount || !toxicCount) return;
    
    chrome.storage.local.get(['analyzedCount', 'toxicCount'], function (result) {
        const analyzed = result.analyzedCount || 0;
        const toxic = result.toxicCount || 0;
        const safe = analyzed - toxic;

        // Only update if values changed (use strict equality)
        const currentAnalyzed = parseInt(analyzedCount.textContent) || 0;
        const currentToxic = parseInt(toxicCount.textContent) || 0;
        
        if (currentAnalyzed !== analyzed || currentToxic !== toxic) {
            updateStats(analyzed, toxic, safe);
        }
    });
}, 5000);
