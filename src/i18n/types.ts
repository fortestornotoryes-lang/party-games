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
    roundN: string; // "Раунд {{n}}"
    score: string;
    winner: string;
    draw: string;
    player: string;
    players: string;
    team: string;
    teams: string;
    passPhone: string; // "Передай телефон"
    yourTurn: string;
    gameOver: string;
    win: string;
    wins: string; // "{{n}} побед"
    vs: string;
    difficulty: {
        easy: string;
        medium: string;
        hard: string;
    };
}

export interface TabooTranslations {
    passInstruction: string; // "Только ты должен видеть карточку с запрещёнными словами"
    explainerBadge: string; // "Объяснять"
    forbiddenWords: string; // "Запрещённые слова"
    wordToGuess: string; // "Загаданное слово"
    wordGuessed: string; // "СЛОВО УГАДАНО!"
    forbiddenHint: string; // "Запрещённые слова произносить нельзя"
    timeOut: string; // "Время вышло!"
    whoGuessed: string; // "Кто угадал?"
    noOneGuessed: string; // "Никто не угадал"
    saidForbidden: string; // "{{player}} произнёс запрещённое слово"
    penaltyHint: string; // "Штраф объяснявшему"
    playerWon: string; // "{{player}} победил!"
    gameEnded: string; // "Игра завершена"
    backToMenu: string; // "В МЕНЮ"
}

export interface BunkerTranslations {
    // BunkerGame.tsx — subtitles
    subtitleCatastrophe: string;
    subtitleDirector: string;
    roundOf: string; // 'Раунд {{current}} из {{total}}'
    subtitleDiscussion: string; // 'Обсуждение · Раунд {{n}}'
    subtitleVoting: string;
    subtitleTribunal: string;
    subtitleSurvival: string;
    subtitleResults: string;

    // BriefingPhase
    emergencyAlert: string;
    playersInGroup: string;
    bunkerSpots: string;
    wontEnter: string; // 'Не попадут: {{n}}'
    willEnter: string; // 'Войдут: {{n}}'
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
    playerOf: string; // '{{current}} из {{total}}'
    passPhoneTo: string; // 'Передайте телефон'
    tapToSeeTrait: string;
    onlyPlayerSees: string; // 'Только {{player}} должен видеть экран'
    announceAloud: string;
    allAnnouncedBtn: string;
    announcedNextBtn: string;

    // DiscussionPhase
    discussionOf: string; // 'ОБСУЖДЕНИЕ'
    discussionRoundNames: {
        r1: string;
        r2: string;
        r3: string;
        r4: string;
        r5: string;
        r6: string;
        r7: string;
    };
    revealedThisRound: string;
    revealedBefore: string;
    toVoting: string;
    nextRoundBtn: string; // 'СЛЕДУЮЩИЙ РАУНД ({{next}}/{{total}})'

    // VotingPhase
    votingLabel: string;
    whoWontEnter: string;
    selectMore: string; // 'Выберите ещё {{n}} для исключения'
    selectionDone: string; // '✓ Выбрано {{n}} — подтвердите решение'
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
    wasHidden: string; // '{{label}} — было скрыто'
    tribunalVoteLabel: string;
    includeInBunker: string; // 'Включить {{player}} в бункер?'
    majorityDecides: string;
    pardonBtn: string;
    pardonDesc: string;
    excludeBtn: string;
    excludeDesc: string;
    playerPardonedBadge: string; // '🕊️ {{player}} помилован'
    whoFreesSpot: string;
    chooseFromBunker: string;
    excludeSmall: string;
    playerPardonedTitle: string; // '{{player}} ПОМИЛОВАН'
    playerExcludedTitle: string; // '{{player}} ИСКЛЮЧЁН'
    spotFreedBy: string; // 'Место освобождает {{player}}'
    toSurvivalBtn: string;
    nextAppellantBtn: string;

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

export interface CodenamesTranslations {
    subtitle: string;
    minPlayers: string;
    redTeam: string;
    blueTeam: string;
    captain: string;
    othersNoSee: string;
    captainTurn: string; // "Ваш ход: {{name}}"
    neutralEndTurn: string;
    assassinDeath: string;
    makeClueHint: string;
    oneWord: string;
    confirm: string;
    teamRed: string; // genitive: "Красных"
    teamBlue: string; // genitive: "Синих"
    clueLabel: string;
    guessesLeft: string; // "Осталось попыток: {{n}}"
    turnEnded: string;
    neutralRevealed: string;
    enemyAgent: string;
    turnPassing: string;
    passTurn: string;
    redWins: string;
    blueWins: string;
    play: string;
}

export interface MillionaireTranslations {
    gameTitle: string;          // "МИЛЛИОНЕР"
    subtitle: string;           // "Кто хочет стать миллионером"
    tapToStart: string;         // "Нажми, чтобы начать"
    tierEasy: string;           // "Лёгкий"
    tierMedium: string;         // "Средний"
    tierHard: string;           // "Сложный"
    checkpoint: string;         // "Рубеж"
    audienceHelp: string;       // "Помощь зала"
    phoneFriend: string;        // "Звонок другу"
    phoneFriendMessage: string; // "«Я думаю, правильный ответ — {{letter}}...»"
    lifelineFriend: string;     // "Другу"
    lifelineAudience: string;   // "Залу"
    correctBadge: string;       // "Правильно!"
    questionSum: string;        // "Вопрос {{n}} — Сумма"
    inPocket: string;           // "бабосиков в кармане"
    goForPrize: string;         // "Вперёд за {{prize}}"
    takeMoney: string;          // "Забрать {{prize}}"
    millionaireLabel: string;   // "МИЛЛИОНЕР!"
    wonLabel: string;           // "Выиграл"
    congratulations: string;    // "ПОЗДРАВЛЯЕМ!"
    nextPlayer: string;         // "Следующий игрок"
    wrong: string;              // "Неверно!"
    questionOf15: string;       // "Вопрос {{n}} из 15"
    correctAnswer: string;      // "Правильный ответ"
    guaranteedAmount: string;   // "Гарантированная сумма"
    nothingEarned: string;      // "Ничего не заработано"
}

export interface DecryptoTranslations {
    subtitle: string;             // "Коды и перехваты"
    teamRed: string;              // "Красных"
    teamBlue: string;             // "Синих"
    teamsTitle: string;           // "Команды"
    teamsSubtitle: string;        // "Распределитесь для игры"
    teamLabelFull: string;        // "Команда {{name}}"
    teamToDative: string;         // "Команде {{name}}"
    startRound1: string;          // "НАЧАТЬ РАУНД 1"
    othersNoSee: string;          // "Остальные не должны видеть экран!"
    showCode: string;             // "ПОКАЗАТЬ КОД"
    roundCaptain: string;         // "Раунд {{n}} · Шифровальщик"
    passToEnemy: string;          // "Передайте телефон команде соперника"
    interceptBtn: string;         // "ПЕРЕХВАТИТЬ"
    passToTeam: string;           // "Передайте телефон своей команде"
    decodeCodeBtn: string;        // "РАЗГАДАТЬ КОД"
    roundResults: string;         // "ИТОГИ РАУНДА"
    interceptionLabel: string;    // "Перехват {{name}}"
    intercepted: string;          // "ПЕРЕХВАТ"
    missed: string;               // "МИМО"
    success: string;              // "УСПЕХ"
    wrong: string;                // "ОШИБКА"
    nextBtn: string;              // "ДАЛЬШЕ"
    victory: string;              // "ПОБЕДА {{name}}!"
    interceptCount: string;       // "✗ {{n}} перехватов"
    failCount: string;            // "✗ {{n}} ошибок"
    newGame: string;              // "НОВАЯ ИГРА"
    encryptor: string;            // "Шифровальщик"
    writeAssociations: string;    // "Напишите ассоциации к словам кода"
    associationFor: string;       // "Ассоциация на \"{{word}}\""
    encrypt: string;              // "ЗАШИФРОВАТЬ"
    interceptTime: string;        // "Время перехвата · Команда {{name}}"
    enemyCurrentClues: string;    // "Текущие подсказки врага"
    enemyHistory: string;         // "История раундов врага"
    codeLabel: string;            // "Код {{code}}"
    enterInterceptedCode: string; // "Введите перехваченный код"
    confirmIntercept: string;     // "ПОДТВЕРДИТЬ ПЕРЕХВАТ"
    captainClues: string;         // "Подсказки капитана"
    enterYourCode: string;        // "Введите ваш код"
    decode: string;               // "РАЗГАДАТЬ"
    scoreCompact: string;         // "✗{{inter}} · {{fail}}ош"
}

export interface AliasTranslations {
    subtitle: string;        // "Объясни быстрее"
    teamRed: string;         // "Красные"
    teamBlue: string;        // "Синие"
    yourTurn: string;        // "Твой черёд!"
    startRound: string;      // "НАЧАТЬ РАУНД"
    explainWord: string;     // "Объясни слово"
    scoreLabel: string;      // "Очки"
    guessed: string;         // "Угадано"
    timeUp: string;          // "Время вышло"
    pointsPerRound: string;  // "Очков за раунд"
    continueBtn: string;     // "ПРОДОЛЖИТЬ"
    victory: string;         // "ПОБЕДА!"
    winningTeam: string;     // "Команда {{name}}"
    mainMenu: string;        // "В ГЛАВНОЕ МЕНЮ"
}

export interface SpyHuntTranslations {
    // SpyHuntGame.tsx subtitles
    subtitleDistributing: string; // 'Раздача ролей'
    subtitlePlaying: string;      // 'Идет поиск...'
    subtitleReveal: string;       // 'Результаты'

    // RoleDistribution.tsx — shared
    secretRole: string;           // 'Секретная роль'
    startGame: string;            // 'НАЧАТЬ ИГРУ'
    gotIt: string;                // 'ЛАДУШКИ'

    // Spy card
    spy: string;                  // 'ШПИОН'
    locationUnknown: string;      // 'Локация неизвестна.'
    dontRevealFindLocation: string; // 'Не выдай себя — узнай место.'
    hintLabel: string;            // 'Подсказка'
    lettersInName: string;        // 'Букв в названии: {{n}}'

    // Traitor card
    traitor: string;              // 'ПРЕДАТЕЛЬ'
    yourLocation: string;         // 'Твоя локация'
    helpSpyConfuseOthers: string; // 'Помогай шпиону, запутывай остальных'

    // Agent card
    agentLabel: string;           // 'Агент'
    secretLocation: string;       // 'Секретная локация'
    yourRole: string;             // 'Твоя роль'
    findSpy: string;              // 'Вычисли шпиона, не раскрывая локацию'

    // PlayingPhase.tsx
    questionIdeas: string;        // 'Идеи для вопросов'
    possibleLocations: string;    // 'Возможные локации'
    agentsSuspected: string;      // 'Агенты под подозрением'
    reveal: string;               // 'РАЗОБЛАЧИТЬ'

    // RevealPhase.tsx
    spyRevealed: string;          // 'Шпион раскрыт'
    agent00: string;              // 'Агент 00'
    backToMenu: string;           // 'ВЕРНУТЬСЯ В МЕНЮ'
}

/**
 * Корневой тип переводов.
 * При добавлении новой игры — добавь её namespace сюда (optional).
 */
export interface Translations {
    common: CommonTranslations;
    taboo?: TabooTranslations;
    bunker?: BunkerTranslations;
    codenames?: CodenamesTranslations;
    millionaire?: MillionaireTranslations;
    decrypto?: DecryptoTranslations;
    alias?: AliasTranslations;
    spy_hunt?: SpyHuntTranslations;

    // Игры добавляются инкрементально по мере запуска /i18n-game <gameKey>
    [gameKey: string]:
        | Record<string, unknown>
        | CommonTranslations
        | TabooTranslations
        | BunkerTranslations
        | CodenamesTranslations
        | MillionaireTranslations
        | DecryptoTranslations
        | AliasTranslations
        | SpyHuntTranslations
        | undefined;
}
