import React from 'react';

const LanguageComposition = ({ composition }) => {
  if (!composition) return null;

  const data = [
    { 
      name: 'Latin Script', 
      value: composition.latin_percentage || 0, 
      color: 'bg-primary-500',
      textColor: 'text-primary-700 dark:text-primary-300'
    },
    { 
      name: 'Indic Script', 
      value: composition.indic_percentage || 0, 
      color: 'bg-warning-500',
      textColor: 'text-warning-700 dark:text-warning-300'
    },
    { 
      name: 'Emojis & Other', 
      value: composition.other_percentage || 0, 
      color: 'bg-secondary-500',
      textColor: 'text-secondary-700 dark:text-secondary-300'
    }
  ];

  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="space-y-2 sm:space-y-3 md:space-y-4">
      
      {/* Stacked Bar */}
      <div className="relative">
        <div className="flex w-full 
                        h-6 sm:h-7 md:h-8 lg:h-9 
                        rounded-md sm:rounded-lg md:rounded-lg 
                        overflow-hidden 
                        shadow-sm">
          {data.map((item, index) => (
            item.value > 0 && (
              <div
                key={index}
                className={`${item.color} 
                           flex items-center justify-center 
                           text-white 
                           font-semibold
                           text-[10px] sm:text-xs md:text-xs lg:text-sm
                           transition-all duration-500 ease-out
                           hover:brightness-110`}
                style={{ width: `${(item.value / total) * 100}%` }}
                role="progressbar"
                aria-valuenow={item.value}
                aria-valuemin="0"
                aria-valuemax="100"
                aria-label={`${item.name}: ${item.value.toFixed(1)}%`}
              >
                {item.value > 5 && `${item.value.toFixed(1)}%`}
              </div>
            )
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-3 
                      gap-1.5 sm:gap-2 md:gap-2.5 lg:gap-3">
        {data.map((item, index) => (
          <div key={index} 
               className="flex items-center 
                          gap-1 sm:gap-1.5 md:gap-2 
                          min-w-0">
            <div className={`flex-shrink-0
                           w-2.5 h-2.5 
                           sm:w-3 sm:h-3 
                           md:w-3 md:h-3
                           lg:w-3.5 lg:h-3.5
                           rounded 
                           ${item.color}`}
                 aria-hidden="true">
            </div>
            <div className="flex flex-col min-w-0 gap-0.5">
              <span className="text-gray-600 dark:text-gray-400
                             text-[10px] sm:text-xs md:text-xs
                             truncate
                             leading-tight">
                {item.name}
              </span>
              <span className={`font-semibold ${item.textColor}
                              text-xs sm:text-sm md:text-sm lg:text-base
                              tabular-nums
                              leading-none`}>
                {item.value.toFixed(1)}%
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Code-Mixed Badge */}
      {composition.is_code_mixed && (
        <div className="bg-secondary-50 dark:bg-secondary-900/30 
                        border border-secondary-200 dark:border-secondary-700 
                        rounded-md sm:rounded-lg md:rounded-lg 
                        p-2 sm:p-2.5 md:p-3 lg:p-3.5
                        shadow-sm">
          <div className="flex items-start 
                          gap-1.5 sm:gap-2 md:gap-2.5">
            <span className="text-base sm:text-lg md:text-xl 
                           flex-shrink-0 
                           leading-none"
                  aria-hidden="true">
              🔄
            </span>
            <div className="flex-1 min-w-0">
              <div className="font-semibold 
                            text-secondary-700 dark:text-secondary-300 
                            text-xs sm:text-sm md:text-sm lg:text-base
                            leading-tight
                            mb-0.5 sm:mb-1">
                Code-Mixed Text
              </div>
              <div className="text-gray-600 dark:text-gray-400
                            text-[10px] sm:text-xs md:text-xs lg:text-sm
                            leading-relaxed
                            break-words">
                Multiple scripts detected - Dominant: <span className="font-medium">{composition.dominant_script}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageComposition;
