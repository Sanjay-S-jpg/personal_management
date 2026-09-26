import { ReactNode } from 'react';

export type ModuleId = 'expense-tracker' | 'wardrobe' | 'tasks' | 'wellness';

export interface AppModule {
  id: ModuleId;
  name: string;
  tagline: string;
  description: string;
  iconName: string;
  status: 'active' | 'coming_soon';
  path: string;
  badge?: string;
  highlights: string[];
}

export const APP_MODULES: AppModule[] = [
  {
    id: 'expense-tracker',
    name: 'Expense Tracker',
    tagline: 'Track spending, view analytics, and control your personal budget',
    description: 'Comprehensive financial dashboard, transaction histories, categorical breakdowns, and weekly/monthly trends.',
    iconName: 'Receipt',
    status: 'active',
    path: '/expenses',
    highlights: ['Multi-Category Budgets', 'Daily Trend Analytics', 'Weekly & Monthly Summaries'],
  },
  {
    id: 'wardrobe',
    name: 'Wardrobe',
    tagline: 'Digital closet organization, outfit planner, and style tracking',
    description: 'Catalog your clothing items, plan outfits according to weather, log wear frequency, and curate capsule collections.',
    iconName: 'Shirt',
    status: 'coming_soon',
    badge: 'Coming Soon',
    path: '/wardrobe',
    highlights: ['Capsule Wardrobe Planner', 'Wear Frequency Analytics', 'Weather-smart Outfit Suggestions'],
  },
  {
    id: 'tasks',
    name: 'Task & Focus Planner',
    tagline: 'Prioritize daily objectives and monitor completion velocity',
    description: 'Integrated personal management task board with urgency scoring, context tagging, and recurring rhythms.',
    iconName: 'CheckSquare',
    status: 'coming_soon',
    badge: 'Roadmap',
    path: '/tasks',
    highlights: ['Priority Matrix', 'Recurring Focus Routines', 'Milestone Completion Logs'],
  },
  {
    id: 'wellness',
    name: 'Habits & Wellness',
    tagline: 'Daily habit streaks, hydration, and restorative sleep metrics',
    description: 'Holistic life rhythms tracking paired with micro-reflections and streak resilience indicators.',
    iconName: 'HeartPulse',
    status: 'coming_soon',
    badge: 'Roadmap',
    path: '/wellness',
    highlights: ['Streak Resilience Tracking', 'Daily Water & Vitality', 'Evening Journal Prompts'],
  },
];
