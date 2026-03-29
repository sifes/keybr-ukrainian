"use client";

import { useTypingContext } from "@/context/TypingContext";

export function Streak() {
  const { state } = useTypingContext();
  const { streak } = state;

  if (streak === 0) return null;

  return (
    <div className="flex items-center gap-1.5 text-sm text-[var(--text-secondary)]">
      <span className="text-orange-500">&#9733;</span>
      <span>
        {streak} {streak === 1 ? "урок" : streak < 5 ? "уроки" : "уроків"} з високою точністю
      </span>
    </div>
  );
}
