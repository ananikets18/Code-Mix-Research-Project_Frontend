/**
 * Export Report Utility
 * Generate PDF and other format reports from analysis results
 */

import jsPDF from "jspdf";
import "jspdf-autotable";

/**
 * Export analysis result as PDF report
 * @param {Object} result - Analysis result object
 * @param {string} originalText - Original analyzed text
 */
export const exportPDFReport = (result, originalText) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    let yPos = 20;

    // Title
    doc.setFontSize(20);
    doc.setTextColor(0, 102, 204);
    doc.text("NLP Analysis Report", pageWidth / 2, yPos, { align: "center" });

    yPos += 10;
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated: ${new Date().toLocaleString()}`, pageWidth / 2, yPos, { align: "center" });

    yPos += 15;

    // Original Text Section
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text("Original Text", 14, yPos);
    yPos += 7;

    doc.setFontSize(10);
    doc.setTextColor(60);
    const textLines = doc.splitTextToSize(originalText, pageWidth - 28);
    doc.text(textLines, 14, yPos);
    yPos += textLines.length * 5 + 10;

    // Language Detection
    if (result.language) {
        doc.setFontSize(14);
        doc.setTextColor(0);
        doc.text("Language Detection", 14, yPos);
        yPos += 7;

        const langData = [
            ["Language", result.language.name || result.language.language_info?.language_name || "Unknown"],
            ["Confidence", `${((result.language.confidence || 0) * 100).toFixed(2)}%`],
            ["Code-Mixed", result.language.is_code_mixed ? "Yes" : "No"],
            ["Romanized", result.language.is_romanized || result.language.language_info?.is_romanized ? "Yes" : "No"],
        ];

        doc.autoTable({
            startY: yPos,
            head: [["Property", "Value"]],
            body: langData,
            theme: "grid",
            headStyles: { fillColor: [0, 102, 204] },
            margin: { left: 14 },
        });

        yPos = doc.lastAutoTable.finalY + 10;
    }

    // Sentiment Analysis
    if (result.sentiment) {
        doc.setFontSize(14);
        doc.setTextColor(0);
        doc.text("Sentiment Analysis", 14, yPos);
        yPos += 7;

        const sentimentData = [
            ["Sentiment", result.sentiment.label || "Unknown"],
            ["Confidence", `${((result.sentiment.confidence || 0) * 100).toFixed(2)}%`],
        ];

        // Add probability breakdown if available
        if (result.sentiment.all_probabilities && result.sentiment.all_probabilities[0]) {
            const probs = result.sentiment.all_probabilities[0];
            if (probs.length === 3) {
                sentimentData.push(
                    ["Negative Probability", `${(probs[0] * 100).toFixed(2)}%`],
                    ["Neutral Probability", `${(probs[1] * 100).toFixed(2)}%`],
                    ["Positive Probability", `${(probs[2] * 100).toFixed(2)}%`]
                );
            }
        }

        doc.autoTable({
            startY: yPos,
            head: [["Property", "Value"]],
            body: sentimentData,
            theme: "grid",
            headStyles: { fillColor: [0, 153, 51] },
            margin: { left: 14 },
        });

        yPos = doc.lastAutoTable.finalY + 10;
    }

    // Toxicity Analysis
    if (result.toxicity) {
        // Check if we need a new page
        if (yPos > 250) {
            doc.addPage();
            yPos = 20;
        }

        doc.setFontSize(14);
        doc.setTextColor(0);
        doc.text("Toxicity Analysis", 14, yPos);
        yPos += 7;

        const toxicityData = [
            ["Toxic", `${((result.toxicity.toxic || 0) * 100).toFixed(2)}%`],
            ["Severe Toxic", `${((result.toxicity.severe_toxic || 0) * 100).toFixed(2)}%`],
            ["Obscene", `${((result.toxicity.obscene || 0) * 100).toFixed(2)}%`],
            ["Threat", `${((result.toxicity.threat || 0) * 100).toFixed(2)}%`],
            ["Insult", `${((result.toxicity.insult || 0) * 100).toFixed(2)}%`],
            ["Identity Hate", `${((result.toxicity.identity_hate || 0) * 100).toFixed(2)}%`],
        ];

        doc.autoTable({
            startY: yPos,
            head: [["Category", "Score"]],
            body: toxicityData,
            theme: "grid",
            headStyles: { fillColor: [204, 0, 0] },
            margin: { left: 14 },
        });

        yPos = doc.lastAutoTable.finalY + 10;
    }

    // Profanity Detection
    if (result.profanity) {
        if (yPos > 260) {
            doc.addPage();
            yPos = 20;
        }

        doc.setFontSize(14);
        doc.setTextColor(0);
        doc.text("Profanity Detection", 14, yPos);
        yPos += 7;

        const profanityData = [
            ["Has Profanity", result.profanity.has_profanity ? "Yes" : "No"],
            ["Word Count", result.profanity.word_count || 0],
        ];

        doc.autoTable({
            startY: yPos,
            head: [["Property", "Value"]],
            body: profanityData,
            theme: "grid",
            headStyles: { fillColor: [255, 153, 0] },
            margin: { left: 14 },
        });

        yPos = doc.lastAutoTable.finalY + 10;
    }

    // Footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text(
            `Page ${i} of ${pageCount}`,
            pageWidth / 2,
            doc.internal.pageSize.getHeight() - 10,
            { align: "center" }
        );
        doc.text(
            "Generated by Code-Mix NLP Analyzer",
            pageWidth / 2,
            doc.internal.pageSize.getHeight() - 5,
            { align: "center" }
        );
    }

    // Save the PDF
    const filename = `nlp-analysis-${Date.now()}.pdf`;
    doc.save(filename);
};

/**
 * Export analysis result as JSON
 * @param {Object} result - Analysis result object
 */
export const exportJSON = (result) => {
    const json = JSON.stringify(result, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `nlp-analysis-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
};

/**
 * Export analysis result as TXT
 * @param {Object} result - Analysis result object
 * @param {string} originalText - Original analyzed text
 */
export const exportTXT = (result, originalText) => {
    let text = "NLP ANALYSIS REPORT\n";
    text += "=".repeat(50) + "\n\n";
    text += `Generated: ${new Date().toLocaleString()}\n\n`;

    text += "ORIGINAL TEXT:\n";
    text += "-".repeat(50) + "\n";
    text += originalText + "\n\n";

    if (result.language) {
        text += "LANGUAGE DETECTION:\n";
        text += "-".repeat(50) + "\n";
        text += `Language: ${result.language.name || result.language.language_info?.language_name || "Unknown"}\n`;
        text += `Confidence: ${((result.language.confidence || 0) * 100).toFixed(2)}%\n`;
        text += `Code-Mixed: ${result.language.is_code_mixed ? "Yes" : "No"}\n`;
        text += `Romanized: ${result.language.is_romanized || result.language.language_info?.is_romanized ? "Yes" : "No"}\n\n`;
    }

    if (result.sentiment) {
        text += "SENTIMENT ANALYSIS:\n";
        text += "-".repeat(50) + "\n";
        text += `Sentiment: ${result.sentiment.label || "Unknown"}\n`;
        text += `Confidence: ${((result.sentiment.confidence || 0) * 100).toFixed(2)}%\n\n`;
    }

    if (result.toxicity) {
        text += "TOXICITY ANALYSIS:\n";
        text += "-".repeat(50) + "\n";
        text += `Toxic: ${((result.toxicity.toxic || 0) * 100).toFixed(2)}%\n`;
        text += `Severe Toxic: ${((result.toxicity.severe_toxic || 0) * 100).toFixed(2)}%\n`;
        text += `Obscene: ${((result.toxicity.obscene || 0) * 100).toFixed(2)}%\n`;
        text += `Threat: ${((result.toxicity.threat || 0) * 100).toFixed(2)}%\n`;
        text += `Insult: ${((result.toxicity.insult || 0) * 100).toFixed(2)}%\n`;
        text += `Identity Hate: ${((result.toxicity.identity_hate || 0) * 100).toFixed(2)}%\n\n`;
    }

    if (result.profanity) {
        text += "PROFANITY DETECTION:\n";
        text += "-".repeat(50) + "\n";
        text += `Has Profanity: ${result.profanity.has_profanity ? "Yes" : "No"}\n`;
        text += `Word Count: ${result.profanity.word_count || 0}\n\n`;
    }

    text += "=".repeat(50) + "\n";
    text += "Generated by Code-Mix NLP Analyzer\n";

    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `nlp-analysis-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
};

export default {
    exportPDFReport,
    exportJSON,
    exportTXT,
};
