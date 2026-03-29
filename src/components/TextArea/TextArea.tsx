"use client";

import { useMemo } from "react";
import { useTypingContext } from "@/context/TypingContext";
import { CharSpan } from "./CharSpan";
import { FONT_SIZE_MAP } from "@/lib/constants";

interface WordData {
  chars: { char: string; globalIndex: number }[];
}

function splitIntoWords(text: string): WordData[] {
  const words: WordData[] = [];
  let current: WordData = { chars: [] };

  for (let i = 0; i < text.length; i++) {
    current.chars.push({ char: text[i], globalIndex: i });
    // End word after space
    if (text[i] === " ") {
      words.push(current);
      current = { chars: [] };
    }
  }
  // Push last word if it has chars
  if (current.chars.length > 0) {
    words.push(current);
  }

  return words;
}

export function TextArea() {
  const { state, settings, handleActivate } = useTypingContext();
  const { text, typedChars, cursorPosition, lessonState, currentSpeed, currentAccuracy, previousResult } = state;

  const fontSizeClass = FONT_SIZE_MAP[settings.fontSize];
  const words = useMemo(() => splitIntoWords(text), [text]);

  return (
    <div
      className="relative w-full rounded-xl bg-[var(--bg-card)] shadow-[0_1px_4px_rgba(0,0,0,0.1)] cursor-text select-none"
      onClick={handleActivate}
      role="textbox"
      aria-label="Зона для друку"
      tabIndex={0}
    >
      {/* Text display — words wrap as whole units */}
      <div className={`px-8 py-6 font-mono ${fontSizeClass} leading-[2.2] h-40 overflow-hidden`}>
        {words.map((word, wi) => (
          <span key={wi} className="inline-block whitespace-nowrap">
            {word.chars.map(({ char, globalIndex }) => {
              const typed = typedChars[globalIndex];
              const charState = typed ? typed.state : "pending";
              const isCursor = globalIndex === cursorPosition && lessonState === "active";

              return (
                <CharSpan
                  key={globalIndex}
                  char={char}
                  state={charState}
                  isCursor={isCursor}
                />
              );
            })}
          </span>
        ))}
      </div>

      {/* Overlay: idle */}
      {lessonState === "idle" && text && (
        <div className="absolute inset-0 flex items-center justify-center bg-[var(--bg-card)]/90 rounded-xl backdrop-blur-[1px]">
          <p className="text-base text-[var(--text-dim)]">
            Натисніть <kbd className="px-2 py-1 bg-[var(--bg-button)] border border-[var(--text-faint)]/20 rounded text-sm font-mono mx-1">Enter</kbd> щоб почати
          </p>
        </div>
      )}

      {/* Overlay: complete */}
      {lessonState === "complete" && previousResult && (
        <div className="absolute inset-0 flex items-center justify-center bg-[var(--bg-card)]/90 rounded-xl backdrop-blur-[1px]">
          <div className="text-center space-y-3">
            <p className="text-xl font-semibold">Урок завершено!</p>
            <div className="flex gap-8 text-sm text-[var(--text-dim)]">
              <div>
                <p className="text-2xl font-bold text-[var(--text-hit)]">{Math.round(previousResult.speed)}</p>
                <p>{settings.speedUnit === "wpm" ? "сл/хв" : "сим/хв"}</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-orange-500">{Math.round(previousResult.accuracy * 100)}%</p>
                <p>точність</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-violet-500">{previousResult.score}</p>
                <p>бали</p>
              </div>
            </div>
            <p className="text-xs text-[var(--text-faint)]">Наступний урок через мить...</p>
          </div>
        </div>
      )}

      {!text && (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-[var(--text-faint)]">Завантаження...</p>
        </div>
      )}

      {lessonState === "active" && (
        <div className="px-8 pb-3 flex gap-6 text-xs text-[var(--text-dim)]">
          <span>Швидкість: <strong>{Math.round(currentSpeed)}</strong> {settings.speedUnit === "wpm" ? "сл/хв" : "сим/хв"}</span>
          <span>Точність: <strong>{Math.round(currentAccuracy * 100)}%</strong></span>
          <span>Прогрес: <strong>{cursorPosition}/{text.length}</strong></span>
        </div>
      )}
    </div>
  );
}
