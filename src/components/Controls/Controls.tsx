"use client";

import { useTypingContext } from "@/context/TypingContext";
import type { ViewMode } from "@/lib/types";

const VIEW_MODES: ViewMode[] = ["normal", "compact", "bare"];
const VIEW_MODE_LABELS: Record<ViewMode, string> = {
  normal: "Повний",
  compact: "Компакт",
  bare: "Мінімум",
};

interface ControlsProps {
  onOpenSettings: () => void;
  showHands: boolean;
  onToggleHands: () => void;
}

export function Controls({ onOpenSettings, showHands, onToggleHands }: ControlsProps) {
  const { settings, updateSetting, handleReset, handleSkip } = useTypingContext();

  const cycleViewMode = () => {
    const currentIndex = VIEW_MODES.indexOf(settings.viewMode);
    const nextIndex = (currentIndex + 1) % VIEW_MODES.length;
    updateSetting("viewMode", VIEW_MODES[nextIndex]);
  };

  const btn = "px-3 py-1.5 text-xs rounded-lg bg-[var(--bg-button)] text-[var(--text-dim)] hover:bg-[var(--bg-button-hover)] transition-colors";
  const btnActive = "px-3 py-1.5 text-xs rounded-lg bg-[var(--accent)] text-white hover:opacity-90 transition-colors";

  return (
    <div className="flex items-center justify-center gap-2 py-2">
      <button onClick={handleReset} className={btn} title="Скинути урок (Ctrl+←)">
        &#8634; Скинути
      </button>
      <button onClick={handleSkip} className={btn} title="Пропустити урок (Ctrl+→)">
        Пропустити &#8635;
      </button>
      <button onClick={onToggleHands} className={showHands ? btnActive : btn} title="Підказка пальців">
        &#9995; Пальці
      </button>
      <button onClick={cycleViewMode} className={btn} title="Режим перегляду">
        &#9635; {VIEW_MODE_LABELS[settings.viewMode]}
      </button>
      <button onClick={onOpenSettings} className={btn} title="Налаштування">
        &#9881; Налаштування
      </button>
    </div>
  );
}
