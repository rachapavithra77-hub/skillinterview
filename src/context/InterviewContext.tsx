import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from "react";
import { api, ApiError, type ChatMessage, type Feedback, type Progress, type Question } from "@/services/api";

export type InterviewConfig = {
  userId: string;
  day: number;
  interviewType: "technical" | "behavioral" | "mixed";
  difficulty: "beginner" | "intermediate" | "advanced";
};

export type HistoryEntry = {
  sessionId: string;
  userId: string;
  day: number;
  interviewType: string;
  difficulty: string;
  score: number;
  questions: number;
  completedAt: string;
};

const HISTORY_KEY = "aia_history";

export function readHistory(): HistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(HISTORY_KEY) ?? "[]") as HistoryEntry[];
  } catch {
    return [];
  }
}

function saveHistory(entry: HistoryEntry) {
  if (typeof window === "undefined") return;
  const list = readHistory().filter((h) => h.sessionId !== entry.sessionId);
  list.unshift(entry);
  window.localStorage.setItem(HISTORY_KEY, JSON.stringify(list.slice(0, 20)));
}

type Ctx = {
  config: InterviewConfig;
  setConfig: (partial: Partial<InterviewConfig>) => void;
  sessionId: string | null;
  messages: ChatMessage[];
  currentQuestion: Question | null;
  progress: Progress;
  completed: boolean;
  feedback: Feedback | null;
  loading: boolean;
  thinking: boolean;
  error: string | null;
  elapsed: number;
  tick: () => void;
  clearError: () => void;
  start: () => Promise<string | null>;
  submitAnswer: (content: string) => Promise<boolean>;
  end: () => Promise<void>;
  loadFeedback: (sessionId: string) => Promise<void>;
  reset: () => void;
};

const InterviewContext = createContext<Ctx | null>(null);

export function InterviewProvider({ children }: { children: ReactNode }) {
  const [config, setConfigState] = useState<InterviewConfig>({
    userId: "user-1",
    day: 1,
    interviewType: "mixed",
    difficulty: "intermediate",
  });
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [progress, setProgress] = useState<Progress>({ current: 0, total: 8 });
  const [completed, setCompleted] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [loading, setLoading] = useState(false);
  const [thinking, setThinking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const answered = useRef(0);

  const setConfig = useCallback((partial: Partial<InterviewConfig>) => {
    setConfigState((prev) => ({ ...prev, ...partial }));
  }, []);

  const reset = useCallback(() => {
    setSessionId(null);
    setMessages([]);
    setCurrentQuestion(null);
    setProgress({ current: 0, total: 8 });
    setCompleted(false);
    setFeedback(null);
    setError(null);
    setElapsed(0);
    answered.current = 0;
  }, []);

  const start = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await api.initAgent().catch(() => undefined);
      const res = await api.startInterview(config);
      setSessionId(res.sessionId);
      setMessages([{ role: "assistant", content: res.question.text, questionId: res.question.id, day: res.question.day }]);
      setCurrentQuestion(res.question);
      setProgress(res.progress);
      setCompleted(false);
      setFeedback(null);
      setElapsed(0);
      answered.current = 0;
      return res.sessionId;
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Interview server unavailable.");
      return null;
    } finally {
      setLoading(false);
    }
  }, [config]);

  const submitAnswer = useCallback(
    async (content: string) => {
      if (!sessionId) return false;
      setError(null);
      setThinking(true);
      setMessages((prev) => [...prev, { role: "user", content }]);
      try {
        const res = await api.sendAnswer(sessionId, content);
        answered.current += 1;
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: res.message.content, questionId: res.message.questionId ?? undefined },
        ]);
        setCurrentQuestion(res.question);
        setProgress(res.progress);
        if (res.completed) {
          setCompleted(true);
          try {
            const fb = await api.getFeedback(sessionId);
            setFeedback(fb);
            saveHistory({
              sessionId,
              userId: config.userId,
              day: config.day,
              interviewType: config.interviewType,
              difficulty: config.difficulty,
              score: fb.overallScore,
              questions: answered.current,
              completedAt: new Date().toISOString(),
            });
          } catch {
            /* feedback fetched again on the results page */
          }
        }
        return res.completed;
      } catch (e) {
        setError(e instanceof ApiError ? e.message : "Interview server unavailable.");
        return false;
      } finally {
        setThinking(false);
      }
    },
    [sessionId, config],
  );

  const end = useCallback(async () => {
    if (!sessionId) return;
    setLoading(true);
    try {
      await api.endInterview(sessionId);
      setCompleted(true);
      const fb = await api.getFeedback(sessionId).catch(() => null);
      if (fb) {
        setFeedback(fb);
        saveHistory({
          sessionId,
          userId: config.userId,
          day: config.day,
          interviewType: config.interviewType,
          difficulty: config.difficulty,
          score: fb.overallScore,
          questions: answered.current,
          completedAt: new Date().toISOString(),
        });
      }
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Interview server unavailable.");
    } finally {
      setLoading(false);
    }
  }, [sessionId, config]);

  const loadFeedback = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const fb = await api.getFeedback(id);
      setFeedback(fb);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Interview server unavailable.");
    } finally {
      setLoading(false);
    }
  }, []);

  const tick = useCallback(() => setElapsed((s) => s + 1), []);
  const clearError = useCallback(() => setError(null), []);

  const value = useMemo<Ctx>(
    () => ({
      config,
      setConfig,
      sessionId,
      messages,
      currentQuestion,
      progress,
      completed,
      feedback,
      loading,
      thinking,
      error,
      elapsed,
      tick,
      clearError,
      start,
      submitAnswer,
      end,
      loadFeedback,
      reset,
    }),
    [
      config,
      setConfig,
      sessionId,
      messages,
      currentQuestion,
      progress,
      completed,
      feedback,
      loading,
      thinking,
      error,
      elapsed,
      tick,
      clearError,
      start,
      submitAnswer,
      end,
      loadFeedback,
      reset,
    ],
  );

  return <InterviewContext.Provider value={value}>{children}</InterviewContext.Provider>;
}

export function useInterview() {
  const ctx = useContext(InterviewContext);
  if (!ctx) throw new Error("useInterview must be used inside InterviewProvider");
  return ctx;
}
