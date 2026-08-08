import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { BrainCircuit, Clock, Eraser, LogOut, Send, Sparkles, User } from "lucide-react";
import { useInterview } from "@/context/InterviewContext";
import { ErrorPanel } from "@/components/ErrorPanel";
import { DAY_LABELS, formatTime } from "@/utils/format";

export const Route = createFileRoute("/interview")({
  head: () => ({
    meta: [
      { title: "Interview Room — AI Interview Agent" },
      {
        name: "description",
        content: "Live AI interview room with curriculum tracking, follow-ups and progress timer.",
      },
      { property: "og:title", content: "Interview Room — AI Interview Agent" },
      { property: "og:description", content: "Your live AI interview session." },
    ],
  }),
  component: InterviewRoom,
});

function InterviewRoom() {
  const {
    sessionId,
    messages,
    currentQuestion,
    progress,
    thinking,
    error,
    elapsed,
    tick,
    clearError,
    submitAnswer,
    end,
    loading,
  } = useInterview();
  const navigate = useNavigate();
  const [answer, setAnswer] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sessionId) navigate({ to: "/setup" });
  }, [sessionId, navigate]);

  useEffect(() => {
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [tick]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages.length, thinking]);

  if (!sessionId) return null;

  const pct = Math.round((progress.current / progress.total) * 100);

  const send = async () => {
    const text = answer.trim();
    if (!text || thinking) return;
    setAnswer("");
    const done = await submitAnswer(text);
    if (done) navigate({ to: "/complete" });
  };

  const finish = async () => {
    await end();
    navigate({ to: "/complete" });
  };

  return (
    <div className="flex min-h-screen flex-col">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/75 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-4 px-5 py-3">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-hero">
              <BrainCircuit className="h-4.5 w-4.5 text-primary-foreground" />
            </span>
            <span className="font-display text-sm font-semibold sm:text-base">
              AI Interview Agent
            </span>
          </Link>

          <span className="rounded-full border border-border bg-secondary/60 px-3 py-1 text-xs">
            Day {currentQuestion?.day ?? "—"}
          </span>
          <span className="text-xs text-muted-foreground">
            Question {progress.current} / {progress.total}
          </span>

          <div className="hidden min-w-40 flex-1 items-center gap-3 sm:flex">
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full rounded-full bg-gradient-hero transition-all duration-700"
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="text-xs text-muted-foreground">{pct}%</span>
          </div>

          <span className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-xs tabular-nums">
            <Clock className="h-3.5 w-3.5" /> {formatTime(elapsed)}
          </span>

          <button
            onClick={finish}
            disabled={loading}
            className="inline-flex items-center gap-1.5 rounded-xl border border-destructive/50 px-3 py-2 text-xs font-medium text-destructive transition-colors hover:bg-destructive/10 disabled:opacity-60"
          >
            <LogOut className="h-3.5 w-3.5" /> End Interview
          </button>
        </div>
      </header>

      <main className="mx-auto grid w-full max-w-7xl flex-1 gap-5 px-5 py-6 lg:grid-cols-[1fr_1fr]">
        {/* LEFT: interviewer + transcript */}
        <section className="glass flex min-h-[28rem] flex-col overflow-hidden rounded-3xl">
          <div className="flex items-center gap-3 border-b border-border/70 px-6 py-4">
            <span className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-hero">
              <BrainCircuit className="h-5 w-5 text-primary-foreground" />
              {thinking ? (
                <span className="animate-pulse-ring absolute inset-0 rounded-2xl border border-primary" />
              ) : null}
            </span>
            <div>
              <p className="font-display text-sm font-semibold">AI Interviewer</p>
              <p className="flex items-center gap-1.5 text-xs text-success">
                <span className="h-1.5 w-1.5 rounded-full bg-success" />
                {thinking ? "Analyzing" : "Online"}
              </p>
            </div>
            <div className="ml-auto flex h-6 items-end gap-1">
              {[0, 1, 2, 3, 4].map((i) => (
                <span
                  key={i}
                  className="w-1 rounded-full bg-primary/70"
                  style={{
                    height: "100%",
                    animation: thinking
                      ? `wave 0.9s ease-in-out ${i * 0.1}s infinite`
                      : `wave 2.4s ease-in-out ${i * 0.2}s infinite`,
                  }}
                />
              ))}
            </div>
          </div>

          <div ref={scrollRef} className="scroll-slim flex-1 space-y-4 overflow-y-auto px-6 py-5">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""} animate-rise`}
              >
                <span
                  className={`mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${
                    m.role === "user" ? "bg-secondary" : "bg-gradient-hero"
                  }`}
                >
                  {m.role === "user" ? (
                    <User className="h-4 w-4" />
                  ) : (
                    <BrainCircuit className="h-4 w-4 text-primary-foreground" />
                  )}
                </span>
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    m.role === "user"
                      ? "rounded-tr-md bg-gradient-hero text-primary-foreground"
                      : "rounded-tl-md bg-secondary/70"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}

            {thinking ? (
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-hero">
                  <Sparkles className="h-4 w-4 animate-pulse text-primary-foreground" />
                </span>
                AI is analyzing your response…
              </div>
            ) : null}
          </div>
        </section>

        {/* RIGHT: current question */}
        <section className="flex flex-col gap-5">
          {error ? <ErrorPanel message={error} onRetry={clearError} /> : null}

          <div className="glass flex flex-1 flex-col rounded-3xl p-6">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-widest text-accent">
                Curriculum Day {currentQuestion?.day ?? "—"}
              </span>
              <span className="text-xs text-muted-foreground">
                Question {progress.current} / {progress.total}
              </span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {DAY_LABELS[currentQuestion?.day ?? 1]}
            </p>

            <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full rounded-full bg-gradient-hero transition-all duration-700"
                style={{ width: `${pct}%` }}
              />
            </div>

            <h1 className="mt-6 font-display text-2xl font-semibold leading-snug">
              {currentQuestion?.text ?? "Preparing the next question…"}
            </h1>

            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) void send();
              }}
              disabled={thinking}
              rows={9}
              placeholder="Type your answer… (⌘/Ctrl + Enter to submit)"
              className="scroll-slim mt-6 w-full flex-1 resize-none rounded-2xl border border-input bg-background/60 p-4 text-sm leading-relaxed outline-none transition-shadow focus:ring-2 focus:ring-ring disabled:opacity-60"
            />

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <button
                onClick={send}
                disabled={thinking || !answer.trim()}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-hero px-5 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 glow-ring"
              >
                <Send className="h-4 w-4" /> {thinking ? "Analyzing…" : "Submit Answer"}
              </button>
              <button
                onClick={() => setAnswer("")}
                disabled={thinking || !answer}
                className="inline-flex items-center gap-2 rounded-xl border border-border px-5 py-3 text-sm font-medium transition-colors hover:bg-secondary disabled:opacity-50"
              >
                <Eraser className="h-4 w-4" /> Clear
              </button>
              <span className="ml-auto text-xs text-muted-foreground">
                {answer.trim().split(/\s+/).filter(Boolean).length} words
              </span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
