"use client";

import { memo } from "react";
import type { CharState } from "@/lib/types";

interface CharSpanProps {
  char: string;
  state: CharState;
  isCursor: boolean;
}

export const CharSpan = memo(function CharSpan({ char, state, isCursor }: CharSpanProps) {
  const isSpace = char === " ";

  let colorClass = "";
  switch (state) {
    case "hit":
      colorClass = "text-[var(--text-hit)]";
      break;
    case "miss":
      colorClass = "text-[var(--text-miss)]";
      break;
    case "pending":
      colorClass = "text-[var(--text-faint)]";
      break;
  }

  // keybr-style cursor: thick underline under the current character
  // No blink during typing — steady indicator
  const cursorClass = isCursor
    ? "border-b-[3px] border-[var(--accent)] pb-[1px]"
    : "";

  return (
    <span
      className={`${colorClass} ${cursorClass} transition-colors duration-100`}
    >
      {isSpace ? "\u00A0" : char}
    </span>
  );
});
