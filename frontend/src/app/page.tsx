"use client";

import React from "react";
import Link from "next/link";
import { Play, TrendingUp, ShieldCheck, Heart, Sparkles, Brain, CheckCircle2 } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      {/* Navigation Header */}
      <header className="w-full bg-white border-b-2 border-slate-200 px-6 py-5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-md">
              <Brain className="w-7 h-7" />
            </div>
            <div>
              <span className="text-2xl font-black text-slate-900 tracking-tight block">
                MindPlay
              </span>
              <span className="text-sm font-semibold text-slate-500 block">
                Cognitive Engagement & Memory Platform
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              href="/progress"
              className="min-h-[48px] px-5 py-2.5 rounded-xl border-2 border-slate-300 bg-white hover:bg-slate-100 text-slate-800 font-bold text-lg flex items-center space-x-2 transition"
            >
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <span>My Progress</span>
            </Link>
            <Link
              href="/admin"
              className="text-sm font-bold text-slate-500 hover:text-slate-800 underline hidden sm:inline"
            >
              Dev Dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* Main Hero Content */}
      <main className="max-w-4xl mx-auto px-6 py-12 text-center space-y-10 my-auto">
        <div className="inline-flex items-center space-x-2 px-5 py-2 rounded-full bg-blue-100 text-blue-900 font-bold text-lg">
          <Sparkles className="w-5 h-5 text-blue-700" />
          <span>Gentle, Accessible Cognitive Activities</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-tight">
          Keep Your Mind Active With Enjoyable Daily Activities
        </h1>

        <p className="text-2xl sm:text-3xl text-slate-700 leading-relaxed font-medium max-w-3xl mx-auto">
          Four simple visual games designed for calm engagement, observation, and gentle memory stimulation.
        </p>

        {/* 4 Activities Feature Pills */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto text-left pt-2">
          <div className="p-4 rounded-2xl bg-white border-2 border-slate-200 flex items-center space-x-3 shadow-sm">
            <span className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 font-black flex items-center justify-center text-lg">1</span>
            <span className="text-xl font-bold text-slate-800">Object Sequence Memory</span>
          </div>
          <div className="p-4 rounded-2xl bg-white border-2 border-slate-200 flex items-center space-x-3 shadow-sm">
            <span className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 font-black flex items-center justify-center text-lg">2</span>
            <span className="text-xl font-bold text-slate-800">Circle Identification & Attention</span>
          </div>
          <div className="p-4 rounded-2xl bg-white border-2 border-slate-200 flex items-center space-x-3 shadow-sm">
            <span className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 font-black flex items-center justify-center text-lg">3</span>
            <span className="text-xl font-bold text-slate-800">Calculation & Word Recall</span>
          </div>
          <div className="p-4 rounded-2xl bg-white border-2 border-slate-200 flex items-center space-x-3 shadow-sm">
            <span className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 font-black flex items-center justify-center text-lg">4</span>
            <span className="text-xl font-bold text-slate-800">Shape Pattern Matching</span>
          </div>
        </div>

        {/* Primary CTA */}
        <div className="pt-6 flex flex-col sm:flex-row gap-5 justify-center max-w-md mx-auto">
          <Link
            href="/assessment"
            className="min-h-[64px] px-8 rounded-2xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-extrabold text-2xl sm:text-3xl flex items-center justify-center space-x-3 shadow-xl focus:ring-4 focus:ring-blue-400 transition"
          >
            <Play className="w-8 h-8 fill-white" />
            <span>Start Activities</span>
          </Link>
        </div>

        {/* Non-clinical disclaimer banner */}
        <div className="bg-slate-100 border-2 border-slate-300 rounded-2xl p-5 max-w-2xl mx-auto text-center space-y-2">
          <div className="flex items-center justify-center space-x-2 text-slate-700 font-bold text-lg">
            <ShieldCheck className="w-6 h-6 text-slate-600" />
            <span>Non-Diagnostic Activity Notice</span>
          </div>
          <p className="text-base text-slate-600 leading-relaxed">
            These activities are experimental games designed for engagement and memory observation.
            They are not validated clinical diagnostic instruments and do not diagnose dementia or Alzheimer&apos;s disease.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-white border-t-2 border-slate-200 py-6 text-center text-slate-500 text-base">
        <p>MindPlay Cognitive Platform • Designed for accessibility, comfort, and independence.</p>
      </footer>
    </div>
  );
}
