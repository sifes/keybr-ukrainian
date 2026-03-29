"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { SessionState, Settings } from "@/lib/types";
import { useTypingSession } from "@/hooks/useTypingSession";
import { useSettings } from "@/hooks/useSettings";
import { useKeyboard } from "@/hooks/useKeyboard";

interface TypingContextValue {
  state: SessionState;
  settings: Settings;
  pressedKeys: Set<string>;
  nextCharacter: string;
  handleActivate: () => void;
  handleReset: () => void;
  handleSkip: () => void;
  updateSetting: <K extends keyof Settings>(key: K, value: Settings[K]) => void;
  resetSettings: () => void;
}

const TypingContext = createContext<TypingContextValue | null>(null);

export function TypingProvider({ children }: { children: ReactNode }) {
  const { settings, updateSetting, resetSettings } = useSettings();
  const { state, handleChar, handleActivate, handleReset, handleSkip, nextCharacter } = useTypingSession(settings);

  const { pressedKeys } = useKeyboard({
    onChar: handleChar,
    onActivate: handleActivate,
    onReset: handleReset,
    onSkip: handleSkip,
    active: state.lessonState === "active",
  });

  return (
    <TypingContext.Provider
      value={{
        state,
        settings,
        pressedKeys,
        nextCharacter,
        handleActivate,
        handleReset,
        handleSkip,
        updateSetting,
        resetSettings,
      }}
    >
      {children}
    </TypingContext.Provider>
  );
}

export function useTypingContext(): TypingContextValue {
  const ctx = useContext(TypingContext);
  if (!ctx) throw new Error("useTypingContext must be used within TypingProvider");
  return ctx;
}
