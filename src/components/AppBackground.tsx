export function AppBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 grid-lines opacity-60" />
      <div
        className="aurora left-[-10%] top-[-15%] h-[42rem] w-[42rem] bg-primary/40"
        style={{ animationDelay: "0s" }}
      />
      <div
        className="aurora right-[-15%] top-[10%] h-[36rem] w-[36rem] bg-accent/35"
        style={{ animationDelay: "-6s" }}
      />
      <div
        className="aurora bottom-[-20%] left-[25%] h-[34rem] w-[34rem] bg-primary/25"
        style={{ animationDelay: "-11s" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/40 to-background" />
    </div>
  );
}
