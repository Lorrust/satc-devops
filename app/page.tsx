"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Timer } from "@/app/components/Timer";
import { Controls } from "@/app/components/Controls";
import { SessionCounter } from "@/app/components/SessionCounter";
import { Particles } from "@/app/components/Particles";
import {
  FOCUS_DURATION,
  getDuration,
  nextSession,
  type SessionType,
} from "@/app/lib/timerUtils";

const STORAGE_KEY = "nocta-session-count";

export default function Home() {
  const [sessionType, setSessionType] = useState<SessionType>("focus");
  const [secondsLeft, setSecondsLeft] = useState(FOCUS_DURATION);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionCount, setSessionCount] = useState(0);
  const [justSwitched, setJustSwitched] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Hydrate session count from localStorage after mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = parseInt(stored, 10);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- hydration-safe localStorage read on mount
      if (!isNaN(parsed)) setSessionCount(parsed);
    }
  }, []);

  // Persist session count to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, String(sessionCount));
  }, [sessionCount]);

  // Core countdown logic
  useEffect(() => {
    if (!isRunning) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          // Timer hit zero — switch session
          const next = nextSession(sessionType);
          setSessionType(next);
          setJustSwitched(true);

          if (sessionType === "focus") {
            setSessionCount((c) => c + 1);
          }

          return getDuration(next);
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, sessionType]);

  // Clear the "just switched" animation flag after it plays
  useEffect(() => {
    if (!justSwitched) return;
    const timeout = setTimeout(() => setJustSwitched(false), 1600);
    return () => clearTimeout(timeout);
  }, [justSwitched]);

  const handleStart = useCallback(() => setIsRunning(true), []);
  const handlePause = useCallback(() => setIsRunning(false), []);
  const handleReset = useCallback(() => {
    setIsRunning(false);
    setSessionType("focus");
    setSecondsLeft(FOCUS_DURATION);
    setJustSwitched(false);
  }, []);

  // Keyboard shortcuts: Space = start/pause, R = reset
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Ignore if user is typing in an input
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;

      if (e.code === "Space") {
        e.preventDefault();
        setIsRunning((prev) => !prev);
      }
      if (e.code === "KeyR" && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        setIsRunning(false);
        setSessionType("focus");
        setSecondsLeft(FOCUS_DURATION);
        setJustSwitched(false);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center px-6 selection:bg-[#818cf8]/30 overflow-hidden">
      {/* Ambient background glow */}
      <div
        className="pointer-events-none fixed inset-0 animate-ambient-drift"
        aria-hidden="true"
      >
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[120px]"
          style={{
            background:
              sessionType === "focus"
                ? "radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)"
                : "radial-gradient(circle, rgba(34,211,238,0.10) 0%, transparent 70%)",
          }}
        />
      </div>

      {/* Floating particles */}
      <Particles sessionType={sessionType} />

      {/* Header — subdued, top area */}
      <header className="flex flex-col items-center gap-1 mb-6">
        <h1 className="font-[family-name:var(--font-space-grotesk)] text-xl font-light tracking-tight text-foreground/60">
          Nocta
        </h1>
        <p className="text-[11px] text-muted-foreground/50 tracking-widest uppercase">
          Deep focus, after dark
        </p>
      </header>

      {/* Timer — main focal point */}
      <div className="mb-6">
        <Timer
          secondsLeft={secondsLeft}
          sessionType={sessionType}
          isRunning={isRunning}
          justSwitched={justSwitched}
        />
      </div>

      {/* Controls */}
      <div className="mb-5">
        <Controls
          isRunning={isRunning}
          onStart={handleStart}
          onPause={handlePause}
          onReset={handleReset}
        />
      </div>

      {/* Session counter */}
      <div className="mb-12">
        <SessionCounter count={sessionCount} />
      </div>

      {/* Keyboard hint */}
      <div className="fixed bottom-5 flex items-center gap-3 text-[10px] text-muted-foreground/30 tracking-wide">
        <span>
          <kbd className="px-1.5 py-0.5 rounded border border-border/30 text-[10px] font-mono">
            space
          </kbd>{" "}
          start / pause
        </span>
        <span>
          <kbd className="px-1.5 py-0.5 rounded border border-border/30 text-[10px] font-mono">
            r
          </kbd>{" "}
          reset
        </span>
      </div>
    </div>
  );
}
