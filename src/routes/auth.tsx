import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2, LogIn, ShieldCheck } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { useAuth } from "@/context/AuthContext";

export const Route = createFileRoute("/auth")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Sign In — AI Interview Agent" },
      {
        name: "description",
        content: "Sign in or create an account to save your AI mock interview sessions and results.",
      },
      { property: "og:title", content: "Sign In — AI Interview Agent" },
      { property: "og:description", content: "Secure email and password access to your interview practice." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { signIn, signUp, session, configured } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    if (session) navigate({ to: "/dashboard", replace: true });
  }, [session, navigate]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setNotice(null);
    if (mode === "signin") {
      const { error } = await signIn(email, password);
      if (error) setError(error);
    } else {
      const { error, needsConfirmation } = await signUp(email, password);
      if (error) setError(error);
      else if (needsConfirmation) setNotice("Check your inbox to confirm your email, then sign in.");
    }
    setBusy(false);
  }

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto flex max-w-md flex-col px-5 py-16">
        <div className="glass rounded-3xl p-8">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-hero glow-ring">
            <ShieldCheck className="h-5 w-5 text-primary-foreground" />
          </span>
          <h1 className="mt-5 font-display text-3xl font-semibold">
            {mode === "signin" ? "Welcome back" : "Create your account"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {mode === "signin"
              ? "Sign in with your email and password."
              : "Sign up with an email and password to get started."}
          </p>

          {!configured ? (
            <p className="mt-5 rounded-xl border border-border bg-secondary/60 p-4 text-sm text-muted-foreground">
              Authentication is not configured yet. Add VITE_SUPABASE_URL and
              VITE_SUPABASE_PUBLISHABLE_KEY to the environment.
            </p>
          ) : null}

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 w-full rounded-xl border border-border bg-secondary/50 px-4 py-3 text-sm outline-none focus:border-accent"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                minLength={6}
                autoComplete={mode === "signin" ? "current-password" : "new-password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 w-full rounded-xl border border-border bg-secondary/50 px-4 py-3 text-sm outline-none focus:border-accent"
                placeholder="••••••••"
              />
            </div>

            {error ? <p className="text-sm text-destructive">{error}</p> : null}
            {notice ? <p className="text-sm text-accent">{notice}</p> : null}

            <button
              type="submit"
              disabled={busy || !configured}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-hero px-6 py-3.5 font-semibold text-primary-foreground glow-ring disabled:opacity-60"
            >
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />}
              {mode === "signin" ? "Sign In" : "Sign Up"}
            </button>
          </form>

          <button
            type="button"
            onClick={() => {
              setMode(mode === "signin" ? "signup" : "signin");
              setError(null);
              setNotice(null);
            }}
            className="mt-5 w-full text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            {mode === "signin"
              ? "Don't have an account? Sign up"
              : "Already have an account? Sign in"}
          </button>
        </div>
      </main>
    </div>
  );
}
