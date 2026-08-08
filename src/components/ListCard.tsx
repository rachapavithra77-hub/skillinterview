import { CheckCircle2 } from "lucide-react";

export function ListCard({
  title,
  items,
  tone,
}: {
  title: string;
  items: string[];
  tone: "success" | "warning";
}) {
  return (
    <div className="glass rounded-3xl p-7">
      <h2 className="font-display text-xl font-semibold">{title}</h2>
      <ul className="mt-4 space-y-3">
        {items.length === 0 ? (
          <li className="text-sm text-muted-foreground">No items recorded.</li>
        ) : (
          items.map((s) => (
            <li key={s} className="flex items-start gap-2.5 text-sm">
              <CheckCircle2
                className={`mt-0.5 h-4 w-4 shrink-0 ${tone === "success" ? "text-success" : "text-warning"}`}
              />
              <span className="text-muted-foreground">{s}</span>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
