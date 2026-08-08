export function ScoreRing({
  score,
  size = 160,
  label,
  sublabel,
}: {
  score: number;
  size?: number;
  label?: string;
  sublabel?: string;
}) {
  const stroke = size / 12;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (Math.max(0, Math.min(100, score)) / 100) * c;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id={`ring-${size}-${label ?? "x"}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="oklch(0.68 0.17 258)" />
            <stop offset="100%" stopColor="oklch(0.7 0.17 305)" />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          strokeWidth={stroke}
          className="stroke-secondary"
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          strokeWidth={stroke}
          strokeLinecap="round"
          stroke={`url(#ring-${size}-${label ?? "x"})`}
          fill="none"
          strokeDasharray={c}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(.2,.7,.3,1)" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display font-bold" style={{ fontSize: size / 4 }}>
          {score}
        </span>
        {label ? (
          <span className="text-xs uppercase tracking-widest text-muted-foreground">{label}</span>
        ) : null}
        {sublabel ? <span className="text-[11px] text-muted-foreground">{sublabel}</span> : null}
      </div>
    </div>
  );
}

export function ScoreBar({ label, score }: { label: string; score: number }) {
  return (
    <div className="glass rounded-2xl p-4">
      <div className="flex items-baseline justify-between">
        <span className="text-sm text-muted-foreground">{label}</span>
        <span className="font-display text-xl font-semibold">{score}</span>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-secondary">
        <div
          className="h-full rounded-full bg-gradient-hero"
          style={{ width: `${score}%`, transition: "width 1s cubic-bezier(.2,.7,.3,1)" }}
        />
      </div>
    </div>
  );
}
