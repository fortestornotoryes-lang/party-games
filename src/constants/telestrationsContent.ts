export type Difficulty = 'easy' | 'medium' | 'hard';

export const TELESTRATIONS_INSTRUCTIONS = [
  {
    title: "Суть игры",
    content: "Рисуй и угадывай по цепочке — как в испорченном телефоне."
  }
];

export const STARTING_WORDS = [
  "Кот на дискотеке",
  "Слон в холодильнике",
  "Пицца-скейтборд"
];

export const WORDS_BY_DIFFICULTY = {
    easy: ["Кот", "Дом"],
    medium: ["Кот на дискотеке"],
    hard: ["Сингулярность"]
};

export const DIFFICULTY_CONFIG = {
    easy: { label: "Легко", emoji: "🌱", desc: "Просто", drawTime: 90, guessTime: 45, text: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/30" },
    medium: { label: "Средне", emoji: "🔥", desc: "Смешно", drawTime: 60, guessTime: 30, text: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/30" },
    hard: { label: "Сложно", emoji: "💀", desc: "Трудно", drawTime: 45, guessTime: 25, text: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/30" }
};
