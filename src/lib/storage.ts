import type { LetterStats, LessonResult, Settings } from "./types";
import { DEFAULT_SETTINGS } from "./constants";

const STORAGE_KEY = "keybr-ua-v1";

interface StoredState {
  version: 1;
  settings: Settings;
  letterStats: Record<string, LetterStats>;
  lessonHistory: LessonResult[];
  streak: number;
  totalPracticeTimeMs: number;
}

function getDefaultState(): StoredState {
  return {
    version: 1,
    settings: DEFAULT_SETTINGS,
    letterStats: {},
    lessonHistory: [],
    streak: 0,
    totalPracticeTimeMs: 0,
  };
}

export function loadState(): StoredState {
  if (typeof window === "undefined") return getDefaultState();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultState();
    const parsed = JSON.parse(raw) as StoredState;
    if (parsed.version !== 1) return getDefaultState();
    return {
      ...getDefaultState(),
      ...parsed,
      settings: { ...DEFAULT_SETTINGS, ...parsed.settings },
    };
  } catch {
    return getDefaultState();
  }
}

export function saveState(state: Partial<StoredState>): void {
  if (typeof window === "undefined") return;
  try {
    const current = loadState();
    const merged = { ...current, ...state, version: 1 as const };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
  } catch {
    // localStorage full or unavailable
  }
}

export function saveSettings(settings: Settings): void {
  saveState({ settings });
}

export function saveLetterStats(letterStats: Record<string, LetterStats>): void {
  saveState({ letterStats });
}

export function saveLessonResult(result: LessonResult, letterStats: Record<string, LetterStats>, streak: number): void {
  const current = loadState();
  saveState({
    letterStats,
    lessonHistory: [...current.lessonHistory, result],
    streak,
    totalPracticeTimeMs: current.totalPracticeTimeMs + result.duration,
  });
}

export function clearAllData(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}
