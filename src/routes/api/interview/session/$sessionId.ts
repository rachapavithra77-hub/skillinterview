import { createFileRoute } from "@tanstack/react-router";
import { errorResponse, json, preflight } from "@/lib/http.server";
import { publicSession, sessions } from "@/lib/session-store.server";

export const Route = createFileRoute("/api/interview/session/$sessionId")({
  server: {
    handlers: {
      OPTIONS: async () => preflight(),
      GET: async ({ params }) => {
        try {
          const session = sessions.get(params.sessionId);
          if (!session) return json({ error: "Interview session not found" }, 404);
          return json(publicSession(session));
        } catch (e) {
          return errorResponse(e);
        }
      },
    },
  },
});
