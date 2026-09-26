import React from 'react';

interface DayMetric {
  dayName: string;
  dateStr: string;
  total: number;
  count: number;
}

interface WeeklyBarChartProps {
  days: DayMetric[];
  weekTotal: number;
}

export const WeeklyBarChart: React.FC<WeeklyBarChartProps> = ({ days, weekTotal }) => {
  const maxDay = Math.max(...days.map((d) => d.total), 1);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-7 gap-2 h-44 items-end pt-4 pb-2 border-b border-neutral-800">
        {days.map((d) => {
          const heightPct = Math.max(Math.round((d.total / maxDay) * 100), d.total > 0 ? 8 : 2);
          const isHighest = d.total === maxDay && d.total > 0;

          return (
            <div key={d.dateStr} className="flex flex-col items-center h-full justify-end group">
              {/* Tooltip on hover */}
              <div className="opacity-0 group-hover:opacity-100 transition-opacity mb-1 px-1.5 py-0.5 bg-neutral-950 border border-neutral-700 text-neutral-200 rounded text-[10px] font-mono whitespace-nowrap pointer-events-none">
                ${d.total.toFixed(2)}
              </div>

              {/* Bar */}
              <div
                className={`w-full max-w-[42px] rounded-t transition-all ${
                  isHighest
                    ? 'bg-amber-500 shadow-md shadow-amber-500/20'
                    : d.total > 0
                    ? 'bg-indigo-600 group-hover:bg-indigo-500'
                    : 'bg-neutral-800'
                }`}
                style={{ height: `${heightPct}%` }}
              />

              {/* Labels */}
              <div className="mt-2 text-center">
                <span className="text-xs font-medium block text-neutral-300">{d.dayName}</span>
                <span className="text-[10px] text-neutral-400 block font-mono">
                  ${d.total > 0 ? d.total.toFixed(0) : '0'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-between items-center text-xs text-neutral-400 px-1">
        <span>Daily Distribution</span>
        <span className="tabular-nums font-mono font-medium text-neutral-200">
          Week Total: ${weekTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
      </div>
    </div>
  );
};
