export enum TabooPhase {
  Pass    = 'pass',     // Передай телефон объясняющему
  Playing = 'playing',  // Таймер + слово + запрещённые слова
  Verdict = 'verdict',  // Кто угадал? Было ли запрещённое слово?
  GameOver = 'game_over',
}
