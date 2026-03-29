"use client";

import { useTypingContext } from "@/context/TypingContext";
import { KEYBOARD_KEYS, KEYBOARD_WIDTH, KEYBOARD_HEIGHT } from "@/lib/keyboard-layout";
import { Key } from "./Key";

export function Keyboard() {
  const { state, settings, pressedKeys, nextCharacter } = useTypingContext();
  const { includedLetters, letterStats, lessonState } = state;
  const includedSet = new Set(includedLetters);

  if (settings.viewMode === "bare") return null;

  const padding = 16;
  const viewWidth = KEYBOARD_WIDTH + padding * 2;
  const viewHeight = KEYBOARD_HEIGHT + padding * 2;

  return (
    <div className="w-full max-w-3xl mx-auto">
      <svg
        viewBox={`0 0 ${viewWidth} ${viewHeight}`}
        className="w-full h-auto"
        role="img"
        aria-label="Українська клавіатура ЙЦУКЕН"
      >
        <g transform={`translate(${padding}, ${padding})`}>
          {KEYBOARD_KEYS.map((keyData) => {
            const stats = letterStats[keyData.letter];
            return (
              <Key
                key={keyData.qwertyCode}
                keyData={keyData}
                isPressed={pressedKeys.has(keyData.letter)}
                isHint={lessonState === "active" && nextCharacter === keyData.letter}
                isIncluded={includedSet.has(keyData.letter)}
                confidence={stats?.confidence ?? 0}
              />
            );
          })}
        </g>
      </svg>
    </div>
  );
}
