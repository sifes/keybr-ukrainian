"use client";

import { useTypingContext } from "@/context/TypingContext";
import { clearAllData } from "@/lib/storage";
import type { FontSize, SpeedUnit, Theme } from "@/lib/types";

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Settings({ isOpen, onClose }: SettingsProps) {
  const { settings, updateSetting, resetSettings } = useTypingContext();

  if (!isOpen) return null;

  const handleReset = () => {
    if (confirm("Ви впевнені? Це видалить весь прогрес та налаштування.")) {
      clearAllData();
      resetSettings();
      window.location.reload();
    }
  };

  const active = "bg-[var(--accent)] text-white";
  const inactive = "bg-[var(--bg-button)] text-[var(--text-dim)] hover:bg-[var(--bg-button-hover)]";

  return (
    <div className="fixed inset-0 z-50 flex justify-end" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-md h-full bg-[var(--bg-card)] shadow-2xl overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Налаштування</h2>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-[var(--bg-button)] text-[var(--text-dim)] transition-colors">
              &#10005;
            </button>
          </div>

          <Section title="Цільова швидкість">
            <div className="flex items-center gap-3">
              <input type="range" min={75} max={750} step={25} value={settings.targetSpeed}
                onChange={(e) => updateSetting("targetSpeed", Number(e.target.value))}
                className="flex-1 accent-[var(--accent)]"
              />
              <span className="text-sm font-mono w-20 text-right">{settings.targetSpeed} CPM</span>
            </div>
            <p className="text-xs text-[var(--text-faint)]">= {Math.round(settings.targetSpeed / 5)} WPM</p>
          </Section>

          <Section title="Одиниці швидкості">
            <div className="flex gap-2">
              {(["cpm", "wpm"] as SpeedUnit[]).map((unit) => (
                <button key={unit} onClick={() => updateSetting("speedUnit", unit)}
                  className={`px-4 py-2 rounded-lg text-sm transition-colors ${settings.speedUnit === unit ? active : inactive}`}>
                  {unit === "cpm" ? "Символів/хв" : "Слів/хв"}
                </button>
              ))}
            </div>
          </Section>

          <Section title="Тип тексту">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={settings.naturalWords}
                onChange={(e) => updateSetting("naturalWords", e.target.checked)}
                className="w-4 h-4 accent-[var(--accent)]" />
              <span className="text-sm">Використовувати реальні українські слова</span>
            </label>
            <p className="text-xs text-[var(--text-faint)]">Вимкніть для фонетичних псевдослів</p>
          </Section>

          <Section title="Розмір шрифту">
            <div className="flex gap-2">
              {(["small", "medium", "large", "xlarge"] as FontSize[]).map((size) => (
                <button key={size} onClick={() => updateSetting("fontSize", size)}
                  className={`px-3 py-2 rounded-lg text-sm transition-colors ${settings.fontSize === size ? active : inactive}`}>
                  {{ small: "S", medium: "M", large: "L", xlarge: "XL" }[size]}
                </button>
              ))}
            </div>
          </Section>

          <Section title="Тема">
            <div className="flex gap-2">
              {(["system", "light", "dark"] as Theme[]).map((theme) => (
                <button key={theme} onClick={() => updateSetting("theme", theme)}
                  className={`px-4 py-2 rounded-lg text-sm transition-colors ${settings.theme === theme ? active : inactive}`}>
                  {{ system: "Системна", light: "Світла", dark: "Темна" }[theme]}
                </button>
              ))}
            </div>
          </Section>

          <Section title="Звук">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={settings.soundEnabled}
                onChange={(e) => updateSetting("soundEnabled", e.target.checked)}
                className="w-4 h-4 accent-[var(--accent)]" />
              <span className="text-sm">Звук при натисканні клавіш</span>
            </label>
          </Section>

          <Section title="Дані">
            <button onClick={handleReset} className="px-4 py-2 rounded-lg text-sm bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors">
              Скинути весь прогрес
            </button>
          </Section>

          <button onClick={onClose} className="w-full py-3 rounded-lg bg-[var(--accent)] text-white font-medium hover:opacity-90 transition-opacity">
            Готово
          </button>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-[var(--text-dim)]">{title}</h3>
      {children}
    </div>
  );
}
