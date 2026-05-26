export type Lang = 'ru' | 'en';

/** Базовые переводы — common-строки, используемые везде */
export interface CommonTranslations {
  back: string;
  done: string;
  next: string;
  start: string;
  correct: string;
  skip: string;
  rematch: string;
  stopGame: string;
  round: string;
  roundN: string;       // "Раунд {{n}}"
  score: string;
  winner: string;
  draw: string;
  player: string;
  players: string;
  team: string;
  teams: string;
  passPhone: string;    // "Передай телефон"
  yourTurn: string;
  gameOver: string;
  win: string;
  wins: string;         // "{{n}} побед"
  vs: string;
  difficulty: {
    easy: string;
    medium: string;
    hard: string;
  };
}

export interface TabooTranslations {
  passInstruction: string;  // "Только ты должен видеть карточку с запрещёнными словами"
  explainerBadge: string;   // "Объяснять"
  forbiddenWords: string;   // "Запрещённые слова"
  wordToGuess: string;      // "Загаданное слово"
  wordGuessed: string;      // "СЛОВО УГАДАНО!"
  forbiddenHint: string;    // "Запрещённые слова произносить нельзя"
  timeOut: string;          // "Время вышло!"
  whoGuessed: string;       // "Кто угадал?"
  noOneGuessed: string;     // "Никто не угадал"
  saidForbidden: string;    // "{{player}} произнёс запрещённое слово"
  penaltyHint: string;      // "Штраф объяснявшему"
  playerWon: string;        // "{{player}} победил!"
  gameEnded: string;        // "Игра завершена"
  backToMenu: string;       // "В МЕНЮ"
}

/**
 * Корневой тип переводов.
 * При добавлении новой игры — добавь её namespace сюда (optional).
 */
export interface Translations {
  common: CommonTranslations;
  taboo?: TabooTranslations;
  // Игры добавляются инкрементально по мере запуска /i18n-game <gameKey>
  [gameKey: string]: Record<string, unknown> | CommonTranslations | TabooTranslations | undefined;
}
