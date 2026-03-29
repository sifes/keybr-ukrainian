/**
 * Ukrainian Phonetic Rules for Typing Practice Text Generation
 *
 * Sources:
 * - Ukrainian phonology (Wikipedia)
 * - sttmedia.com character frequency analysis
 * - hermitdave/FrequencyWords Ukrainian corpus
 * - keybr.com Ukrainian phonetic model
 * - Academic papers on Ukrainian syllable structure
 */

// === ALPHABET ===
export const UKRAINIAN_ALPHABET = "абвгґдеєжзиіїйклмнопрстуфхцчшщьюя";

// === LETTER CLASSIFICATION ===
export const VOWELS = new Set(["а", "е", "є", "и", "і", "ї", "о", "у", "ю", "я"]);
export const CONSONANTS = new Set([
  "б", "в", "г", "ґ", "д", "ж", "з", "й", "к", "л",
  "м", "н", "п", "р", "с", "т", "ф", "х", "ц", "ч", "ш", "щ",
]);
export const SOFT_SIGN = "ь"; // Palatalizes preceding consonant
export const APOSTROPHE = "'"; // Separates consonant from iotated vowel

// Iotated vowels (begin with /j/ sound after apostrophe or word-initially)
export const IOTATED_VOWELS = new Set(["є", "ї", "ю", "я"]);

// Consonants that can be softened by ь
export const SOFTENABLE_CONSONANTS = new Set([
  "д", "з", "л", "н", "с", "т", "ц",
]);

// Consonants before which apostrophe is used (before iotated vowels)
export const APOSTROPHE_CONSONANTS = new Set([
  "б", "в", "г", "ґ", "д", "ж", "з", "к", "м", "н", "п", "р", "с", "т", "ф", "х", "ц", "ч", "ш", "щ",
]);

// === LETTER FREQUENCIES (from corpus analysis) ===
// Sorted by frequency, descending
export const LETTER_FREQUENCIES: Array<{ letter: string; percentage: number }> = [
  { letter: "о", percentage: 9.83 },
  { letter: "а", percentage: 8.28 },
  { letter: "н", percentage: 7.08 },
  { letter: "е", percentage: 7.06 },
  { letter: "т", percentage: 6.16 },
  { letter: "и", percentage: 5.74 },
  { letter: "і", percentage: 5.38 },
  { letter: "в", percentage: 4.90 },
  { letter: "м", percentage: 3.72 },
  { letter: "д", percentage: 3.67 },
  { letter: "с", percentage: 3.60 },
  { letter: "р", percentage: 3.58 },
  { letter: "у", percentage: 3.12 },
  { letter: "к", percentage: 3.09 },
  { letter: "л", percentage: 2.82 },
  { letter: "п", percentage: 2.56 },
  { letter: "з", percentage: 2.29 },
  { letter: "б", percentage: 2.01 },
  { letter: "я", percentage: 2.01 },
  { letter: "ь", percentage: 1.86 },
  { letter: "ч", percentage: 1.74 },
  { letter: "й", percentage: 1.55 },
  { letter: "ж", percentage: 1.28 },
  { letter: "г", percentage: 1.24 },
  { letter: "щ", percentage: 1.18 },
  { letter: "ш", percentage: 1.01 },
  { letter: "х", percentage: 0.87 },
  { letter: "ю", percentage: 0.77 },
  { letter: "ц", percentage: 0.62 },
  { letter: "є", percentage: 0.44 },
  { letter: "ї", percentage: 0.39 },
  { letter: "ф", percentage: 0.17 },
  { letter: "ґ", percentage: 0.01 },
];

// Progressive difficulty order for introducing letters
// (from most frequent / easiest to least frequent / rarest)
export const PROGRESSIVE_LETTER_ORDER = [
  // Tier 1: Most common letters (covers ~60% of text)
  "о", "а", "н", "е", "т", "и", "і", "в",
  // Tier 2: Common letters (covers ~80%)
  "м", "д", "с", "р", "у", "к", "л", "п",
  // Tier 3: Medium frequency
  "з", "б", "я", "ь", "ч", "й",
  // Tier 4: Less common
  "ж", "г", "щ", "ш", "х", "ю",
  // Tier 5: Rare letters
  "ц", "є", "ї", "ф", "ґ",
];

// === KEYBOARD LAYOUT (Ukrainian standard ЙЦУКЕН) ===
export const KEYBOARD_LAYOUT = {
  // Row positions (0-indexed from top)
  topRow:    ["й", "ц", "у", "к", "е", "н", "г", "ш", "щ", "з", "х", "ї"],
  homeRow:   ["ф", "і", "в", "а", "п", "р", "о", "л", "д", "ж", "є"],
  bottomRow: ["я", "ч", "с", "м", "и", "т", "ь", "б", "ю"],
  // Home row keys (most accessible for touch typing)
  homeKeys: new Set(["ф", "і", "в", "а", "п", "р", "о", "л", "д", "ж", "є"]),
  // Left hand home position: ф і в а (pinky to index)
  // Right hand home position: п р о л (index to pinky) + д ж є
};

// === SYLLABLE STRUCTURE RULES ===

/**
 * Ukrainian syllable structure: (C)(C)(C)(C)V(C)(C)(C)
 * - Onset: 0-4 consonants
 * - Nucleus: 1 vowel (obligatory)
 * - Coda: 0-3 consonants
 * - Ukrainian strongly favors OPEN syllables (ending in vowel)
 */

// Common word-initial consonant clusters (sorted by frequency)
export const INITIAL_CLUSTERS = [
  // Two-consonant clusters
  "пр", "зн", "вс", "св", "ст", "тр", "сл", "дл", "сп",
  "зр", "кр", "зв", "др", "зд", "дв", "дж", "хт", "см",
  "вж", "вр", "гр", "бр", "сд", "пл", "хл", "зм", "кт",
  "кл", "хв", "дн", "вз", "бл", "шк", "сн", "шв", "вн",
  "гл", "вл", "зб", "сх", "вм",
  // Three-consonant clusters
  "спр", "стр", "встр", "здр", "скр",
];

// Common single-consonant onsets (all consonants can start a syllable)
export const SINGLE_ONSETS = [
  "н", "т", "м", "д", "в", "б", "л", "п", "к", "р",
  "г", "ч", "щ", "з", "ж", "с", "ц", "х", "ш", "й", "ф",
];

// Common codas (word-final consonants/clusters)
export const COMMON_CODAS = [
  // Single consonants
  "й", "к", "м", "т", "н", "в", "с", "х", "ш", "з",
  "д", "л", "р", "б", "ж", "ч", "г", "п", "ц",
  // With soft sign
  "ть", "сь", "нь", "дь", "ль", "ць",
  // Two-consonant codas
  "ст", "зд", "рт", "нт", "кс", "рд", "кт",
  // With soft sign
  "сть", "рть",
];

// === PHONOTACTIC CONSTRAINTS ===
// Rules about which letter combinations are valid in Ukrainian

/**
 * Valid bigrams: which letters can follow which.
 * This is a simplified model - the full model is in the JSON data file.
 * These rules help generate pronounceable pseudo-words.
 */

// After a vowel, these consonants commonly follow
export const VOWEL_FOLLOWERS: Record<string, string[]> = {
  а: ["н", "т", "в", "л", "к", "р", "з", "д", "м", "с", "й", "ч", "б", "ж", "г", "ш", "ц", "х", "п", "ю", "є", "ї"],
  е: ["н", "р", "д", "б", "ш", "л", "в", "й", "м", "т", "с", "к", "з", "��", "п", "ц", "г", "х"],
  и: ["н", "т", "й", "в", "д", "м", "с", "к", "л", "х", "ч", "ш", "б", "р", "з", "ц", "ж", "щ", "г", "п"],
  і: ["л", "н", "т", "в", "д", "й", "р", "с", "б", "ш", "к", "м", "з", "п", "г", "ж", "ч", "щ", "х", "ц"],
  о: ["г", "н", "ж", "б", "м", "в", "д", "л", "р", "с", "т", "з", "к", "ч", "п", "й", "х", "ш", "ц", "щ"],
  у: ["д", "т", "ж", "в", "м", "к", "н", "б", "с", "р", "л", "з", "ч", "г", "п", "х", "ш", "ц", "й"],
  є: ["м", "т", "ш", "н", "д", "с"],
  ї: ["х", "м", "н", "й", "в", "з", "д"],
  ю: ["т", "ч", "д", "б", "в", "к"],
  я: ["к", "н", "т", "в", "л", "з", "ч", "д", "м", "с", "щ"],
};

// After these consonants, these vowels commonly follow
export const CONSONANT_VOWEL_PAIRS: Record<string, string[]> = {
  б: ["у", "о", "а", "і", "и", "е"],
  в: ["а", "о", "і", "и", "е", "у"],
  г: ["о", "а", "і", "у", "е"],
  ґ: ["а", "у", "е", "о"],
  д: ["о", "а", "е", "і", "и", "у"],
  ж: ["е", "и", "і", "а", "о", "у"],
  з: ["а", "е", "о", "і", "у", "и"],
  й: ["о", "у", "і"],
  к: ["о", "а", "и", "у", "і", "е"],
  л: ["а", "и", "і", "о", "е", "у", "ю"],
  м: ["о", "а", "е", "и", "і", "у"],
  н: ["а", "о", "е", "и", "і", "у", "я"],
  п: ["о", "е", "а", "і", "и", "у"],
  р: ["о", "а", "и", "е", "і", "у"],
  с: ["а", "о", "і", "е", "и", "у", "я"],
  т: ["о", "а", "и", "е", "і", "у"],
  ф: ["а", "о", "е", "і"],
  х: ["о", "а", "і", "у"],
  ц: ["е", "і", "ю"],
  ч: ["а", "и", "і", "е", "о", "у"],
  ш: ["а", "и", "е", "і", "о", "у"],
  щ: ["о", "е", "а", "і", "у"],
};

// Letters that CANNOT follow each other (forbidden bigrams)
export const FORBIDDEN_BIGRAMS = [
  // Consecutive ь (soft sign)
  "ьь",
  // ь cannot follow vowels
  "аь", "еь", "єь", "иь", "іь", "їь", "оь", "уь", "юь", "яь",
  // Certain consonant clusters that don't occur
  "гґ", "ґг", "щщ", "шщ", "жш", "цщ",
  // ї cannot follow consonants directly (needs apostrophe)
  // But in simplified typing practice we may allow it
];

// === DIGRAPHS (two-letter combinations representing single sounds) ===
export const DIGRAPHS = [
  { letters: "дж", sound: "affricate /dʒ/", example: "джерело" },
  { letters: "дз", sound: "affricate /dz/", example: "дзвін" },
];

// === USEFUL WORD PATTERNS FOR PRACTICE ===

// Short common words good for beginners (2-3 letters)
export const SHORT_WORDS = [
  "не", "що", "на", "це", "ти", "як", "за", "до", "ми", "ви",
  "ні", "та", "то", "ну", "де", "бо", "по", "ще", "чи", "він",
  "від", "які", "час", "без", "те", "все", "вже", "був", "хто",
  "раз", "два", "три", "сам", "над", "між", "під", "біля",
];

// Medium words (4-6 letters) - good for intermediate practice
export const MEDIUM_WORDS = [
  "мене", "його", "тобі", "вона", "коли", "щоб", "хочу", "може",
  "добре", "знаю", "дуже", "буде", "можу", "через", "після",
  "людей", "років", "місце", "будь", "день", "краще", "завжди",
  "тільки", "більше", "також", "просто", "потім", "знову",
  "тепер", "думаю", "треба", "якщо", "зараз", "слова", "далі",
];
