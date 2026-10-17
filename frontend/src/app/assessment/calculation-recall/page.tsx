"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useActivitySession } from "@/hooks/useActivitySession";
import { ActivityHeader } from "@/components/ActivityHeader";
import { InstructionCard } from "@/components/InstructionCard";
import { PauseModal } from "@/components/PauseModal";
import { ActivityTransition } from "@/components/ActivityTransition";
import { ArrowRight, Check, BookOpen, Calculator } from "lucide-react";

type SubPhase = "WORD_PRESENTATION" | "CALCULATION" | "WORD_RECALL";

export default function CalculationRecallPage() {
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
    gameType: "calculation_recall",
    startApiCall: api.startCalculationRecall,
    nextRoute: "/assessment/shape-recognition",
  });

  // Flow Sub-phases
  const [subPhase, setSubPhase] = useState<SubPhase>("WORD_PRESENTATION");

  // Word presentation state
  const [wordIdx, setWordIdx] = useState<number>(0);
  const wordsPresentedEndRef = useRef<number>(0);

  // Calculation state
  const [calcQuestionIdx, setCalcQuestionIdx] = useState<number>(0);
  const [calculationAnswers, setCalculationAnswers] = useState<Record<string, number>>({});
  const calcStartTimeRef = useRef<number>(0);
  const calcEndTimeRef = useRef<number>(0);

  // Word recall state
  const [selectedWords, setSelectedWords] = useState<string[]>([]);

  // When task data is initialized
  useEffect(() => {
    if (taskData) {
      setSubPhase("WORD_PRESENTATION");
      setWordIdx(0);
      setCalcQuestionIdx(0);
      setCalculationAnswers({});
      setSelectedWords([]);
    }
  }, [taskData]);

  // Word presentation timer (Screen 1)
  useEffect(() => {
    if (lifecycle !== "IN_PROGRESS" || subPhase !== "WORD_PRESENTATION" || !taskData || isPaused) return;

    const words = taskData.words_to_present || [];
    const duration = taskData.presentation_duration_ms || 3000;

    if (wordIdx < words.length) {
      const timer = setTimeout(() => {
        setWordIdx((prev) => prev + 1);
      }, duration);
      return () => clearTimeout(timer);
    } else {
      // Finished word presentation -> Move to Calculation
      wordsPresentedEndRef.current = Date.now();
      calcStartTimeRef.current = Date.now();
      setSubPhase("CALCULATION");
    }
  }, [lifecycle, subPhase, wordIdx, taskData, isPaused]);

  // Handle calculation answer choice
  const handleSelectCalcAnswer = (questionId: string, answer: number) => {
    const updated = { ...calculationAnswers, [questionId]: answer };
    setCalculationAnswers(updated);

    const questions = taskData?.calculation_questions || [];
    if (calcQuestionIdx + 1 < questions.length) {
      setCalcQuestionIdx((prev) => prev + 1);
    } else {
      // Completed calculation -> Record calc timing and move to word recall
      calcEndTimeRef.current = Date.now();
      setSubPhase("WORD_RECALL");
    }
  };

  // Toggle word selection in Screen 3
  const handleToggleWord = (word: string) => {
    setSelectedWords((prev) =>
      prev.includes(word) ? prev.filter((w) => w !== word) : [...prev, word]
    );
  };

  // Final submit
  const handleSubmit = async () => {
    const totalTime = Date.now() - startTimeRef.current;
    const calcTime = calcEndTimeRef.current - calcStartTimeRef.current;
    const delaySec = Math.max(
      0,
      Math.round(((Date.now() - wordsPresentedEndRef.current) / 1000) * 10) / 10
    );

    const answersList = Object.entries(calculationAnswers).map(([qid, ans]) => ({
      question_id: qid,
      selected_answer: ans,
    }));

    await submitAnswer({
      calculation_answers: answersList,
      recalled_words: selectedWords,
      calculation_time_ms: calcTime,
      word_recall_delay_seconds: delaySec,
      total_time_ms: totalTime,
    });
  };

  const words = taskData?.words_to_present || [];
  const questions = taskData?.calculation_questions || [];
  const recallChoices = taskData?.recall_word_choices || [];
  const currentQuestion = questions[calcQuestionIdx];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <ActivityHeader
        title="Basic Calculation & Delayed Word Recall"
        stepNumber={3}
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
          activityTitle="Basic Calculation & Delayed Word Recall"
          nextActivityTitle="Shape Recognition & Spatial Reasoning"
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
            title="Basic Calculation & Word Recall"
            instructions="First, you will see three words to remember. Next, you will answer a few simple number questions. Later, you will be asked which words you saw."
            exampleText="Take your time on each step. You do not need to rush."
            difficulty={difficulty}
            onDifficultyChange={setDifficulty}
            onStart={startTask}
            isLoading={isLoading}
          />
        )}

        {/* STEP 2A: WORD PRESENTATION */}
        {lifecycle === "IN_PROGRESS" && subPhase === "WORD_PRESENTATION" && taskData && (
          <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-xl border-3 border-amber-200 text-center space-y-8 max-w-xl mx-auto w-full">
            <div className="flex items-center justify-between border-b-2 border-slate-100 pb-4">
              <span className="text-xl font-bold text-slate-500">
                Word {Math.min(wordIdx + 1, words.length)} of {words.length}
              </span>
              <span className="text-amber-700 font-bold text-lg flex items-center gap-1">
                <BookOpen className="w-5 h-5" />
                <span>Remember this word</span>
              </span>
            </div>

            {wordIdx < words.length && (
              <div className="py-12 space-y-4">
                <p className="text-2xl text-slate-500 font-medium">Please remember:</p>
                <div className="p-8 rounded-3xl bg-amber-50 border-4 border-amber-300 inline-block">
                  <h3 className="text-5xl sm:text-6xl font-black text-slate-900 tracking-wide">
                    {words[wordIdx]}
                  </h3>
                </div>
              </div>
            )}

            <p className="text-xl text-slate-500 font-medium">
              You will be asked about these words later.
            </p>
          </div>
        )}

        {/* STEP 2B: BASIC CALCULATION */}
        {lifecycle === "IN_PROGRESS" && subPhase === "CALCULATION" && currentQuestion && (
          <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-xl border-3 border-blue-200 space-y-8 max-w-2xl mx-auto w-full text-center">
            <div className="flex items-center justify-between border-b-2 border-slate-100 pb-4">
              <span className="text-xl font-bold text-slate-500">
                Question {calcQuestionIdx + 1} of {questions.length}
              </span>
              <span className="text-blue-700 font-bold text-lg flex items-center gap-1">
                <Calculator className="w-5 h-5" />
                <span>Basic Calculation</span>
              </span>
            </div>

            <div className="py-6 space-y-3">
              <p className="text-2xl text-slate-600 font-medium">
                Let&apos;s solve this number question:
              </p>
              <h2 className="text-6xl sm:text-7xl font-black text-slate-900 tracking-wider">
                {currentQuestion.text}
              </h2>
            </div>

            {/* Multiple Choice Answers */}
            <div className="grid grid-cols-3 gap-4 sm:gap-6 pt-4">
              {currentQuestion.options.map((opt: number) => (
                <button
                  key={opt}
                  onClick={() => handleSelectCalcAnswer(currentQuestion.id, opt)}
                  className="min-h-[72px] sm:min-h-[88px] rounded-2xl border-4 border-slate-300 bg-white hover:bg-blue-50 hover:border-blue-600 active:scale-95 text-4xl sm:text-5xl font-black text-slate-900 shadow-md focus:outline-none focus:ring-4 focus:ring-blue-300 transition cursor-pointer"
                  aria-label={`Option ${opt}`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2C: DELAYED WORD RECALL */}
        {lifecycle === "IN_PROGRESS" && subPhase === "WORD_RECALL" && (
          <div className="space-y-6 max-w-2xl mx-auto w-full">
            <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-xl border-3 border-purple-200 text-center space-y-6">
              <div className="border-b-2 border-slate-100 pb-4">
                <span className="text-purple-700 font-bold uppercase tracking-wider text-base">
                  Delayed Word Recognition
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-1">
                  Which words did you see earlier?
                </h2>
                <p className="text-xl text-slate-600 mt-2">
                  Tap all the words you remember seeing. Selected: <span className="font-bold text-purple-700">{selectedWords.length}</span>
                </p>
              </div>

              {/* 6 Word Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6 pt-2">
                {recallChoices.map((word: string) => {
                  const isSelected = selectedWords.includes(word);
                  return (
                    <button
                      key={word}
                      onClick={() => handleToggleWord(word)}
                      className={`min-h-[90px] sm:min-h-[110px] p-4 rounded-2xl border-4 font-black text-2xl sm:text-3xl transition flex items-center justify-center cursor-pointer ${
                        isSelected
                          ? "border-purple-600 bg-purple-50 text-purple-900 ring-4 ring-purple-300 shadow-lg scale-105"
                          : "border-slate-300 bg-white text-slate-800 hover:border-slate-400 hover:bg-slate-50"
                      }`}
                      aria-label={`${word}. ${isSelected ? "Selected" : "Not selected"}`}
                    >
                      {word}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full min-h-[64px] rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-2xl sm:text-3xl flex items-center justify-center space-x-3 shadow-xl focus:ring-4 focus:ring-emerald-400 transition cursor-pointer"
            >
              <Check className="w-8 h-8" />
              <span>{isLoading ? "Saving..." : "Submit Answers"}</span>
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
