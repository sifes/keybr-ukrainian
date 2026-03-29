export type Finger = "pinky" | "ring" | "middle" | "index";
export type Hand = "left" | "right";
export type CharState = "pending" | "hit" | "miss";
export type LessonState = "idle" | "active" | "complete";
export type SpeedUnit = "wpm" | "cpm";
export type FontSize = "small" | "medium" | "large" | "xlarge";
export type ViewMode = "normal" | "compact" | "bare";
export type Theme = "light" | "dark" | "system";

export interface LetterStats {
  letter: string;
  hitCount: number;
  missCount: number;
  totalTime: number;
  averageTime: number;
  bestTime: number;
  confidence: number;
  bestConfidence: number;
  samples: number;
}

export interface KeyboardKey {
  letter: string;
  row: "top" | "home" | "bottom";
  col: number;
  finger: Finger;
  hand: Hand;
  qwertyCode: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface TypedChar {
  char: string;
  state: CharState;
  timeMs: number;
}

export interface LessonResult {
  timestamp: number;
  duration: number;
  length: number;
  speed: number;
  accuracy: number;
  score: number;
  includedLetters: string[];
  focusedLetter: string;
  perKeyStats: Record<string, { hits: number; misses: number; avgTime: number }>;
}

export interface Settings {
  targetSpeed: number;
  speedUnit: SpeedUnit;
  naturalWords: boolean;
  soundEnabled: boolean;
  dailyGoalMinutes: number;
  fontSize: FontSize;
  viewMode: ViewMode;
  theme: Theme;
}

export interface SessionState {
  lessonState: LessonState;
  text: string;
  typedChars: TypedChar[];
  cursorPosition: number;
  missedPositions: Set<number>; // positions where wrong key was pressed before correct one
  startTime: number | null;
  lastKeyTime: number | null;
  includedLetters: string[];
  focusedLetter: string;
  letterStats: Record<string, LetterStats>;
  lessonHistory: LessonResult[];
  previousResult: LessonResult | null;
  streak: number;
  currentSpeed: number;
  currentAccuracy: number;
}

export type SessionAction =
  | { type: "INIT"; letterStats: Record<string, LetterStats>; lessonHistory: LessonResult[]; settings: Settings }
  | { type: "START_LESSON"; text: string; includedLetters: string[]; focusedLetter: string; autoStart?: boolean }
  | { type: "KEY_PRESS"; key: string; timestamp: number }
  | { type: "COMPLETE_LESSON"; result: LessonResult; updatedStats: Record<string, LetterStats> }
  | { type: "RESET_LESSON" }
  | { type: "SKIP_LESSON"; text: string; includedLetters: string[]; focusedLetter: string }
  | { type: "ACTIVATE" };
