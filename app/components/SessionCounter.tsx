"use client";

interface SessionCounterProps {
  count: number;
}

export function SessionCounter({ count }: SessionCounterProps) {
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-[10px] font-medium tracking-[0.2em] uppercase text-muted-foreground/70">
        Sessions
      </span>
      <span className="text-2xl font-light text-[#818cf8]/80 font-mono tabular-nums">
        {count}
      </span>
    </div>
  );
}
