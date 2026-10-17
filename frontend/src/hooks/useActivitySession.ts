"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { api, ActivityStartResult, ActivitySubmitResult } from "@/lib/api";

export type ActivityLifecycle =
  | "NOT_STARTED"
  | "INSTRUCTIONS"
  | "IN_PROGRESS"
  | "ANSWER_SUBMISSION"
  | "RESULT_SAVED"
  | "COMPLETED";

interface UseActivitySessionOptions {
  gameType: "object_memory" | "circle_search" | "calculation_recall" | "shape_recognition";
  startApiCall: (sessionId: string, difficulty?: string) => Promise<ActivityStartResult>;
  nextRoute: string;
}

export function useActivitySession({
  gameType,
  startApiCall,
  nextRoute,
}: UseActivitySessionOptions) {
  const router = useRouter();

  const [lifecycle, setLifecycle] = useState<ActivityLifecycle>("NOT_STARTED");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [taskData, setTaskData] = useState<any>(null);
  const [difficulty, setDifficulty] = useState<string>("medium");
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lastResult, setLastResult] = useState<ActivitySubmitResult | null>(null);

  const isSubmittingRef = useRef(false);
  const startTimeRef = useRef<number>(0);

  // Load session from localStorage on mount
  useEffect(() => {
    const storedSession = localStorage.getItem("current_assessment_session");
    if (!storedSession) {
      router.push("/assessment");
      return;
    }
    try {
      const parsed = JSON.parse(storedSession);
      setSessionId(parsed.id);
      const savedDiff = localStorage.getItem("assessment_difficulty") || "medium";
      setDifficulty(savedDiff);
      setLifecycle("INSTRUCTIONS");
    } catch {
      router.push("/assessment");
    }
  }, [router]);

  // Start the activity
  const startTask = useCallback(async () => {
    if (!sessionId) return;
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await startApiCall(sessionId, difficulty);
      setAttemptId(res.attempt_id);
      setTaskData(res.task_data);
      startTimeRef.current = Date.now();
      setLifecycle("IN_PROGRESS");
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to start the activity. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [sessionId, difficulty, startApiCall]);

  // Submit answer
  const submitAnswer = useCallback(
    async (payload: any) => {
      if (!attemptId || isSubmittingRef.current) return;
      isSubmittingRef.current = true;
      setIsLoading(true);
      setErrorMessage(null);
      setLifecycle("ANSWER_SUBMISSION");

      try {
        const result = await api.submitActivity(attemptId, payload);
        setLastResult(result);
        setLifecycle("RESULT_SAVED");
        setTimeout(() => {
          setLifecycle("COMPLETED");
        }, 1200);
      } catch (err: any) {
        setErrorMessage(err.message || "Unable to save your response. Please retry.");
        setLifecycle("IN_PROGRESS");
      } finally {
        setIsLoading(false);
        isSubmittingRef.current = false;
      }
    },
    [attemptId]
  );

  // Pause / Resume
  const pauseActivity = () => setIsPaused(true);
  const resumeActivity = () => setIsPaused(false);

  // Exit safely
  const exitSession = () => {
    router.push("/");
  };

  // Move to next step
  const proceedToNext = () => {
    router.push(nextRoute);
  };

  return {
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
    lastResult,
    startTask,
    submitAnswer,
    pauseActivity,
    resumeActivity,
    exitSession,
    proceedToNext,
    startTimeRef,
  };
}
