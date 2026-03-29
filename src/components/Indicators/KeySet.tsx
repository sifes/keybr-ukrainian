"use client";

import { useTypingContext } from "@/context/TypingContext";
import { PROGRESSIVE_LETTER_ORDER } from "@/data/ukrainian-phonetic-rules";

function getConfidenceStyle(confidence: number): string {
  if (confidence >= 1.0) return "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30";
  if (confidence >= 0.8) return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
  if (confidence >= 0.5) return "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/25";
  if (confidence > 0) return "bg-red-500/10 text-red-500 dark:text-red-400 border-red-500/20";
  return "bg-[var(--bg-button)] text-[var(--text-faint)] border-transparent";
}

export function KeySet() {
  const { state } = useTypingContext();
  const { includedLetters, focusedLetter, letterStats } = state;
  const includedSet = new Set(includedLetters);

  return (
    <div className="flex flex-wrap gap-1.5 justify-center">
      {PROGRESSIVE_LETTER_ORDER.map((letter) => {
        const isIncluded = includedSet.has(letter);
        const isFocused = letter === focusedLetter;
        const stats = letterStats[letter];
        const confidence = stats?.confidence ?? 0;

        if (!isIncluded) {
          return (
            <span key={letter} className="w-7 h-7 flex items-center justify-center rounded text-[10px] text-[var(--text-faint)]/40">
              {letter}
            </span>
          );
        }

        return (
          <span
            key={letter}
            className={`w-7 h-7 flex items-center justify-center rounded text-sm font-medium border transition-all duration-200 ${getConfidenceStyle(confidence)} ${isFocused ? "ring-2 ring-[var(--accent)] scale-110" : ""}`}
            title={`${letter}: ${Math.round(confidence * 100)}% впевненість`}
          >
            {letter}
          </span>
        );
      })}
    </div>
  );
}
