import React from 'react';
import { Shirt, Sparkles, ArrowLeft, Calendar, Tag, Layers, CheckCircle2 } from 'lucide-react';

interface WardrobePageProps {
  onBackHome: () => void;
  onOpenExpenses: () => void;
}

export const WardrobePage: React.FC<WardrobePageProps> = ({ onBackHome, onOpenExpenses }) => {
  const upcomingFeatures = [
    {
      title: 'Digital Closet Catalog',
      desc: 'Photograph and categorize shirts, bottoms, outerwear, and accessories with color & fabric metadata.',
      icon: <Shirt className="w-5 h-5 text-indigo-400" />,
    },
    {
      title: 'Capsule Wardrobe Planner',
      desc: 'Build cohesive 10-30 piece seasonal rotations and calculate cost-per-wear metrics.',
      icon: <Layers className="w-5 h-5 text-pink-400" />,
    },
    {
      title: 'Outfit Calendar & Scheduling',
      desc: 'Plan weekly outfits based on local weather forecasts and scheduled calendar appointments.',
      icon: <Calendar className="w-5 h-5 text-emerald-400" />,
    },
    {
      title: 'Care & Laundry Tracking',
      desc: 'Track dry cleaning schedules, delicate garments wash logs, and maintenance reminders.',
      icon: <Tag className="w-5 h-5 text-amber-400" />,
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Back button */}
      <div>
        <button
          onClick={onBackHome}
          className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Personal Overview</span>
        </button>
      </div>

      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-neutral-900 border border-neutral-800 p-8 sm:p-10 text-center flex flex-col items-center">
        <div className="w-16 h-16 rounded-2xl bg-neutral-800 border border-neutral-700 flex items-center justify-center mb-6 shadow-xl">
          <Shirt className="w-8 h-8 text-pink-400" />
        </div>

        <span className="text-xs font-semibold text-pink-400 tracking-wider uppercase mb-2">
          Module In Development
        </span>
        <h1 className="text-3xl font-bold text-neutral-100 tracking-tight">
          Wardrobe Management
        </h1>
        <p className="text-sm text-neutral-400 max-w-xl mt-3 leading-relaxed">
          The Wardrobe module is currently being finalized. It will integrate directly with your Personal Management account and provide intelligent closet curation.
        </p>

        <div className="flex flex-wrap justify-center gap-3 mt-8">
          <button
            onClick={onOpenExpenses}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg transition-colors"
          >
            Go to Expense Tracker
          </button>
          <button
            onClick={onBackHome}
            className="px-5 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold rounded-lg transition-colors"
          >
            Return to Dashboard
          </button>
        </div>
      </div>

      {/* Planned Feature Architecture */}
      <div className="space-y-4">
        <h2 className="text-base font-semibold text-neutral-200">
          Planned Module Capabilities
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {upcomingFeatures.map((feat, idx) => (
            <div
              key={idx}
              className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 flex items-start gap-4"
            >
              <div className="p-2.5 rounded-lg bg-neutral-950 border border-neutral-800 shrink-0">
                {feat.icon}
              </div>
              <div>
                <h3 className="text-sm font-semibold text-neutral-100">{feat.title}</h3>
                <p className="text-xs text-neutral-400 mt-1 leading-relaxed">{feat.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
