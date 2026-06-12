import type { Difficulty } from '@/shared/types';

export interface TabooClassicCard {
  id: number;
  word: string;
  forbidden: string[];
  difficulty: Difficulty;
}

// ─── Easy ──────────────────────────────────────────────────────────────────────
// Простые слова, 4 запрещённых — самые очевидные синонимы и связанные слова
const EASY: TabooClassicCard[] = [
  { id: 1, difficulty: 'easy', word: 'КОШКА', forbidden: ['кот', 'животное', 'мяу', 'пушистый'] },
  { id: 2, difficulty: 'easy', word: 'СОБАКА', forbidden: ['пёс', 'животное', 'лаять', 'хвост'] },
  { id: 3, difficulty: 'easy', word: 'ЯБЛОКО', forbidden: ['фрукт', 'красный', 'дерево', 'сок'] },
  {
    id: 4,
    difficulty: 'easy',
    word: 'МАШИНА',
    forbidden: ['автомобиль', 'руль', 'ехать', 'колесо'],
  },
  { id: 5, difficulty: 'easy', word: 'СОЛНЦЕ', forbidden: ['светить', 'жаркий', 'небо', 'звезда'] },
  { id: 6, difficulty: 'easy', word: 'ДЕРЕВО', forbidden: ['ветка', 'листья', 'расти', 'лес'] },
  { id: 7, difficulty: 'easy', word: 'МЯЧ', forbidden: ['круглый', 'бросать', 'играть', 'футбол'] },
  { id: 8, difficulty: 'easy', word: 'РЫБА', forbidden: ['море', 'плавать', 'чешуя', 'ловить'] },
  { id: 9, difficulty: 'easy', word: 'ХЛЕБ', forbidden: ['мука', 'печь', 'есть', 'буханка'] },
  { id: 10, difficulty: 'easy', word: 'ВОДА', forbidden: ['пить', 'жидкость', 'мокрый', 'море'] },
  { id: 11, difficulty: 'easy', word: 'ТОРТ', forbidden: ['сладкий', 'праздник', 'свеча', 'крем'] },
  {
    id: 12,
    difficulty: 'easy',
    word: 'ТЕЛЕВИЗОР',
    forbidden: ['смотреть', 'экран', 'канал', 'пульт'],
  },
  { id: 13, difficulty: 'easy', word: 'ЗОНТ', forbidden: ['дождь', 'раскрыть', 'мокрый', 'ручка'] },
  {
    id: 14,
    difficulty: 'easy',
    word: 'ВЕЛОСИПЕД',
    forbidden: ['ехать', 'педаль', 'руль', 'колесо'],
  },
  { id: 15, difficulty: 'easy', word: 'КОФЕ', forbidden: ['горячий', 'чашка', 'напиток', 'утро'] },
  { id: 16, difficulty: 'easy', word: 'САМОЛЁТ', forbidden: ['лететь', 'крыло', 'небо', 'пилот'] },
  { id: 17, difficulty: 'easy', word: 'ЛУНА', forbidden: ['ночь', 'светить', 'круглый', 'небо'] },
  {
    id: 18,
    difficulty: 'easy',
    word: 'СНЕГОВИК',
    forbidden: ['снег', 'зима', 'морковь', 'лепить'],
  },
  {
    id: 19,
    difficulty: 'easy',
    word: 'КЛЮЧ',
    forbidden: ['открыть', 'дверь', 'замок', 'потерять'],
  },
  {
    id: 20,
    difficulty: 'easy',
    word: 'ТЕЛЕФОН',
    forbidden: ['звонить', 'экран', 'заряд', 'позвонить'],
  },
  {
    id: 21,
    difficulty: 'easy',
    word: 'КОМПЬЮТЕР',
    forbidden: ['клавиатура', 'мышь', 'экран', 'программа'],
  },
  {
    id: 22,
    difficulty: 'easy',
    word: 'СТОЛ',
    forbidden: ['стул', 'есть', 'поверхность', 'мебель'],
  },
  {
    id: 23,
    difficulty: 'easy',
    word: 'КРОВАТЬ',
    forbidden: ['спать', 'подушка', 'мебель', 'одеяло'],
  },
  {
    id: 24,
    difficulty: 'easy',
    word: 'БАНАН',
    forbidden: ['жёлтый', 'тропики', 'обезьяна', 'фрукт'],
  },
  { id: 25, difficulty: 'easy', word: 'ПИЦЦА', forbidden: ['тесто', 'сыр', 'Италия', 'томат'] },
  {
    id: 26,
    difficulty: 'easy',
    word: 'КОРОВА',
    forbidden: ['молоко', 'мычать', 'ферма', 'животное'],
  },
  {
    id: 27,
    difficulty: 'easy',
    word: 'ПОЕЗД',
    forbidden: ['рельсы', 'вагон', 'локомотив', 'станция'],
  },
  {
    id: 28,
    difficulty: 'easy',
    word: 'ГИТАРА',
    forbidden: ['струна', 'играть', 'музыка', 'инструмент'],
  },
  {
    id: 29,
    difficulty: 'easy',
    word: 'ВРАЧ',
    forbidden: ['больница', 'лечить', 'таблетка', 'доктор'],
  },
  { id: 30, difficulty: 'easy', word: 'ДОЖДЬ', forbidden: ['зонт', 'лужа', 'облако', 'капля'] },
];

// ─── Medium ────────────────────────────────────────────────────────────────────
// Умеренно сложные слова, 5 запрещённых
const MEDIUM: TabooClassicCard[] = [
  {
    id: 31,
    difficulty: 'medium',
    word: 'ВУЛКАН',
    forbidden: ['лава', 'гора', 'извержение', 'огонь', 'взрыв'],
  },
  {
    id: 32,
    difficulty: 'medium',
    word: 'АКУЛА',
    forbidden: ['рыба', 'зуб', 'море', 'кусать', 'плавник'],
  },
  {
    id: 33,
    difficulty: 'medium',
    word: 'МАЯК',
    forbidden: ['море', 'свет', 'берег', 'корабль', 'башня'],
  },
  {
    id: 34,
    difficulty: 'medium',
    word: 'СКРИПКА',
    forbidden: ['смычок', 'струны', 'оркестр', 'музыка', 'играть'],
  },
  {
    id: 35,
    difficulty: 'medium',
    word: 'КАКТУС',
    forbidden: ['пустыня', 'колючка', 'растение', 'засуха', 'игла'],
  },
  {
    id: 36,
    difficulty: 'medium',
    word: 'ДЕТЕКТИВ',
    forbidden: ['расследование', 'преступник', 'улика', 'полиция', 'следствие'],
  },
  {
    id: 37,
    difficulty: 'medium',
    word: 'АЭРОПОРТ',
    forbidden: ['самолёт', 'вылет', 'терминал', 'чемодан', 'рейс'],
  },
  {
    id: 38,
    difficulty: 'medium',
    word: 'ДЕЛЬФИН',
    forbidden: ['море', 'умный', 'прыжок', 'млекопитающее', 'плавать'],
  },
  {
    id: 39,
    difficulty: 'medium',
    word: 'ПИРАМИДА',
    forbidden: ['Египет', 'фараон', 'треугольник', 'строить', 'древний'],
  },
  {
    id: 40,
    difficulty: 'medium',
    word: 'ПАРАШЮТ',
    forbidden: ['прыжок', 'купол', 'самолёт', 'падать', 'небо'],
  },
  {
    id: 41,
    difficulty: 'medium',
    word: 'КАРНАВАЛ',
    forbidden: ['маска', 'костюм', 'праздник', 'танцевать', 'Венеция'],
  },
  {
    id: 42,
    difficulty: 'medium',
    word: 'ТЕРМОМЕТР',
    forbidden: ['температура', 'измерять', 'болезнь', 'градус', 'жара'],
  },
  {
    id: 43,
    difficulty: 'medium',
    word: 'ОЛЕНЬ',
    forbidden: ['рога', 'лес', 'животное', 'Новый год', 'Санта'],
  },
  {
    id: 44,
    difficulty: 'medium',
    word: 'ЛАБИРИНТ',
    forbidden: ['запутать', 'выход', 'стена', 'ход', 'заблудиться'],
  },
  {
    id: 45,
    difficulty: 'medium',
    word: 'ПАСПОРТ',
    forbidden: ['документ', 'граница', 'виза', 'фото', 'удостоверение'],
  },
  {
    id: 46,
    difficulty: 'medium',
    word: 'ДИРИЖЁР',
    forbidden: ['оркестр', 'палочка', 'музыка', 'концерт', 'управлять'],
  },
  {
    id: 47,
    difficulty: 'medium',
    word: 'ЭКВАТОР',
    forbidden: ['жара', 'линия', 'земля', 'Африка', 'тропик'],
  },
  {
    id: 48,
    difficulty: 'medium',
    word: 'ПЕЩЕРА',
    forbidden: ['тёмный', 'камень', 'подземный', 'вход', 'летучая мышь'],
  },
  {
    id: 49,
    difficulty: 'medium',
    word: 'ШТРАФ',
    forbidden: ['нарушение', 'платить', 'полиция', 'правило', 'наказание'],
  },
  {
    id: 50,
    difficulty: 'medium',
    word: 'АУКЦИОН',
    forbidden: ['торги', 'цена', 'ставка', 'продавать', 'молоток'],
  },
  {
    id: 51,
    difficulty: 'medium',
    word: 'ГЕЙЗЕР',
    forbidden: ['вода', 'горячий', 'фонтан', 'пар', 'Исландия'],
  },
  {
    id: 52,
    difficulty: 'medium',
    word: 'ПРИЛИВ',
    forbidden: ['море', 'волна', 'луна', 'вода', 'берег'],
  },
  {
    id: 53,
    difficulty: 'medium',
    word: 'ТЕЛЕСКОП',
    forbidden: ['смотреть', 'звезда', 'увеличить', 'астроном', 'небо'],
  },
  {
    id: 54,
    difficulty: 'medium',
    word: 'КАНИКУЛЫ',
    forbidden: ['отдых', 'школа', 'лето', 'свободный', 'отпуск'],
  },
  {
    id: 55,
    difficulty: 'medium',
    word: 'СИРЕНА',
    forbidden: ['звук', 'полиция', 'скорая', 'вой', 'сигнал'],
  },
  {
    id: 56,
    difficulty: 'medium',
    word: 'ЖЮРИ',
    forbidden: ['суд', 'решение', 'судить', 'конкурс', 'голосование'],
  },
  {
    id: 57,
    difficulty: 'medium',
    word: 'ЯКОРЬ',
    forbidden: ['корабль', 'море', 'держать', 'дно', 'цепь'],
  },
  {
    id: 58,
    difficulty: 'medium',
    word: 'ТРАМВАЙ',
    forbidden: ['рельсы', 'город', 'ехать', 'вагон', 'электричество'],
  },
  {
    id: 59,
    difficulty: 'medium',
    word: 'ЧЕМПИОН',
    forbidden: ['победить', 'первый', 'соревнование', 'приз', 'титул'],
  },
  {
    id: 60,
    difficulty: 'medium',
    word: 'КАРАНТИН',
    forbidden: ['болезнь', 'изоляция', 'запрет', 'вирус', 'сидеть дома'],
  },
];

// ─── Hard ──────────────────────────────────────────────────────────────────────
// Абстрактные и сложные слова, 5 запрещённых — самые ожидаемые пояснения под запретом
const HARD: TabooClassicCard[] = [
  {
    id: 61,
    difficulty: 'hard',
    word: 'СОВЕСТЬ',
    forbidden: ['чувство', 'поступок', 'вина', 'честность', 'душа'],
  },
  {
    id: 62,
    difficulty: 'hard',
    word: 'НОСТАЛЬГИЯ',
    forbidden: ['прошлое', 'воспоминание', 'грусть', 'детство', 'тоска'],
  },
  {
    id: 63,
    difficulty: 'hard',
    word: 'ГРАВИТАЦИЯ',
    forbidden: ['притяжение', 'падать', 'земля', 'сила', 'Ньютон'],
  },
  {
    id: 64,
    difficulty: 'hard',
    word: 'ИНФЛЯЦИЯ',
    forbidden: ['деньги', 'цены', 'расти', 'экономика', 'обесценить'],
  },
  {
    id: 65,
    difficulty: 'hard',
    word: 'ЭПИДЕМИЯ',
    forbidden: ['болезнь', 'распространять', 'вирус', 'заразный', 'массовый'],
  },
  {
    id: 66,
    difficulty: 'hard',
    word: 'МЕДИТАЦИЯ',
    forbidden: ['спокойствие', 'дыхание', 'расслабить', 'концентрация', 'йога'],
  },
  {
    id: 67,
    difficulty: 'hard',
    word: 'ЭМПАТИЯ',
    forbidden: ['сочувствие', 'понимать', 'чувствовать', 'другой', 'переживать'],
  },
  {
    id: 68,
    difficulty: 'hard',
    word: 'ИЛЛЮЗИЯ',
    forbidden: ['обман', 'видеть', 'настоящий', 'восприятие', 'фокус'],
  },
  {
    id: 69,
    difficulty: 'hard',
    word: 'РЕПУТАЦИЯ',
    forbidden: ['мнение', 'имя', 'доверие', 'образ', 'общество'],
  },
  {
    id: 70,
    difficulty: 'hard',
    word: 'ХАОС',
    forbidden: ['беспорядок', 'разрушение', 'паника', 'контроль', 'смешать'],
  },
  {
    id: 71,
    difficulty: 'hard',
    word: 'ПАРАДОКС',
    forbidden: ['противоречие', 'логика', 'невозможный', 'истина', 'загадка'],
  },
  {
    id: 72,
    difficulty: 'hard',
    word: 'МОНОПОЛИЯ',
    forbidden: ['игра', 'власть', 'рынок', 'контроль', 'один'],
  },
  {
    id: 73,
    difficulty: 'hard',
    word: 'ТАКТИКА',
    forbidden: ['план', 'стратегия', 'действие', 'игра', 'победить'],
  },
  {
    id: 74,
    difficulty: 'hard',
    word: 'ДИАЛЕКТ',
    forbidden: ['язык', 'говор', 'регион', 'речь', 'отличие'],
  },
  {
    id: 75,
    difficulty: 'hard',
    word: 'ФЕНОМЕН',
    forbidden: ['явление', 'необычный', 'природа', 'уникальный', 'наблюдать'],
  },
  {
    id: 76,
    difficulty: 'hard',
    word: 'КАТАЛИЗАТОР',
    forbidden: ['ускорять', 'реакция', 'химия', 'изменение', 'процесс'],
  },
  {
    id: 77,
    difficulty: 'hard',
    word: 'СУВЕРЕНИТЕТ',
    forbidden: ['государство', 'независимость', 'власть', 'страна', 'право'],
  },
  {
    id: 78,
    difficulty: 'hard',
    word: 'ИМПРОВИЗАЦИЯ',
    forbidden: ['спонтанный', 'подготовка', 'музыка', 'театр', 'сочинять'],
  },
  {
    id: 79,
    difficulty: 'hard',
    word: 'КОНСЕНСУС',
    forbidden: ['согласие', 'решение', 'группа', 'договориться', 'мнение'],
  },
  {
    id: 80,
    difficulty: 'hard',
    word: 'АРХИТЕКТУРА',
    forbidden: ['строить', 'здание', 'дизайн', 'проектировать', 'город'],
  },
  {
    id: 81,
    difficulty: 'hard',
    word: 'ХАРИЗМА',
    forbidden: ['личность', 'обаяние', 'привлекать', 'лидер', 'магнетизм'],
  },
  {
    id: 82,
    difficulty: 'hard',
    word: 'ПРОПАГАНДА',
    forbidden: ['информация', 'влиять', 'государство', 'СМИ', 'манипуляция'],
  },
  {
    id: 83,
    difficulty: 'hard',
    word: 'МЕТАФОРА',
    forbidden: ['сравнение', 'слово', 'литература', 'образ', 'язык'],
  },
  {
    id: 84,
    difficulty: 'hard',
    word: 'АВАНТЮРА',
    forbidden: ['риск', 'приключение', 'план', 'авантюрист', 'неизвестность'],
  },
  {
    id: 85,
    difficulty: 'hard',
    word: 'БЮРОКРАТИЯ',
    forbidden: ['чиновник', 'документ', 'бумага', 'государство', 'правило'],
  },
  {
    id: 86,
    difficulty: 'hard',
    word: 'ДЕГРАДАЦИЯ',
    forbidden: ['упадок', 'ухудшение', 'разрушать', 'падать', 'регресс'],
  },
  {
    id: 87,
    difficulty: 'hard',
    word: 'СТЕРЕОТИП',
    forbidden: ['предрассудок', 'мнение', 'группа', 'ярлык', 'убеждение'],
  },
  {
    id: 88,
    difficulty: 'hard',
    word: 'ЛОЯЛЬНОСТЬ',
    forbidden: ['верность', 'преданность', 'доверие', 'поддержка', 'слушаться'],
  },
  {
    id: 89,
    difficulty: 'hard',
    word: 'КОМПРОМИСС',
    forbidden: ['уступка', 'договор', 'обе стороны', 'решение', 'середина'],
  },
  {
    id: 90,
    difficulty: 'hard',
    word: 'ПРОКРАСТИНАЦИЯ',
    forbidden: ['откладывать', 'лень', 'потом', 'время', 'работа'],
  },
];

export const TABOO_CLASSIC_CARDS: readonly TabooClassicCard[] = [...EASY, ...MEDIUM, ...HARD];

/** Все слова колоды данной сложности — общий источник для игры и contentService.getWordStats. */
export function getTabooClassicWordPool(difficulty: Difficulty): string[] {
  return TABOO_CLASSIC_CARDS.filter((c) => c.difficulty === difficulty).map((c) => c.word);
}

/** Pick a random unused card of the given difficulty. */
export function getNextTabooClassicCard(
  difficulty: Difficulty,
  usedIds: ReadonlySet<number>
): TabooClassicCard {
  const pool = TABOO_CLASSIC_CARDS.filter((c) => c.difficulty === difficulty && !usedIds.has(c.id));
  if (pool.length === 0) {
    // All cards used — fall back to full deck
    return TABOO_CLASSIC_CARDS.filter((c) => c.difficulty === difficulty)[
      Math.floor(
        Math.random() * TABOO_CLASSIC_CARDS.filter((c) => c.difficulty === difficulty).length
      )
    ];
  }
  return pool[Math.floor(Math.random() * pool.length)];
}
