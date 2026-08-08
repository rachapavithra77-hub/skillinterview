import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { errorResponse, json, preflight } from "@/lib/http.server";
import { createSession, publicSession, agentState } from "@/lib/session-store.server";
import { TOTAL_QUESTIONS } from "@/lib/curriculum";

const StartSchema = z.object({
  userId: z.string().min(1).max(64).default("user-1"),
  day: z.coerce.number().int().min(1).max(4).default(1),
  interviewType: z.enum(["technical", "behavioral", "mixed"]).default("mixed"),
  difficulty: z.enum(["beginner", "intermediate", "advanced"]).default("intermediate"),
});

export const Route = createFileRoute("/api/interview/start")({
  server: {
    handlers: {
      OPTIONS: async () => preflight(),
      POST: async ({ request }) => {
        try {
          const body = await request.json().catch(() => ({}));
          const parsed = StartSchema.safeParse(body ?? {});
          if (!parsed.success) {
            return json({ error: "Invalid request", issues: parsed.error.issues }, 400);
          }
          if (!agentState.initialized) {
            agentState.initialized = true;
            agentState.initializedAt = new Date().toISOString();
          }
          const session = createSession(parsed.data);
          return json({
            sessionId: session.sessionId,
            question: {
              id: session.currentQuestionId,
              text: session.currentQuestionText,
              day: session.currentDay,
            },
            progress: { current: 1, total: TOTAL_QUESTIONS },
            session: publicSession(session),
          });
        } catch (e) {
          return errorResponse(e);
        }
      },
    },
  },
});
