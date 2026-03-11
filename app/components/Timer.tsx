"use client";

import {
  formatTime,
  getDuration,
  type SessionType,
} from "@/app/lib/timerUtils";

interface TimerProps {
  secondsLeft: number;
  sessionType: SessionType;
  isRunning: boolean;
  justSwitched: boolean;
}

const RING_SIZE = 272;
const STROKE_WIDTH = 4;
const RADIUS = (RING_SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function Timer({
  secondsLeft,
  sessionType,
  isRunning,
  justSwitched,
}: TimerProps) {
  const label = sessionType === "focus" ? "Focus" : "Break";
  const totalDuration = getDuration(sessionType);
  const progress = 1 - secondsLeft / totalDuration;
  const strokeOffset = CIRCUMFERENCE * (1 - progress);

  const accentColor = sessionType === "focus" ? "#818cf8" : "#22d3ee";
  const glowClass =
    sessionType === "focus" ? "animate-pulse-glow" : "animate-pulse-glow-cyan";

  return (
    <div
      className={`flex flex-col items-center gap-5 ${justSwitched ? "animate-scale-pop" : ""}`}
    >
      {/* Timer ring + digits */}
      <div className="relative flex items-center justify-center w-[272px] h-[272px] sm:w-[272px] sm:h-[272px]">
        {/* SVG progress ring */}
        <svg
          className="absolute inset-0 -rotate-90"
          width={RING_SIZE}
          height={RING_SIZE}
          viewBox={`0 0 ${RING_SIZE} ${RING_SIZE}`}
        >
          {/* Track */}
          <circle
            cx={RING_SIZE / 2}
            cy={RING_SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke="rgba(148, 163, 184, 0.08)"
            strokeWidth={STROKE_WIDTH}
          />
          {/* Progress */}
          <circle
            cx={RING_SIZE / 2}
            cy={RING_SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke={accentColor}
            strokeWidth={STROKE_WIDTH}
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={strokeOffset}
            className="transition-[stroke-dashoffset] duration-1000 linear"
            style={{ opacity: isRunning ? 0.9 : 0.4 }}
          />
        </svg>

        {/* Inner glow background */}
        <div
          className={`absolute inset-4 rounded-full ${justSwitched ? glowClass : ""}`}
          style={{
            background: `radial-gradient(circle, ${accentColor}08 0%, transparent 70%)`,
          }}
        />

        {/* Timer digits */}
        <span
          className={`relative font-mono text-7xl font-extralight tracking-wider transition-all duration-500 ${
            sessionType === "focus" ? "text-foreground" : "text-[#22d3ee]"
          } ${isRunning ? "opacity-100" : "opacity-50"}`}
        >
          {formatTime(secondsLeft)}
        </span>
      </div>

      {/* Session pill indicator */}
      <div
        className={`flex items-center gap-2 px-4 py-1.5 rounded-full transition-all duration-500 ${
          sessionType === "focus"
            ? "bg-[#818cf8]/8 text-[#818cf8]"
            : "bg-[#22d3ee]/8 text-[#22d3ee]"
        } ${justSwitched ? "animate-fade-in" : ""}`}
      >
        <span
          className="inline-block size-1.5 rounded-full"
          style={{ backgroundColor: accentColor }}
        />
        <span className="text-xs font-medium tracking-widest uppercase">
          {label}
        </span>
      </div>
    </div>
  );
}
