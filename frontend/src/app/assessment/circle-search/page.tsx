"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useActivitySession } from "@/hooks/useActivitySession";
import { ActivityHeader } from "@/components/ActivityHeader";
import { InstructionCard } from "@/components/InstructionCard";
import { PauseModal } from "@/components/PauseModal";
import { ActivityTransition } from "@/components/ActivityTransition";
import { Check, CheckCircle, HelpCircle } from "lucide-react";

export default function CircleSearchPage() {
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
    gameType: "circle_search",
    startApiCall: api.startCircleSearch,
    nextRoute: "/assessment/calculation-recall",
  });

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isReviewing, setIsReviewing] = useState<boolean>(false);

  // Toggle selection
  const handleToggleShape = (shapeId: string) => {
    setSelectedIds((prev) =>
      prev.includes(shapeId) ? prev.filter((id) => id !== shapeId) : [...prev, shapeId]
    );
  };

  // Submit Answer
  const handleSubmit = async () => {
    const completionTime = Date.now() - startTimeRef.current;
    await submitAnswer({
      selected_ids: selectedIds,
      completion_time_ms: completionTime,
    });
  };

  // Render a shape SVG with high contrast
  const renderShape = (shape: string, isSelected: boolean) => {
    const strokeColor = isSelected ? "#1d4ed8" : "#334155";
    const fillColor = isSelected ? "#bfdbfe" : "#f1f5f9";

    switch (shape) {
      case "circle":
        return (
          <svg viewBox="0 0 100 100" className="w-16 h-16 sm:w-20 sm:h-20" aria-label="Circle shape">
            <circle cx="50" cy="50" r="38" fill={fillColor} stroke={strokeColor} strokeWidth="6" />
          </svg>
        );
      case "square":
        return (
          <svg viewBox="0 0 100 100" className="w-16 h-16 sm:w-20 sm:h-20" aria-label="Square shape">
            <rect x="15" y="15" width="70" height="70" rx="4" fill={fillColor} stroke={strokeColor} strokeWidth="6" />
          </svg>
        );
      case "triangle":
        return (
          <svg viewBox="0 0 100 100" className="w-16 h-16 sm:w-20 sm:h-20" aria-label="Triangle shape">
            <polygon points="50,15 88,85 12,85" fill={fillColor} stroke={strokeColor} strokeWidth="6" />
          </svg>
        );
      case "rectangle":
        return (
          <svg viewBox="0 0 100 100" className="w-16 h-16 sm:w-20 sm:h-20" aria-label="Rectangle shape">
            <rect x="10" y="25" width="80" height="50" rx="4" fill={fillColor} stroke={strokeColor} strokeWidth="6" />
          </svg>
        );
      default:
        return null;
    }
  };

  const gridSize = taskData?.grid_size || 4;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <ActivityHeader
        title="Circle Identification & Attention"
        stepNumber={2}
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
          activityTitle="Circle Identification & Attention"
          nextActivityTitle="Basic Calculation & Word Recall"
          onContinue={proceedToNext}
        />
      )}

      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 flex flex-col justify-center">
        {errorMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 border-2 border-rose-300 text-rose-800 text-xl font-bold text-center">
            {errorMessage}
          </div>
        )}

        {/* STEP 1: INSTRUCTIONS */}
        {lifecycle === "INSTRUCTIONS" && (
          <InstructionCard
            title="Circle Identification & Attention"
            instructions="Look at all the shapes. Tap every circle you can see. Do not tap the other shapes."
            exampleText="Tip: Take your time. You can tap a shape again to deselect it if you change your mind."
            difficulty={difficulty}
            onDifficultyChange={setDifficulty}
            onStart={startTask}
            isLoading={isLoading}
          />
        )}

        {/* STEP 2: SHAPE GRID */}
        {lifecycle === "IN_PROGRESS" && taskData && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-lg border-2 border-slate-200 text-center space-y-4">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Tap every circle ( ○ )
              </h2>
              <p className="text-xl text-slate-600 font-medium">
                Selected: <span className="font-bold text-blue-700">{selectedIds.length}</span> shapes
              </p>

              {/* Grid representation */}
              <div
                className="grid gap-4 sm:gap-6 justify-center mx-auto my-6"
                style={{
                  gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
                  maxWidth: gridSize === 3 ? "420px" : gridSize === 4 ? "540px" : "660px",
                }}
              >
                {taskData.grid_items.map((item: any) => {
                  const isSelected = selectedIds.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleToggleShape(item.id)}
                      className={`min-h-[80px] sm:min-h-[110px] min-w-[80px] sm:min-w-[110px] p-3 rounded-2xl border-4 flex flex-col items-center justify-center relative transition cursor-pointer ${
                        isSelected
                          ? "border-blue-600 bg-blue-50 ring-4 ring-blue-300 shadow-md scale-105"
                          : "border-slate-300 bg-white hover:border-slate-400 hover:bg-slate-50"
                      }`}
                      aria-label={`${item.shape} at row ${item.row + 1}, column ${item.col + 1}. ${
                        isSelected ? "Selected" : "Not selected"
                      }`}
                    >
                      {renderShape(item.shape, isSelected)}
                      {isSelected && (
                        <span className="absolute top-1 right-1 bg-blue-600 text-white rounded-full p-1 shadow">
                          <Check className="w-4 h-4 sm:w-5 sm:h-5 stroke-[3]" />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Submit / Confirmation Panel */}
            <div className="bg-white rounded-3xl p-6 shadow-md border-2 border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xl font-bold text-slate-700">
                Have you selected all the circles?
              </span>
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full sm:w-auto min-h-[56px] px-8 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-2xl flex items-center justify-center space-x-3 shadow-lg focus:ring-4 focus:ring-emerald-400 transition cursor-pointer"
              >
                <Check className="w-7 h-7" />
                <span>{isLoading ? "Saving..." : "Submit Answer"}</span>
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
