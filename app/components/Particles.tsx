"use client";

import { useMemo } from "react";
import type { SessionType } from "@/app/lib/timerUtils";

interface ParticlesProps {
  sessionType: SessionType;
}

interface Particle {
  id: number;
  left: string;
  size: number;
  duration: number;
  delay: number;
  startY: number;
  drift: number;
  opacity: number;
}

const PARTICLE_COUNT = 18;

function generateParticles(seed: number): Particle[] {
  // Deterministic-ish spread so particles don't jump on re-render
  return Array.from({ length: PARTICLE_COUNT }, (_, i) => {
    const hash = ((i + 1) * 2654435761 + seed) >>> 0;
    const rand = (offset: number) =>
      (((hash * (offset + 1) * 16807) >>> 0) % 10000) / 10000;

    return {
      id: i,
      left: `${rand(1) * 100}%`,
      size: 2 + rand(2) * 3, // 2–5px
      duration: 14 + rand(3) * 18, // 14–32s
      delay: rand(4) * -20, // stagger starts
      startY: 80 + rand(5) * 30, // start from bottom area (80–110%)
      drift: -40 + rand(6) * 80, // horizontal drift range
      opacity: 0.15 + rand(7) * 0.35, // 0.15–0.50
    };
  });
}

export function Particles({ sessionType }: ParticlesProps) {
  const particles = useMemo(() => generateParticles(42), []);

  const isFocus = sessionType === "focus";
  // rgb channels only — opacity is per-particle
  const color = isFocus ? "129, 140, 248" : "34, 211, 238"; // indigo : cyan

  return (
    <div
      className="pointer-events-none fixed inset-0 overflow-hidden"
      aria-hidden="true"
    >
      {particles.map((p) => {
        const dotSize = isFocus ? p.size : p.size * 1.4;
        return (
          <span
            key={p.id}
            className="absolute rounded-full"
            style={
              {
                left: p.left,
                top: `${90 + (p.startY - 80)}%`,
                width: dotSize,
                height: dotSize,
                backgroundColor: `rgba(${color}, ${p.opacity})`,
                // Single continuous animation — never restarts
                animation: `particle-drift ${p.duration}s linear ${p.delay}s infinite`,
                // Smooth morph on session switch
                transition:
                  "background-color 1.6s ease-in-out, width 1.6s ease-in-out, height 1.6s ease-in-out",
                "--drift": `${p.drift}px`,
              } as React.CSSProperties
            }
          />
        );
      })}
    </div>
  );
}
