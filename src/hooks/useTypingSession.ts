"use client";

import { useReducer, useCallback, useEffect, useRef } from "react";
import type { SessionState, SessionAction, TypedChar, Settings } from "@/lib/types";
import { buildLessonResult, updateLetterStats, calculateSpeed, calculateAccuracy } from "@/lib/stats";
import { createLesson } from "@/lib/lesson";
import { loadState, saveLessonResult } from "@/lib/storage";
import { STREAK_ACCURACY_THRESHOLD, STREAK_RESET_THRESHOLD } from "@/lib/constants";

const initialState: SessionState = {
  lessonState: "idle",
  text: "",
  typedChars: [],
  cursorPosition: 0,
  missedPositions: new Set(),
  startTime: null,
  lastKeyTime: null,
  includedLetters: [],
  focusedLetter: "",
  letterStats: {},
  lessonHistory: [],
  previousResult: null,
  streak: 0,
  currentSpeed: 0,
  currentAccuracy: 1,
};

function sessionReducer(state: SessionState, action: SessionAction): SessionState {
  switch (action.type) {
    case "INIT":
      return {
        ...state,
        letterStats: action.letterStats,
        lessonHistory: action.lessonHistory,
      };

    case "ACTIVATE":
      if (state.lessonState === "idle" && state.text) {
        return { ...state, lessonState: "active" };
      }
      return state;

    case "START_LESSON":
      return {
        ...state,
        lessonState: action.autoStart ? "active" : "idle",
        text: action.text,
        typedChars: [],
        cursorPosition: 0,
        missedPositions: new Set(),
        startTime: null,
        lastKeyTime: null,
        includedLetters: action.includedLetters,
        focusedLetter: action.focusedLetter,
        currentSpeed: 0,
        currentAccuracy: 1,
      };

    case "KEY_PRESS": {
      if (state.lessonState !== "active") return state;
      if (state.cursorPosition >= state.text.length) return state;

      const expected = state.text[state.cursorPosition];
      const isCorrect = action.key === expected;
      const now = action.timestamp;
      const startTime = state.startTime ?? now;

      if (!isCorrect) {
        // Wrong key: just record that this position had an error, DON'T advance
        // Character stays "pending" visually — no change to typedChars
        const newMissed = new Set(state.missedPositions);
        newMissed.add(state.cursorPosition);
        return {
          ...state,
          missedPositions: newMissed,
          startTime,
          lastKeyTime: now,
        };
      }

      // Correct key: advance cursor
      // If this position had errors → mark as "miss", otherwise "hit"
      const hadError = state.missedPositions.has(state.cursorPosition);
      const timeSinceLastKey = state.lastKeyTime ? now - state.lastKeyTime : 0;

      const newChar: TypedChar = {
        char: expected,
        state: hadError ? "miss" : "hit",
        timeMs: timeSinceLastKey,
      };

      const newTypedChars = [...state.typedChars, newChar];
      const newCursorPosition = state.cursorPosition + 1;

      const charsWithTime = newTypedChars.filter((c) => c.timeMs > 0);
      const currentSpeed = calculateSpeed(charsWithTime, "cpm");
      const currentAccuracy = calculateAccuracy(newTypedChars);

      const isComplete = newCursorPosition >= state.text.length;

      return {
        ...state,
        lessonState: isComplete ? "complete" : "active",
        typedChars: newTypedChars,
        cursorPosition: newCursorPosition,
        startTime,
        lastKeyTime: now,
        currentSpeed,
        currentAccuracy,
      };
    }

    case "COMPLETE_LESSON": {
      const newStreak = action.result.accuracy >= STREAK_ACCURACY_THRESHOLD
        ? state.streak + 1
        : action.result.accuracy < STREAK_RESET_THRESHOLD
          ? 0
          : state.streak;

      return {
        ...state,
        letterStats: action.updatedStats,
        lessonHistory: [...state.lessonHistory, action.result],
        previousResult: action.result,
        streak: newStreak,
      };
    }

    case "RESET_LESSON":
      return {
        ...state,
        lessonState: "idle",
        typedChars: [],
        cursorPosition: 0,
        missedPositions: new Set(),
        startTime: null,
        lastKeyTime: null,
        currentSpeed: 0,
        currentAccuracy: 1,
      };

    case "SKIP_LESSON":
      return {
        ...state,
        lessonState: "idle",
        text: action.text,
        typedChars: [],
        cursorPosition: 0,
        missedPositions: new Set(),
        startTime: null,
        lastKeyTime: null,
        includedLetters: action.includedLetters,
        focusedLetter: action.focusedLetter,
        currentSpeed: 0,
        currentAccuracy: 1,
      };

    default:
      return state;
  }
}

export function useTypingSession(settings: Settings) {
  const [state, dispatch] = useReducer(sessionReducer, initialState);
  const settingsRef = useRef(settings);
  settingsRef.current = settings;

  useEffect(() => {
    const stored = loadState();
    dispatch({
      type: "INIT",
      letterStats: stored.letterStats,
      lessonHistory: stored.lessonHistory,
      settings,
    });

    createLesson(stored.letterStats, settings).then((lesson) => {
      dispatch({
        type: "START_LESSON",
        text: lesson.text,
        includedLetters: lesson.includedLetters,
        focusedLetter: lesson.focusedLetter,
      });
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (state.lessonState !== "complete") return;
    if (!state.startTime || state.typedChars.length === 0) return;

    const result = buildLessonResult(
      state.typedChars,
      state.startTime,
      performance.now(),
      state.includedLetters,
      state.focusedLetter,
      settingsRef.current.speedUnit,
    );

    const updatedStats = updateLetterStats(
      state.letterStats,
      result.perKeyStats,
      settingsRef.current.targetSpeed,
    );

    saveLessonResult(result, updatedStats, state.streak);
    dispatch({ type: "COMPLETE_LESSON", result, updatedStats });

    const timer = setTimeout(() => {
      createLesson(updatedStats, settingsRef.current).then((lesson) => {
        dispatch({
          type: "START_LESSON",
          text: lesson.text,
          includedLetters: lesson.includedLetters,
          focusedLetter: lesson.focusedLetter,
          autoStart: true,
        });
      });
    }, 1500);

    return () => clearTimeout(timer);
  }, [state.lessonState]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleChar = useCallback((key: string, timestamp: number) => {
    dispatch({ type: "KEY_PRESS", key, timestamp });
  }, []);

  const handleActivate = useCallback(() => {
    dispatch({ type: "ACTIVATE" });
  }, []);

  const handleReset = useCallback(() => {
    dispatch({ type: "RESET_LESSON" });
  }, []);

  const handleSkip = useCallback(() => {
    createLesson(state.letterStats, settingsRef.current).then((lesson) => {
      dispatch({
        type: "SKIP_LESSON",
        text: lesson.text,
        includedLetters: lesson.includedLetters,
        focusedLetter: lesson.focusedLetter,
      });
    });
  }, [state.letterStats]);

  const nextCharacter = state.cursorPosition < state.text.length
    ? state.text[state.cursorPosition]
    : "";

  return {
    state,
    handleChar,
    handleActivate,
    handleReset,
    handleSkip,
    nextCharacter,
  };
}
