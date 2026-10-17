"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import { Play, ArrowLeft, Sparkles, CheckCircle2 } from "lucide-react";

export default function AssessmentIntroPage() {
  const router = useRouter();
  const [ageGroup, setAgeGroup] = useState<string>("70-79");
  const [difficulty, setDifficulty] = useState<string>("medium");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleStartSession = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Create session in backend
      const session = await api.createSession(ageGroup, "en");
      localStorage.setItem("current_assessment_session", JSON.stringify(session));
      localStorage.setItem("assessment_difficulty", difficulty);
      localStorage.setItem("assessment_user_id", session.user_id);

      // Navigate to Activity 1
      router.push("/assessment/object-memory");
    } catch (err: any) {
      setError(err.message || "Failed to start session. Please ensure backend is reachable.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 flex flex-col justify-center">
      <div className="max-w-2xl mx-auto w-full bg-white rounded-3xl p-8 sm:p-12 shadow-xl border-3 border-slate-300 space-y-8">
        <Link
          href="/"
          className="inline-flex items-center space-x-2 text-slate-600 hover:text-slate-900 font-bold text-lg mb-2"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Home</span>
        </Link>

        <div className="space-y-3 text-center sm:text-left">
          <span className="text-blue-600 font-bold uppercase tracking-wider text-base">
            Session Introduction
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
            Welcome to Your Cognitive Session
          </h1>
          <p className="text-xl sm:text-2xl text-slate-600 font-medium leading-relaxed">
            You will complete 4 short, friendly activities. There is no time limit pressure. You can pause at any time.
          </p>
        </div>

        {error && (
          <div className="p-4 rounded-2xl bg-rose-50 border-2 border-rose-300 text-rose-800 text-lg font-bold">
            {error}
          </div>
        )}

        {/* Configuration Options */}
        <div className="space-y-6 pt-2">
          {/* Age group (optional) */}
          <div className="space-y-3">
            <label className="block text-xl font-bold text-slate-800">
              Select Age Group (optional):
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(["60-69", "70-79", "80+"] as const).map((age) => (
                <button
                  key={age}
                  type="button"
                  onClick={() => setAgeGroup(age)}
                  className={`min-h-[52px] rounded-xl font-bold text-xl border-2 transition ${
                    ageGroup === age
                      ? "bg-blue-600 text-white border-blue-700 shadow-md ring-4 ring-blue-300"
                      : "bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200"
                  }`}
                >
                  {age}
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty Level */}
          <div className="space-y-3">
            <label className="block text-xl font-bold text-slate-800">
              Select Game Difficulty:
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(["easy", "medium", "advanced"] as const).map((diff) => (
                <button
                  key={diff}
                  type="button"
                  onClick={() => setDifficulty(diff)}
                  className={`min-h-[52px] rounded-xl font-bold text-xl capitalize border-2 transition ${
                    difficulty === diff
                      ? "bg-blue-600 text-white border-blue-700 shadow-md ring-4 ring-blue-300"
                      : "bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200"
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Start Button */}
        <div className="pt-4">
          <button
            onClick={handleStartSession}
            disabled={isLoading}
            className="w-full min-h-[64px] rounded-2xl bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-extrabold text-2xl sm:text-3xl flex items-center justify-center space-x-3 shadow-xl focus:ring-4 focus:ring-blue-400 transition cursor-pointer"
          >
            <Play className="w-8 h-8 fill-white" />
            <span>{isLoading ? "Preparing Session..." : "Begin Activity 1"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
