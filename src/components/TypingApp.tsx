"use client";

import { useState } from "react";
import { TypingProvider } from "@/context/TypingContext";
import { TextArea } from "./TextArea/TextArea";
import { Keyboard } from "./Keyboard/Keyboard";
import { HandGuide } from "./Keyboard/HandGuide";
import { Indicators } from "./Indicators/Indicators";
import { Controls } from "./Controls/Controls";
import { Settings } from "./Settings/Settings";

export function TypingApp() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [showHands, setShowHands] = useState(false);

  return (
    <TypingProvider>
      <div className="min-h-screen flex flex-col">
        <header className="py-3 px-4 text-center">
          <h1 className="text-lg font-semibold tracking-tight">
            Тренажер друку
            <span className="text-[var(--text-faint)] font-normal ml-2 text-sm">українська</span>
          </h1>
        </header>

        <main className="flex-1 flex flex-col items-center w-full max-w-4xl mx-auto px-4 gap-4 pb-8">
          <Controls
            onOpenSettings={() => setSettingsOpen(true)}
            showHands={showHands}
            onToggleHands={() => setShowHands((v) => !v)}
          />
          <TextArea />
          <Keyboard />
          {showHands && <HandGuide />}
          <Indicators />
        </main>

        <Settings isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
      </div>
    </TypingProvider>
  );
}
