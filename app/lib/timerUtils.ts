export const FOCUS_DURATION = 25 * 60; // 25 minutes in seconds
export const BREAK_DURATION = 5 * 60; // 5 minutes in seconds

export type SessionType = "focus" | "break";

/**
 * Formats seconds into MM:SS display string.
 */
export function formatTime(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

/**
 * Returns the duration in seconds for the given session type.
 */
export function getDuration(session: SessionType): number {
  return session === "focus" ? FOCUS_DURATION : BREAK_DURATION;
}

/**
 * Returns the next session type.
 */
export function nextSession(current: SessionType): SessionType {
  return current === "focus" ? "break" : "focus";
}
