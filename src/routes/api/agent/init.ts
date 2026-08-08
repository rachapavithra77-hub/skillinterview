import { createFileRoute } from "@tanstack/react-router";
import { errorResponse, json, preflight } from "@/lib/http.server";
import { agentState } from "@/lib/session-store.server";
import { generateAgentFeed } from "@/lib/interview.service.server";
import { CURRICULUM, TOTAL_QUESTIONS } from "@/lib/curriculum";

export const Route = createFileRoute("/api/agent/init")({
  server: {
    handlers: {
      OPTIONS: async () => preflight(),
      GET: async () => handleInit(),
      POST: async () => handleInit(),
    },
  },
});

async function handleInit() {
  try {
    agentState.initialized = true;
    agentState.initializedAt = new Date().toISOString();
    try {
      agentState.feed = await generateAgentFeed();
    } catch {
      // Feed generation failure must not block agent initialization.
      agentState.feed = agentState.feed ?? [];
    }
    return json({
      success: true,
      status: "initialized",
      agent: {
        name: "Nova — AI Interview Agent",
        capabilities: [
          "curriculum-driven interviewing",
          "context-aware follow-up questions",
          "answer scoring",
          "structured final feedback",
          "autonomous insight feed",
        ],
        curriculumDays: CURRICULUM.map((d) => ({ day: d.day, title: d.title, topics: d.topics })),
        questionsPerInterview: TOTAL_QUESTIONS,
      },
      feedItems: agentState.feed.length,
      initializedAt: agentState.initializedAt,
    });
  } catch (e) {
    return errorResponse(e);
  }
}
