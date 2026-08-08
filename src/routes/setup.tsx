import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { CheckCircle2, Loader2, Play } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { ErrorPanel } from "@/components/ErrorPanel";
import { useInterview, type InterviewConfig } from "@/context/InterviewContext";
import { DAY_LABELS } from "@/utils/format";

export const Route = createFileRoute("/setup")({
  head: () => ({
    meta: [
      { title: "Interview Setup — AI Interview Agent" },
      {
        name: "description",
        content:
          "Configure your AI mock interview: candidate ID, curriculum day, interview type and difficulty.",
      },
      { property: "og:title", content: "Interview Setup — AI Interview Agent" },
      {
        property: "og:description",
        content: "Configure curriculum day, interview type and difficulty before you begin.",
      },
    ],
  }),
  component: SetupPage,
});

const TYPES: InterviewConfig["interviewType"][] = ["technical", "behavioral", "mixed"];
const LEVELS: InterviewConfig["difficulty"][] = ["beginner", "intermediate", "advanced"];

function SetupPage() {
  const { config, setConfig, start, loading, error, clearError } = useInterview();
  const navigate = useNavigate();

  const begin = async () => {
    const id = await start();
    if (id) navigate({ to: "/interview" });
  };

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-5 py-12">
        <h1 className="font-display text-4xl font-semibold">Interview setup</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Configure the session. The agent will cover all four curriculum days regardless of where
          you start.
        </p>

        {error ? (
          <div className="mt-6">
            <ErrorPanel
              message={error}
              onRetry={() => {
                clearError();
                void begin();
              }}
            />
          </div>
        ) : null}

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="glass space-y-8 rounded-3xl p-7">
            <Field label="Candidate ID">
              <input
                value={config.userId}
                onChange={(e) => setConfig({ userId: e.target.value })}
                className="w-full rounded-xl border border-input bg-background/60 px-4 py-3 text-sm outline-none transition-shadow focus:ring-2 focus:ring-ring"
                placeholder="user-1"
              />
            </Field>

            <Field label="Curriculum day">
              <div className="grid gap-3 sm:grid-cols-2">
                {[1, 2, 3, 4].map((d) => (
                  <button
                    key={d}
                    onClick={() => setConfig({ day: d })}
                    className={`rounded-2xl border p-4 text-left transition-all ${
                      config.day === d
                        ? "border-primary bg-secondary glow-ring"
                        : "border-border hover:bg-secondary/50"
                    }`}
                  >
                    <span className="text-xs uppercase tracking-widest text-muted-foreground">
                      Day {d}
                    </span>
                    <span className="mt-1 block text-sm font-medium">{DAY_LABELS[d]}</span>
                  </button>
                ))}
              </div>
            </Field>

            <Field label="Interview type">
              <Pills
                options={TYPES}
                value={config.interviewType}
                onChange={(v) => setConfig({ interviewType: v })}
              />
            </Field>

            <Field label="Difficulty">
              <Pills
                options={LEVELS}
                value={config.difficulty}
                onChange={(v) => setConfig({ difficulty: v })}
              />
            </Field>

            <button
              onClick={begin}
              disabled={loading || !config.userId.trim()}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-hero px-6 py-4 font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 glow-ring"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Preparing your interviewer…
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" /> Begin AI Interview
                </>
              )}
            </button>
          </div>

          <aside className="glass h-fit rounded-3xl p-7">
            <span className="text-xs uppercase tracking-widest text-muted-foreground">
              Interview preview
            </span>
            <h2 className="mt-2 font-display text-2xl font-semibold">
              Day {config.day} · {config.interviewType}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">{DAY_LABELS[config.day]}</p>
            <ul className="mt-6 space-y-3 text-sm">
              {[
                "Minimum 8 questions",
                "Context-aware follow-ups",
                "All 4 curriculum days covered",
                "AI feedback and scoring",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 text-success" />
                  <span className="text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 rounded-2xl bg-secondary/60 p-4 text-xs text-muted-foreground">
              Difficulty: <span className="font-medium text-foreground">{config.difficulty}</span>
              <br />
              Candidate: <span className="font-medium text-foreground">{config.userId || "—"}</span>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <span className="mb-3 block text-xs uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
      {children}
    </div>
  );
}

function Pills<T extends string>({
  options,
  value,
  onChange,
}: {
  options: T[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o}
          onClick={() => onChange(o)}
          className={`rounded-xl border px-4 py-2.5 text-sm capitalize transition-all ${
            value === o ? "border-primary bg-secondary glow-ring" : "border-border hover:bg-secondary/50"
          }`}
        >
          {o}
        </button>
      ))}
    </div>
  );
}
