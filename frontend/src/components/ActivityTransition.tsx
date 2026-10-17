"use client";

import React from "react";
import { CheckCircle2, ArrowRight } from "lucide-react";

interface ActivityTransitionProps {
  activityTitle: string;
  onContinue: () => void;
  nextActivityTitle: string;
}

export const ActivityTransition: React.FC<ActivityTransitionProps> = ({
  activityTitle,
  onContinue,
  nextActivityTitle,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 sm:p-12 max-w-xl w-full text-center shadow-2xl border-4 border-emerald-300 space-y-8 animate-fadeIn">
        <div className="w-24 h-24 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
          <CheckCircle2 className="w-14 h-14" />
        </div>

        <div className="space-y-4">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
            Activity Completed
          </h2>
          <p className="text-2xl text-slate-700 leading-relaxed font-medium">
            Your responses have been recorded safely. Let&apos;s move to the next activity:
          </p>
          <div className="p-4 bg-blue-50 rounded-2xl border-2 border-blue-200 text-blue-900 font-bold text-2xl">
            {nextActivityTitle}
          </div>
        </div>

        <button
          onClick={onContinue}
          className="w-full min-h-[60px] px-8 py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-extrabold text-2xl flex items-center justify-center space-x-3 shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-400 transition cursor-pointer"
        >
          <span>Continue</span>
          <ArrowRight className="w-7 h-7" />
        </button>
      </div>
    </div>
  );
};
