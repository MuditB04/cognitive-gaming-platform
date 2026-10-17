"use client";

import React from "react";
import { Play, LogOut, Coffee } from "lucide-react";

interface PauseModalProps {
  isOpen: boolean;
  onResume: () => void;
  onExit: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({ isOpen, onResume, onExit }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 sm:p-12 max-w-lg w-full text-center shadow-2xl border-4 border-blue-200 space-y-8">
        <div className="w-20 h-20 mx-auto rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
          <Coffee className="w-10 h-10" />
        </div>

        <div className="space-y-3">
          <h2 className="text-3xl font-extrabold text-slate-900">Activity Paused</h2>
          <p className="text-xl sm:text-2xl text-slate-600">
            Take your time. Take a deep breath or grab a drink. Whenever you feel ready, tap Continue.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <button
            onClick={onResume}
            className="w-full min-h-[56px] px-8 py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-extrabold text-2xl flex items-center justify-center space-x-3 shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-400 transition"
          >
            <Play className="w-7 h-7 fill-white" />
            <span>Continue Activity</span>
          </button>

          <button
            onClick={onExit}
            className="w-full min-h-[48px] px-6 py-3 rounded-xl border-2 border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-lg flex items-center justify-center space-x-2 transition"
          >
            <LogOut className="w-5 h-5" />
            <span>Exit for Now</span>
          </button>
        </div>
      </div>
    </div>
  );
};
