"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api, SessionReport } from "@/lib/api";
import { CheckCircle2, TrendingUp, Home, AlertCircle, Info, Sparkles } from "lucide-react";

export default function AssessmentCompletePage() {
  const router = useRouter();
  const [report, setReport] = useState<SessionReport | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadReport() {
      const stored = localStorage.getItem("current_assessment_session");
      if (!stored) {
        router.push("/assessment");
        return;
      }

      try {
        const session = JSON.parse(stored);
        // Complete the session in the backend
        await api.completeSession(session.id).catch(() => {});
        // Fetch report
        const rep = await api.getSessionReport(session.id);
        setReport(rep);
      } catch (err: any) {
        setError(err.message || "Failed to load session report");
      } finally {
        setLoading(false);
      }
    }

    loadReport();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <h2 className="text-2xl font-bold text-slate-800">Preparing your session summary...</h2>
        </div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl border-2 border-rose-300 text-center space-y-6">
          <AlertCircle className="w-12 h-12 text-rose-600 mx-auto" />
          <h2 className="text-2xl font-bold text-slate-900">Summary Unavailable</h2>
          <p className="text-lg text-slate-600">{error || "Could not retrieve activity metrics."}</p>
          <Link
            href="/"
            className="inline-block min-h-[48px] px-6 py-3 bg-blue-600 text-white font-bold rounded-xl text-lg"
          >
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  const acts = report.activities || {};
  const objMem = acts.object_memory?.metrics;
  const circleSearch = acts.circle_search?.metrics;
  const calcRecall = acts.calculation_recall?.metrics;
  const shapeRec = acts.shape_recognition?.metrics;

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-lg border-2 border-slate-200 text-center space-y-4">
          <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-12 h-12" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
            Session Completed!
          </h1>
          <p className="text-xl sm:text-2xl text-slate-600 max-w-2xl mx-auto font-medium">
            Thank you for completing today&apos;s cognitive activities. Below is your activity summary.
          </p>
        </div>

        {/* Clinical Disclaimer Alert Banner */}
        <div className="bg-amber-50 border-3 border-amber-300 rounded-3xl p-6 sm:p-8 flex items-start space-x-4 shadow-sm">
          <Info className="w-8 h-8 text-amber-700 flex-shrink-0 mt-1" />
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-amber-900">Important Note</h3>
            <p className="text-lg text-amber-800 leading-relaxed">
              {report.disclaimer}
            </p>
          </div>
        </div>

        {/* Activity Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Object Sequence Memory */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border-2 border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b-2 border-slate-100 pb-3">
              <h2 className="text-2xl font-bold text-slate-900">Object Sequence Memory</h2>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full font-bold text-sm">
                Activity 1
              </span>
            </div>
            {objMem ? (
              <div className="space-y-3 text-lg sm:text-xl text-slate-700">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="font-medium text-slate-500">Correct positions:</span>
                  <span className="font-extrabold text-slate-900">{objMem.correct_positions} / {objMem.total_objects}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="font-medium text-slate-500">Position accuracy:</span>
                  <span className="font-extrabold text-blue-700">{objMem.position_accuracy}%</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="font-medium text-slate-500">Exact sequence:</span>
                  <span className="font-extrabold text-slate-900">{objMem.exact_sequence ? "Yes" : "No"}</span>
                </div>
              </div>
            ) : (
              <p className="text-slate-400 italic">Activity was not completed in this session.</p>
            )}
          </div>

          {/* Card 2: Circle Identification */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border-2 border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b-2 border-slate-100 pb-3">
              <h2 className="text-2xl font-bold text-slate-900">Circle Identification</h2>
              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full font-bold text-sm">
                Activity 2
              </span>
            </div>
            {circleSearch ? (
              <div className="space-y-3 text-lg sm:text-xl text-slate-700">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="font-medium text-slate-500">Targets detected:</span>
                  <span className="font-extrabold text-slate-900">{circleSearch.correct_circles_selected} / {circleSearch.total_circles}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="font-medium text-slate-500">Target detection rate:</span>
                  <span className="font-extrabold text-emerald-700">{circleSearch.target_detection_rate}%</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="font-medium text-slate-500">False selections:</span>
                  <span className="font-extrabold text-slate-900">{circleSearch.incorrect_non_circle_selections}</span>
                </div>
              </div>
            ) : (
              <p className="text-slate-400 italic">Activity was not completed in this session.</p>
            )}
          </div>

          {/* Card 3: Basic Calculation */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border-2 border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b-2 border-slate-100 pb-3">
              <h2 className="text-2xl font-bold text-slate-900">Basic Calculation</h2>
              <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full font-bold text-sm">
                Activity 3A
              </span>
            </div>
            {calcRecall?.calculation ? (
              <div className="space-y-3 text-lg sm:text-xl text-slate-700">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="font-medium text-slate-500">Correct answers:</span>
                  <span className="font-extrabold text-slate-900">{calcRecall.calculation.correct_answers} / {calcRecall.calculation.questions_attempted}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="font-medium text-slate-500">Calculation accuracy:</span>
                  <span className="font-extrabold text-amber-700">{calcRecall.calculation.calculation_accuracy}%</span>
                </div>
              </div>
            ) : (
              <p className="text-slate-400 italic">Activity was not completed in this session.</p>
            )}
          </div>

          {/* Card 4: Delayed Word Recognition */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border-2 border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b-2 border-slate-100 pb-3">
              <h2 className="text-2xl font-bold text-slate-900">Delayed Word Recognition</h2>
              <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full font-bold text-sm">
                Activity 3B
              </span>
            </div>
            {calcRecall?.word_recall ? (
              <div className="space-y-3 text-lg sm:text-xl text-slate-700">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="font-medium text-slate-500">Correct words:</span>
                  <span className="font-extrabold text-slate-900">{calcRecall.word_recall.correct_words} / {calcRecall.word_recall.total_words}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="font-medium text-slate-500">Recognition accuracy:</span>
                  <span className="font-extrabold text-purple-700">{calcRecall.word_recall.word_recall_accuracy}%</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="font-medium text-slate-500">Missed words / Distractors:</span>
                  <span className="font-extrabold text-slate-900">{calcRecall.word_recall.missed_words} / {calcRecall.word_recall.false_positive_selections}</span>
                </div>
              </div>
            ) : (
              <p className="text-slate-400 italic">Activity was not completed in this session.</p>
            )}
          </div>

          {/* Card 5: Shape Recognition */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border-2 border-slate-200 space-y-4 md:col-span-2">
            <div className="flex items-center justify-between border-b-2 border-slate-100 pb-3">
              <h2 className="text-2xl font-bold text-slate-900">Shape Recognition & Spatial Reasoning</h2>
              <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full font-bold text-sm">
                Activity 4
              </span>
            </div>
            {shapeRec ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-lg sm:text-xl text-slate-700">
                <div className="flex justify-between py-1 border-b sm:border-b-0 border-slate-100">
                  <span className="font-medium text-slate-500">Correct answers:</span>
                  <span className="font-extrabold text-slate-900">{shapeRec.correct_answers} / {shapeRec.total_questions}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="font-medium text-slate-500">Shape accuracy:</span>
                  <span className="font-extrabold text-indigo-700">{shapeRec.shape_accuracy}%</span>
                </div>
              </div>
            ) : (
              <p className="text-slate-400 italic">Activity was not completed in this session.</p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <Link
            href="/progress"
            className="flex-1 min-h-[60px] rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-2xl flex items-center justify-center space-x-3 shadow-xl transition"
          >
            <TrendingUp className="w-7 h-7" />
            <span>View Historical Progress</span>
          </Link>
          <Link
            href="/"
            className="min-h-[60px] px-8 rounded-2xl border-3 border-slate-300 bg-white hover:bg-slate-100 text-slate-800 font-bold text-2xl flex items-center justify-center space-x-3 transition"
          >
            <Home className="w-7 h-7" />
            <span>Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
