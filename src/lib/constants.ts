import type { Settings } from "./types";

export const INITIAL_LETTER_COUNT = 6;
export const TARGET_SPEED_DEFAULT = 175; // CPM
export const EMA_ALPHA = 0.1;
export const MIN_LESSON_LENGTH = 100;
export const MAX_LESSON_LENGTH = 200;
export const WORD_MIN_LENGTH = 3;
export const WORD_MAX_LENGTH = 10;
export const MIN_SAMPLES_FOR_CONFIDENCE = 3;
export const STREAK_ACCURACY_THRESHOLD = 0.95;
export const STREAK_RESET_THRESHOLD = 0.90;

export const DEFAULT_SETTINGS: Settings = {
  targetSpeed: TARGET_SPEED_DEFAULT,
  speedUnit: "cpm",
  naturalWords: true,
  soundEnabled: false,
  dailyGoalMinutes: 0,
  fontSize: "medium",
  viewMode: "normal",
  theme: "system",
};

export const FONT_SIZE_MAP = {
  small: "text-lg",
  medium: "text-xl",
  large: "text-2xl",
  xlarge: "text-3xl",
} as const;

export const FINGER_COLORS = {
  left: {
    pinky: "#8ec07c",
    ring: "#b8bb26",
    middle: "#fabd2f",
    index: "#83a698",
  },
  right: {
    index: "#d3869b",
    middle: "#fabd2f",
    ring: "#b8bb26",
    pinky: "#8ec07c",
  },
} as const;

export const THEME_COLORS = {
  light: {
    bgPrimary: "#f4f0f0",
    bgSecondary: "#ffffff",
    textPrimary: "#282640",
    textSecondary: "#6b6b6b",
    textPending: "#b8b4b4",
    textCorrect: "#2a7e21",
    textError: "#ff3333",
    keyBg: "#e8e4e4",
    keyActive: "#d0c8c8",
    keyHint: "#4a9966",
  },
  dark: {
    bgPrimary: "#1a1a2e",
    bgSecondary: "#16213e",
    textPrimary: "#e0e0e0",
    textSecondary: "#9f9999",
    textPending: "#555555",
    textCorrect: "#448154",
    textError: "#9b4545",
    keyBg: "#2a2a3e",
    keyActive: "#3a3a4e",
    keyHint: "#448154",
  },
} as const;
