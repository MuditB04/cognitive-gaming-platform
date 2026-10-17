"use client";

import React, { useState } from "react";
import { Pause, LogOut, Info } from "lucide-react";

interface ActivityHeaderProps {
  title: string;
  stepNumber: number;
  totalSteps?: number;
  onPause: () => void;
  onExit: () => void;
}

export const ActivityHeader: React.FC<ActivityHeaderProps> = ({
  title,
  stepNumber,
  totalSteps = 4,
  onPause,
  onExit,
}) => {
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  return (
    <>
      <header className="w-full bg-white border-b-2 border-slate-200 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <span className="px-4 py-2 bg-blue-100 text-blue-900 rounded-full font-bold text-lg">
            Activity {stepNumber} of {totalSteps}
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {title}
          </h1>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={onPause}
            className="flex items-center space-x-2 min-h-[48px] px-5 py-2.5 rounded-xl border-2 border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold text-lg focus:outline-none focus:ring-4 focus:ring-blue-400 transition"
            aria-label="Pause the current activity"
          >
            <Pause className="w-6 h-6 text-slate-700" />
            <span>Pause</span>
          </button>

          <button
            onClick={() => setShowExitConfirm(true)}
            className="flex items-center space-x-2 min-h-[48px] px-5 py-2.5 rounded-xl border-2 border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-800 font-bold text-lg focus:outline-none focus:ring-4 focus:ring-rose-400 transition"
            aria-label="Exit the assessment"
          >
            <LogOut className="w-6 h-6 text-rose-700" />
            <span>Exit</span>
          </button>
        </div>
      </header>

      {/* Exit Confirmation Modal */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl border-2 border-slate-300 text-center space-y-6">
            <h2 className="text-2xl font-bold text-slate-900">Do you want to exit?</h2>
            <p className="text-xl text-slate-600 leading-relaxed">
              Your completed activities have been safely saved. You can always come back and try again later.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setShowExitConfirm(false)}
                className="min-h-[52px] px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xl shadow focus:ring-4 focus:ring-blue-400"
              >
                Keep Playing
              </button>
              <button
                onClick={() => {
                  setShowExitConfirm(false);
                  onExit();
                }}
                className="min-h-[52px] px-6 py-3 rounded-xl border-2 border-slate-300 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xl"
              >
                Exit to Home
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
