"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useActivitySession } from "@/hooks/useActivitySession";
import { ActivityHeader } from "@/components/ActivityHeader";
import { InstructionCard } from "@/components/InstructionCard";
import { PauseModal } from "@/components/PauseModal";
import { ActivityTransition } from "@/components/ActivityTransition";
import { ObjectIcon } from "@/components/icons/ObjectIcons";
import { RotateCcw, Check, ArrowRight, Eye, RefreshCw } from "lucide-react";

export default function ObjectMemoryPage() {
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
    gameType: "object_memory",
    startApiCall: api.startObjectMemory,
    nextRoute: "/assessment/circle-search",
  });

  // Presentation State
  const [presentationIndex, setPresentationIndex] = useState<number>(0);
  const [isShowingSequence, setIsShowingSequence] = useState<boolean>(false);
  const [extraDuration, setExtraDuration] = useState<number>(0); // Accessibility extra time

  // Reconstruction State
  const [selectedSequence, setSelectedSequence] = useState<string[]>([]);
  const [availableChoices, setAvailableChoices] = useState<any[]>([]);

  // When task data is loaded, prepare choices
  useEffect(() => {
    if (taskData) {
      setAvailableChoices(taskData.shuffled_choices || []);
      setSelectedSequence([]);
      setPresentationIndex(0);
      setIsShowingSequence(true);
    }
  }, [taskData]);

  // Object presentation timer
  useEffect(() => {
    if (!isShowingSequence || !taskData || isPaused) return;

    const items = taskData.presentation_items || [];
    const baseDuration = taskData.presentation_duration_ms || 2000;
    const currentDuration = baseDuration + extraDuration;

    if (presentationIndex < items.length) {
      const timer = setTimeout(() => {
        setPresentationIndex((prev) => prev + 1);
      }, currentDuration);
      return () => clearTimeout(timer);
    } else {
      // Completed presentation, move to reconstruction
      setIsShowingSequence(false);
    }
  }, [isShowingSequence, presentationIndex, taskData, isPaused, extraDuration]);

  // Handle selecting an object into the next open slot
  const handleSelectObject = (objectId: string) => {
    if (selectedSequence.includes(objectId)) return;
    const maxSlots = taskData?.presentation_items?.length || 4;
    if (selectedSequence.length < maxSlots) {
      setSelectedSequence([...selectedSequence, objectId]);
    }
  };

  // Handle removing an object from a slot
  const handleRemoveFromSlot = (indexToRemove: number) => {
    const updated = selectedSequence.filter((_, idx) => idx !== indexToRemove);
    setSelectedSequence(updated);
  };

  // Handle final submission
  const handleSubmit = async () => {
    const responseTime = Date.now() - startTimeRef.current;
    await submitAnswer({
      selected_sequence: selectedSequence,
      response_time_ms: responseTime,
    });
  };

  // Reset reconstruction slots
  const handleClearSlots = () => {
    setSelectedSequence([]);
  };

  const totalObjects = taskData?.presentation_items?.length || 4;
  const isAllFilled = selectedSequence.length === totalObjects;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <ActivityHeader
        title="Object Sequence Memory"
        stepNumber={1}
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
          activityTitle="Object Sequence Memory"
          nextActivityTitle="Circle Identification & Attention"
          onContinue={proceedToNext}
        />
      )}

      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 flex flex-col justify-center">
        {errorMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 border-2 border-rose-300 text-rose-800 text-xl font-bold text-center">
            {errorMessage}
          </div>
        )}

        {/* STEP 1: INSTRUCTIONS */}
        {lifecycle === "INSTRUCTIONS" && (
          <InstructionCard
            title="Object Sequence Memory"
            instructions="Look carefully at the pictures. Remember which picture comes first, second, and third. After the pictures disappear, put them back in the same order."
            exampleText="Tip: You will see one picture at a time. Take your time to remember the sequence."
            difficulty={difficulty}
            onDifficultyChange={setDifficulty}
            onStart={startTask}
            isLoading={isLoading}
          />
        )}

        {/* STEP 2: PRESENTATION SCREEN */}
        {lifecycle === "IN_PROGRESS" && isShowingSequence && taskData && (
          <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-xl border-3 border-blue-200 text-center space-y-8 max-w-2xl mx-auto w-full">
            <div className="flex items-center justify-between border-b-2 border-slate-100 pb-4">
              <span className="text-xl font-bold text-slate-500">
                Item {presentationIndex + 1} of {totalObjects}
              </span>
              <div className="flex items-center space-x-2 text-slate-600 font-medium text-lg">
                <Eye className="w-6 h-6 text-blue-600" />
                <span>Memorize the order</span>
              </div>
            </div>

            {presentationIndex < totalObjects && (
              <div className="py-8 flex flex-col items-center justify-center space-y-6">
                <div className="p-8 rounded-3xl bg-slate-50 border-4 border-slate-200 shadow-md">
                  <ObjectIcon
                    name={taskData.presentation_items[presentationIndex]?.name || ""}
                    className="w-40 h-40 sm:w-48 sm:h-48"
                  />
                </div>
                <h3 className="text-4xl sm:text-5xl font-extrabold text-slate-900 capitalize">
                  {taskData.presentation_items[presentationIndex]?.name}
                </h3>
              </div>
            )}

            <div className="pt-4 flex justify-between items-center text-slate-500 text-lg">
              <span>Showing automatically...</span>
              <button
                onClick={() => setExtraDuration((d) => (d === 0 ? 1500 : 0))}
                className="text-base text-blue-700 underline font-semibold focus:outline-none"
              >
                {extraDuration === 0 ? "Need more viewing time?" : "Standard viewing time"}
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: RECONSTRUCTION SCREEN */}
        {lifecycle === "IN_PROGRESS" && !isShowingSequence && taskData && (
          <div className="space-y-8">
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-lg border-2 border-slate-200 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-slate-100 pb-4">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                    Place the pictures in the order you saw them:
                  </h2>
                  <p className="text-xl text-slate-600 mt-1">
                    Tap a picture below to place it into the next empty slot.
                  </p>
                </div>
                {selectedSequence.length > 0 && (
                  <button
                    onClick={handleClearSlots}
                    className="min-h-[48px] px-4 py-2 rounded-xl border-2 border-slate-300 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-lg flex items-center space-x-2 transition"
                  >
                    <RotateCcw className="w-5 h-5" />
                    <span>Start Over</span>
                  </button>
                )}
              </div>

              {/* Sequence Slots */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 pt-2">
                {Array.from({ length: totalObjects }).map((_, slotIdx) => {
                  const assignedId = selectedSequence[slotIdx];
                  const assignedItem = taskData.presentation_items.find(
                    (item: any) => item.id === assignedId
                  );

                  return (
                    <div
                      key={slotIdx}
                      className={`min-h-[160px] sm:min-h-[190px] rounded-2xl border-4 p-4 flex flex-col items-center justify-center relative transition ${
                        assignedItem
                          ? "border-blue-600 bg-blue-50/60 shadow-md"
                          : "border-dashed border-slate-300 bg-slate-50"
                      }`}
                    >
                      <span className="absolute top-2 left-3 font-extrabold text-slate-400 text-lg">
                        Slot {slotIdx + 1}
                      </span>

                      {assignedItem ? (
                        <div className="flex flex-col items-center space-y-2 mt-4">
                          <ObjectIcon name={assignedItem.name} className="w-20 h-20 sm:w-24 sm:h-24" />
                          <span className="text-xl font-bold text-slate-900">{assignedItem.name}</span>
                          <button
                            onClick={() => handleRemoveFromSlot(slotIdx)}
                            className="mt-1 text-sm font-bold text-rose-600 hover:text-rose-800 underline focus:ring-2 focus:ring-rose-400"
                            aria-label={`Remove ${assignedItem.name} from slot ${slotIdx + 1}`}
                          >
                            Remove
                          </button>
                        </div>
                      ) : (
                        <span className="text-lg font-medium text-slate-400">
                          Empty
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Available Choices */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-lg border-2 border-slate-200 space-y-4">
              <h3 className="text-xl sm:text-2xl font-bold text-slate-800">
                Available Pictures:
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
                {availableChoices.map((item) => {
                  const isChosen = selectedSequence.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelectObject(item.id)}
                      disabled={isChosen}
                      className={`min-h-[140px] p-4 rounded-2xl border-3 flex flex-col items-center justify-center space-y-3 transition cursor-pointer ${
                        isChosen
                          ? "opacity-30 border-slate-200 bg-slate-100 cursor-not-allowed"
                          : "border-slate-300 bg-white hover:border-blue-500 hover:shadow-lg active:scale-95 focus:ring-4 focus:ring-blue-300"
                      }`}
                      aria-label={`Select ${item.name}`}
                    >
                      <ObjectIcon name={item.name} className="w-16 h-16 sm:w-20 sm:h-20" />
                      <span className="text-xl font-extrabold text-slate-900">{item.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                onClick={handleSubmit}
                disabled={!isAllFilled || isLoading}
                className={`w-full min-h-[64px] rounded-2xl font-extrabold text-2xl sm:text-3xl flex items-center justify-center space-x-3 shadow-xl transition cursor-pointer ${
                  isAllFilled && !isLoading
                    ? "bg-emerald-600 hover:bg-emerald-700 text-white focus:ring-4 focus:ring-emerald-400"
                    : "bg-slate-300 text-slate-500 cursor-not-allowed"
                }`}
              >
                <Check className="w-8 h-8" />
                <span>{isLoading ? "Saving..." : isAllFilled ? "Submit Answer" : `Select all ${totalObjects} pictures to submit`}</span>
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
