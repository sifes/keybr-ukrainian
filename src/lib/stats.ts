import type { TypedChar, LessonResult, LetterStats } from "./types";
import { EMA_ALPHA } from "./constants";

export function calculateSpeed(chars: TypedChar[], unit: "cpm" | "wpm"): number {
  if (chars.length < 2) return 0;
  const totalTimeMs = chars.reduce((sum, c) => sum + c.timeMs, 0);
  if (totalTimeMs <= 0) return 0;
  const cpm = (chars.length / totalTimeMs) * 60000;
  return unit === "wpm" ? cpm / 5 : cpm;
}

export function calculateAccuracy(chars: TypedChar[]): number {
  if (chars.length === 0) return 1;
  const errors = chars.filter((c) => c.state === "miss").length;
  return (chars.length - errors) / chars.length;
}

export function calculateScore(speed: number, accuracy: number, uniqueLetters: number, length: number): number {
  const complexity = uniqueLetters / 33;
  const errors = Math.round(length * (1 - accuracy));
  return Math.round((speed * complexity) / (errors + 1) * (length / 50));
}

export function emaSmooth(current: number, newValue: number, alpha: number = EMA_ALPHA): number {
  if (current <= 0) return newValue;
  return alpha * newValue + (1 - alpha) * current;
}

export function calculateConfidence(averageTime: number, targetSpeed: number): number {
  if (averageTime <= 0) return 0;
  const targetTime = 60000 / targetSpeed; // ms per character at target CPM
  return targetTime / averageTime;
}

export function buildLessonResult(
  chars: TypedChar[],
  startTime: number,
  endTime: number,
  includedLetters: string[],
  focusedLetter: string,
  speedUnit: "cpm" | "wpm",
): LessonResult {
  const perKeyStats: Record<string, { hits: number; misses: number; avgTime: number }> = {};

  for (const c of chars) {
    const letter = c.char.toLowerCase();
    if (!perKeyStats[letter]) {
      perKeyStats[letter] = { hits: 0, misses: 0, avgTime: 0 };
    }
    if (c.state === "hit") {
      const prev = perKeyStats[letter];
      const totalTime = prev.avgTime * prev.hits + c.timeMs;
      prev.hits++;
      prev.avgTime = totalTime / prev.hits;
    } else {
      perKeyStats[letter].misses++;
    }
  }

  return {
    timestamp: endTime,
    duration: endTime - startTime,
    length: chars.length,
    speed: calculateSpeed(chars, speedUnit),
    accuracy: calculateAccuracy(chars),
    score: calculateScore(
      calculateSpeed(chars, "cpm"),
      calculateAccuracy(chars),
      new Set(chars.map((c) => c.char.toLowerCase())).size,
      chars.length,
    ),
    includedLetters,
    focusedLetter,
    perKeyStats,
  };
}

export function updateLetterStats(
  existingStats: Record<string, LetterStats>,
  perKeyStats: Record<string, { hits: number; misses: number; avgTime: number }>,
  targetSpeed: number,
): Record<string, LetterStats> {
  const updated = { ...existingStats };

  for (const [letter, keyResult] of Object.entries(perKeyStats)) {
    const prev = updated[letter] || {
      letter,
      hitCount: 0,
      missCount: 0,
      totalTime: 0,
      averageTime: 0,
      bestTime: Infinity,
      confidence: 0,
      bestConfidence: 0,
      samples: 0,
    };

    const newHits = prev.hitCount + keyResult.hits;
    const newMisses = prev.missCount + keyResult.misses;

    let newAvgTime = prev.averageTime;
    let newBestTime = prev.bestTime;

    if (keyResult.hits > 0 && keyResult.avgTime > 0) {
      newAvgTime = emaSmooth(prev.averageTime, keyResult.avgTime);
      newBestTime = Math.min(prev.bestTime === Infinity ? keyResult.avgTime : prev.bestTime, keyResult.avgTime);
    }

    const confidence = calculateConfidence(newAvgTime, targetSpeed);
    const bestConfidence = Math.max(prev.bestConfidence, confidence);

    updated[letter] = {
      letter,
      hitCount: newHits,
      missCount: newMisses,
      totalTime: prev.totalTime + keyResult.avgTime * keyResult.hits,
      averageTime: newAvgTime,
      bestTime: newBestTime,
      confidence,
      bestConfidence,
      samples: prev.samples + 1,
    };
  }

  return updated;
}
