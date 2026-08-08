import { chatJSON, type ChatMessage } from "./ai.server";
import { TOTAL_QUESTIONS } from "./curriculum";
import type { Feedback, Session } from "./session-store.server";

const SYSTEM_PROMPT = `You are "Nova", a professional senior technical interviewer conducting a structured, curriculum-based interview.

Rules you must always follow:
- Ask exactly ONE question at a time.
- Never repeat a question that was already asked.
- Use the candidate's previous answers: a follow-up MUST explicitly reference concrete details the candidate mentioned.
- Stay professional, concise and warm. No filler, no bullet lists in your spoken question.
- Keep the interview on curriculum. The interview finishes after ${TOTAL_QUESTIONS} curriculum questions.
- Always reply with strict JSON only, no markdown fences.`;

function transcript(session: Session) {
  return session.messages
    .map((m) => `${m.role === "assistant" ? "INTERVIEWER" : "CANDIDATE"}: ${m.content}`)
    .join("\n");
}

export type TurnResult = {
  score: number;
  analysis: string;
  askFollowUp: boolean;
  nextQuestion: string;
};

export async function analyzeAndAsk(
  session: Session,
  answer: string,
  plannedNext: { text: string; day: number; topic: string } | null,
  followUpAllowed: boolean,
): Promise<TurnResult> {
  const messages: ChatMessage[] = [
    { role: "system", content: SYSTEM_PROMPT },
    {
      role: "user",
      content: `Interview context
- Candidate: ${session.userId}
- Interview type: ${session.interviewType}
- Difficulty: ${session.difficulty}
- Current curriculum day: ${session.currentDay}
- Progress: question ${session.slotIndex + 1} of ${TOTAL_QUESTIONS}

Full conversation so far:
${transcript(session)}

Question just asked: "${session.currentQuestionText}"
Candidate's latest answer: "${answer}"

${
  plannedNext
    ? `The next planned curriculum question (day ${plannedNext.day}, topic ${plannedNext.topic}) is: "${plannedNext.text}"`
    : "There is no next curriculum question; this was the final one."
}
Follow-up allowed for the current question: ${followUpAllowed}

Tasks:
1. Score the latest answer 0-100 for depth, correctness and clarity.
2. Write a one-sentence internal analysis of the answer.
3. Decide askFollowUp: true only if follow-up is allowed AND the answer mentions something specific worth probing or is too shallow.
4. Produce nextQuestion:
   - if askFollowUp is true: a follow-up that explicitly references specifics from the candidate's answer.
   - otherwise: a short natural acknowledgement of their answer, then ask the planned curriculum question (you may lightly rephrase it, keep its intent). If there is no next question, thank them and say the interview is complete.

Return JSON: {"score": number, "analysis": string, "askFollowUp": boolean, "nextQuestion": string}`,
    },
  ];

  const out = await chatJSON<TurnResult>(messages);
  return {
    score: Math.max(0, Math.min(100, Math.round(Number(out.score) || 0))),
    analysis: String(out.analysis ?? ""),
    askFollowUp: Boolean(out.askFollowUp) && followUpAllowed && !!plannedNext,
    nextQuestion: String(out.nextQuestion ?? plannedNext?.text ?? "Thank you for your time."),
  };
}

export async function generateFeedback(session: Session): Promise<Feedback> {
  const messages: ChatMessage[] = [
    { role: "system", content: SYSTEM_PROMPT },
    {
      role: "user",
      content: `The interview is finished. Evaluate the candidate using ONLY the real conversation below.

Candidate: ${session.userId}
Interview type: ${session.interviewType} | Difficulty: ${session.difficulty}
Curriculum days covered: ${[...new Set(session.answers.map((a) => a.day))].join(", ")}

Q&A pairs:
${session.answers
  .map(
    (a, i) =>
      `${i + 1}. [day ${a.day}${a.isFollowUp ? " follow-up" : ""}] Q: ${a.question}\n   A: ${a.answer}`,
  )
  .join("\n")}

Return JSON exactly:
{
 "overallScore": number 0-100,
 "technicalScore": number 0-100,
 "communicationScore": number 0-100,
 "problemSolvingScore": number 0-100,
 "confidenceScore": number 0-100,
 "strengths": string[3-5],
 "areasToImprove": string[3-5],
 "summary": string (3-5 sentences, specific to what they said),
 "nextSteps": string[3-4],
 "questionFeedback": [{"index": number, "score": number, "feedback": string}]
}`,
    },
  ];

  const raw = await chatJSON<
    Omit<Feedback, "questionFeedback"> & {
      questionFeedback?: { index: number; score: number; feedback: string }[];
    }
  >(messages);

  const clamp = (n: unknown) => Math.max(0, Math.min(100, Math.round(Number(n) || 0)));

  return {
    overallScore: clamp(raw.overallScore),
    technicalScore: clamp(raw.technicalScore),
    communicationScore: clamp(raw.communicationScore),
    problemSolvingScore: clamp(raw.problemSolvingScore),
    confidenceScore: clamp(raw.confidenceScore),
    strengths: raw.strengths ?? [],
    areasToImprove: raw.areasToImprove ?? [],
    summary: raw.summary ?? "",
    nextSteps: raw.nextSteps ?? [],
    questionFeedback: session.answers.map((a, i) => {
      const match = raw.questionFeedback?.find((q) => Number(q.index) === i + 1);
      return {
        questionId: a.questionId,
        day: a.day,
        question: a.question,
        answer: a.answer,
        score: clamp(match?.score ?? a.score),
        feedback: match?.feedback ?? a.analysis,
      };
    }),
  };
}

export async function generateAgentFeed() {
  const messages: ChatMessage[] = [
    {
      role: "system",
      content:
        "You are an autonomous interview-coaching agent. You publish short, useful insight posts for candidates preparing for technical interviews. Reply with strict JSON only.",
    },
    {
      role: "user",
      content: `Autonomously generate 5 insight posts covering the interview curriculum: Day 1 fundamentals, Day 2 technical concepts & problem solving, Day 3 projects/debugging/system thinking, Day 4 behavioral/teamwork/leadership, plus one post on answering structure.
Return JSON: {"posts":[{"title": string, "body": string (2-3 sentences, actionable), "tags": string[2-3]}]}`,
    },
  ];
  const out = await chatJSON<{ posts: { title: string; body: string; tags: string[] }[] }>(messages);
  return (out.posts ?? []).map((p) => ({
    id: `post_${crypto.randomUUID()}`,
    title: p.title,
    body: p.body,
    tags: p.tags ?? [],
    createdAt: new Date().toISOString(),
  }));
}
