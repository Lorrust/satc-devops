"use client";

import { formatTime, type SessionType } from "@/app/lib/timerUtils";

interface TimerProps {
  secondsLeft: number;
  sessionType: SessionType;
  isRunning: boolean;
  justSwitched: boolean;
}

export function Timer({
  secondsLeft,
  sessionType,
  isRunning,
  justSwitched,
}: TimerProps) {
  const label = sessionType === "focus" ? "Focus" : "Break";

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Session type label */}
      <span
        className={`text-sm font-medium tracking-widest uppercase transition-all duration-500 ${
          sessionType === "focus" ? "text-[#818cf8]" : "text-[#22d3ee]"
        } ${justSwitched ? "animate-fade-in" : ""}`}
      >
        {label}
      </span>

      {/* Timer display */}
      <div
        className={`relative flex items-center justify-center w-56 h-56 rounded-full border border-border/40 ${
          justSwitched ? "animate-pulse-glow" : ""
        }`}
        style={{
          background:
            "radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%)",
        }}
      >
        <span
          className={`font-mono text-6xl font-light tracking-wider transition-colors duration-500 ${
            sessionType === "focus" ? "text-foreground" : "text-[#22d3ee]"
          } ${isRunning ? "opacity-100" : "opacity-70"}`}
        >
          {formatTime(secondsLeft)}
        </span>
      </div>
    </div>
  );
}
