"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useActivitySession } from "@/hooks/useActivitySession";
import { ActivityHeader } from "@/components/ActivityHeader";
import { InstructionCard } from "@/components/InstructionCard";
import { PauseModal } from "@/components/PauseModal";
import { ActivityTransition } from "@/components/ActivityTransition";
import { Check, CheckCircle2 } from "lucide-react";

export default function ShapeRecognitionPage() {
  const router = useRouter();

  const {
    lifecycle,
    setLifecycle,
    sessionId,
    attemptId,
    taskData,
    difficulty,
    setDifficulty,
    isPaused,
    isLoading,
    errorMessage,
    startTask,
    submitAnswer,
    pauseActivity,
    resumeActivity,
    exitSession,
    proceedToNext,
    startTimeRef,
  } = useActivitySession({
    gameType: "shape_recognition",
    startApiCall: api.startShapeRecognition,
    nextRoute: "/assessment/complete",
  });

  const [questionIdx, setQuestionIdx] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  // Render individual SVG shape
  const renderSingleShape = (shape: string, size = "w-14 h-14 sm:w-16 sm:h-16") => {
    switch (shape) {
      case "circle":
        return (
          <svg viewBox="0 0 100 100" className={size}>
            <circle cx="50" cy="50" r="38" fill="#e0f2fe" stroke="#0284c7" strokeWidth="6" />
          </svg>
        );
      case "square":
        return (
          <svg viewBox="0 0 100 100" className={size}>
            <rect x="15" y="15" width="70" height="70" rx="4" fill="#fef3c7" stroke="#d97706" strokeWidth="6" />
          </svg>
        );
      case "triangle":
        return (
          <svg viewBox="0 0 100 100" className={size}>
            <polygon points="50,15 88,85 12,85" fill="#fce7f3" stroke="#db2777" strokeWidth="6" />
          </svg>
        );
      case "rectangle":
        return (
          <svg viewBox="0 0 100 100" className={size}>
            <rect x="10" y="25" width="80" height="50" rx="4" fill="#dcfce7" stroke="#16a34a" strokeWidth="6" />
          </svg>
        );
      default:
        return null;
    }
  };

  // Choose an option and proceed to next question or submit
  const handleSelectOption = async (optionId: string) => {
    const questions = taskData?.questions || [];
    const currentQ = questions[questionIdx];
    const updatedAnswers = { ...answers, [currentQ.id]: optionId };
    setAnswers(updatedAnswers);

    if (questionIdx + 1 < questions.length) {
      setQuestionIdx((prev) => prev + 1);
    } else {
      // Completed all questions -> Submit
      const completionTime = Date.now() - startTimeRef.current;
      const formattedAnswers = Object.entries(updatedAnswers).map(([qid, optId]) => ({
        question_id: qid,
        selected_option_id: optId,
      }));

      await submitAnswer({
        answers: formattedAnswers,
        completion_time_ms: completionTime,
      });
    }
  };

  const questions = taskData?.questions || [];
  const currentQ = questions[questionIdx];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <ActivityHeader
        title="Shape Recognition & Spatial Reasoning"
        stepNumber={4}
        totalSteps={4}
        onPause={pauseActivity}
        onExit={exitSession}
      />

      <PauseModal
        isOpen={isPaused}
        onResume={resumeActivity}
        onExit={exitSession}
      />

      {lifecycle === "COMPLETED" && (
        <ActivityTransition
          activityTitle="Shape Recognition & Spatial Reasoning"
          nextActivityTitle="Session Summary & Results"
          onContinue={proceedToNext}
        />
      )}

      <main className="flex-1 max-w-3xl w-full mx-auto p-4 sm:p-6 flex flex-col justify-center">
        {errorMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 border-2 border-rose-300 text-rose-800 text-xl font-bold text-center">
            {errorMessage}
          </div>
        )}

        {/* STEP 1: INSTRUCTIONS */}
        {lifecycle === "INSTRUCTIONS" && (
          <InstructionCard
            title="Shape Recognition & Spatial Reasoning"
            instructions="Look at the target shape or pattern. Then select the matching shape or arrangement below."
            exampleText="Tip: Observe the shapes and their arrangement carefully before making your selection."
            difficulty={difficulty}
            onDifficultyChange={setDifficulty}
            onStart={startTask}
            isLoading={isLoading}
          />
        )}

        {/* STEP 2: ACTIVE QUESTION */}
        {lifecycle === "IN_PROGRESS" && currentQ && (
          <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-xl border-3 border-slate-300 space-y-8 text-center">
            <div className="flex items-center justify-between border-b-2 border-slate-100 pb-4">
              <span className="text-xl font-bold text-slate-500">
                Question {questionIdx + 1} of {questions.length}
              </span>
              <span className="text-emerald-700 font-bold text-lg">
                {currentQ.mode === "shape_match" ? "Single Shape Match" : "Pattern Match"}
              </span>
            </div>

            {/* Target Display */}
            <div className="p-6 rounded-3xl bg-slate-50 border-3 border-slate-200 inline-block mx-auto space-y-3">
              <span className="text-sm font-extrabold uppercase tracking-widest text-slate-500 block">
                TARGET
              </span>
              {currentQ.mode === "shape_match" ? (
                <div className="flex items-center justify-center p-4">
                  {renderSingleShape(currentQ.target, "w-24 h-24 sm:w-28 sm:h-28")}
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-4 p-4">
                  {currentQ.target_pattern?.map((s: string, sIdx: number) => (
                    <div key={sIdx}>{renderSingleShape(s, "w-16 h-16 sm:w-20 sm:h-20")}</div>
                  ))}
                </div>
              )}
            </div>

            <p className="text-2xl font-bold text-slate-800">
              {currentQ.instruction}
            </p>

            {/* Options */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 pt-2">
              {currentQ.options.map((opt: any, optIdx: number) => (
                <button
                  key={opt.id}
                  onClick={() => handleSelectOption(opt.id)}
                  disabled={isLoading}
                  className="min-h-[120px] p-4 rounded-2xl border-4 border-slate-300 bg-white hover:border-blue-500 hover:bg-blue-50/50 active:scale-95 flex flex-col items-center justify-center space-y-2 shadow-md transition cursor-pointer"
                  aria-label={`Choice ${optIdx + 1}`}
                >
                  <span className="text-lg font-bold text-slate-400">
                    Option {String.fromCharCode(65 + optIdx)}
                  </span>
                  {currentQ.mode === "shape_match" ? (
                    renderSingleShape(opt.shape, "w-16 h-16 sm:w-20 sm:h-20")
                  ) : (
                    <div className="flex items-center space-x-2">
                      {opt.pattern?.map((s: string, idx: number) => (
                        <div key={idx}>{renderSingleShape(s, "w-10 h-10 sm:w-12 sm:h-12")}</div>
                      ))}
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
