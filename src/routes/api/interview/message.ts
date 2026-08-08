import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { errorResponse, json, preflight } from "@/lib/http.server";
import { sessions } from "@/lib/session-store.server";
import { analyzeAndAsk, generateFeedback } from "@/lib/interview.service.server";
import { TOTAL_QUESTIONS } from "@/lib/curriculum";

const MessageSchema = z.object({
  sessionId: z.string().min(1),
  content: z.string().min(1).max(8000),
});

export const Route = createFileRoute("/api/interview/message")({
  server: {
    handlers: {
      OPTIONS: async () => preflight(),
      POST: async ({ request }) => {
        try {
          const body = await request.json().catch(() => ({}));
          const parsed = MessageSchema.safeParse(body ?? {});
          if (!parsed.success) {
            return json({ error: "Invalid request", issues: parsed.error.issues }, 400);
          }
          const session = sessions.get(parsed.data.sessionId);
          if (!session) return json({ error: "Interview session not found" }, 404);
          if (session.completed) {
            return json({
              message: {
                role: "assistant",
                content: "This interview is already complete. View your feedback report.",
                questionId: null,
              },
              progress: { current: TOTAL_QUESTIONS, total: TOTAL_QUESTIONS },
              completed: true,
            });
          }

          const now = new Date().toISOString();
          const answeredQuestion = session.currentQuestionText;
          const answeredId = session.currentQuestionId;
          const answeredDay = session.currentDay;
          const wasFollowUp = session.pendingIsFollowUp;

          session.messages.push({ role: "user", content: parsed.data.content, createdAt: now });

          const isLastSlot = session.slotIndex >= TOTAL_QUESTIONS - 1;
          const plannedNext = isLastSlot ? null : session.plan[session.slotIndex + 1]!;
          const followUpAllowed = !wasFollowUp && !session.followUpUsed && !isLastSlot;

          const turn = await analyzeAndAsk(
            session,
            parsed.data.content,
            plannedNext ? { text: plannedNext.text, day: plannedNext.day, topic: plannedNext.topic } : null,
            followUpAllowed,
          );

          session.answers.push({
            questionId: answeredId,
            day: answeredDay,
            question: answeredQuestion,
            answer: parsed.data.content,
            score: turn.score,
            analysis: turn.analysis,
            isFollowUp: wasFollowUp,
            createdAt: now,
          });

          let completed = false;

          if (turn.askFollowUp && plannedNext) {
            session.followUpUsed = true;
            session.pendingIsFollowUp = true;
            session.currentQuestionId = `${answeredId}-followup`;
            session.currentQuestionText = turn.nextQuestion;
          } else if (plannedNext) {
            session.slotIndex += 1;
            session.followUpUsed = false;
            session.pendingIsFollowUp = false;
            session.currentQuestionId = plannedNext.questionId;
            session.currentQuestionText = turn.nextQuestion;
            session.currentDay = plannedNext.day;
          } else {
            completed = true;
            session.completed = true;
            session.slotIndex = TOTAL_QUESTIONS - 1;
          }

          session.messages.push({
            role: "assistant",
            content: turn.nextQuestion,
            questionId: session.currentQuestionId,
            day: session.currentDay,
            createdAt: new Date().toISOString(),
          });
          session.updatedAt = new Date().toISOString();

          if (completed && !session.feedback) {
            try {
              session.feedback = await generateFeedback(session);
            } catch {
              session.feedback = null;
            }
          }

          return json({
            message: {
              role: "assistant",
              content: turn.nextQuestion,
              questionId: session.currentQuestionId,
            },
            question: completed
              ? null
              : {
                  id: session.currentQuestionId,
                  text: session.currentQuestionText,
                  day: session.currentDay,
                },
            isFollowUp: session.pendingIsFollowUp,
            progress: {
              current: completed ? TOTAL_QUESTIONS : session.slotIndex + 1,
              total: TOTAL_QUESTIONS,
            },
            completed,
          });
        } catch (e) {
          return errorResponse(e);
        }
      },
    },
  },
});
