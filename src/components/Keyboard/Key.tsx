"use client";

import { memo } from "react";
import type { KeyboardKey as KeyboardKeyType } from "@/lib/types";
import { getFingerColor, HOME_KEYS } from "@/lib/keyboard-layout";

interface KeyProps {
  keyData: KeyboardKeyType;
  isPressed: boolean;
  isHint: boolean;
  isIncluded: boolean;
  confidence: number;
}

export const Key = memo(function Key({ keyData, isPressed, isHint, isIncluded, confidence }: KeyProps) {
  const { letter, x, y, width, height, hand, finger } = keyData;
  const fingerColor = getFingerColor(hand, finger);
  const isHome = HOME_KEYS.has(letter);

  let fillOpacity = isIncluded ? 0.25 : 0.06;
  let fill = fingerColor;

  if (isPressed) {
    fillOpacity = 0.7;
  } else if (isHint) {
    fill = "var(--accent)";
    fillOpacity = 0.5;
  }

  if (isIncluded && confidence > 0 && !isPressed && !isHint) {
    if (confidence >= 1.0) fillOpacity = 0.35;
    else if (confidence < 0.5) fillOpacity = 0.15;
  }

  return (
    <g transform={`translate(${x}, ${y})`}>
      <rect
        width={width}
        height={height}
        rx={6}
        fill={fill}
        fillOpacity={fillOpacity}
        stroke={isHint ? "var(--accent)" : "var(--text-faint)"}
        strokeWidth={isHint ? 2 : 0.3}
        strokeOpacity={isHint ? 1 : 0.3}
        className={isHint ? "animate-pulse-hint" : ""}
      />
      {isPressed && (
        <rect width={width} height={height} rx={6} fill={fingerColor} fillOpacity={0.5} />
      )}
      <text
        x={width / 2}
        y={height / 2 + 1}
        textAnchor="middle"
        dominantBaseline="central"
        fill={isIncluded ? "var(--text-main)" : "var(--text-faint)"}
        fontSize={16}
        fontWeight={isHint ? 700 : 500}
        fontFamily="system-ui, sans-serif"
      >
        {letter}
      </text>
      {isHome && (
        <rect
          x={width / 2 - 6} y={height - 8} width={12} height={2} rx={1}
          fill="var(--text-main)" fillOpacity={0.3}
        />
      )}
    </g>
  );
});
