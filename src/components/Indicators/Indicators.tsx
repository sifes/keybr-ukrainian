"use client";

import { useTypingContext } from "@/context/TypingContext";
import { Gauge } from "./Gauge";
import { KeySet } from "./KeySet";
import { CurrentKey } from "./CurrentKey";
import { Streak } from "./Streak";

export function Indicators() {
  const { state, settings } = useTypingContext();
  const { currentSpeed, currentAccuracy, previousResult } = state;

  if (settings.viewMode !== "normal") return null;

  const prevSpeed = previousResult?.speed ?? 0;
  const prevAccuracy = previousResult?.accuracy ?? 0;

  const speed = settings.speedUnit === "wpm" ? currentSpeed / 5 : currentSpeed;
  const prevSpeedDisplay = settings.speedUnit === "wpm" ? prevSpeed / 5 : prevSpeed;

  return (
    <div className="w-full max-w-3xl mx-auto space-y-4">
      <div className="flex justify-center gap-8">
        <Gauge
          value={speed}
          max={settings.speedUnit === "wpm" ? 120 : 600}
          label="Швидкість"
          unit={settings.speedUnit === "wpm" ? "сл/хв" : "сим/хв"}
          color="#059669"
          delta={previousResult ? speed - prevSpeedDisplay : undefined}
        />
        <Gauge
          value={currentAccuracy * 100}
          max={100}
          label="Точність"
          unit="%"
          color="#f97316"
          delta={previousResult ? (currentAccuracy - prevAccuracy) * 100 : undefined}
        />
        <Gauge
          value={previousResult?.score ?? 0}
          max={200}
          label="Бали"
          unit="очки"
          color="#8b5cf6"
          delta={state.lessonHistory.length > 1 ? (previousResult?.score ?? 0) - (state.lessonHistory[state.lessonHistory.length - 2]?.score ?? 0) : undefined}
        />
      </div>

      <KeySet />

      <div className="flex items-center justify-between px-2">
        <CurrentKey />
        <Streak />
      </div>
    </div>
  );
}
