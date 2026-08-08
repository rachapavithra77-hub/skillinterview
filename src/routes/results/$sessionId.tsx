import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2, MessageSquareQuote, Target, User } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { ErrorPanel } from "@/components/ErrorPanel";
import { ScoreBar, ScoreRing } from "@/components/ScoreVisuals";
import { ListCard } from "@/components/ListCard";
import { api, ApiError, type Feedback } from "@/services/api";
import { DAY_LABELS, scoreTone } from "@/utils/format";

export const Route = createFileRoute("/results/$sessionId")({
  head: () => ({
    meta: [
      { title: "Interview Results — AI Interview Agent" },
      {
        name: "description",
        content:
          "Detailed AI interview results: category scores, question-by-question feedback and next steps.",
      },
      { property: "og:title", content: "Interview Results — AI Interview Agent" },
      {
        property: "og:description",
        content: "Question-by-question AI analysis of your interview performance.",
      },
    ],
  }),
  component: ResultsPage,
});

function ResultsPage() {
  const { sessionId } = Route.useParams();
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      setFeedback(await api.getFeedback(sessionId));
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Interview server unavailable.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-5 py-12">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">
          Session {sessionId.slice(0, 16)}…
        </p>
        <h1 className="mt-2 font-display text-4xl font-semibold">Performance report</h1>

        {error ? (
          <div className="mt-8">
            <ErrorPanel message={error} onRetry={load} />
          </div>
        ) : null}

        {loading ? (
          <div className="mt-16 flex items-center gap-3 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" /> Loading results…
          </div>
        ) : null}

        {feedback ? (
          <>
            <div className="glass mt-8 grid items-center gap-8 rounded-3xl p-8 md:grid-cols-[auto_1fr]">
              <ScoreRing score={feedback.overallScore} size={180} label="Overall" />
              <div>
                <h2 className="font-display text-xl font-semibold">AI summary</h2>
                <p className="mt-2 leading-relaxed text-muted-foreground">{feedback.summary}</p>
                {feedback.daysCovered?.length ? (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {feedback.daysCovered.map((d) => (
                      <span
                        key={d}
                        className="rounded-full border border-border bg-secondary/60 px-3 py-1 text-xs"
                      >
                        Day {d} · {DAY_LABELS[d]}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <ScoreBar label="Technical" score={feedback.technicalScore} />
              <ScoreBar label="Communication" score={feedback.communicationScore} />
              <ScoreBar label="Problem Solving" score={feedback.problemSolvingScore} />
              <ScoreBar label="Confidence" score={feedback.confidenceScore} />
            </div>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <ListCard title="Strengths" items={feedback.strengths} tone="success" />
              <ListCard title="Areas to improve" items={feedback.areasToImprove} tone="warning" />
            </div>

            {feedback.nextSteps?.length ? (
              <div className="glass mt-6 rounded-3xl p-7">
                <h2 className="flex items-center gap-2 font-display text-xl font-semibold">
                  <Target className="h-5 w-5 text-accent" /> Recommended next steps
                </h2>
                <ol className="mt-4 space-y-3">
                  {feedback.nextSteps.map((s, i) => (
                    <li key={s} className="flex gap-3 text-sm text-muted-foreground">
                      <span className="font-display font-semibold text-foreground">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {s}
                    </li>
                  ))}
                </ol>
              </div>
            ) : null}

            <h2 className="mt-12 font-display text-2xl font-semibold">
              Question-by-question feedback
            </h2>
            <div className="mt-5 space-y-4">
              {feedback.questionFeedback.map((q, i) => (
                <article key={`${q.questionId}-${i}`} className="glass rounded-3xl p-6">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="rounded-full border border-border bg-secondary/60 px-3 py-1 text-xs">
                      Day {q.day}
                    </span>
                    <span className="text-xs text-muted-foreground">Question {i + 1}</span>
                    <span className={`ml-auto font-display text-2xl font-semibold ${scoreTone(q.score)}`}>
                      {q.score}
                    </span>
                  </div>
                  <p className="mt-4 font-medium">{q.question}</p>
                  <div className="mt-4 flex gap-3 rounded-2xl bg-secondary/50 p-4 text-sm">
                    <User className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                    <p className="text-muted-foreground">{q.answer}</p>
                  </div>
                  <div className="mt-3 flex gap-3 rounded-2xl border border-border p-4 text-sm">
                    <MessageSquareQuote className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                    <p className="text-muted-foreground">{q.feedback}</p>
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                to="/setup"
                className="rounded-xl bg-gradient-hero px-6 py-3.5 font-semibold text-primary-foreground glow-ring"
              >
                Start another interview
              </Link>
              <Link
                to="/dashboard"
                className="rounded-xl border border-border px-6 py-3.5 font-medium transition-colors hover:bg-secondary"
              >
                Dashboard
              </Link>
            </div>
          </>
        ) : null}
      </main>
    </div>
  );
}
