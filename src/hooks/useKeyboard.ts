"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { QWERTY_TO_UKRAINIAN, UKRAINIAN_LETTERS } from "@/lib/keyboard-layout";

interface UseKeyboardOptions {
  onChar: (char: string, timestamp: number) => void;
  onActivate: () => void;
  onReset: () => void;
  onSkip: () => void;
  active: boolean;
}

export function useKeyboard({ onChar, onActivate, onReset, onSkip, active }: UseKeyboardOptions) {
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());
  const activeRef = useRef(active);
  activeRef.current = active;

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Ctrl+Left → reset
      if (e.ctrlKey && e.key === "ArrowLeft") {
        e.preventDefault();
        onReset();
        return;
      }
      // Ctrl+Right → skip
      if (e.ctrlKey && e.key === "ArrowRight") {
        e.preventDefault();
        onSkip();
        return;
      }

      // Enter → activate
      if (e.key === "Enter") {
        e.preventDefault();
        onActivate();
        return;
      }

      // Ignore modifiers, function keys, etc.
      if (e.ctrlKey || e.altKey || e.metaKey) return;
      if (e.key.length > 1 && e.key !== "Backspace") return;

      // Resolve the Ukrainian character
      let char: string | undefined;

      // First try: event.key might already be Ukrainian if the OS keyboard layout is active
      if (e.key.length === 1 && UKRAINIAN_LETTERS.has(e.key.toLowerCase())) {
        char = e.key.toLowerCase();
      }
      // Second try: map physical key code to Ukrainian
      else if (QWERTY_TO_UKRAINIAN[e.code]) {
        char = QWERTY_TO_UKRAINIAN[e.code];
      }

      // Handle space
      if (e.key === " " || e.code === "Space") {
        char = " ";
      }

      if (!char) return;

      e.preventDefault();

      // Track pressed key for visual feedback
      const keyLetter = char === " " ? "Space" : char;
      setPressedKeys((prev) => new Set(prev).add(keyLetter));

      if (activeRef.current) {
        onChar(char, performance.now());
      }
    },
    [onChar, onActivate, onReset, onSkip],
  );

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    let char: string | undefined;
    if (e.key.length === 1 && UKRAINIAN_LETTERS.has(e.key.toLowerCase())) {
      char = e.key.toLowerCase();
    } else if (QWERTY_TO_UKRAINIAN[e.code]) {
      char = QWERTY_TO_UKRAINIAN[e.code];
    }
    if (e.key === " " || e.code === "Space") {
      char = "Space";
    }

    if (char) {
      const keyLetter = char === "Space" ? "Space" : char;
      setPressedKeys((prev) => {
        const next = new Set(prev);
        next.delete(keyLetter);
        return next;
      });
    }
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  return { pressedKeys };
}
