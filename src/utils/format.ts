export function formatTime(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function scoreTone(score: number) {
  if (score >= 80) return "text-success";
  if (score >= 60) return "text-warning";
  return "text-destructive";
}

export const DAY_LABELS: Record<number, string> = {
  1: "Introduction & Fundamentals",
  2: "Technical Concepts & Problem Solving",
  3: "Projects, Debugging & System Thinking",
  4: "Behavioral, Teamwork & Leadership",
};
