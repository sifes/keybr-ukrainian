"use client";

import { useTypingContext } from "@/context/TypingContext";
import { UKRAINIAN_TO_QWERTY } from "@/lib/keyboard-layout";
import type { Finger, Hand } from "@/lib/types";

// Which finger presses which physical key
const KEY_FINGER_MAP: Record<string, { finger: Finger; hand: Hand }> = {
  KeyQ: { finger: "pinky", hand: "left" },
  KeyA: { finger: "pinky", hand: "left" },
  KeyZ: { finger: "pinky", hand: "left" },
  KeyW: { finger: "ring", hand: "left" },
  KeyS: { finger: "ring", hand: "left" },
  KeyX: { finger: "ring", hand: "left" },
  KeyE: { finger: "middle", hand: "left" },
  KeyD: { finger: "middle", hand: "left" },
  KeyC: { finger: "middle", hand: "left" },
  KeyR: { finger: "index", hand: "left" },
  KeyF: { finger: "index", hand: "left" },
  KeyV: { finger: "index", hand: "left" },
  KeyT: { finger: "index", hand: "left" },
  KeyG: { finger: "index", hand: "left" },
  KeyB: { finger: "index", hand: "left" },
  KeyY: { finger: "index", hand: "right" },
  KeyH: { finger: "index", hand: "right" },
  KeyN: { finger: "index", hand: "right" },
  KeyU: { finger: "index", hand: "right" },
  KeyJ: { finger: "index", hand: "right" },
  KeyM: { finger: "index", hand: "right" },
  KeyI: { finger: "middle", hand: "right" },
  KeyK: { finger: "middle", hand: "right" },
  Comma: { finger: "middle", hand: "right" },
  KeyO: { finger: "ring", hand: "right" },
  KeyL: { finger: "ring", hand: "right" },
  Period: { finger: "ring", hand: "right" },
  KeyP: { finger: "pinky", hand: "right" },
  Semicolon: { finger: "pinky", hand: "right" },
  BracketLeft: { finger: "pinky", hand: "right" },
  BracketRight: { finger: "pinky", hand: "right" },
  Quote: { finger: "pinky", hand: "right" },
};

function getFingerForLetter(letter: string): { finger: Finger; hand: Hand } | null {
  if (letter === " ") return null;
  const code = UKRAINIAN_TO_QWERTY[letter];
  if (!code) return null;
  return KEY_FINGER_MAP[code] || null;
}

const FINGER_NAMES: Record<Finger, string> = {
  pinky: "мізинець",
  ring: "безіменний",
  middle: "середній",
  index: "вказівний",
};

// Finger positions on each hand (x offsets from hand center, y from base)
// Order: pinky, ring, middle, index (+ thumb)
const LEFT_FINGERS = [
  { id: "pinky" as Finger, x: -36, len: 28 },
  { id: "ring" as Finger, x: -20, len: 34 },
  { id: "middle" as Finger, x: -6, len: 38 },
  { id: "index" as Finger, x: 8, len: 34 },
];

const RIGHT_FINGERS = [
  { id: "index" as Finger, x: -8, len: 34 },
  { id: "middle" as Finger, x: 6, len: 38 },
  { id: "ring" as Finger, x: 20, len: 34 },
  { id: "pinky" as Finger, x: 36, len: 28 },
];

const FINGER_COLORS: Record<Finger, string> = {
  pinky: "#8ec07c",
  ring: "#b8bb26",
  middle: "#fabd2f",
  index: "#83a698",
};

function HandSVG({ hand, activeFinger }: { hand: "left" | "right"; activeFinger: Finger | null }) {
  const fingers = hand === "left" ? LEFT_FINGERS : RIGHT_FINGERS;
  const cx = 50;
  const palmY = 70;
  const fingerWidth = 10;
  const thumbDir = hand === "left" ? 1 : -1;

  return (
    <svg viewBox="0 0 100 100" className="w-20 h-20">
      {/* Palm */}
      <ellipse cx={cx} cy={palmY} rx={32} ry={18} fill="var(--bg-button)" stroke="var(--text-faint)" strokeWidth={1} strokeOpacity={0.3} />

      {/* Thumb */}
      <rect
        x={cx + thumbDir * 24}
        y={palmY - 12}
        width={fingerWidth}
        height={20}
        rx={5}
        fill="var(--bg-button)"
        stroke="var(--text-faint)"
        strokeWidth={1}
        strokeOpacity={0.3}
        transform={`rotate(${thumbDir * 30}, ${cx + thumbDir * 29}, ${palmY - 2})`}
      />

      {/* Fingers */}
      {fingers.map((f) => {
        const isActive = f.id === activeFinger;
        const fill = isActive ? FINGER_COLORS[f.id] : "var(--bg-button)";
        const opacity = isActive ? 0.9 : 1;
        const strokeColor = isActive ? FINGER_COLORS[f.id] : "var(--text-faint)";

        return (
          <g key={f.id}>
            <rect
              x={cx + f.x - fingerWidth / 2}
              y={palmY - f.len - 14}
              width={fingerWidth}
              height={f.len}
              rx={5}
              fill={fill}
              fillOpacity={opacity}
              stroke={strokeColor}
              strokeWidth={isActive ? 2 : 1}
              strokeOpacity={isActive ? 1 : 0.3}
              className="transition-all duration-150"
            />
            {/* Fingertip circle highlight */}
            {isActive && (
              <circle
                cx={cx + f.x}
                cy={palmY - f.len - 10}
                r={6}
                fill={FINGER_COLORS[f.id]}
                fillOpacity={0.4}
                className="animate-pulse-hint"
              />
            )}
          </g>
        );
      })}
    </svg>
  );
}

export function HandGuide() {
  const { nextCharacter, state } = useTypingContext();
  const { lessonState } = state;

  const fingerInfo = lessonState === "active" && nextCharacter
    ? getFingerForLetter(nextCharacter)
    : null;

  const isSpace = nextCharacter === " ";

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="flex items-center justify-center gap-6">
        {/* Left hand */}
        <div className="flex flex-col items-center">
          <HandSVG hand="left" activeFinger={fingerInfo?.hand === "left" ? fingerInfo.finger : null} />
          <span className="text-[10px] text-[var(--text-faint)]">ліва</span>
        </div>

        {/* Current key info */}
        <div className="flex flex-col items-center min-w-[80px]">
          {fingerInfo && !isSpace ? (
            <>
              <span className="text-2xl font-bold" style={{ color: FINGER_COLORS[fingerInfo.finger] }}>
                {nextCharacter}
              </span>
              <span className="text-xs text-[var(--text-dim)]">
                {fingerInfo.hand === "left" ? "ліва" : "права"}, {FINGER_NAMES[fingerInfo.finger]}
              </span>
            </>
          ) : isSpace ? (
            <>
              <span className="text-lg text-[var(--text-dim)]">&#9251;</span>
              <span className="text-xs text-[var(--text-dim)]">пробіл</span>
            </>
          ) : (
            <span className="text-xs text-[var(--text-faint)]">...</span>
          )}
        </div>

        {/* Right hand */}
        <div className="flex flex-col items-center">
          <HandSVG hand="right" activeFinger={fingerInfo?.hand === "right" ? fingerInfo.finger : null} />
          <span className="text-[10px] text-[var(--text-faint)]">права</span>
        </div>
      </div>
    </div>
  );
}
