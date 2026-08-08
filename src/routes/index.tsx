import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BrainCircuit,
  Compass,
  Gauge,
  LineChart,
  MessageSquareQuote,
  Sparkles,
  Target,
} from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AI Interview Agent — Practice Smarter, Interview Confidently" },
      {
        name: "description",
        content:
          "Run a curriculum-based AI mock interview: 8+ questions across 4 curriculum days, context-aware follow-ups and structured performance feedback.",
      },
      { property: "og:title", content: "AI Interview Agent — Practice Smarter" },
      {
        property: "og:description",
        content:
          "Curriculum-driven AI mock interviews with context-aware follow-ups and structured scoring.",
      },
    ],
  }),
  component: Landing,
});

const FEATURES = [
  {
    icon: BrainCircuit,
    title: "AI-Powered Interviews",
    body: "A senior-level AI interviewer drives the session from a structured curriculum, one question at a time.",
  },
  {
    icon: MessageSquareQuote,
    title: "Context-Aware Follow-ups",
    body: "Every follow-up references what you actually said — no generic recycled prompts.",
  },
  {
    icon: Gauge,
    title: "Real-Time Feedback",
    body: "Answers are analysed and scored as you go, so the interview adapts to your depth.",
  },
  {
    icon: LineChart,
    title: "Structured Performance Analysis",
    body: "Technical, communication, problem-solving and confidence scores with per-question review.",
  },
];

const STEPS = [
  {
    n: "01",
    title: "Choose",
    body: "Pick your curriculum day, interview type and difficulty. Setup takes seconds.",
    icon: Compass,
  },
  {
    n: "02",
    title: "Interview",
    body: "Answer at least 8 questions across four curriculum days with live AI follow-ups.",
    icon: MessageSquareQuote,
  },
  {
    n: "03",
    title: "Improve",
    body: "Get a scored report with strengths, gaps and recommended next steps.",
    icon: Target,
  },
];

function Landing() {
  return (
    <div className="min-h-screen">
      <SiteHeader />

      <main>
        {/* Hero */}
        <section className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:py-24">
          <div className="animate-rise">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-3 py-1.5 text-xs font-medium text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5 text-accent" />
              Autonomous interview agent · 4 curriculum days
            </span>
            <h1 className="mt-6 font-display text-5xl font-bold leading-[1.05] sm:text-6xl">
              Practice smarter.
              <br />
              <span className="text-gradient">Interview with confidence.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground">
              An AI interviewer that runs a real, curriculum-driven session — it listens to your
              answers, probes deeper where it matters, and hands you a structured performance report
              at the end.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/setup"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-hero px-6 py-3.5 font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5 glow-ring"
              >
                Start Interview <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 rounded-xl border border-border px-6 py-3.5 font-medium transition-colors hover:bg-secondary"
              >
                View Dashboard
              </Link>
            </div>
            <dl className="mt-10 grid max-w-md grid-cols-3 gap-4">
              {[
                ["8+", "Questions"],
                ["4", "Curriculum days"],
                ["100", "Point scoring"],
              ].map(([v, k]) => (
                <div key={k} className="glass rounded-2xl px-4 py-3">
                  <dt className="font-display text-2xl font-semibold">{v}</dt>
                  <dd className="text-xs text-muted-foreground">{k}</dd>
                </div>
              ))}
            </dl>
          </div>

          <InterviewerVisual />
        </section>

        {/* Features */}
        <section id="features" className="mx-auto max-w-7xl scroll-mt-24 px-5 py-14">
          <h2 className="font-display text-3xl font-semibold sm:text-4xl">
            Built like a real interview loop
          </h2>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Not a quiz generator. The agent maintains conversation context across the whole session.
          </p>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((f) => (
              <article
                key={f.title}
                className="glass group rounded-3xl p-6 transition-transform hover:-translate-y-1"
              >
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-hero">
                  <f.icon className="h-5 w-5 text-primary-foreground" />
                </span>
                <h3 className="mt-5 font-display text-lg font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.body}</p>
              </article>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="mx-auto max-w-7xl scroll-mt-24 px-5 py-14">
          <h2 className="font-display text-3xl font-semibold sm:text-4xl">How it works</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {STEPS.map((s) => (
              <article key={s.n} className="glass relative overflow-hidden rounded-3xl p-7">
                <span className="absolute -right-3 -top-5 font-display text-7xl font-bold text-foreground/5">
                  {s.n}
                </span>
                <s.icon className="h-6 w-6 text-accent" />
                <h3 className="mt-5 font-display text-xl font-semibold">
                  <span className="text-muted-foreground">{s.n}</span> {s.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.body}</p>
              </article>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-7xl px-5 py-16">
          <div className="glass relative overflow-hidden rounded-[2rem] px-8 py-14 text-center">
            <div className="absolute inset-0 bg-gradient-hero opacity-10" />
            <div className="relative">
              <h2 className="font-display text-3xl font-semibold sm:text-4xl">
                Ready for your next interview?
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
                Spin up a session in seconds. No account, no setup friction.
              </p>
              <Link
                to="/setup"
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-gradient-hero px-7 py-3.5 font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5 glow-ring"
              >
                Start Interview <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/70 py-8 text-center text-sm text-muted-foreground">
        AI Interview Agent · Curriculum-driven mock interviews
      </footer>
    </div>
  );
}

function InterviewerVisual() {
  return (
    <div className="relative mx-auto w-full max-w-lg">
      <div className="glass relative rounded-[2rem] p-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="relative flex h-3 w-3">
              <span className="animate-pulse-ring absolute inline-flex h-full w-full rounded-full bg-success" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-success" />
            </span>
            <span className="text-sm font-medium">AI Interviewer · Online</span>
          </div>
          <span className="text-xs uppercase tracking-widest text-muted-foreground">Day 2</span>
        </div>

        <div className="mt-8 flex flex-col items-center">
          <div className="relative flex h-32 w-32 items-center justify-center">
            <span className="animate-pulse-ring absolute inset-0 rounded-full border border-primary/50" />
            <span
              className="animate-pulse-ring absolute inset-0 rounded-full border border-accent/40"
              style={{ animationDelay: "1.2s" }}
            />
            <span className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-hero glow-ring">
              <BrainCircuit className="h-10 w-10 text-primary-foreground" />
            </span>
          </div>
          <div className="mt-6 flex h-10 items-end gap-1.5">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => (
              <span
                key={i}
                className="w-1.5 rounded-full bg-gradient-hero"
                style={{
                  height: "100%",
                  animation: `wave 1.4s ease-in-out ${i * 0.09}s infinite`,
                }}
              />
            ))}
          </div>
        </div>

        <div className="mt-8 space-y-3">
          <div className="rounded-2xl rounded-tl-md bg-secondary/70 px-4 py-3 text-sm">
            Tell me about the most difficult project you have worked on.
          </div>
          <div className="ml-auto max-w-[85%] rounded-2xl rounded-tr-md bg-gradient-hero px-4 py-3 text-sm text-primary-foreground">
            I built a recommendation system for a fintech product.
          </div>
          <div className="rounded-2xl rounded-tl-md bg-secondary/70 px-4 py-3 text-sm">
            What was the biggest technical challenge in that recommendation system?
          </div>
        </div>
      </div>

      <div className="glass animate-floaty absolute -left-6 top-16 hidden rounded-2xl px-4 py-3 text-xs sm:block">
        <p className="text-muted-foreground">Follow-up detected</p>
        <p className="font-medium">Context carried forward</p>
      </div>
      <div
        className="glass animate-floaty absolute -right-4 bottom-16 hidden rounded-2xl px-4 py-3 text-xs sm:block"
        style={{ animationDelay: "-3s" }}
      >
        <p className="text-muted-foreground">Live score</p>
        <p className="font-display text-lg font-semibold text-gradient">82 / 100</p>
      </div>
    </div>
  );
}
