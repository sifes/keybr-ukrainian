import type { LetterStats, Settings } from "./types";
import { PROGRESSIVE_LETTER_ORDER } from "../data/ukrainian-phonetic-rules";
import { INITIAL_LETTER_COUNT, MIN_SAMPLES_FOR_CONFIDENCE } from "./constants";
import { buildTransitionTable, generateFragment, type TransitionTable } from "./markov";

let cachedTable: TransitionTable | null = null;
let cachedWords: string[] | null = null;

async function getWordList(): Promise<string[]> {
  if (cachedWords) return cachedWords;
  const data = (await import("../data/ukrainian-language-data.json")).default;
  cachedWords = data.wordsByFrequency as string[];
  return cachedWords;
}

async function getTransitionTable(): Promise<TransitionTable> {
  if (cachedTable) return cachedTable;
  const words = await getWordList();
  cachedTable = buildTransitionTable(words);
  return cachedTable;
}

export function determineIncludedLetters(
  letterStats: Record<string, LetterStats>,
  targetSpeed: number,
): string[] {
  const included: string[] = [];

  for (let i = 0; i < PROGRESSIVE_LETTER_ORDER.length; i++) {
    const letter = PROGRESSIVE_LETTER_ORDER[i];

    // Always include minimum set
    if (i < INITIAL_LETTER_COUNT) {
      included.push(letter);
      continue;
    }

    // Include if this letter was previously mastered
    const stats = letterStats[letter];
    if (stats && stats.bestConfidence >= 1.0) {
      included.push(letter);
      continue;
    }

    // Check if all currently included letters have been mastered at some point
    const allMastered = included.every((l) => {
      const s = letterStats[l];
      return s && s.bestConfidence >= 1.0 && s.samples >= MIN_SAMPLES_FOR_CONFIDENCE;
    });

    if (allMastered) {
      included.push(letter); // Unlock the next letter
      break; // Only unlock one at a time
    }

    break; // Stop if conditions not met
  }

  return included;
}

export function determineFocusedLetter(
  includedLetters: string[],
  letterStats: Record<string, LetterStats>,
): string {
  let weakestLetter = includedLetters[0];
  let lowestConfidence = Infinity;

  for (const letter of includedLetters) {
    const stats = letterStats[letter];
    const confidence = stats ? stats.confidence : 0;

    if (confidence < lowestConfidence) {
      lowestConfidence = confidence;
      weakestLetter = letter;
    }
  }

  return weakestLetter;
}

export async function createLesson(
  letterStats: Record<string, LetterStats>,
  settings: Settings,
): Promise<{ text: string; includedLetters: string[]; focusedLetter: string }> {
  const includedLetters = determineIncludedLetters(letterStats, settings.targetSpeed);
  const focusedLetter = determineFocusedLetter(includedLetters, letterStats);

  const [table, wordList] = await Promise.all([
    getTransitionTable(),
    getWordList(),
  ]);

  const text = generateFragment(
    table,
    includedLetters,
    focusedLetter,
    settings.naturalWords,
    wordList,
  );

  return { text, includedLetters, focusedLetter };
}
