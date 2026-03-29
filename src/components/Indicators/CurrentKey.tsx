"use client";

import { useTypingContext } from "@/context/TypingContext";

export function CurrentKey() {
  const { state, settings } = useTypingContext();
  const { focusedLetter, letterStats, includedLetters } = state;

  const stats = letterStats[focusedLetter];
  const allUnlocked = includedLetters.length >= 33;

  return (
    <div className="flex items-center gap-4 text-sm">
      <div className="flex items-center gap-3">
        <span className="text-3xl font-bold text-[var(--accent)]">{focusedLetter}</span>
        <div className="text-[var(--text-dim)]">
          {!stats || stats.samples === 0 ? (
            <p className="text-xs">Ще не калібровано</p>
          ) : (
            <div className="flex gap-4 text-xs">
              <div>
                <span className="text-[var(--text-faint)]">Швидкість: </span>
                <span className="font-mono font-medium">
                  {Math.round(60000 / stats.averageTime)} {settings.speedUnit === "wpm" ? "сл/хв" : "сим/хв"}
                </span>
              </div>
              <div>
                <span className="text-[var(--text-faint)]">Впевненість: </span>
                <span className="font-mono font-medium">{Math.round(stats.confidence * 100)}%</span>
              </div>
              <div>
                <span className="text-[var(--text-faint)]">Точність: </span>
                <span className="font-mono font-medium">
                  {stats.hitCount + stats.missCount > 0
                    ? Math.round((stats.hitCount / (stats.hitCount + stats.missCount)) * 100)
                    : 0}%
                </span>
              </div>
            </div>
          )}
          {allUnlocked && <p className="text-xs text-[var(--accent)]">Усі літери розблоковано!</p>}
        </div>
      </div>
    </div>
  );
}
