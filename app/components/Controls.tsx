"use client";

import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw } from "lucide-react";

interface ControlsProps {
  isRunning: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
}

export function Controls({
  isRunning,
  onStart,
  onPause,
  onReset,
}: ControlsProps) {
  return (
    <div className="flex items-center gap-4">
      {isRunning ? (
        <Button
          variant="outline"
          size="lg"
          onClick={onPause}
          className="gap-2 border-border/40 bg-secondary/50 hover:bg-secondary/80 hover:shadow-[0_0_16px_rgba(99,102,241,0.15)] transition-all duration-300 cursor-pointer"
        >
          <Pause className="size-4" />
          Pause
        </Button>
      ) : (
        <Button
          variant="outline"
          size="lg"
          onClick={onStart}
          className="gap-2 border-[#818cf8]/30 bg-[#818cf8]/10 text-[#818cf8] hover:bg-[#818cf8]/20 hover:shadow-[0_0_16px_rgba(99,102,241,0.25)] transition-all duration-300 cursor-pointer"
        >
          <Play className="size-4" />
          Start
        </Button>
      )}

      <Button
        variant="ghost"
        size="lg"
        onClick={onReset}
        className="gap-2 text-muted-foreground hover:text-foreground transition-all duration-300 cursor-pointer"
      >
        <RotateCcw className="size-4" />
        Reset
      </Button>
    </div>
  );
}
