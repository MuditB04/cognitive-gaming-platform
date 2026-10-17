"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { api, UserProgress } from "@/lib/api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  TrendingUp,
  ArrowLeft,
  Calendar,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
} from "lucide-react";

export default function ProgressPage() {
  const [progressData, setProgressData] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProgress() {
      // Look up saved user_id or prompt
      let userId = localStorage.getItem("assessment_user_id");
      if (!userId) {
        // Check if there was a session stored
        const storedSession = localStorage.getItem("current_assessment_session");
        if (storedSession) {
          try {
            userId = JSON.parse(storedSession).user_id;
          } catch {}
        }
      }

      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        const data = await api.getUserProgress(userId);
        setProgressData(data);
      } catch (err: any) {
        setError(err.message || "Failed to load progress history");
      } finally {
        setLoading(false);
      }
    }

    loadProgress();
  }, []);

  // Prepare chart series from completed sessions
  const chartData = (progressData?.sessions || [])
    .filter((s) => s.status === "completed")
    .map((s, idx) => {
      const acts = s.activities || {};
      const dateLabel = s.completed_at
        ? new Date(s.completed_at).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
          })
        : `Session ${idx + 1}`;

      return {
        name: dateLabel,
        "Object Memory (%)": acts.object_memory?.metrics?.position_accuracy ?? null,
        "Circle Search (%)": acts.circle_search?.metrics?.target_detection_rate ?? null,
        "Calculation (%)": acts.calculation_recall?.metrics?.calculation?.calculation_accuracy ?? null,
        "Word Recall (%)": acts.calculation_recall?.metrics?.word_recall?.word_recall_accuracy ?? null,
        "Shape Matching (%)": acts.shape_recognition?.metrics?.shape_accuracy ?? null,
      };
    })
    .reverse();

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Navigation & Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/"
            className="inline-flex items-center space-x-2 text-slate-700 hover:text-slate-900 font-bold text-xl"
          >
            <ArrowLeft className="w-6 h-6" />
            <span>Back to Home</span>
          </Link>
          <Link
            href="/assessment"
            className="min-h-[48px] px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg shadow transition"
          >
            Start New Session
          </Link>
        </div>

        <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-lg border-2 border-slate-200 space-y-3">
          <span className="text-blue-600 font-bold uppercase tracking-wider text-base">
            Longitudinal Observation
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Activity Progress & History
          </h1>
          <p className="text-xl sm:text-2xl text-slate-600 font-medium">
            Review your activity performance and trend consistency across completed sessions.
          </p>
        </div>

        {/* Disclaimer */}
        <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-6 flex items-start space-x-4">
          <ShieldCheck className="w-7 h-7 text-amber-700 flex-shrink-0 mt-1" />
          <p className="text-base sm:text-lg text-amber-900 leading-relaxed font-medium">
            These metrics represent performance on experimental cognitive exercises and must not be used as clinical diagnostic thresholds for dementia or Alzheimer&apos;s disease.
          </p>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-500 font-bold text-2xl">
            Loading your progress...
          </div>
        ) : !progressData || progressData.sessions.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border-2 border-slate-200 space-y-6">
            <Calendar className="w-16 h-16 text-slate-400 mx-auto" />
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">
              No Previous Sessions Found
            </h2>
            <p className="text-xl text-slate-600 max-w-lg mx-auto">
              Once you complete an assessment session, your like-for-like activity performance will be tracked here.
            </p>
            <Link
              href="/assessment"
              className="inline-block min-h-[56px] px-8 py-3 bg-blue-600 text-white font-bold rounded-2xl text-xl shadow"
            >
              Start First Session
            </Link>
          </div>
        ) : (
          <>
            {/* Visual Trend Chart */}
            {chartData.length > 0 && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-lg border-2 border-slate-200 space-y-6">
                <div className="flex items-center justify-between border-b-2 border-slate-100 pb-4">
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                    Performance Trends Across Sessions
                  </h2>
                  <span className="text-slate-500 font-bold text-base">Accuracy (%)</span>
                </div>
                <div className="w-full h-80 sm:h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 10 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="name" stroke="#64748b" style={{ fontSize: "14px", fontWeight: "bold" }} />
                      <YAxis domain={[0, 100]} stroke="#64748b" style={{ fontSize: "14px" }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#ffffff",
                          borderRadius: "16px",
                          border: "2px solid #cbd5e1",
                          boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                          fontSize: "15px",
                          fontWeight: "bold",
                        }}
                      />
                      <Legend wrapperStyle={{ paddingTop: "12px", fontSize: "14px", fontWeight: "bold" }} />
                      <Line type="monotone" dataKey="Object Memory (%)" stroke="#2563eb" strokeWidth={3} dot={{ r: 6 }} />
                      <Line type="monotone" dataKey="Circle Search (%)" stroke="#16a34a" strokeWidth={3} dot={{ r: 6 }} />
                      <Line type="monotone" dataKey="Calculation (%)" stroke="#d97706" strokeWidth={3} dot={{ r: 6 }} />
                      <Line type="monotone" dataKey="Word Recall (%)" stroke="#9333ea" strokeWidth={3} dot={{ r: 6 }} />
                      <Line type="monotone" dataKey="Shape Matching (%)" stroke="#4f46e5" strokeWidth={3} dot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* List of Past Sessions */}
            <div className="space-y-4">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Session Log ({progressData.total_sessions} total)
              </h2>

              <div className="space-y-4">
                {progressData.sessions.map((s, idx) => (
                  <div
                    key={s.session_id}
                    className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border-2 border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-bold uppercase ${
                            s.status === "completed"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {s.status === "completed" ? "Completed" : "Incomplete / Paused"}
                        </span>
                        <span className="text-slate-400 font-medium text-sm">
                          ID: {s.session_id.slice(0, 8)}...
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-xl font-bold text-slate-900">
                        <Clock className="w-5 h-5 text-slate-500" />
                        <span>
                          {s.started_at ? new Date(s.started_at).toLocaleString() : "Date unknown"}
                        </span>
                      </div>
                      <p className="text-lg text-slate-600 font-medium">
                        Activities completed: <span className="font-bold text-slate-900">{s.activities_completed} of 4</span>
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {Object.keys(s.activities || {}).map((gameKey) => (
                        <span
                          key={gameKey}
                          className="px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-sm font-bold capitalize border border-slate-300"
                        >
                          {gameKey.replace("_", " ")}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
