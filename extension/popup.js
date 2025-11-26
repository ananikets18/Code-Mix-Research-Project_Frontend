document.addEventListener('DOMContentLoaded', function () {
    const statusIndicator = document.getElementById('statusIndicator');
    const enableExtension = document.getElementById('enableExtension');
    const blurToxic = document.getElementById('blurToxic');
    const toxicityThreshold = document.getElementById('toxicityThreshold');
    const thresholdValue = document.getElementById('thresholdValue');
    const analyzedCount = document.getElementById('analyzedCount');
    const toxicCount = document.getElementById('toxicCount');
    const openDashboard = document.getElementById('openDashboard');

    // Check backend connection
    fetch('https://thequoteshub.info/health')
        .then(response => {
            if (response.ok) {
                statusIndicator.classList.add('connected');
                statusIndicator.title = "Connected to Backend";
            } else {
                statusIndicator.title = "Backend Error";
            }
        })
        .catch(() => {
            statusIndicator.title = "Backend Offline";
        });

    // Load settings
    chrome.storage.local.get(['enabled', 'blurToxic', 'toxicityThreshold', 'stats'], function (result) {
        enableExtension.checked = result.enabled !== false;
        blurToxic.checked = result.blurToxic !== false;

        const threshold = result.toxicityThreshold || 0.7;
        toxicityThreshold.value = threshold * 100;
        thresholdValue.textContent = Math.round(threshold * 100);

        if (result.stats) {
            analyzedCount.textContent = result.stats.analyzed || 0;
            toxicCount.textContent = result.stats.toxic || 0;
        }
    });

    // Save settings
    enableExtension.addEventListener('change', function () {
        chrome.storage.local.set({ enabled: this.checked });
    });

    blurToxic.addEventListener('change', function () {
        chrome.storage.local.set({ blurToxic: this.checked });
    });

    toxicityThreshold.addEventListener('input', function () {
        const value = this.value / 100;
        thresholdValue.textContent = this.value;
        chrome.storage.local.set({ toxicityThreshold: value });
    });

    // Open website
    openDashboard.addEventListener('click', function (e) {
        e.preventDefault();
        chrome.tabs.create({ url: 'https://code-mix-for-social-media.netlify.app/' });
    });
});
