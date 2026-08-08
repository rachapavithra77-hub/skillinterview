import { createFileRoute } from "@tanstack/react-router";
import { json, preflight } from "@/lib/http.server";

export const Route = createFileRoute("/api/health")({
  server: {
    handlers: {
      OPTIONS: async () => preflight(),
      GET: async () => json({ status: "active", service: "ai-interview-agent" }),
    },
  },
});
