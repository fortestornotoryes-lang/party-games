export enum TabooReversePhase {
    Pass = 'pass', // Передай телефон объясняющему
    Playing = 'playing', // Таймер + слово + обязательные слова
    Verdict = 'verdict', // Оценить раунд (классика / команды)
    BlitzVerdict = 'blitz_verdict', // Итог хода в режиме Блиц
    GameOver = 'game_over',
}

export interface BlitzResult {
    card: {
        id: number;
        word: string;
        required: string[];
        difficulty: string;
    };
    status: 'guessed' | 'skipped';
}
