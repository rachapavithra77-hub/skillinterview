import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { errorResponse, json, preflight } from "@/lib/http.server";
import { publicSession, sessions } from "@/lib/session-store.server";
import { generateFeedback } from "@/lib/interview.service.server";

const EndSchema = z.object({ sessionId: z.string().min(1) });

export const Route = createFileRoute("/api/interview/end")({
  server: {
    handlers: {
      OPTIONS: async () => preflight(),
      POST: async ({ request }) => {
        try {
          const body = await request.json().catch(() => ({}));
          const parsed = EndSchema.safeParse(body ?? {});
          if (!parsed.success) {
            return json({ error: "Invalid request", issues: parsed.error.issues }, 400);
          }
          const session = sessions.get(parsed.data.sessionId);
          if (!session) return json({ error: "Interview session not found" }, 404);

          session.completed = true;
          session.updatedAt = new Date().toISOString();
          if (!session.feedback && session.answers.length > 0) {
            try {
              session.feedback = await generateFeedback(session);
            } catch {
              session.feedback = null;
            }
          }
          return json({ success: true, completed: true, session: publicSession(session) });
        } catch (e) {
          return errorResponse(e);
        }
      },
    },
  },
});
