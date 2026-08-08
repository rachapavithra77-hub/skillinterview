import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Loader2, PartyPopper, ArrowRight } from "lucide-react";
import { useInterview } from "@/context/InterviewContext";
import { ErrorPanel } from "@/components/ErrorPanel";
import { ScoreBar, ScoreRing } from "@/components/ScoreVisuals";
import { ListCard } from "@/components/ListCard";

export const Route = createFileRoute("/complete")({
  head: () => ({
    meta: [
      { title: "Interview Complete — AI Interview Agent" },
      {
        name: "description",
        content: "Your AI interview is complete. Review your overall score and AI-generated summary.",
      },
      { property: "og:title", content: "Interview Complete — AI Interview Agent" },
      { property: "og:description", content: "Overall score, category breakdown and summary." },
    ],
  }),
  component: CompletePage,
});

function CompletePage() {
  const { sessionId, feedback, loading, error, loadFeedback, clearError } = useInterview();
  const navigate = useNavigate();

  useEffect(() => {
    if (!sessionId) {
      navigate({ to: "/setup" });
      return;
    }
    if (!feedback) void loadFeedback(sessionId);
  }, [sessionId, feedback, loadFeedback, navigate]);

  if (!sessionId) return null;

  return (
    <div className="min-h-screen">
      <main className="mx-auto max-w-5xl px-5 py-16">
        <div className="text-center">
          <span className="relative mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-hero glow-ring">
            <span className="animate-pulse-ring absolute inset-0 rounded-full border border-primary" />
            <PartyPopper className="h-10 w-10 text-primary-foreground" />
          </span>
          <h1 className="mt-8 font-display text-4xl font-semibold sm:text-5xl">
            Interview <span className="text-gradient">Complete</span>
          </h1>
          <p className="mt-3 text-muted-foreground">
            Your responses have been analysed across all four curriculum days.
          </p>
        </div>

        {error ? (
          <div className="mt-10">
            <ErrorPanel
              message={error}
              onRetry={() => {
                clearError();
                void loadFeedback(sessionId);
              }}
            />
          </div>
        ) : null}

        {loading && !feedback ? (
          <div className="mt-16 flex flex-col items-center gap-3 text-muted-foreground">
            <Loader2 className="h-6 w-6 animate-spin" />
            Generating your structured feedback…
          </div>
        ) : null}

        {feedback ? (
          <>
            <div className="mt-12 flex flex-col items-center gap-6">
              <ScoreRing score={feedback.overallScore} size={200} label="Overall" sublabel="out of 100" />
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <ScoreBar label="Technical" score={feedback.technicalScore} />
              <ScoreBar label="Communication" score={feedback.communicationScore} />
              <ScoreBar label="Problem Solving" score={feedback.problemSolvingScore} />
              <ScoreBar label="Confidence" score={feedback.confidenceScore} />
            </div>

            <div className="mt-10 grid gap-5 md:grid-cols-2">
              <ListCard title="Strengths" items={feedback.strengths} tone="success" />
              <ListCard title="Areas to improve" items={feedback.areasToImprove} tone="warning" />
            </div>

            <div className="glass mt-6 rounded-3xl p-7">
              <h2 className="font-display text-xl font-semibold">AI summary</h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">{feedback.summary}</p>
            </div>

            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <Link
                to="/results/$sessionId"
                params={{ sessionId }}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-hero px-6 py-3.5 font-semibold text-primary-foreground glow-ring"
              >
                View detailed results <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 rounded-xl border border-border px-6 py-3.5 font-medium transition-colors hover:bg-secondary"
              >
                Go to dashboard
              </Link>
            </div>
          </>
        ) : null}
      </main>
    </div>
  );
}
