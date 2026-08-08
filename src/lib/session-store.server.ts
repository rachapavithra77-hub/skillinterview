import { buildPlan, TOTAL_QUESTIONS } from "./curriculum";

export type Message = {
  role: "assistant" | "user";
  content: string;
  questionId?: string;
  day?: number;
  createdAt: string;
};

export type AnswerRecord = {
  questionId: string;
  day: number;
  question: string;
  answer: string;
  score: number;
  analysis: string;
  isFollowUp: boolean;
  createdAt: string;
};

export type Feedback = {
  overallScore: number;
  technicalScore: number;
  communicationScore: number;
  problemSolvingScore: number;
  confidenceScore: number;
  strengths: string[];
  areasToImprove: string[];
  summary: string;
  nextSteps: string[];
  questionFeedback: {
    questionId: string;
    day: number;
    question: string;
    answer: string;
    score: number;
    feedback: string;
  }[];
};

export type Session = {
  sessionId: string;
  userId: string;
  startDay: number;
  interviewType: string;
  difficulty: string;
  plan: ReturnType<typeof buildPlan>;
  slotIndex: number; // 0-based index into plan
  followUpUsed: boolean;
  pendingIsFollowUp: boolean;
  currentQuestionId: string;
  currentQuestionText: string;
  currentDay: number;
  messages: Message[];
  answers: AnswerRecord[];
  completed: boolean;
  feedback: Feedback | null;
  createdAt: string;
  updatedAt: string;
};

type AgentState = {
  initialized: boolean;
  initializedAt: string | null;
  feed: { id: string; title: string; body: string; tags: string[]; createdAt: string }[];
};

const g = globalThis as unknown as {
  __interviewSessions?: Map<string, Session>;
  __agentState?: AgentState;
};

export const sessions: Map<string, Session> =
  g.__interviewSessions ?? (g.__interviewSessions = new Map());

export const agentState: AgentState =
  g.__agentState ?? (g.__agentState = { initialized: false, initializedAt: null, feed: [] });

export function createSession(input: {
  userId: string;
  day: number;
  interviewType: string;
  difficulty: string;
}): Session {
  const plan = buildPlan(input.day, input.interviewType);
  const first = plan[0]!;
  const now = new Date().toISOString();
  const session: Session = {
    sessionId: `sess_${crypto.randomUUID()}`,
    userId: input.userId,
    startDay: input.day,
    interviewType: input.interviewType,
    difficulty: input.difficulty,
    plan,
    slotIndex: 0,
    followUpUsed: false,
    pendingIsFollowUp: false,
    currentQuestionId: first.questionId,
    currentQuestionText: first.text,
    currentDay: first.day,
    messages: [
      {
        role: "assistant",
        content: first.text,
        questionId: first.questionId,
        day: first.day,
        createdAt: now,
      },
    ],
    answers: [],
    completed: false,
    feedback: null,
    createdAt: now,
    updatedAt: now,
  };
  sessions.set(session.sessionId, session);
  return session;
}

export function publicSession(s: Session) {
  return {
    sessionId: s.sessionId,
    userId: s.userId,
    interviewType: s.interviewType,
    difficulty: s.difficulty,
    day: s.currentDay,
    daysCovered: [...new Set(s.answers.map((a) => a.day))].sort(),
    currentQuestion: s.completed
      ? null
      : { id: s.currentQuestionId, text: s.currentQuestionText, day: s.currentDay },
    progress: { current: Math.min(s.slotIndex + 1, TOTAL_QUESTIONS), total: TOTAL_QUESTIONS },
    messages: s.messages,
    answers: s.answers,
    completed: s.completed,
    feedback: s.feedback,
    createdAt: s.createdAt,
    updatedAt: s.updatedAt,
  };
}

export const TOTAL = TOTAL_QUESTIONS;
