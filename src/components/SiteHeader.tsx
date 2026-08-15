import { Link, useNavigate } from "@tanstack/react-router";
import { BrainCircuit, LayoutDashboard, LogIn, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export function SiteHeader() {
  const { session, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4">
        <Link to="/" className="group flex items-center gap-3">
          <span className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-hero glow-ring">
            <BrainCircuit className="h-5 w-5 text-primary-foreground" />
          </span>
          <span className="font-display text-lg font-semibold tracking-tight">
            AI Interview <span className="text-gradient">Agent</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 text-sm text-muted-foreground md:flex">
          <Link
            to="/"
            className="rounded-lg px-3 py-2 transition-colors hover:bg-secondary hover:text-foreground"
          >
            Home
          </Link>
          <a
            href="/#how-it-works"
            className="rounded-lg px-3 py-2 transition-colors hover:bg-secondary hover:text-foreground"
          >
            How It Works
          </a>
          <a
            href="/#features"
            className="rounded-lg px-3 py-2 transition-colors hover:bg-secondary hover:text-foreground"
          >
            Features
          </a>
          <Link
            to="/dashboard"
            className="rounded-lg px-3 py-2 transition-colors hover:bg-secondary hover:text-foreground"
          >
            Dashboard
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            to="/dashboard"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-border text-muted-foreground transition-colors hover:text-foreground md:hidden"
            aria-label="Dashboard"
          >
            <LayoutDashboard className="h-4 w-4" />
          </Link>
          <Link
            to="/setup"
            className="rounded-xl bg-gradient-hero px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5 glow-ring"
          >
            Start Interview
          </Link>
        </div>
      </div>
    </header>
  );
}
