"use client";

import type { SessionType } from "@/app/lib/timerUtils";

interface SessionCounterProps {
  count: number;
  sessionType: SessionType;
}

export function SessionCounter({ count, sessionType }: SessionCounterProps) {
  const color =
    sessionType === "focus" ? "text-[#818cf8]/80" : "text-[#22d3ee]/80";

  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-[10px] font-medium tracking-[0.2em] uppercase text-muted-foreground/70">
        Sessions
      </span>
      <span
        className={`text-2xl font-light font-mono tabular-nums transition-colors duration-700 ${color}`}
      >
        {count}
      </span>
    </div>
  );
}
