"use client";

interface SessionCounterProps {
  count: number;
}

export function SessionCounter({ count }: SessionCounterProps) {
  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <span className="inline-block size-2 rounded-full bg-[#818cf8]/60" />
      <span>
        {count} {count === 1 ? "session" : "sessions"} completed
      </span>
    </div>
  );
}
