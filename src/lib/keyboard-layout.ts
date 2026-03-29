import type { Finger, Hand, KeyboardKey } from "./types";

// Physical key code → Ukrainian letter mapping
export const QWERTY_TO_UKRAINIAN: Record<string, string> = {
  KeyQ: "й", KeyW: "ц", KeyE: "у", KeyR: "к", KeyT: "е",
  KeyY: "н", KeyU: "г", KeyI: "ш", KeyO: "щ", KeyP: "з",
  BracketLeft: "х", BracketRight: "ї",
  KeyA: "ф", KeyS: "і", KeyD: "в", KeyF: "а", KeyG: "п",
  KeyH: "р", KeyJ: "о", KeyK: "л", KeyL: "д",
  Semicolon: "ж", Quote: "є",
  KeyZ: "я", KeyX: "ч", KeyC: "с", KeyV: "м", KeyB: "и",
  KeyN: "т", KeyM: "ь", Comma: "б", Period: "ю",
};

export const UKRAINIAN_TO_QWERTY: Record<string, string> = Object.fromEntries(
  Object.entries(QWERTY_TO_UKRAINIAN).map(([k, v]) => [v, k])
);

// All Ukrainian lowercase letters
export const UKRAINIAN_LETTERS = new Set(Object.values(QWERTY_TO_UKRAINIAN));

// Finger assignment per physical column
interface FingerAssignment {
  finger: Finger;
  hand: Hand;
}

const FINGER_MAP: Record<string, FingerAssignment> = {
  // Top row
  KeyQ: { finger: "pinky", hand: "left" },
  KeyW: { finger: "ring", hand: "left" },
  KeyE: { finger: "middle", hand: "left" },
  KeyR: { finger: "index", hand: "left" },
  KeyT: { finger: "index", hand: "left" },
  KeyY: { finger: "index", hand: "right" },
  KeyU: { finger: "index", hand: "right" },
  KeyI: { finger: "middle", hand: "right" },
  KeyO: { finger: "ring", hand: "right" },
  KeyP: { finger: "pinky", hand: "right" },
  BracketLeft: { finger: "pinky", hand: "right" },
  BracketRight: { finger: "pinky", hand: "right" },
  // Home row
  KeyA: { finger: "pinky", hand: "left" },
  KeyS: { finger: "ring", hand: "left" },
  KeyD: { finger: "middle", hand: "left" },
  KeyF: { finger: "index", hand: "left" },
  KeyG: { finger: "index", hand: "left" },
  KeyH: { finger: "index", hand: "right" },
  KeyJ: { finger: "index", hand: "right" },
  KeyK: { finger: "middle", hand: "right" },
  KeyL: { finger: "ring", hand: "right" },
  Semicolon: { finger: "pinky", hand: "right" },
  Quote: { finger: "pinky", hand: "right" },
  // Bottom row
  KeyZ: { finger: "pinky", hand: "left" },
  KeyX: { finger: "ring", hand: "left" },
  KeyC: { finger: "middle", hand: "left" },
  KeyV: { finger: "index", hand: "left" },
  KeyB: { finger: "index", hand: "left" },
  KeyN: { finger: "index", hand: "right" },
  KeyM: { finger: "index", hand: "right" },
  Comma: { finger: "middle", hand: "right" },
  Period: { finger: "ring", hand: "right" },
};

// SVG layout constants
const KEY_W = 54;
const KEY_H = 54;
const GAP = 4;
const ROW_H = KEY_H + GAP;

// Row definitions with stagger offsets (ANSI keyboard)
const ROWS: { keys: string[]; row: "top" | "home" | "bottom"; offsetX: number; y: number }[] = [
  {
    row: "top",
    offsetX: 0,
    y: 0,
    keys: ["KeyQ", "KeyW", "KeyE", "KeyR", "KeyT", "KeyY", "KeyU", "KeyI", "KeyO", "KeyP", "BracketLeft", "BracketRight"],
  },
  {
    row: "home",
    offsetX: 14, // ANSI stagger
    y: ROW_H,
    keys: ["KeyA", "KeyS", "KeyD", "KeyF", "KeyG", "KeyH", "KeyJ", "KeyK", "KeyL", "Semicolon", "Quote"],
  },
  {
    row: "bottom",
    offsetX: 38, // ANSI stagger
    y: ROW_H * 2,
    keys: ["KeyZ", "KeyX", "KeyC", "KeyV", "KeyB", "KeyN", "KeyM", "Comma", "Period"],
  },
];

// Build the keyboard keys array with positions
export const KEYBOARD_KEYS: KeyboardKey[] = ROWS.flatMap(({ row, offsetX, y, keys }) =>
  keys.map((code, col) => ({
    letter: QWERTY_TO_UKRAINIAN[code],
    row,
    col,
    finger: FINGER_MAP[code].finger,
    hand: FINGER_MAP[code].hand,
    qwertyCode: code,
    x: offsetX + col * (KEY_W + GAP),
    y,
    width: KEY_W,
    height: KEY_H,
  }))
);

// Get the color for a key based on its finger zone
export function getFingerColor(hand: Hand, finger: Finger): string {
  if (hand === "left") {
    return { pinky: "#8ec07c", ring: "#b8bb26", middle: "#fabd2f", index: "#83a698" }[finger];
  }
  return { pinky: "#8ec07c", ring: "#b8bb26", middle: "#fabd2f", index: "#d3869b" }[finger];
}

// Home keys (keys with homing bumps)
export const HOME_KEYS = new Set(["а", "о"]); // F and J positions

// Calculate total SVG dimensions
export const KEYBOARD_WIDTH = Math.max(
  ...ROWS.map((r) => r.offsetX + r.keys.length * (KEY_W + GAP) - GAP)
);
export const KEYBOARD_HEIGHT = ROWS.length * ROW_H - GAP;
