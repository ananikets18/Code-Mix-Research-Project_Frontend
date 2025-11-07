import React from "react";

const SentimentBars = ({ sentiment }) => {
  if (!sentiment) return null;

  // Safely extract probabilities - API returns nested array [[neg, neu, pos]]
  let probs = [0, 0, 0];
  if (Array.isArray(sentiment.all_probabilities)) {
    // Flatten if nested: [[0.29, 0.30, 0.40]] -> [0.29, 0.30, 0.40]
    const flatProbs = Array.isArray(sentiment.all_probabilities[0])
      ? sentiment.all_probabilities[0]
      : sentiment.all_probabilities;

    probs = [flatProbs[0] ?? 0, flatProbs[1] ?? 0, flatProbs[2] ?? 0];
  }

  const safeProb = (v) => {
    const n = Number(v);
    if (!Number.isFinite(n)) return 0;
    // clamp to [0,1]
    return Math.max(0, Math.min(1, n));
  };

  const pNeg = safeProb(probs[0]);
  const pNeu = safeProb(probs[1]);
  const pPos = safeProb(probs[2]);

  const toPct = (p) => (p * 100).toFixed(2);

  const winner =
    typeof sentiment.label === "string"
      ? sentiment.label.toLowerCase()
      : undefined;

  const sentimentData = [
    {
      label: "Negative",
      value: toPct(pNeg),
      numericValue: pNeg,
      color: "bg-error-500",
      textColor: "text-error-700 dark:text-error-300",
      isWinner: winner === "negative",
    },
    {
      label: "Neutral",
      value: toPct(pNeu),
      numericValue: pNeu,
      color: "bg-gray-500",
      textColor: "text-gray-700 dark:text-gray-300",
      isWinner: winner === "neutral",
    },
    {
      label: "Positive",
      value: toPct(pPos),
      numericValue: pPos,
      color: "bg-success-500",
      textColor: "text-success-700 dark:text-success-300",
      isWinner: winner === "positive",
    },
  ];

  // Sort by numeric value (highest first)
  const sortedSentimentData = [...sentimentData].sort(
    (a, b) => b.numericValue - a.numericValue
  );

  return (
    <div className="space-y-2 sm:space-y-2.5 md:space-y-3 lg:space-y-3.5">
      {sortedSentimentData.map((item) => (
        <div
          key={item.label}
          className="space-y-1 sm:space-y-1 md:space-y-1.5 lg:space-y-1.5"
        >
          {/* Label and Percentage Row */}
          <div
            className="flex justify-between items-center 
                      gap-2 sm:gap-3 md:gap-4"
          >
            <span
              className={`font-medium ${item.textColor} 
                         flex items-center 
                         gap-1.5 sm:gap-2 md:gap-2 lg:gap-2.5
                         text-xs sm:text-sm md:text-sm lg:text-base
                         leading-tight`}
            >
              <span className="truncate max-w-[120px] sm:max-w-none">
                {item.label}
              </span>
              {item.isWinner && (
                <span
                  className="text-yellow-500 dark:text-yellow-400
                           text-sm sm:text-base md:text-base lg:text-lg
                           flex-shrink-0"
                  aria-label="Highest sentiment"
                >
                  ★
                </span>
              )}
            </span>
            <span
              className="text-gray-600 dark:text-gray-400
                       font-medium sm:font-semibold
                       text-xs sm:text-sm md:text-sm lg:text-base
                       tabular-nums
                       flex-shrink-0"
            >
              {item.value}%
            </span>
          </div>

          {/* Progress Bar */}
          <div
            className="w-full 
                      bg-gray-200 dark:bg-gray-700 
                      rounded-full 
                      h-2 sm:h-2.5 md:h-2.5 lg:h-3
                      overflow-hidden
                      shadow-inner"
          >
            <div
              className={`${item.color} 
                     h-full 
                     rounded-full 
                     transition-all duration-500 ease-out
                     shadow-sm`}
              style={{
                width: `${isNaN(Number(item.value)) ? 0 : item.value}%`,
              }}
              role="progressbar"
              aria-valuenow={item.value}
              aria-valuemin="0"
              aria-valuemax="100"
              aria-label={`${item.label} sentiment: ${item.value}%`}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SentimentBars;
