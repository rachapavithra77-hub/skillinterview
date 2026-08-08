const RAW_BASE = (import.meta.env["VITE_API_URL"] as string | undefined) ?? "/api";
export const API_BASE = RAW_BASE.replace(/\/$/, "");

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers: { "Content-Type": "application/json", ...(options.headers ?? {}) },
    });
  } catch {
    throw new ApiError("Interview server unavailable.", 0);
  }

  const text = await res.text();
  let data: unknown = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = null;
  }

  if (!res.ok) {
    const msg =
      (data as { error?: string } | null)?.error ??
      (res.status >= 500 ? "Interview server error." : "Request failed.");
    throw new ApiError(msg, res.status);
  }
  return data as T;
}

export type Question = { id: string; text: string; day: number };
export type ChatMessage = {
  role: "assistant" | "user";
  content: string;
  questionId?: string;
  day?: number;
  createdAt?: string;
};
export type Progress = { current: number; total: number };

export type Feedback = {
  overallScore: number;
  technicalScore: number;
  communicationScore: number;
  problemSolvingScore: number;
  confidenceScore: number;
  strengths: string[];
  areasToImprove: string[];
  summary: string;
  nextSteps?: string[];
  questionFeedback: {
    questionId: string;
    day: number;
    question: string;
    answer: string;
    score: number;
    feedback: string;
  }[];
  daysCovered?: number[];
  sessionId?: string;
};

export type SessionPayload = {
  sessionId: string;
  userId: string;
  interviewType: string;
  difficulty: string;
  day: number;
  daysCovered: number[];
  currentQuestion: Question | null;
  progress: Progress;
  messages: ChatMessage[];
  answers: { questionId: string; day: number; question: string; answer: string; score: number }[];
  completed: boolean;
  feedback: Feedback | null;
};

export const api = {
  health: () => request<{ status: string }>("/health"),
  initAgent: () => request<{ success: boolean; status: string }>("/agent/init", { method: "POST" }),
  getFeed: () =>
    request<{ posts: { id: string; title: string; body: string; tags: string[] }[] }>("/agent/feed"),
  startInterview: (payload: {
    userId: string;
    day: number;
    interviewType: string;
    difficulty: string;
  }) =>
    request<{ sessionId: string; question: Question; progress: Progress }>("/interview/start", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  sendAnswer: (sessionId: string, content: string) =>
    request<{
      message: ChatMessage;
      question: Question | null;
      isFollowUp: boolean;
      progress: Progress;
      completed: boolean;
    }>("/interview/message", {
      method: "POST",
      body: JSON.stringify({ sessionId, content }),
    }),
  getSession: (sessionId: string) => request<SessionPayload>(`/interview/session/${sessionId}`),
  getFeedback: (sessionId: string) => request<Feedback>(`/interview/feedback/${sessionId}`),
  endInterview: (sessionId: string) =>
    request<{ success: boolean; completed: boolean }>("/interview/end", {
      method: "POST",
      body: JSON.stringify({ sessionId }),
    }),
};
