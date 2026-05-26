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

export interface BunkerTranslations {
  // BunkerGame.tsx — subtitles
  subtitleCatastrophe: string;
  subtitleDirector: string;
  roundOf: string;              // 'Раунд {{current}} из {{total}}'
  subtitleDiscussion: string;   // 'Обсуждение · Раунд {{n}}'
  subtitleVoting: string;
  subtitleTribunal: string;
  subtitleSurvival: string;
  subtitleResults: string;

  // BriefingPhase
  emergencyAlert: string;
  playersInGroup: string;
  bunkerSpots: string;
  wontEnter: string;            // 'Не попадут: {{n}}'
  willEnter: string;            // 'Войдут: {{n}}'
  distributeCards: string;

  // DictatorRevealPhase
  modeDictator: string;
  directorElected: string;
  directorDesc: string;
  tapToRevealDirector: string;
  guaranteedSpot: string;
  notInVoting: string;
  toRevealTraits: string;

  // RevealPhase
  roundOrdinals: {
    first: string;
    second: string;
    third: string;
    fourth: string;
    fifth: string;
  };
  playerOf: string;             // '{{current}} из {{total}}'
  passPhoneTo: string;          // 'Передайте телефон'
  tapToSeeTrait: string;
  onlyPlayerSees: string;       // 'Только {{player}} должен видеть экран'
  announceAloud: string;
  allAnnouncedBtn: string;
  announcedNextBtn: string;

  // DiscussionPhase
  discussionOf: string;         // 'ОБСУЖДЕНИЕ'
  discussionRoundNames: {
    r1: string;
    r2: string;
    r3: string;
    r4: string;
    r5: string;
  };
  revealedThisRound: string;
  revealedBefore: string;
  toVoting: string;
  nextRoundBtn: string;         // 'СЛЕДУЮЩИЙ РАУНД ({{next}}/{{total}})'

  // VotingPhase
  votingLabel: string;
  whoWontEnter: string;
  selectMore: string;           // 'Выберите ещё {{n}} для исключения'
  selectionDone: string;        // '✓ Выбрано {{n}} — подтвердите решение'
  directorProtected: string;
  eliminatedBadge: string;
  confirmVoteBtn: string;

  // TribunalPhase
  tribunalLabel: string;
  eliminatedCanAppeal: string;
  tribunalDesc: string;
  eliminatedPlayers: string;
  appealBtn: string;
  skipToSimBtn: string;
  appealLabel: string;
  revealingHiddenTrait: string; // '{{player}} раскрывает скрытую черту'
  wasHidden: string;            // '{{label}} — было скрыто'
  tribunalVoteLabel: string;
  includeInBunker: string;      // 'Включить {{player}} в бункер?'
  majorityDecides: string;
  pardonBtn: string;
  pardonDesc: string;
  excludeBtn: string;
  excludeDesc: string;
  playerPardonedBadge: string;  // '🕊️ {{player}} помилован'
  whoFreesSpot: string;
  chooseFromBunker: string;
  excludeSmall: string;
  playerPardonedTitle: string;  // '{{player}} ПОМИЛОВАН'
  playerExcludedTitle: string;  // '{{player}} ИСКЛЮЧЁН'
  spotFreedBy: string;          // 'Место освобождает {{player}}'
  toSurvivalBtn: string;

  // SurvivalPhase
  survivalLabel: string;
  teamInBunker: string;
  eventsInBunker: string;
  resourcesLabel: string;
  resources: {
    food: string;
    water: string;
    medicine: string;
    energy: string;
    morale: string;
  };
  seeResultsBtn: string;

  // ResultsPhase outcomes
  outcomes: {
    full_victory: { title: string; subtitle: string };
    partial: { title: string; subtitle: string };
    pyrrhic: { title: string; subtitle: string };
    defeat: { title: string; subtitle: string };
  };
  finalResources: string;
  survivorsLabel: string;
  outsidersLabel: string;
  newGameBtn: string;

  // Trait labels (from types.ts TRAIT_LABELS)
  traitLabels: {
    profession: string;
    health: string;
    hobby: string;
    phobia: string;
    trait: string;
    item: string;
    specialFact: string;
  };
}

/**
 * Корневой тип переводов.
 * При добавлении новой игры — добавь её namespace сюда (optional).
 */
export interface Translations {
  common: CommonTranslations;
  taboo?: TabooTranslations;
  bunker?: BunkerTranslations;
  // Игры добавляются инкрементально по мере запуска /i18n-game <gameKey>
  [gameKey: string]: Record<string, unknown> | CommonTranslations | TabooTranslations | BunkerTranslations | undefined;
}
