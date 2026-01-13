export interface Verse {
  id: number;
  text: string;
  source: string;
  chapter: string;
  verseNumber: string;
  isPremium: boolean;
}

export const verses: Verse[] = [
  {
    id: 1,
    text: "Hatreds never cease through hatred in this world; through love alone they cease. This is an eternal law.",
    source: "Dhammapada",
    chapter: "Chapter 1 (Yamaka Vagga)",
    verseNumber: "Verse 5",
    isPremium: false,
  },
  {
    id: 2,
    text: "All conditioned things are impermanent — when one sees this with wisdom, one turns away from suffering.",
    source: "Dhammapada",
    chapter: "Chapter 20 (Magga Vagga)",
    verseNumber: "Verse 277",
    isPremium: false,
  },
  {
    id: 3,
    text: "Wisdom springs from meditation; without meditation wisdom wanes.",
    source: "Dhammapada",
    chapter: "Chapter 20 (Magga Vagga)",
    verseNumber: "Verse 282",
    isPremium: false,
  },
  {
    id: 4,
    text: "The mind is everything. What you think, you become.",
    source: "Dhammapada",
    chapter: "Chapter 1 (Yamaka Vagga)",
    verseNumber: "Verse 1-2",
    isPremium: false,
  },
  {
    id: 5,
    text: "Better than a thousand hollow words is one word that brings peace.",
    source: "Dhammapada",
    chapter: "Chapter 8 (Sahassa Vagga)",
    verseNumber: "Verse 100",
    isPremium: false,
  },
  {
    id: 6,
    text: "Let go of the past. Let go of the future. Let go of the present. Crossing beyond, with a mind released, do not again undergo birth and decay.",
    source: "Dhammapada",
    chapter: "Chapter 24 (Tanha Vagga)",
    verseNumber: "Verse 348",
    isPremium: false,
  },
  {
    id: 7,
    text: "Peace comes from within. Do not seek it without.",
    source: "Dhammapada",
    chapter: "Traditional Teaching",
    verseNumber: "Paraphrased",
    isPremium: false,
  },
  {
    id: 8,
    text: "Wander alone like a rhinoceros horn.",
    source: "Khaggavisana Sutta",
    chapter: "Rhinoceros Sutra",
    verseNumber: "",
    isPremium: false,
  },
  {
    id: 9,
    text: "You yourself must strive. The Buddhas only point the way.",
    source: "Dhammapada",
    chapter: "Chapter 20 (Magga Vagga)",
    verseNumber: "Verse 276",
    isPremium: true,
  },
  {
    id: 10,
    text: "There is no fire like passion, no shark like hatred, no snare like folly, no torrent like greed.",
    source: "Dhammapada",
    chapter: "Chapter 18 (Mala Vagga)",
    verseNumber: "Verse 251",
    isPremium: true,
  },
  {
    id: 11,
    text: "Just as a solid rock is not shaken by the storm, even so the wise are not affected by praise or blame.",
    source: "Dhammapada",
    chapter: "Chapter 6 (Pandita Vagga)",
    verseNumber: "Verse 81",
    isPremium: true,
  },
  {
    id: 12,
    text: "Irrigators channel waters; fletchers straighten arrows; carpenters bend wood; the wise master themselves.",
    source: "Dhammapada",
    chapter: "Chapter 6 (Pandita Vagga)",
    verseNumber: "Verse 80",
    isPremium: true,
  },
  {
    id: 13,
    text: "Those who are free of resentful thoughts surely find peace.",
    source: "Dhammapada",
    chapter: "Chapter 1 (Yamaka Vagga)",
    verseNumber: "Verse 6",
    isPremium: true,
  },
  {
    id: 14,
    text: "Health is the greatest gift, contentment the greatest wealth, faithfulness the best relationship.",
    source: "Dhammapada",
    chapter: "Chapter 15 (Sukha Vagga)",
    verseNumber: "Verse 204",
    isPremium: true,
  },
  {
    id: 15,
    text: "An idea that is developed and put into action is more important than an idea that exists only as an idea.",
    source: "Buddha",
    chapter: "Traditional Teaching",
    verseNumber: "",
    isPremium: true,
  },
  {
    id: 16,
    text: "Do not dwell in the past, do not dream of the future, concentrate the mind on the present moment.",
    source: "Buddha",
    chapter: "Traditional Teaching",
    verseNumber: "",
    isPremium: true,
  },
];

export const stayPresentMessages = [
  "Are you present right now?",
  "Notice this moment.",
  "Where is your mind?",
  "Breathe. You are here.",
  "This too shall pass.",
  "Return to your breath.",
  "Feel your feet on the ground.",
  "What do you hear right now?",
  "Let thoughts pass like clouds.",
  "This moment is enough.",
];

export const getFreeVerses = (): Verse[] => verses.filter(v => !v.isPremium);
export const getAllVerses = (): Verse[] => verses;

export const getDailyVerse = (isPremium: boolean = false): Verse => {
  const availableVerses = isPremium ? verses : getFreeVerses();
  const today = new Date();
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24)
  );
  return availableVerses[dayOfYear % availableVerses.length];
};

export const getRandomStayPresentMessage = (): string => {
  return stayPresentMessages[Math.floor(Math.random() * stayPresentMessages.length)];
};
