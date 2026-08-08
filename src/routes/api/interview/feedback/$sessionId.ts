import { createFileRoute } from "@tanstack/react-router";
import { errorResponse, json, preflight } from "@/lib/http.server";
import { sessions } from "@/lib/session-store.server";
import { generateFeedback } from "@/lib/interview.service.server";

export const Route = createFileRoute("/api/interview/feedback/$sessionId")({
  server: {
    handlers: {
      OPTIONS: async () => preflight(),
      GET: async ({ params }) => {
        try {
          const session = sessions.get(params.sessionId);
          if (!session) return json({ error: "Interview session not found" }, 404);
          if (!session.answers.length) {
            return json({ error: "No answers recorded for this interview yet" }, 400);
          }
          if (!session.feedback) {
            session.feedback = await generateFeedback(session);
            session.updatedAt = new Date().toISOString();
          }
          return json({
            sessionId: session.sessionId,
            userId: session.userId,
            daysCovered: [...new Set(session.answers.map((a) => a.day))].sort(),
            ...session.feedback,
          });
        } catch (e) {
          return errorResponse(e);
        }
      },
    },
  },
});
