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
    subtitleFullReveal: string;

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
    fullRevealLabel: string;
    fullRevealDesc: string;
    hiddenBadge: string;

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

export interface FakeArtistTranslations {
    // Distribution
    secretRole: string;           // 'Секретная роль'
    imposter: string;             // 'САМОЗВАНЕЦ'
    categoryLabel: string;        // 'Тема'
    imposterHint: string;         // 'Слово неизвестно — рисуй, чтобы не выдать себя'
    startGame: string;            // 'НАЧАТЬ ИГРУ'
    gotIt: string;                // 'ПОНЯТНО'
    artistRole: string;           // 'Художник'
    yourWord: string;             // 'Твоё слово'
    artistHint: string;           // 'Рисуй, не раскрывая слово напрямую'
    // Playing phase
    turnSubtitle: string;         // 'Ход {{current}} / {{total}}'
    drawingLabel: string;         // 'Рисует'
    timerSeconds: string;         // '{{n}}с'
    drawOneLine: string;          // 'Нарисуй одну линию'
    confirm: string;              // 'ПОДТВЕРДИТЬ'
    nextPlayer: string;           // 'Следующий игрок'
    passPhoneInstruction: string; // 'Передайте телефон этому игроку и нажмите кнопку ниже'
    readyToDraw: string;          // 'Я ГОТОВ РИСОВАТЬ'
    // Voting
    voteSimultaneously: string;   // 'Голосуйте одновременно'
    revealImpostor: string;       // 'Раскрыть самозванца'
    mainMenu: string;             // 'В ГЛАВНОЕ МЕНЮ'
}

export interface ResistanceTranslations {
    // ResistanceGame.tsx
    missionN: string;             // 'Миссия {{n}}'
    resistanceLabel: string;      // 'ГРУППА'
    spiesLabel: string;           // 'ШПИОНЫ'
    missionLeader: string;        // 'Лидер миссии'
    selectTeam: string;           // 'Выбери {{n}} чел. для операции'
    startMission: string;         // 'НАЧАТЬ МИССИЮ'
    votingBadge: string;          // 'Голосует'
    tapToVote: string;            // 'Нажми чтобы проголосовать'
    success: string;              // 'УСПЕХ'
    fail: string;                 // 'ПРОВАЛ'
    missionTitle: string;         // 'ОПЕРАЦИЯ'
    missionFailed: string;        // 'ПРОВАЛЕНА'
    missionSucceeded: string;     // 'УДАЧНА'
    finalScore: string;           // 'ФИНАЛЬНЫЙ СЧЕТ'
    won: string;                  // 'ПОБЕДИЛИ'
    spyAgents: string;            // 'Агенты шпионажа'
    restart: string;              // 'ЗАНОВО'
    // ResistanceDistribution.tsx
    secretRole: string;           // 'Секретная роль'
    roleLabel: string;            // 'Роль'
    spyRole: string;              // 'ШПИОН'
    resistanceRole: string;       // 'СОПРОТИВЛЕНИЕ' (с мягким переносом ­)
    allies: string;               // 'Союзники'
    youAlone: string;             // 'Ты один'
    spyHint: string;              // 'Срывай миссии, не раскрывая себя'
    resistanceHint: string;       // 'Выполняй миссии — вычисли шпионов'
    startGame: string;            // 'НАЧАТЬ ИГРУ'
    gotIt: string;                // 'ЛАДУШКИ'
}

export interface TruthOrDareTranslations {
    // TruthOrDareGame.tsx, PassPhase.tsx
    subtitle: string;        // 'Правда или Действие'
    tapToContinue: string;   // 'Нажми чтобы продолжить'
    // ChoicePhase.tsx
    choosing: string;        // 'Выбирает'
    truthTitle: string;      // 'ПРАВДА'
    truthHint: string;       // 'Ответь честно'
    dareTitle: string;       // 'ДЕЙСТВИЕ'
    dareHint: string;        // 'Выполни задание'
    // ActionPhase.tsx
    truthBadge: string;      // 'Правда'
    dareBadge: string;       // 'Действие'
    completed: string;       // 'ВЫПОЛНЕНО'
}

export interface CorridorTranslations {
    // CorridorGame.tsx
    title: string;           // 'КОРИДОР'
    subtitle: string;        // 'Первым пройди на другую сторону'
    player1: string;         // 'Игрок 1'
    player2: string;         // 'Игрок 2'
    // PlayerStatusBar.tsx
    wallsLeft: string;       // 'Стен: {{n}}'
    turn: string;            // 'ХОД'
    // ActionControls.tsx
    moveLabel: string;       // 'Ход'
    moveHint: string;        // 'передвинь фишку'
    wallHLabel: string;      // 'Стена ─'
    wallHHint: string;       // 'горизонт.'
    wallVLabel: string;      // 'Стена │'
    wallVHint: string;       // 'вертикал.'
    // GameOverOverlay.tsx
    victory: string;         // 'Победа!'
    reachedFinish: string;   // 'достиг финиша'
    playAgain: string;       // 'Играть снова'
    toMenu: string;          // 'В меню'
}

export interface TabooReverseTranslations {
    // PassPhase.tsx
    passInstruction: string;         // 'Только ты должен видеть загаданное слово'
    // PlayingPhase.tsx
    secretWord: string;              // 'Загаданное слово'
    requiredWords: string;           // 'Обязательные слова — используй все!'
    guessed: string;                 // 'УГАДАНО!'
    wordGuessed: string;             // 'СЛОВО УГАДАНО!'
    skipPenaltyHint: string;         // 'Пропуск даёт −1 объясняющему'
    noWordAllowed: string;           // 'Само слово называть нельзя'
    // VerdictPhase.tsx
    timeUp: string;                  // 'Время вышло!'
    markUsedWords: string;           // 'Отметьте использованные слова'
    usedCount: string;               // 'Использовано: {{n}}/{{total}}'
    whoGuessed: string;              // 'Кто угадал?'
    allWordsUsed: string;            // 'Все слова использованы'
    wordsUsedOf: string;             // 'Слов использовано: {{n}}/{{total}}'
    nobodyGuessed: string;           // 'Никто не угадал'
    explainerSaidWord: string;       // '{{player}} назвал слово'
    penaltyForExplainer: string;     // 'Штраф объяснявшему'
    // BlitzVerdictPhase.tsx
    turnResult: string;              // 'Итог хода'
    guessedCount: string;            // '✓ {{n}} угадано'
    skippedCount: string;            // '✗ {{n}} пропущено'
    noCards: string;                 // 'Ни одной карточки'
    timeUpBeforeFirst: string;       // 'Время вышло до первого угадывания'
    skipPenaltyFor: string;          // 'Пропуск — −1 для {{player}}'
    nobody: string;                  // 'Никто'
    confirm: string;                 // 'ПОДТВЕРДИТЬ'
    // GameOverPhase.tsx
    teamWon: string;                 // 'Команда {{n}} победила!'
    teamN: string;                   // 'Команда {{n}}'
    playerWon: string;               // '{{player}} победил!'
}

export interface ConnectFourTranslations {
    // ConnectFourGame.tsx
    title: string;           // 'ЧЕТЫРЕ В РЯД'
    player1: string;         // 'Игрок 1'
    player2: string;         // 'Игрок 2'
    winnerLine: string;      // 'Победил {{player}}!'
    drawResult: string;      // 'Ничья!'
    currentTurn: string;     // 'Ход: {{player}}'
    newGame: string;         // 'НОВАЯ ИГРА'
    // PopOutToggle.tsx
    place: string;           // 'ПОСТАВИТЬ'
    popOut: string;          // 'ВЫТАЩИТЬ'
    // GameOverBanner.tsx
    roundResult: string;     // 'Итог раунда'
}

export interface MafiaTranslations {
    // MafiaGame.tsx
    cityFallsAsleep: string;   // 'Город засыпает...'
    inDevelopment: string;     // 'Этот режим игры находится в разработке...'
    goBack: string;            // 'Вернуться'
}

export interface WavelengthTranslations {
    // WavelengthGame.tsx
    subtitle: string;              // 'На одной волне'
    // PassPhase.tsx
    newRound: string;              // 'Новый раунд'
    psychicLabel: string;          // 'Телепат'
    psychicInstruction: string;    // '{{psychic}}, возьми телефон! Только ты должен видеть секретную цель. Убедись, что остальные не смотрят.'
    iAmReady: string;              // 'Я ГОТОВ'
    // CluePhase.tsx
    currentPsychic: string;        // 'Текущий Телепат'
    onlyYouSeeTarget: string;      // 'Только ты видишь целевую зону на шкале!'
    giveClueHint: string;          // 'Придумай подсказку, чтобы попали в зону'
    iGaveClue: string;             // 'Я ДАЛ ПОДСКАЗКУ'
    // GuessingPhase.tsx
    adjustWave: string;            // 'НАСТРОЙТЕ ВОЛНУ'
    valueLabel: string;            // 'Значение'
    confirmChoice: string;         // 'ПОДТВЕРДИТЬ ВЫБОР'
    // RevealPhase.tsx
    result: string;                // 'РЕЗУЛЬТАТ'
    targetLabel: string;           // 'Цель'
    answerLabel: string;           // 'Ответ'
    yourScore: string;             // 'Твои очки'
    perfect: string;               // 'ИДЕАЛЬНО!'
    nextRound: string;             // 'СЛЕДУЮЩИЙ РАУНД'
}

export interface JustOneTranslations {
    // JustOneGame.tsx
    subtitle: string;              // 'Пойми намёк'
    // PassPhase.tsx
    newRound: string;              // 'Новый раунд'
    guessing: string;              // 'Отгадывает'
    passInstruction: string;       // '{{guesser}}, передай телефон остальным. Только они увидят загаданное слово!'
    weTookPhone: string;           // 'МЫ ВЗЯЛИ ТЕЛЕФОН'
    // HintingPhase.tsx + ResultPhase.tsx
    secretWord: string;            // 'Загаданное слово'
    // HintingPhase.tsx
    hintsLabel: string;            // 'Подсказки'
    hintPlaceholder: string;       // 'Подсказка...'
    readyShowGuesser: string;      // 'ГОТОВО! ПОКАЗАТЬ {{guesser}}'
    // GuessingPhase.tsx
    guessInstruction: string;      // 'Угадай слово по подсказкам команды'
    allHintsClashed: string;       // 'Все подсказки совпали — ни одной не осталось!'
    guessPlaceholder: string;      // 'Твоя догадка...'
    submitAnswer: string;          // 'ОТВЕТИТЬ'
    // ResultPhase.tsx
    correctDisplay: string;        // 'ПРАВИЛЬНО!'
    wrongDisplay: string;          // 'ОШИБКА'
    answerLabel: string;           // 'Ответ:'
    nextRound: string;             // 'СЛЕДУЮЩИЙ РАУНД'
}

export interface TelestrationsTranslations {
    // TelestrationsGame.tsx — subtitle
    playerCount: string;             // 'Игроков: {{n}}'
    draws: string;                   // 'Рисует'
    guesses: string;                 // 'Угадывает'
    // TelestrationsGame.tsx — Transition phase PassPhoneCard
    tapToSeeWord: string;            // 'Нажми чтобы увидеть слово'
    tapToSeeDrawing: string;         // 'Нажми чтобы увидеть рисунок'
    // TelestrationsSetup.tsx
    settingsTitle: string;           // 'Настройки'
    difficultyLabel: string;         // 'Сложность'
    difficultyLabels: {
        easy: string;                // 'Легко'
        medium: string;              // 'Средне'
        hard: string;                // 'Сложно'
    };
    difficultyDescriptions: {
        easy: string;                // 'Просто'
        medium: string;              // 'Смешно'
        hard: string;                // 'Трудно'
    };
    timerSeconds: string;            // '{{n}}с'
    drawingTimerLabel: string;       // 'рисунок'
    // TelestrationsStart.tsx
    firstDraws: string;              // 'Первый рисует'
    rememberAndDraw: string;         // 'Запомни слово и нарисуй его так, чтобы другие поняли'
    gameOrder: string;               // 'Порядок этой игры'
    makeSureNoOneWatches: string;    // 'Убедись, что остальные не смотрят'
    showWord: string;                // 'Показать слово'
    yourSecretWord: string;          // 'Твоё секретное слово'
    readyToDraw: string;             // 'Я готов рисовать'
    // TelestrationsGuess.tsx
    guessDrawing: string;            // '💬 Угадай рисунок'
    whatIsDepicted: string;          // 'Что здесь изображено?'
    writePlaceholder: string;        // 'Напиши ответ...'
    // TelestrationsGallery.tsx
    chainEnd: string;                // 'Финал цепочки'
    seeHowWordChanged: string;       // 'Смотрите, как менялось слово'
    originalWord: string;            // 'Исходное слово'
    newGame: string;                 // 'Новая игра'
    toMenu: string;                  // 'В меню'
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
    fake_artist?: FakeArtistTranslations;
    resistance?: ResistanceTranslations;
    telestrations?: TelestrationsTranslations;
    truth_or_dare?: TruthOrDareTranslations;
    just_one?: JustOneTranslations;
    wavelength?: WavelengthTranslations;
    mafia?: MafiaTranslations;
    connect_four?: ConnectFourTranslations;
    taboo_reverse?: TabooReverseTranslations;
    corridor?: CorridorTranslations;

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
        | ResistanceTranslations
        | TelestrationsTranslations
        | TruthOrDareTranslations
        | JustOneTranslations
        | WavelengthTranslations
        | MafiaTranslations
        | ConnectFourTranslations
        | TabooReverseTranslations
        | CorridorTranslations
        | undefined;
}
