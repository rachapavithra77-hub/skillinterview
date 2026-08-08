import { createFileRoute } from "@tanstack/react-router";
import { errorResponse, json, preflight } from "@/lib/http.server";
import { agentState } from "@/lib/session-store.server";
import { generateAgentFeed } from "@/lib/interview.service.server";

export const Route = createFileRoute("/api/agent/feed")({
  server: {
    handlers: {
      OPTIONS: async () => preflight(),
      GET: async () => {
        try {
          if (!agentState.initialized) {
            agentState.initialized = true;
            agentState.initializedAt = new Date().toISOString();
          }
          if (!agentState.feed.length) {
            agentState.feed = await generateAgentFeed();
          }
          return json({
            initialized: agentState.initialized,
            initializedAt: agentState.initializedAt,
            count: agentState.feed.length,
            posts: agentState.feed,
          });
        } catch (e) {
          return errorResponse(e);
        }
      },
    },
  },
});
