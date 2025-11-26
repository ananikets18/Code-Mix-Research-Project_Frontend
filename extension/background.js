// Background Service Worker

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'analyzeText') {
        analyzeText(request.text)
            .then(result => sendResponse({ success: true, data: result }))
            .catch(error => sendResponse({ success: false, error: error.message }));
        return true; // Will respond asynchronously
    } else if (request.action === 'translateText') {
        translateText(request.text, request.sourceLang, request.targetLang)
            .then(result => sendResponse({ success: true, data: result }))
            .catch(error => sendResponse({ success: false, error: error.message }));
        return true;
    }
});

async function analyzeText(text) {
    try {
        const response = await fetch('https://thequoteshub.info/analyze', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                text: text,
                compact_mode: true
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Update stats
        updateStats(data);

        return data;
    } catch (error) {
        console.error('Analysis error:', error);
        throw error;
    }
}

async function translateText(text, sourceLang = 'auto', targetLang = 'en') {
    try {
        const response = await fetch('https://thequoteshub.info/translate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                text: text,
                source_lang: sourceLang,
                target_lang: targetLang
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Translation error:', error);
        throw error;
    }
}

function updateStats(data) {
    chrome.storage.local.get(['stats'], function (result) {
        const stats = result.stats || { analyzed: 0, toxic: 0 };
        stats.analyzed++;

        if (data.toxicity) {
            // Check if any toxicity score is high (> 0.7)
            const isToxic = Object.values(data.toxicity).some(score => score > 0.7);
            if (isToxic) {
                stats.toxic++;
            }
        }

        chrome.storage.local.set({ stats: stats });
    });
}
