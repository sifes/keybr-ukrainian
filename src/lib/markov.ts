import { WORD_MIN_LENGTH, WORD_MAX_LENGTH, MIN_LESSON_LENGTH, MAX_LESSON_LENGTH } from "./constants";

export type TransitionTable = Map<string, Map<string, number>>;

export function buildTransitionTable(words: string[]): TransitionTable {
  const table: TransitionTable = new Map();

  const addTransition = (context: string, next: string) => {
    if (!table.has(context)) table.set(context, new Map());
    const nextMap = table.get(context)!;
    nextMap.set(next, (nextMap.get(next) || 0) + 1);
  };

  for (const word of words) {
    const w = " " + word.toLowerCase() + " ";
    for (let i = 0; i < w.length - 1; i++) {
      for (let order = 1; order <= Math.min(4, i + 1); order++) {
        const context = w.slice(i + 1 - order, i + 1);
        const next = w[i + 1];
        addTransition(context, next);
      }
    }
  }

  return table;
}

function weightedRandomPick(candidates: Map<string, number>, allowedSet: Set<string>): string | null {
  let totalWeight = 0;
  const filtered: [string, number][] = [];

  for (const [char, freq] of candidates) {
    if (allowedSet.has(char) || char === " ") {
      filtered.push([char, freq]);
      totalWeight += freq;
    }
  }

  if (filtered.length === 0 || totalWeight === 0) return null;

  let r = Math.random() * totalWeight;
  for (const [char, freq] of filtered) {
    r -= freq;
    if (r <= 0) return char;
  }

  return filtered[filtered.length - 1][0];
}

function generatePseudoWord(
  table: TransitionTable,
  includedLetters: Set<string>,
  focusedLetter: string,
  targetLength: number,
): string | null {
  let word = "";
  let context = " ";
  let hasFocused = false;

  for (let i = 0; i < targetLength; i++) {
    let picked: string | null = null;

    for (let order = Math.min(4, context.length); order >= 1; order--) {
      const ctx = context.slice(-order);
      const candidates = table.get(ctx);
      if (candidates) {
        picked = weightedRandomPick(candidates, includedLetters);
        if (picked && picked !== " ") break;
      }
    }

    if (!picked || picked === " ") {
      if (!hasFocused && includedLetters.has(focusedLetter)) {
        word += focusedLetter;
        hasFocused = true;
        context += focusedLetter;
        continue;
      }
      break;
    }

    word += picked;
    context += picked;
    if (picked === focusedLetter) hasFocused = true;
  }

  if (word.length < WORD_MIN_LENGTH) return null;
  if (!hasFocused) return null;

  return word;
}

// Shuffle array in-place (Fisher-Yates)
function shuffle<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function generateFragment(
  table: TransitionTable,
  includedLetters: string[],
  focusedLetter: string,
  naturalWords: boolean,
  wordList: string[],
): string {
  const letterSet = new Set(includedLetters);
  const words: string[] = [];
  let totalLength = 0;

  // Also allow shorter words (min 2 chars) when letter set is small
  const minWordLen = includedLetters.length <= 8 ? 2 : WORD_MIN_LENGTH;

  if (naturalWords) {
    const validWords = wordList.filter((w) => {
      const lower = w.toLowerCase();
      if (lower.length < minWordLen || lower.length > WORD_MAX_LENGTH) return false;
      for (const ch of lower) {
        if (!letterSet.has(ch)) return false;
      }
      return true;
    });

    const focusedWords = validWords.filter((w) => w.toLowerCase().includes(focusedLetter));
    const otherWords = validWords.filter((w) => !w.toLowerCase().includes(focusedLetter));

    // Use all available words, shuffled, to maximize variety
    const shuffledFocused = shuffle([...focusedWords]);
    const shuffledOther = shuffle([...otherWords]);
    let focusedIdx = 0;
    let otherIdx = 0;

    while (totalLength < MIN_LESSON_LENGTH) {
      let word: string | undefined;

      // 60% focused words, 40% other — cycling through all available
      if (shuffledFocused.length > 0 && (Math.random() < 0.6 || shuffledOther.length === 0)) {
        word = shuffledFocused[focusedIdx % shuffledFocused.length];
        focusedIdx++;
      } else if (shuffledOther.length > 0) {
        word = shuffledOther[otherIdx % shuffledOther.length];
        otherIdx++;
      }

      if (!word) break;

      // Avoid immediate repetition: don't repeat the same word as previous
      if (words.length > 0 && words[words.length - 1] === word.toLowerCase()) {
        // Try the next word instead
        if (shuffledFocused.length > 1 || shuffledOther.length > 1) {
          continue;
        }
      }

      words.push(word.toLowerCase());
      totalLength += word.length + 1;

      // Safety: if we've cycled through everything twice, stop trying to avoid repeats
      if (focusedIdx > shuffledFocused.length * 3 && otherIdx > shuffledOther.length * 3) break;
    }

    if (totalLength >= MIN_LESSON_LENGTH) {
      return words.join(" ").slice(0, MAX_LESSON_LENGTH);
    }
  }

  // Pseudo-word generation using Markov chain
  let attempts = 0;
  const usedWords = new Set<string>();

  while (totalLength < MIN_LESSON_LENGTH && attempts < 500) {
    attempts++;
    const targetLen = minWordLen + Math.floor(Math.random() * (WORD_MAX_LENGTH - minWordLen + 1));
    const word = generatePseudoWord(table, letterSet, focusedLetter, targetLen);

    if (word) {
      // Avoid repeating the same word more than twice
      const count = words.filter((w) => w === word).length;
      if (count >= 2 && usedWords.size > 3) continue;

      words.push(word);
      usedWords.add(word);
      totalLength += word.length + 1;
    }
  }

  // Fallback: generate simple alternating patterns
  if (totalLength < 50) {
    const vowels = includedLetters.filter((l) => "аеєиіїоуюя".includes(l));
    const consonants = includedLetters.filter((l) => !vowels.includes(l) && l !== "ь");

    while (totalLength < MIN_LESSON_LENGTH) {
      let word = "";
      const len = minWordLen + Math.floor(Math.random() * 4);
      for (let i = 0; i < len; i++) {
        if (i % 2 === 0 && consonants.length > 0) {
          word += consonants[Math.floor(Math.random() * consonants.length)];
        } else if (vowels.length > 0) {
          word += vowels[Math.floor(Math.random() * vowels.length)];
        }
      }
      if (word.length >= minWordLen) {
        // Ensure focused letter appears
        if (!word.includes(focusedLetter)) {
          const pos = Math.floor(Math.random() * word.length);
          word = word.slice(0, pos) + focusedLetter + word.slice(pos + 1);
        }
        words.push(word);
        totalLength += word.length + 1;
      }
    }
  }

  return words.join(" ").slice(0, MAX_LESSON_LENGTH);
}
