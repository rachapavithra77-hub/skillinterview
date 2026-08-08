import { AlertTriangle, RefreshCw, Server } from "lucide-react";
import { useState } from "react";
import { api } from "@/services/api";

export function ErrorPanel({ message, onRetry }: { message: string; onRetry?: () => void }) {
  const [serverStatus, setServerStatus] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);

  const check = async () => {
    setChecking(true);
    try {
      const res = await api.health();
      setServerStatus(`Server responded: ${res.status}`);
    } catch {
      setServerStatus("Server did not respond.");
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="glass rounded-2xl border-destructive/40 p-5">
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 h-5 w-5 text-destructive" />
        <div className="flex-1">
          <p className="font-medium">{message}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            The interview agent could not be reached. You can retry or check the server status.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {onRetry ? (
              <button
                onClick={onRetry}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-hero px-4 py-2 text-sm font-semibold text-primary-foreground"
              >
                <RefreshCw className="h-4 w-4" /> Retry
              </button>
            ) : null}
            <button
              onClick={check}
              disabled={checking}
              className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary disabled:opacity-60"
            >
              <Server className="h-4 w-4" /> {checking ? "Checking…" : "Check Server"}
            </button>
          </div>
          {serverStatus ? (
            <p className="mt-3 text-xs text-muted-foreground">{serverStatus}</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
