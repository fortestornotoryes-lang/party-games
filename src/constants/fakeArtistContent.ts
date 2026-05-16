export interface FakeArtistCategory {
  category: string;
  word: string;
}

export type FakeArtistDifficulty = 'easy' | 'medium' | 'hard';

export const FAKE_ARTIST_DIFFICULTY_CONFIG = {
  easy: {
    label: 'Легко',
    emoji: '🌱',
    desc: 'Узнаваемые образы — понятно всем',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    text: 'text-emerald-400',
  },
  medium: {
    label: 'Средне',
    emoji: '🔥',
    desc: 'Сложнее нарисовать за одну линию',
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/30',
    text: 'text-orange-400',
  },
  hard: {
    label: 'Сложно',
    emoji: '💀',
    desc: 'Абстракции — самозванцу легче слиться',
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
    text: 'text-red-400',
  },
} as const;

export const FAKE_ARTIST_DATA_BY_DIFFICULTY: Record<FakeArtistDifficulty, FakeArtistCategory[]> = {
  easy: [
    { category: "Животные", word: "Жираф" },
    { category: "Животные", word: "Слон" }
    // ...
  ],
  medium: [
    { category: "Транспорт", word: "Вертолет" }
  ],
  hard: [
    { category: "Эмоции", word: "Радость" }
  ]
};

export const FAKE_ARTIST_INSTRUCTIONS = [
  { title: "Суть игры", content: "Все игроки знают Тему и Слово, кроме одного (Самозванца). Он знает только Тему." }
  // ...
];
