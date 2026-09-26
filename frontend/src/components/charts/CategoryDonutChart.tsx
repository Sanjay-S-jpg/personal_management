import React, { useState } from 'react';
import { CategorySummary } from '../../types/expense';

interface CategoryDonutChartProps {
  categories: CategorySummary[];
  totalSpent: number;
}

const CATEGORY_COLORS: Record<string, string> = {
  Food: '#38bdf8',          // Sky
  Fuel: '#f59e0b',          // Amber
  Orders: '#818cf8',        // Indigo
  'Family Expense': '#ec4899', // Pink
  'Office Expense': '#10b981', // Emerald
  Friends: '#a855f7',       // Purple
  Things: '#06b6d4',        // Cyan
  Savings: '#22c55e',       // Green
  Others: '#94a3b8',        // Slate
};

export const CategoryDonutChart: React.FC<CategoryDonutChartProps> = ({ categories, totalSpent }) => {
  const [hoveredCategory, setHoveredCategory] = useState<CategorySummary | null>(null);

  if (!categories || categories.length === 0 || totalSpent <= 0) {
    return (
      <div className="h-64 flex flex-col items-center justify-center text-center p-4 text-neutral-400">
        <p className="text-sm">No categorical spending recorded yet</p>
        <span className="text-xs text-neutral-500 mt-1">Expenses logged will automatically generate breakdown</span>
      </div>
    );
  }

  // Calculate SVG arc segments for a donut chart
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  let accumulatedPercent = 0;

  const activeCategory = hoveredCategory || categories[0];

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-2">
      {/* SVG Donut */}
      <div className="relative w-48 h-48 shrink-0 flex items-center justify-center">
        <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 160 160">
          {/* Background circle track */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            className="stroke-neutral-800"
            strokeWidth="18"
            fill="transparent"
          />

          {categories.map((cat) => {
            const fraction = cat.total / totalSpent;
            const strokeDasharray = `${fraction * circumference} ${circumference}`;
            const strokeDashoffset = -accumulatedPercent * circumference;
            accumulatedPercent += fraction;

            const color = CATEGORY_COLORS[cat.category] || '#94a3b8';
            const isSelected = hoveredCategory?.category === cat.category;

            return (
              <circle
                key={cat.category}
                cx="80"
                cy="80"
                r={radius}
                fill="transparent"
                stroke={color}
                strokeWidth={isSelected ? '22' : '18'}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-200 cursor-pointer"
                onMouseEnter={() => setHoveredCategory(cat)}
                onMouseLeave={() => setHoveredCategory(null)}
              />
            );
          })}
        </svg>

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
          <span className="text-xs text-neutral-400 font-medium truncate max-w-[100px]">
            {activeCategory.category}
          </span>
          <span className="text-lg font-bold text-neutral-100 tabular-nums">
            ${activeCategory.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          <span className="text-[11px] text-neutral-400 tabular-nums">
            {((activeCategory.total / totalSpent) * 100).toFixed(1)}%
          </span>
        </div>
      </div>

      {/* Categorical breakdown list */}
      <div className="flex-1 w-full space-y-2 max-h-56 overflow-y-auto pr-1">
        {categories.map((cat) => {
          const color = CATEGORY_COLORS[cat.category] || '#94a3b8';
          const pct = ((cat.total / totalSpent) * 100).toFixed(1);
          const isHovered = hoveredCategory?.category === cat.category;

          return (
            <div
              key={cat.category}
              onMouseEnter={() => setHoveredCategory(cat)}
              onMouseLeave={() => setHoveredCategory(null)}
              className={`flex items-center justify-between text-xs p-2 rounded-lg transition-colors cursor-pointer ${
                isHovered ? 'bg-neutral-800 text-white' : 'hover:bg-neutral-800/50 text-neutral-300'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate mr-2">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: color }}
                />
                <span className="font-medium truncate">{cat.category}</span>
                <span className="text-neutral-500 text-[11px]">· {cat.count} {cat.count === 1 ? 'item' : 'items'}</span>
              </div>
              <div className="flex items-center gap-3 shrink-0 tabular-nums font-mono">
                <span className="text-neutral-400">{pct}%</span>
                <span className="font-semibold text-neutral-100">
                  ${cat.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
