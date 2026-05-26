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

/**
 * Корневой тип переводов.
 * При добавлении новой игры — добавь её namespace сюда (optional).
 */
export interface Translations {
  common: CommonTranslations;
  // Игры добавляются инкрементально по мере запуска /i18n-game <gameKey>
  [gameKey: string]: Record<string, unknown> | CommonTranslations;
}
