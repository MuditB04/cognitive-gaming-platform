const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";

export interface SessionData {
  id: string;
  user_id: string;
  status: string;
  started_at: string;
  completed_at: string | null;
  attempts: any[];
}

export interface ActivityStartResult {
  attempt_id: string;
  session_id: string;
  game_type: string;
  task_version: string;
  difficulty: string;
  task_data: any;
}

export interface ActivitySubmitResult {
  attempt_id: string;
  session_id: string;
  game_type: string;
  status: string;
  completed_at: string;
  metrics: any;
  feedback_message: string;
}

export interface SessionReport {
  session_id: string;
  user_id: string;
  status: string;
  started_at: string;
  completed_at: string | null;
  activities: Record<string, any>;
  disclaimer: string;
}

export interface UserProgress {
  user_id: string;
  total_sessions: number;
  sessions: any[];
  disclaimer: string;
}

export const api = {
  async createSession(age_group?: string, preferred_language = "en"): Promise<SessionData> {
    const res = await fetch(`${API_BASE_URL}/sessions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ age_group, preferred_language }),
    });
    if (!res.ok) throw new Error("Failed to create assessment session");
    return res.json();
  },

  async getSession(sessionId: string): Promise<SessionData> {
    const res = await fetch(`${API_BASE_URL}/sessions/${sessionId}`);
    if (!res.ok) throw new Error("Failed to load session");
    return res.json();
  },

  async completeSession(sessionId: string): Promise<SessionData> {
    const res = await fetch(`${API_BASE_URL}/sessions/${sessionId}/complete`, {
      method: "POST",
    });
    if (!res.ok) throw new Error("Failed to complete session");
    return res.json();
  },

  async startObjectMemory(sessionId: string, difficulty = "medium"): Promise<ActivityStartResult> {
    const res = await fetch(`${API_BASE_URL}/sessions/${sessionId}/object-memory/start`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ difficulty }),
    });
    if (!res.ok) throw new Error("Failed to start Object Memory activity");
    return res.json();
  },

  async startCircleSearch(sessionId: string, difficulty = "medium"): Promise<ActivityStartResult> {
    const res = await fetch(`${API_BASE_URL}/sessions/${sessionId}/circle-search/start`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ difficulty }),
    });
    if (!res.ok) throw new Error("Failed to start Circle Search activity");
    return res.json();
  },

  async startCalculationRecall(sessionId: string, difficulty = "medium"): Promise<ActivityStartResult> {
    const res = await fetch(`${API_BASE_URL}/sessions/${sessionId}/calculation-recall/start`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ difficulty }),
    });
    if (!res.ok) throw new Error("Failed to start Calculation & Word Recall activity");
    return res.json();
  },

  async startShapeRecognition(sessionId: string, difficulty = "medium"): Promise<ActivityStartResult> {
    const res = await fetch(`${API_BASE_URL}/sessions/${sessionId}/shape-recognition/start`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ difficulty }),
    });
    if (!res.ok) throw new Error("Failed to start Shape Recognition activity");
    return res.json();
  },

  async submitActivity(attemptId: string, payload: any): Promise<ActivitySubmitResult> {
    const res = await fetch(`${API_BASE_URL}/activities/${attemptId}/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: "Submission failed" }));
      throw new Error(err.detail || "Submission failed");
    }
    return res.json();
  },

  async getSessionReport(sessionId: string): Promise<SessionReport> {
    const res = await fetch(`${API_BASE_URL}/sessions/${sessionId}/report`);
    if (!res.ok) throw new Error("Failed to load session report");
    return res.json();
  },

  async getUserProgress(userId: string): Promise<UserProgress> {
    const res = await fetch(`${API_BASE_URL}/users/${userId}/progress`);
    if (!res.ok) throw new Error("Failed to load user progress");
    return res.json();
  },

  async getAdminStats(): Promise<any> {
    const res = await fetch(`${API_BASE_URL}/admin/stats`);
    if (!res.ok) throw new Error("Failed to load admin stats");
    return res.json();
  },
};
