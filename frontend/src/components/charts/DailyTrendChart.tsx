import React, { useState } from 'react';
import { DailySpending } from '../../types/expense';

interface DailyTrendChartProps {
  data: DailySpending[];
}

export const DailyTrendChart: React.FC<DailyTrendChartProps> = ({ data }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (!data || data.length === 0) {
    return (
      <div className="h-48 flex items-center justify-center text-sm text-neutral-400">
        No daily spending data available
      </div>
    );
  }

  const maxDaily = Math.max(...data.map((d) => d.total), 10);

  return (
    <div className="w-full space-y-4">
      <div className="h-48 flex items-end justify-between gap-2 pt-6 pb-2 px-2 border-b border-neutral-800">
        {data.map((item, idx) => {
          const heightPct = Math.max(Math.round((item.total / maxDaily) * 100), item.total > 0 ? 8 : 2);
          const isHovered = hoveredIndex === idx;

          return (
            <div
              key={item.date}
              className="relative flex-1 flex flex-col items-center h-full justify-end group cursor-pointer"
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Tooltip on hover */}
              {isHovered && (
                <div className="absolute -top-10 z-20 px-2 py-1 bg-neutral-950 border border-neutral-700 text-neutral-100 rounded text-[11px] font-mono whitespace-nowrap shadow-lg pointer-events-none">
                  <div className="font-semibold">${item.total.toFixed(2)}</div>
                  <div className="text-[10px] text-neutral-400">{item.date}</div>
                </div>
              )}

              {/* Bar */}
              <div
                className={`w-full max-w-[36px] rounded-t transition-all duration-200 ${
                  isHovered
                    ? 'bg-indigo-400 shadow-md shadow-indigo-500/20'
                    : item.total > 0
                    ? 'bg-indigo-600/80 hover:bg-indigo-500'
                    : 'bg-neutral-800'
                }`}
                style={{ height: `${heightPct}%` }}
              />

              {/* Day label */}
              <div className="mt-2 text-center">
                <span
                  className={`text-[11px] block transition-colors ${
                    isHovered ? 'text-indigo-400 font-semibold' : 'text-neutral-400'
                  }`}
                >
                  {item.dayLabel}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between text-xs text-neutral-400 px-1">
        <span>7-Day Activity Horizon</span>
        <span className="tabular-nums font-mono">
          Max: ${maxDaily.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
      </div>
    </div>
  );
};
