"use client";

import {
  useState,
  useEffect,
  useCallback,
  useRef,
  useSyncExternalStore,
} from "react";
import { Timer } from "@/app/components/Timer";
import { Controls } from "@/app/components/Controls";
import { SessionCounter } from "@/app/components/SessionCounter";
import {
  FOCUS_DURATION,
  getDuration,
  nextSession,
  type SessionType,
} from "@/app/lib/timerUtils";

const STORAGE_KEY = "nocta-session-count";

// Notify useSyncExternalStore subscribers when we write to localStorage
let listeners: Array<() => void> = [];
function emitChange() {
  for (const listener of listeners) listener();
}

function subscribe(callback: () => void) {
  listeners = [...listeners, callback];
  return () => {
    listeners = listeners.filter((l) => l !== callback);
  };
}

function getSnapshot(): number {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? parseInt(stored, 10) || 0 : 0;
}

function getServerSnapshot(): number {
  return 0;
}

function incrementSessionCount() {
  const current = getSnapshot();
  localStorage.setItem(STORAGE_KEY, String(current + 1));
  emitChange();
}

export default function Home() {
  const [sessionType, setSessionType] = useState<SessionType>("focus");
  const [secondsLeft, setSecondsLeft] = useState(FOCUS_DURATION);
  const [isRunning, setIsRunning] = useState(false);
  const sessionCount = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
  const [justSwitched, setJustSwitched] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

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
          setSecondsLeft(getDuration(next));
          setJustSwitched(true);

          if (sessionType === "focus") {
            incrementSessionCount();
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

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-10 px-4 selection:bg-[#818cf8]/30">
      {/* Header */}
      <header className="flex flex-col items-center gap-2">
        <h1 className="font-[family-name:var(--font-space-grotesk)] text-4xl font-light tracking-tight text-foreground">
          Nocta
        </h1>
        <p className="text-sm text-muted-foreground tracking-wide">
          Deep focus, after dark.
        </p>
      </header>

      {/* Timer */}
      <Timer
        secondsLeft={secondsLeft}
        sessionType={sessionType}
        isRunning={isRunning}
        justSwitched={justSwitched}
      />

      {/* Controls */}
      <Controls
        isRunning={isRunning}
        onStart={handleStart}
        onPause={handlePause}
        onReset={handleReset}
      />

      {/* Session counter */}
      <SessionCounter count={sessionCount} />
    </div>
  );
}
