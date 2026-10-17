"use client";

import React from "react";
import { Play, Volume2, HelpCircle } from "lucide-react";

interface InstructionCardProps {
  title: string;
  instructions: string;
  exampleText?: string;
  onStart: () => void;
  isLoading?: boolean;
  difficulty?: string;
  onDifficultyChange?: (diff: string) => void;
}

export const InstructionCard: React.FC<InstructionCardProps> = ({
  title,
  instructions,
  exampleText,
  onStart,
  isLoading = false,
  difficulty = "medium",
  onDifficultyChange,
}) => {
  return (
    <div className="max-w-3xl mx-auto my-8 bg-white border-3 border-slate-300 rounded-3xl p-8 sm:p-12 shadow-xl space-y-8">
      <div className="border-b-2 border-slate-200 pb-6 flex items-start justify-between">
        <div>
          <span className="text-blue-600 font-bold uppercase tracking-wider text-sm sm:text-base">
            Instructions
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-1">
            {title}
          </h2>
        </div>
      </div>

      <div className="bg-blue-50/70 border-2 border-blue-200 rounded-2xl p-6 sm:p-8">
        <p className="text-2xl sm:text-3xl font-medium text-slate-800 leading-relaxed">
          {instructions}
        </p>
      </div>

      {exampleText && (
        <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-6 flex items-start space-x-4">
          <HelpCircle className="w-8 h-8 text-amber-600 flex-shrink-0 mt-1" />
          <p className="text-xl sm:text-2xl text-amber-900 font-medium leading-relaxed">
            {exampleText}
          </p>
        </div>
      )}

      {onDifficultyChange && (
        <div className="space-y-3 pt-2">
          <label className="block text-xl font-bold text-slate-800">
            Difficulty Level:
          </label>
          <div className="grid grid-cols-3 gap-4">
            {(["easy", "medium", "advanced"] as const).map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => onDifficultyChange(lvl)}
                className={`min-h-[52px] rounded-xl font-bold text-xl capitalize border-2 transition ${
                  difficulty === lvl
                    ? "bg-blue-600 text-white border-blue-700 shadow-md ring-4 ring-blue-300"
                    : "bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200"
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="pt-4">
        <button
          onClick={onStart}
          disabled={isLoading}
          className="w-full min-h-[64px] rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-extrabold text-2xl sm:text-3xl flex items-center justify-center space-x-4 shadow-xl focus:outline-none focus:ring-4 focus:ring-emerald-400 transition cursor-pointer"
        >
          <Play className="w-8 h-8 fill-white" />
          <span>{isLoading ? "Starting Activity..." : "Start Activity"}</span>
        </button>
      </div>
    </div>
  );
};
