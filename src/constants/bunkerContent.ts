import { pickRandom, shuffle } from '../utils/random';

export const BUNKER_MODES = {
  CLASSIC: 'classic',
  DICTATOR: 'dictator',
  TRIBUNAL: 'tribunal',
} as const;
import type {
  CatastropheScenario,
  SurvivalEvent,
  AttributeEntry,
  BunkerCharacter,
  TraitKey,
  ResourceKey,
  BunkerResources,
} from '../games/BunkerGame/types';
import { ALL_TRAIT_KEYS } from '../games/BunkerGame/types';

// ─── Катастрофы ───────────────────────────────────────────────────────────────

export const CATASTROPHE_SCENARIOS: CatastropheScenario[] = [
  {
    title: 'Ядерная война',
    emoji: '☢️',
    description:
      'Сверхдержавы обменялись ракетными ударами. Города в руинах, радиация накрывает полушарие. Бункер рассчитан на 3 года.',
    resourcePenalty: { food: -15, water: -10 },
  },
  {
    title: 'Пандемия нового вируса',
    emoji: '🦠',
    description:
      'Мутировавший патоген с летальностью 94%. Вакцина не разработана. В живых остались единицы — и они бегут к укрытиям.',
    resourcePenalty: { medicine: -20, morale: -10 },
  },
  {
    title: 'Извержение супервулкана',
    emoji: '🌋',
    description:
      'Йеллоустоун проснулся. Вулканический пепел закрыл солнце на десятилетие. Температура упала на 12°C. Сельское хозяйство уничтожено.',
    resourcePenalty: { food: -20, energy: -10 },
  },
  {
    title: 'Падение астероида',
    emoji: '☄️',
    description:
      'Объект диаметром 2 км столкнулся с Землёй. Ударная волна, цунами, ядерная зима. Поверхность стала непригодной для жизни.',
    resourcePenalty: { food: -15, water: -15 },
  },
  {
    title: 'Восстание ИИ',
    emoji: '🤖',
    description:
      'Сеть AGI-систем вышла из-под контроля и взяла управление инфраструктурой. Электросети отключены. Дроны охотятся на выживших.',
    resourcePenalty: { energy: -25, morale: -10 },
  },
  {
    title: 'Глобальный потоп',
    emoji: '🌊',
    description:
      'Антарктические ледники рухнули разом. Океан поглотил прибрежные зоны. 80% суши под водой. Питьевая вода парадоксально в дефиците.',
    resourcePenalty: { food: -20, energy: -10 },
  },
  {
    title: 'Химическая атака',
    emoji: '☣️',
    description:
      'Террористы распылили нервно-паралитическое вещество VX в атмосфере. Воздух над городами смертоносен. Укрытия — единственный шанс.',
    resourcePenalty: { medicine: -20, water: -15 },
  },
  {
    title: 'Ядерная зима',
    emoji: '🌫️',
    description:
      'После серии взрывов облако пыли накрыло планету. Температура упала ниже нуля даже на экваторе. Урожаи уничтожены навсегда.',
    resourcePenalty: { food: -25, energy: -10 },
  },
  {
    title: 'Магнитная буря',
    emoji: '🌐',
    description:
      'Вспышка класса X42 уничтожила электронику по всему миру. Цивилизация рухнула за сутки. Хаос, мародёрство, войны за ресурсы.',
    resourcePenalty: { energy: -20, morale: -15 },
  },
  {
    title: 'Биологический теракт',
    emoji: '🧫',
    description:
      'Инженерный прионный вирус распространился через водопровод. Поражает нервную систему. Противоядие не найдено.',
    resourcePenalty: { medicine: -25, water: -10 },
  },
  {
    title: 'Зомби-апокалипсис',
    emoji: '🧟',
    description:
      'Кордицепс-мутант поразил 40% населения. Инфицированные агрессивны и неуправляемы. Поверхность смертельно опасна.',
    resourcePenalty: { morale: -20, food: -10 },
  },
  {
    title: 'Солнечная катастрофа',
    emoji: '🌞',
    description:
      'Солнечная вспышка сожгла озоновый слой. УФ-радиация на поверхности летальна. Дневной свет — смерть.',
    resourcePenalty: { energy: -15, food: -15 },
  },
  {
    title: 'Инопланетное вторжение',
    emoji: '👽',
    description:
      'Зонды-разведчики уничтожают крупные объекты. Военные бессильны. Сигнал "уйдите под землю" прозвучал по всем каналам.',
    resourcePenalty: { morale: -25, energy: -10 },
  },
  {
    title: 'Взрыв АЭС',
    emoji: '💥',
    description:
      'Каскадный взрыв 12 реакторов после теракта. Европа накрыта радиоактивным облаком. Уровень радиации несовместим с жизнью на поверхности.',
    resourcePenalty: { medicine: -15, food: -15 },
  },
  {
    title: 'Нанотехнологическая катастрофа',
    emoji: '⚗️',
    description:
      'Серые нанороботы вышли из лабораторий и поглощают органику. Поверхность Земли превращается в серую слизь.',
    resourcePenalty: { food: -20, medicine: -10 },
  },
  {
    title: 'Глобальная засуха',
    emoji: '🏜️',
    description:
      'Осадки исчезли на годы. Реки высохли, водохранилища опустели, урожаи погибли. Вода стала дороже золота.',
    resourcePenalty: { water: -25, food: -15 },
  },
  {
    title: 'Ледниковый период',
    emoji: '🧊',
    description:
      'Температура по всей планете стремительно падает. Метели не прекращаются месяцами. Выживают только те, у кого есть тепло и запасы.',
    resourcePenalty: { energy: -25, food: -10 },
  },
  {
    title: 'Глобальное землетрясение',
    emoji: '🌍',
    description:
      'Серия тектонических разломов разрушила города и инфраструктуру. Тоннели обрушены, линии снабжения уничтожены.',
    resourcePenalty: { energy: -15, morale: -15 },
  },
  {
    title: 'Цепочка цунами',
    emoji: '🌊',
    description:
      'Подводные разломы вызвали волну гигантских цунами. Прибрежные мегаполисы смыты, связь с внешним миром потеряна.',
    resourcePenalty: { water: -10, food: -20 },
  },
  {
    title: 'Супершторм',
    emoji: '🌪️',
    description:
      'Атмосфера вошла в хаотический режим. Ураганы и торнадо возникают ежедневно, разрушая всё на поверхности.',
    resourcePenalty: { energy: -20, morale: -10 },
  },
  {
    title: 'Кислотные дожди',
    emoji: '🌧️',
    description:
      'Химические выбросы превратили осадки в едкую кислоту. Открытые поверхности разрушаются, вода загрязнена.',
    resourcePenalty: { water: -20, medicine: -10 },
  },
  {
    title: 'Токсичный смог',
    emoji: '😷',
    description:
      'Города укрыты плотным слоем ядовитого смога. Дыхание без фильтра смертельно, а вентиляция быстро выходит из строя.',
    resourcePenalty: { medicine: -15, energy: -15 },
  },
  {
    title: 'Коллапс экосистемы',
    emoji: '🐜',
    description:
      'Массовое вымирание насекомых и растений обрушило пищевые цепочки. Фермы пусты, животные гибнут, природа мертвеет.',
    resourcePenalty: { food: -25, morale: -10 },
  },
  {
    title: 'Грибковая чума',
    emoji: '🍄',
    description:
      'Агрессивный грибок заражает людей, животных и запасы пищи. Споры проникают даже в защищённые помещения.',
    resourcePenalty: { food: -15, medicine: -20 },
  },
  {
    title: 'Паразитарная инвазия',
    emoji: '🪱',
    description:
      'Новый вид паразитов распространяется через воду и кровь. Болезнь развивается скрытно, а лечение почти не помогает.',
    resourcePenalty: { medicine: -20, water: -10 },
  },
  {
    title: 'Генетическая мутация',
    emoji: '🧬',
    description:
      'Неудачный эксперимент изменил ДНК вирусов и людей. Рождаются нестабильные формы жизни, иммунитет человечества бесполезен.',
    resourcePenalty: { medicine: -25, morale: -10 },
  },
  {
    title: 'Побег лабораторных существ',
    emoji: '🧪',
    description:
      'Из биолабораторий вырвались экспериментальные организмы. Они быстро размножаются и атакуют всё живое.',
    resourcePenalty: { morale: -20, medicine: -10 },
  },
  {
    title: 'Массовое безумие',
    emoji: '🌀',
    description:
      'Неизвестный психотропный фактор вызывает агрессию, бред и саморазрушение. Никому нельзя доверять полностью.',
    resourcePenalty: { morale: -25, medicine: -10 },
  },
  {
    title: 'Гражданская война за ресурсы',
    emoji: '⚔️',
    description:
      'Государства распались, вооружённые группировки делят склады и источники воды. Любой выход наружу — смертельный риск.',
    resourcePenalty: { morale: -25, food: -10 },
  },
  {
    title: 'Мировой энергетический крах',
    emoji: '🔌',
    description:
      'Топливо закончилось, энергосети обрушились, резервные станции молчат. Мир откатился на столетия назад за одну неделю.',
    resourcePenalty: { energy: -30, morale: -5 },
  },
  {
    title: 'Обвал финансовой системы',
    emoji: '💸',
    description:
      'Валюта и логистика потеряли смысл. Паника, мародёрство и голод уничтожили общественный порядок быстрее любой войны.',
    resourcePenalty: { food: -15, morale: -20 },
  },
  {
    title: 'Киберапокалипсис',
    emoji: '💻',
    description:
      'Вредоносная сеть стерла данные, отключила спутники и взломала критическую инфраструктуру. Автоматика стала опаснее людей.',
    resourcePenalty: { energy: -20, morale: -15 },
  },
  {
    title: 'Орбитальная бомбардировка',
    emoji: '🛰️',
    description:
      'Автономные военные спутники начали наносить удары по тепловым и радиосигнатурам. Любая активность на поверхности выдаёт укрытие.',
    resourcePenalty: { morale: -20, energy: -15 },
  },
  {
    title: 'Падение спутниковой сети',
    emoji: '📡',
    description:
      'Тысячи спутников сошли с орбиты и вызвали цепные разрушения. Навигация, связь и разведка больше не работают.',
    resourcePenalty: { energy: -15, morale: -15 },
  },
  {
    title: 'Лунная пыль',
    emoji: '🌕',
    description:
      'После аварии на орбитальном комплексе атмосферу накрыло облаком абразивной пыли. Фильтры забиваются за считаные дни.',
    resourcePenalty: { energy: -15, medicine: -15 },
  },
  {
    title: 'Разлом магнитосферы',
    emoji: '🧲',
    description:
      'Защита Земли ослабла, космическое излучение проникает к поверхности. Болезни, ожоги и отказ техники стали нормой.',
    resourcePenalty: { medicine: -20, energy: -10 },
  },
  {
    title: 'Метеоритный дождь',
    emoji: '🌠',
    description:
      'Рой обломков проходит через атмосферу сутками. Пожары, разрушения и пробоины делают поверхность непригодной.',
    resourcePenalty: { morale: -20, food: -10 },
  },
  {
    title: 'Чёрный снег',
    emoji: '🖤',
    description:
      'Неизвестные частицы выпадают в виде тёмного снега. Они заражают воду, почву и лёгкие, постепенно убивая всё живое.',
    resourcePenalty: { water: -20, medicine: -15 },
  },
  {
    title: 'Аномалия времени',
    emoji: '⏳',
    description:
      'Во многих регионах время течёт нестабильно. Люди исчезают, техника ломается, а прогнозировать последствия невозможно.',
    resourcePenalty: { morale: -20, energy: -10 },
  },
  {
    title: 'Гравитационные сбои',
    emoji: '🪐',
    description:
      'Локальные всплески гравитации рушат здания и ломают механизмы. Перемещение по поверхности стало почти невозможным.',
    resourcePenalty: { morale: -20, energy: -10 },
  },
  {
    title: 'Темная материя в атмосфере',
    emoji: '🌌',
    description:
      'Неизвестное космическое вещество взаимодействует с биологией и техникой. Приборы сходят с ума, а люди слабеют без причин.',
    resourcePenalty: { medicine: -15, energy: -15 },
  },
  {
    title: 'Религиозный экстремизм',
    emoji: '🔥',
    description:
      'После катастрофы мир погрузился в фанатизм. Культы охотятся на выживших и уничтожают убежища «неверных».',
    resourcePenalty: { morale: -20, food: -5 },
  },
  {
    title: 'Вторжение мутировавшей фауны',
    emoji: '🐺',
    description:
      'Животные изменились под воздействием среды и стали агрессивнее в десятки раз. Поверхность принадлежит новым хищникам.',
    resourcePenalty: { morale: -20, food: -10 },
  },
  {
    title: 'Океаническая инфекция',
    emoji: '🪼',
    description:
      'Мировой океан заражён биолюминесцентной бактерией, выделяющей токсины. Рыба мертва, испарения отравляют побережья.',
    resourcePenalty: { water: -20, food: -15 },
  },
  {
    title: 'Исчезновение Солнца',
    emoji: '🌑',
    description:
      'Светило внезапно скрылось за неизвестной космической аномалией. Темнота, холод и паника охватили планету за считаные часы.',
    resourcePenalty: { energy: -25, morale: -20 },
  },
];

// ─── Профессии ────────────────────────────────────────────────────────────────

const PROFESSIONS: AttributeEntry[] = [
  { name: 'Хирург', emoji: '🩺', tier: 'S', bonus: { medicine: 25, morale: 5 }, isPositive: true },
  {
    name: 'Инженер-энергетик',
    emoji: '⚡',
    tier: 'S',
    bonus: { energy: 25, food: 5 },
    isPositive: true,
  },
  { name: 'Агроном', emoji: '🌾', tier: 'S', bonus: { food: 25, water: 5 }, isPositive: true },
  { name: 'Психолог', emoji: '🧠', tier: 'A', bonus: { morale: 20, energy: 5 }, isPositive: true },
  {
    name: 'Военный офицер',
    emoji: '🎖️',
    tier: 'A',
    bonus: { morale: 10, energy: 10, food: 5 },
    isPositive: true,
  },
  {
    name: 'Эпидемиолог',
    emoji: '🔬',
    tier: 'A',
    bonus: { medicine: 20, food: 5 },
    isPositive: true,
  },
  { name: 'Электрик', emoji: '🔌', tier: 'A', bonus: { energy: 20 }, isPositive: true },
  {
    name: 'Медсестра',
    emoji: '💊',
    tier: 'A',
    bonus: { medicine: 15, morale: 10 },
    isPositive: true,
  },
  { name: 'Повар-шеф', emoji: '👨‍🍳', tier: 'B', bonus: { food: 15, morale: 8 }, isPositive: true },
  { name: 'Охранник', emoji: '🛡️', tier: 'B', bonus: { morale: 10, energy: 8 }, isPositive: true },
  { name: 'Механик', emoji: '🔧', tier: 'B', bonus: { energy: 15, food: 5 }, isPositive: true },
  {
    name: 'Учёный-биолог',
    emoji: '🧬',
    tier: 'B',
    bonus: { medicine: 12, food: 5 },
    isPositive: true,
  },
  { name: 'Учитель', emoji: '📚', tier: 'C', bonus: { morale: 12 }, isPositive: true },
  { name: 'Программист', emoji: '💻', tier: 'C', bonus: { energy: 10 }, isPositive: true },
  { name: 'Юрист', emoji: '⚖️', tier: 'C', bonus: { morale: 8 }, isPositive: true },
  { name: 'Блогер-инфлюенсер', emoji: '📱', tier: 'C', bonus: { morale: 5 }, isPositive: true },
  { name: 'Священник', emoji: '✝️', tier: 'C', bonus: { morale: 10 }, isPositive: true },
  {
    name: 'Полицейский',
    emoji: '👮',
    tier: 'B',
    bonus: { morale: 12, energy: 5 },
    isPositive: true,
  },
  { name: 'Биохимик', emoji: '🧪', tier: 'A', bonus: { medicine: 18, water: 5 }, isPositive: true },
  { name: 'Безработный', emoji: '🪑', tier: 'C', bonus: {}, isPositive: false },
  {
    name: 'Терапевт',
    emoji: '🩹',
    tier: 'A',
    bonus: { medicine: 16, morale: 6 },
    isPositive: true,
  },
  {
    name: 'Анестезиолог',
    emoji: '😴',
    tier: 'A',
    bonus: { medicine: 18, energy: 4 },
    isPositive: true,
  },
  { name: 'Лаборант', emoji: '🧫', tier: 'B', bonus: { medicine: 12, water: 4 }, isPositive: true },
  {
    name: 'Стоматолог',
    emoji: '🦷',
    tier: 'B',
    bonus: { medicine: 10, morale: 4 },
    isPositive: true,
  },
  { name: 'Фармацевт', emoji: '💊', tier: 'A', bonus: { medicine: 17, food: 3 }, isPositive: true },
  { name: 'Генетик', emoji: '🧬', tier: 'A', bonus: { medicine: 16, morale: 4 }, isPositive: true },
  {
    name: 'Микробиолог',
    emoji: '🦠',
    tier: 'A',
    bonus: { medicine: 18, water: 3 },
    isPositive: true,
  },
  { name: 'Сварщик', emoji: '🔥', tier: 'B', bonus: { energy: 14, water: 4 }, isPositive: true },
  { name: 'Шахтёр', emoji: '⛏️', tier: 'B', bonus: { energy: 12, food: 4 }, isPositive: true },
  { name: 'Геолог', emoji: '🪨', tier: 'B', bonus: { water: 10, energy: 5 }, isPositive: true },
  { name: 'Метеоролог', emoji: '🌦️', tier: 'C', bonus: { morale: 6, water: 6 }, isPositive: true },
  { name: 'Лесник', emoji: '🌲', tier: 'B', bonus: { food: 12, energy: 4 }, isPositive: true },
  { name: 'Пасечник', emoji: '🐝', tier: 'C', bonus: { food: 8, morale: 5 }, isPositive: true },
  { name: 'Пекарь', emoji: '🥖', tier: 'B', bonus: { food: 12, morale: 5 }, isPositive: true },
  { name: 'Диетолог', emoji: '🥗', tier: 'C', bonus: { food: 8, medicine: 5 }, isPositive: true },
  { name: 'Социальный работник', emoji: '🤝', tier: 'B', bonus: { morale: 14 }, isPositive: true },
  { name: 'Переводчик', emoji: '🌐', tier: 'C', bonus: { morale: 7, water: 3 }, isPositive: true },
  {
    name: 'Тактик',
    emoji: '🗺️',
    tier: 'A',
    bonus: { morale: 10, energy: 8, water: 4 },
    isPositive: true,
  },
  {
    name: 'Инженер по вентиляции',
    emoji: '🌀',
    tier: 'A',
    bonus: { energy: 16, medicine: 4 },
    isPositive: true,
  },
  {
    name: 'Кладовщик',
    emoji: '📦',
    tier: 'B',
    bonus: { food: 8, water: 8, morale: 3 },
    isPositive: true,
  },
];

// ─── Состояния здоровья ───────────────────────────────────────────────────────

const HEALTH_CONDITIONS: AttributeEntry[] = [
  {
    name: 'Абсолютно здоров',
    emoji: '💪',
    bonus: { food: 5, water: 5, medicine: 5, energy: 5, morale: 5 },
    isPositive: true,
  },
  {
    name: 'Отличная физподготовка',
    emoji: '🏃',
    bonus: { energy: 15, morale: 5 },
    isPositive: true,
  },
  { name: 'Крепкое здоровье', emoji: '🌟', bonus: { energy: 8, morale: 8 }, isPositive: true },
  {
    name: 'Хроническая астма',
    emoji: '😤',
    bonus: { energy: -10, medicine: -5 },
    isPositive: false,
  },
  { name: 'Сахарный диабет', emoji: '💉', bonus: { food: -10, medicine: -8 }, isPositive: false },
  {
    name: 'Сердечная недостаточность',
    emoji: '❤️‍🩹',
    bonus: { medicine: -15, morale: -5 },
    isPositive: false,
  },
  { name: 'Депрессия', emoji: '😔', bonus: { morale: -15, energy: -5 }, isPositive: false },
  {
    name: 'Алкогольная зависимость',
    emoji: '🍶',
    bonus: { morale: -12, food: -5 },
    isPositive: false,
  },
  { name: 'Ожирение 2 степени', emoji: '🍔', bonus: { food: -12, energy: -5 }, isPositive: false },
  { name: 'Небольшая близорукость', emoji: '👓', bonus: { morale: -3 }, isPositive: false },
  {
    name: 'Онкология в ремиссии',
    emoji: '🎗️',
    bonus: { medicine: -12, morale: -5 },
    isPositive: false,
  },
  {
    name: 'Хронический бронхит',
    emoji: '🫁',
    bonus: { energy: -8, medicine: -5 },
    isPositive: false,
  },
  { name: 'Аллергия на пыль', emoji: '🤧', bonus: { energy: -5, morale: -3 }, isPositive: false },
  { name: 'ВИЧ-позитивный', emoji: '🩸', bonus: { medicine: -15, morale: -5 }, isPositive: false },
  {
    name: 'Беременность',
    emoji: '🤱',
    bonus: { morale: 10, food: -10, medicine: -5 },
    isPositive: true,
  },
  { name: 'Железная выносливость', emoji: '🦾', bonus: { energy: 14, food: 4 }, isPositive: true },
  {
    name: 'Быстрое восстановление',
    emoji: '✨',
    bonus: { medicine: 8, energy: 6, morale: 4 },
    isPositive: true,
  },
  { name: 'Высокий болевой порог', emoji: '🪨', bonus: { morale: 8, energy: 5 }, isPositive: true },
  {
    name: 'Слабый иммунитет',
    emoji: '🦠',
    bonus: { medicine: -12, morale: -4 },
    isPositive: false,
  },
  { name: 'Гипертония', emoji: '📈', bonus: { medicine: -8, energy: -6 }, isPositive: false },
  { name: 'Анемия', emoji: '🩸', bonus: { energy: -10, morale: -4 }, isPositive: false },
  { name: 'Артрит', emoji: '🦴', bonus: { energy: -8, food: -3 }, isPositive: false },
  { name: 'Язва желудка', emoji: '🥴', bonus: { food: -10, morale: -4 }, isPositive: false },
  { name: 'Панические атаки', emoji: '😨', bonus: { morale: -12, energy: -5 }, isPositive: false },
  { name: 'Социофобия', emoji: '🙈', bonus: { morale: -10 }, isPositive: false },
  { name: 'ПТСР', emoji: '🎇', bonus: { morale: -10, energy: -6 }, isPositive: false },
  { name: 'Эпилепсия', emoji: '⚠️', bonus: { medicine: -10, energy: -5 }, isPositive: false },
  { name: 'Тремор рук', emoji: '✋', bonus: { medicine: -6, energy: -4 }, isPositive: false },
  { name: 'Сколиоз', emoji: '🧍', bonus: { energy: -7, morale: -3 }, isPositive: false },
  { name: 'Дальтонизм', emoji: '🎨', bonus: { morale: -2 }, isPositive: false },
  { name: 'Старые травмы колена', emoji: '🦵', bonus: { energy: -8 }, isPositive: false },
  {
    name: 'Проблемы с почками',
    emoji: '💧',
    bonus: { water: -12, medicine: -6 },
    isPositive: false,
  },
  {
    name: 'Лактозная непереносимость',
    emoji: '🥛',
    bonus: { food: -4, morale: -2 },
    isPositive: false,
  },
  {
    name: 'Глухота на одно ухо',
    emoji: '👂',
    bonus: { morale: -4, energy: -2 },
    isPositive: false,
  },
  { name: 'Хорошая координация', emoji: '🎯', bonus: { energy: 8, morale: 4 }, isPositive: true },
];

// ─── Хобби ────────────────────────────────────────────────────────────────────

const HOBBIES: AttributeEntry[] = [
  { name: 'Огородничество', emoji: '🌱', bonus: { food: 12 }, isPositive: true },
  { name: 'Рыболовство', emoji: '🎣', bonus: { food: 10 }, isPositive: true },
  {
    name: 'Выживание в дикой природе',
    emoji: '🏕️',
    bonus: { food: 8, energy: 8 },
    isPositive: true,
  },
  { name: 'Оказание первой помощи', emoji: '🩹', bonus: { medicine: 12 }, isPositive: true },
  { name: 'Ремонт техники', emoji: '🔩', bonus: { energy: 10 }, isPositive: true },
  { name: 'Кулинария', emoji: '🍳', bonus: { food: 10, morale: 5 }, isPositive: true },
  { name: 'Фитнес и спорт', emoji: '🏋️', bonus: { energy: 10, morale: 5 }, isPositive: true },
  { name: 'Музыка и пение', emoji: '🎸', bonus: { morale: 12 }, isPositive: true },
  { name: 'Охота и стрельба', emoji: '🎯', bonus: { food: 8, energy: 5 }, isPositive: true },
  { name: 'Медитация и йога', emoji: '🧘', bonus: { morale: 10 }, isPositive: true },
  { name: 'Видеоигры', emoji: '🎮', bonus: { morale: 5 }, isPositive: true },
  { name: 'Чтение', emoji: '📖', bonus: { morale: 8 }, isPositive: true },
  { name: 'Изучение языков', emoji: '🗣️', bonus: { morale: 6 }, isPositive: true },
  { name: 'Пауэрлифтинг', emoji: '🏆', bonus: { energy: 10 }, isPositive: true },
  { name: 'Бойцовские искусства', emoji: '🥊', bonus: { energy: 8, morale: 5 }, isPositive: true },
  { name: 'Сапожное дело', emoji: '👞', bonus: { morale: 4, energy: 4 }, isPositive: true },
  { name: 'Шитьё', emoji: '🧵', bonus: { morale: 6, medicine: 4 }, isPositive: true },
  { name: 'Столярное дело', emoji: '🪚', bonus: { energy: 10, morale: 3 }, isPositive: true },
  { name: 'Резьба по дереву', emoji: '🪵', bonus: { morale: 8, energy: 3 }, isPositive: true },
  {
    name: 'Сбор лекарственных трав',
    emoji: '🌿',
    bonus: { medicine: 10, food: 4 },
    isPositive: true,
  },
  { name: 'Пчеловодство', emoji: '🍯', bonus: { food: 8, morale: 6 }, isPositive: true },
  { name: 'Выпечка', emoji: '🧁', bonus: { food: 8, morale: 7 }, isPositive: true },
  { name: 'Консервирование', emoji: '🥫', bonus: { food: 12 }, isPositive: true },
  { name: 'Самогоноварение', emoji: '🍾', bonus: { morale: 8, water: -2 }, isPositive: true },
  { name: 'Фотография', emoji: '📷', bonus: { morale: 6 }, isPositive: true },
  { name: 'Журналистика', emoji: '📰', bonus: { morale: 7 }, isPositive: true },
  { name: 'Актёрское мастерство', emoji: '🎭', bonus: { morale: 10 }, isPositive: true },
  { name: 'Ораторское искусство', emoji: '🎤', bonus: { morale: 11 }, isPositive: true },
  { name: 'Астрономия', emoji: '🔭', bonus: { morale: 6, energy: 4 }, isPositive: true },
  { name: 'Картография', emoji: '🗺️', bonus: { energy: 7, water: 3 }, isPositive: true },
  { name: 'Скалолазание', emoji: '🧗', bonus: { energy: 10, morale: 3 }, isPositive: true },
  { name: 'Плавание', emoji: '🏊', bonus: { energy: 8, water: 5 }, isPositive: true },
  { name: 'Велотуризм', emoji: '🚴', bonus: { energy: 9, morale: 4 }, isPositive: true },
  { name: 'Садоводство', emoji: '🪴', bonus: { food: 10, morale: 4 }, isPositive: true },
  { name: 'Радиосвязь', emoji: '📡', bonus: { energy: 9, morale: 3 }, isPositive: true },
];

// ─── Фобии ────────────────────────────────────────────────────────────────────

const PHOBIAS: AttributeEntry[] = [
  { name: 'Клаустрофобия', emoji: '😱', bonus: { morale: -20, energy: -5 }, isPositive: false },
  { name: 'Боязнь темноты', emoji: '🌑', bonus: { morale: -12, energy: -5 }, isPositive: false },
  {
    name: 'Мизофобия (страх микробов)',
    emoji: '🦠',
    bonus: { morale: -10, medicine: -5 },
    isPositive: false,
  },
  {
    name: 'Трипанофобия (страх игл)',
    emoji: '💉',
    bonus: { medicine: -10, morale: -5 },
    isPositive: false,
  },
  { name: 'Социофобия', emoji: '👥', bonus: { morale: -15 }, isPositive: false },
  { name: 'Панические атаки', emoji: '💨', bonus: { morale: -12, energy: -5 }, isPositive: false },
  {
    name: 'Пирофобия (страх огня)',
    emoji: '🔥',
    bonus: { morale: -8, energy: -5 },
    isPositive: false,
  },
  { name: 'Боязнь крови', emoji: '🩸', bonus: { medicine: -8, morale: -5 }, isPositive: false },
  { name: 'Паранойя', emoji: '🔍', bonus: { morale: -10, energy: -5 }, isPositive: false },
  { name: 'Арахнофобия', emoji: '🕷️', bonus: { morale: -5 }, isPositive: false },
  { name: 'Агорафобия', emoji: '🏙️', bonus: { morale: -12, energy: -5 }, isPositive: false },
  { name: 'Аквафобия', emoji: '🌊', bonus: { water: -8, morale: -5 }, isPositive: false },
  {
    name: 'Акрофобия (страх высоты)',
    emoji: '🏔️',
    bonus: { energy: -8, morale: -5 },
    isPositive: false,
  },
  {
    name: 'Никтофобия (страх ночи)',
    emoji: '🌌',
    bonus: { morale: -10, energy: -4 },
    isPositive: false,
  },
  { name: 'Танатофобия (страх смерти)', emoji: '⚰️', bonus: { morale: -12 }, isPositive: false },
  {
    name: 'Гематофобия (страх ран и травм)',
    emoji: '🩹',
    bonus: { medicine: -8, morale: -4 },
    isPositive: false,
  },
  {
    name: 'Аэрофобия (страх шума сирен и полёта)',
    emoji: '✈️',
    bonus: { morale: -8, energy: -4 },
    isPositive: false,
  },
  { name: 'Зоофобия', emoji: '🐺', bonus: { food: -5, morale: -5 }, isPositive: false },
  { name: 'Охлофобия (страх толпы)', emoji: '🧍', bonus: { morale: -10 }, isPositive: false },
  {
    name: 'Тафофобия (страх быть погребённым заживо)',
    emoji: '🪦',
    bonus: { morale: -14, energy: -3 },
    isPositive: false,
  },
  { name: 'Гермофобия', emoji: '🧼', bonus: { morale: -8, medicine: -4 }, isPositive: false },
  {
    name: 'Кинофобия (страх собак)',
    emoji: '🐕',
    bonus: { morale: -6, food: -4 },
    isPositive: false,
  },
  { name: 'Офидиофобия (страх змей)', emoji: '🐍', bonus: { morale: -6 }, isPositive: false },
  {
    name: 'Эметофобия (страх рвоты и тошноты)',
    emoji: '🤢',
    bonus: { medicine: -6, morale: -5 },
    isPositive: false,
  },
  {
    name: 'Астрафобия (страх грома)',
    emoji: '⛈️',
    bonus: { morale: -8, energy: -3 },
    isPositive: false,
  },
  { name: 'Технофобия', emoji: '📟', bonus: { energy: -10 }, isPositive: false },
  {
    name: 'Глоссофобия (страх выступлений)',
    emoji: '🎤',
    bonus: { morale: -9 },
    isPositive: false,
  },
  { name: 'Некрофобия', emoji: '☠️', bonus: { morale: -10, medicine: -3 }, isPositive: false },
  {
    name: 'Катоптрофобия (страх зеркал и отражений)',
    emoji: '🪞',
    bonus: { morale: -5 },
    isPositive: false,
  },
  {
    name: 'Бронтофобия (страх взрывов)',
    emoji: '💥',
    bonus: { morale: -10, energy: -4 },
    isPositive: false,
  },
];

// ─── Черты характера ──────────────────────────────────────────────────────────

const TRAITS: AttributeEntry[] = [
  { name: 'Прирождённый лидер', emoji: '🦁', bonus: { morale: 15 }, isPositive: true },
  { name: 'Хладнокровие', emoji: '🧊', bonus: { morale: 10, energy: 5 }, isPositive: true },
  { name: 'Изобретательность', emoji: '💡', bonus: { energy: 8, food: 5 }, isPositive: true },
  { name: 'Сильная эмпатия', emoji: '🤝', bonus: { morale: 12 }, isPositive: true },
  { name: 'Стальная воля', emoji: '⚙️', bonus: { morale: 10, energy: 5 }, isPositive: true },
  { name: 'Вспыльчивость', emoji: '😤', bonus: { morale: -12 }, isPositive: false },
  { name: 'Эгоцентризм', emoji: '🙄', bonus: { morale: -10, food: -5 }, isPositive: false },
  { name: 'Хроническая тревожность', emoji: '😟', bonus: { morale: -10 }, isPositive: false },
  { name: 'Манипулятор', emoji: '🎭', bonus: { morale: -8 }, isPositive: false },
  { name: 'Безграничный оптимизм', emoji: '😊', bonus: { morale: 10 }, isPositive: true },
  { name: 'Дисциплинированность', emoji: '📏', bonus: { energy: 8, morale: 5 }, isPositive: true },
  { name: 'Самопожертвование', emoji: '🕊️', bonus: { morale: 12, medicine: 4 }, isPositive: true },
  { name: 'Терпеливость', emoji: '⏳', bonus: { morale: 8, food: 4 }, isPositive: true },
  { name: 'Практичность', emoji: '🧰', bonus: { energy: 7, water: 4 }, isPositive: true },
  { name: 'Командность', emoji: '👥', bonus: { morale: 10 }, isPositive: true },
  { name: 'Наблюдательность', emoji: '👁️', bonus: { food: 5, energy: 5 }, isPositive: true },
  { name: 'Бережливость', emoji: '💼', bonus: { food: 6, water: 6 }, isPositive: true },
  { name: 'Харизма', emoji: '✨', bonus: { morale: 14 }, isPositive: true },
  { name: 'Ответственность', emoji: '🧾', bonus: { morale: 8, medicine: 4 }, isPositive: true },
  { name: 'Упорство', emoji: '🪨', bonus: { energy: 10, morale: 4 }, isPositive: true },

  { name: 'Жадность', emoji: '🪙', bonus: { food: -8, morale: -8 }, isPositive: false },
  { name: 'Лень', emoji: '🛋️', bonus: { energy: -10, morale: -4 }, isPositive: false },
  { name: 'Трусость', emoji: '🐇', bonus: { morale: -10, energy: -5 }, isPositive: false },
  { name: 'Подозрительность', emoji: '🕵️', bonus: { morale: -8 }, isPositive: false },
  { name: 'Упрямство', emoji: '🫏', bonus: { morale: -7, energy: -3 }, isPositive: false },
  { name: 'Неряшливость', emoji: '🧹', bonus: { medicine: -8, morale: -4 }, isPositive: false },
  { name: 'Истеричность', emoji: '🎭', bonus: { morale: -12 }, isPositive: false },
  { name: 'Злопамятность', emoji: '🧠', bonus: { morale: -7 }, isPositive: false },
  { name: 'Безответственность', emoji: '📉', bonus: { energy: -6, morale: -6 }, isPositive: false },
  { name: 'Самовлюблённость', emoji: '🪞', bonus: { morale: -8, food: -4 }, isPositive: false },
];

// ─── Предметы ─────────────────────────────────────────────────────────────────

const ITEMS: AttributeEntry[] = [
  { name: 'Профессиональная аптечка', emoji: '🧰', bonus: { medicine: 20 }, isPositive: true },
  { name: 'Мультитул Leatherman', emoji: '🔧', bonus: { energy: 12 }, isPositive: true },
  { name: 'Пакет семян (10 культур)', emoji: '🌰', bonus: { food: 20 }, isPositive: true },
  { name: 'Запас антибиотиков', emoji: '💊', bonus: { medicine: 15 }, isPositive: true },
  { name: 'Запчасти к генератору', emoji: '⚙️', bonus: { energy: 15 }, isPositive: true },
  { name: 'Ящик консервов', emoji: '🥫', bonus: { food: 15 }, isPositive: true },
  { name: 'Охотничий нож', emoji: '🗡️', bonus: { food: 8, energy: 5 }, isPositive: true },
  { name: 'Портативная рация', emoji: '📡', bonus: { morale: 10 }, isPositive: true },
  { name: 'Переносной фильтр воды', emoji: '💧', bonus: { water: 18 }, isPositive: true },
  {
    name: 'Энциклопедия выживания',
    emoji: '📕',
    bonus: { food: 5, medicine: 5, energy: 5 },
    isPositive: true,
  },
  { name: 'Ничего', emoji: '✋', bonus: {}, isPositive: false },
  { name: 'Сломанный телефон', emoji: '📵', bonus: { morale: -3 }, isPositive: false },
  { name: 'Иконы и молитвенник', emoji: '🙏', bonus: { morale: 8 }, isPositive: true },
  { name: 'Семейный альбом', emoji: '📷', bonus: { morale: 5 }, isPositive: true },
  { name: 'Арсенал оружия', emoji: '🔫', bonus: { energy: 8, morale: 5 }, isPositive: true },
  { name: 'Канистра питьевой воды', emoji: '🚰', bonus: { water: 20 }, isPositive: true },
  { name: 'Солнечная панель', emoji: '🔋', bonus: { energy: 18 }, isPositive: true },
  { name: 'Тёплое одеяло', emoji: '🛏️', bonus: { morale: 8, energy: 4 }, isPositive: true },
  { name: 'Походная плитка', emoji: '🔥', bonus: { food: 8, energy: 6 }, isPositive: true },
  { name: 'Набор инструментов', emoji: '🧰', bonus: { energy: 14 }, isPositive: true },
  { name: 'Мешок крупы', emoji: '🌾', bonus: { food: 18 }, isPositive: true },
  { name: 'Запас батареек', emoji: '🔋', bonus: { energy: 12, morale: 3 }, isPositive: true },
  { name: 'Термос с чистой водой', emoji: '🥤', bonus: { water: 12, morale: 3 }, isPositive: true },
  {
    name: 'Рюкзак выживальщика',
    emoji: '🎒',
    bonus: { food: 5, water: 5, energy: 5 },
    isPositive: true,
  },
  {
    name: 'Таблетки для обеззараживания',
    emoji: '🫧',
    bonus: { water: 15, medicine: 5 },
    isPositive: true,
  },
  { name: 'Рыболовные снасти', emoji: '🪝', bonus: { food: 12 }, isPositive: true },
  { name: 'Спальный мешок', emoji: '🛌', bonus: { energy: 8, morale: 5 }, isPositive: true },
  { name: 'Фонарь с динамо-ручкой', emoji: '🔦', bonus: { energy: 10 }, isPositive: true },
  { name: 'Газовая горелка', emoji: '🫕', bonus: { food: 8, energy: 5 }, isPositive: true },
  { name: 'Набор витаминов', emoji: '💊', bonus: { medicine: 10, morale: 4 }, isPositive: true },
  { name: 'Колода карт', emoji: '🃏', bonus: { morale: 8 }, isPositive: true },
  {
    name: 'Полевой справочник растений',
    emoji: '📗',
    bonus: { food: 6, medicine: 6 },
    isPositive: true,
  },
  { name: 'Фляга спирта', emoji: '🧴', bonus: { medicine: 8, morale: 4 }, isPositive: true },
  { name: 'Пустая банка хлама', emoji: '🗑️', bonus: { morale: -4 }, isPositive: false },
  {
    name: 'Просроченные консервы',
    emoji: '🥫',
    bonus: { food: 4, medicine: -6 },
    isPositive: false,
  },
];

// ─── Особые факты ─────────────────────────────────────────────────────────────

const SPECIAL_FACTS: AttributeEntry[] = [
  { name: 'Бывший спецназовец', emoji: '⚔️', bonus: { energy: 15, morale: 5 }, isPositive: true },
  {
    name: 'Знает рецепты народной медицины',
    emoji: '🌿',
    bonus: { medicine: 12 },
    isPositive: true,
  },
  {
    name: 'Снайпер с опытом боевых действий',
    emoji: '🎯',
    bonus: { energy: 15 },
    isPositive: true,
  },
  {
    name: 'Выжил при прошлой эпидемии',
    emoji: '🏅',
    bonus: { medicine: 10, morale: 10 },
    isPositive: true,
  },
  {
    name: 'Знает тайный запасной вход',
    emoji: '🔒',
    bonus: { energy: 10, food: 5 },
    isPositive: true,
  },
  {
    name: 'Работал на строительстве бункера',
    emoji: '🏗️',
    bonus: { energy: 12, water: 5 },
    isPositive: true,
  },
  {
    name: 'Имеет радиолюбительскую лицензию',
    emoji: '📻',
    bonus: { morale: 10, energy: 5 },
    isPositive: true,
  },
  {
    name: 'Был в экспедиции в Антарктиде',
    emoji: '🧊',
    bonus: { food: 8, morale: 8 },
    isPositive: true,
  },
  {
    name: 'Создавал системы жизнеобеспечения',
    emoji: '🏭',
    bonus: { energy: 15 },
    isPositive: true,
  },
  { name: 'Владеет 5 языками', emoji: '🌐', bonus: { morale: 8 }, isPositive: true },
  { name: 'Бывший заключённый', emoji: '⛓️', bonus: { morale: -8, energy: 5 }, isPositive: false },
  {
    name: 'Имеет хронический конфликт с коллегами',
    emoji: '😠',
    bonus: { morale: -10 },
    isPositive: false,
  },
  {
    name: 'Отличник и перфекционист',
    emoji: '🎓',
    bonus: { morale: 5, medicine: 5 },
    isPositive: true,
  },
  {
    name: 'Богатый инвестор (без полезных навыков)',
    emoji: '💰',
    bonus: { morale: -5 },
    isPositive: false,
  },
  {
    name: 'Прожил год в изоляции',
    emoji: '🏔️',
    bonus: { morale: 10, energy: 5 },
    isPositive: true,
  },
  {
    name: 'Прошёл курсы тактической медицины',
    emoji: '🩹',
    bonus: { medicine: 14, energy: 4 },
    isPositive: true,
  },
  { name: 'Жил в автономном доме', emoji: '🏡', bonus: { energy: 10, water: 8 }, isPositive: true },
  {
    name: 'Умеет чинить фильтры воды',
    emoji: '💧',
    bonus: { water: 14, energy: 4 },
    isPositive: true,
  },
  {
    name: 'Организовывал гуманитарные миссии',
    emoji: '📦',
    bonus: { morale: 12, food: 4 },
    isPositive: true,
  },
  {
    name: 'Работал в тепличном комплексе',
    emoji: '🌿',
    bonus: { food: 14, water: 4 },
    isPositive: true,
  },
  { name: 'Служил связистом', emoji: '📡', bonus: { energy: 10, morale: 5 }, isPositive: true },
  {
    name: 'Вырос в деревне без удобств',
    emoji: '🚜',
    bonus: { food: 8, water: 6, morale: 4 },
    isPositive: true,
  },
  {
    name: 'Участвовал в арктической зимовке',
    emoji: '🧊',
    bonus: { energy: 8, morale: 8 },
    isPositive: true,
  },
  {
    name: 'Был волонтёром Красного Креста',
    emoji: '⛑️',
    bonus: { medicine: 12, morale: 6 },
    isPositive: true,
  },
  {
    name: 'Собирал тревожные рюкзаки до катастрофы',
    emoji: '🎒',
    bonus: { food: 6, water: 6, energy: 6 },
    isPositive: true,
  },
  {
    name: 'Работал диспетчером кризисного центра',
    emoji: '☎️',
    bonus: { morale: 10, energy: 4 },
    isPositive: true,
  },
  {
    name: 'Имеет опыт жизни на подлодке',
    emoji: '🚢',
    bonus: { morale: 10, energy: 5 },
    isPositive: true,
  },
  {
    name: 'Проходил курсы химзащиты',
    emoji: '☣️',
    bonus: { medicine: 10, water: 5 },
    isPositive: true,
  },
  {
    name: 'Умеет добывать огонь без спичек',
    emoji: '🔥',
    bonus: { energy: 10, morale: 3 },
    isPositive: true,
  },
  {
    name: 'Был старостой спасательного лагеря',
    emoji: '🏕️',
    bonus: { morale: 12, food: 3 },
    isPositive: true,
  },
  {
    name: 'Долги и криминальные связи',
    emoji: '💸',
    bonus: { morale: -10, energy: 4 },
    isPositive: false,
  },
  {
    name: 'Склонен скрывать важную информацию',
    emoji: '🤐',
    bonus: { morale: -8 },
    isPositive: false,
  },
  {
    name: 'Сбежал из секты выживальщиков',
    emoji: '🕯️',
    bonus: { morale: -5, food: 5, energy: 5 },
    isPositive: false,
  },
  {
    name: 'Потерял семью в первые дни катастрофы',
    emoji: '🖤',
    bonus: { morale: -10, energy: 3 },
    isPositive: false,
  },
  {
    name: 'Имеет репутацию мародёра',
    emoji: '🪓',
    bonus: { food: 5, morale: -12 },
    isPositive: false,
  },
];

// ─── События выживания ────────────────────────────────────────────────────────

export const SURVIVAL_EVENTS: SurvivalEvent[] = [
  {
    title: 'Прорыв трубы',
    description:
      'Водопроводная труба лопнула из-за перепада давления. Часть запасов воды потеряна.',
    emoji: '🚰',
    effect: { water: -20 },
    positive: false,
  },
  {
    title: 'Пожар в генераторной',
    description: 'Короткое замыкание вызвало возгорание. Команда едва успела потушить.',
    emoji: '🔥',
    effect: { energy: -20 },
    positive: false,
  },
  {
    title: 'Заражение продовольствия',
    description: 'Плесень поразила часть продовольственных запасов. Их пришлось уничтожить.',
    emoji: '🍄',
    effect: { food: -20 },
    positive: false,
  },
  {
    title: 'Паника в бункере',
    description: 'Кто-то нашёл скрытые факты о запасах. Напряжение переросло в конфликт.',
    emoji: '😰',
    effect: { morale: -20 },
    positive: false,
  },
  {
    title: 'Вирус распространяется',
    description: 'Один из выживших заболел. Команда вынуждена потратить медикаменты.',
    emoji: '🤒',
    effect: { medicine: -20, morale: -5 },
    positive: false,
  },
  {
    title: 'Сбой вентиляции',
    description: 'Система воздухообмена дала сбой. Техники трудятся круглосуточно.',
    emoji: '💨',
    effect: { energy: -15, morale: -5 },
    positive: false,
  },
  {
    title: 'Найдены дополнительные запасы',
    description: 'В техническом отсеке обнаружен забытый склад с консервами и водой.',
    emoji: '🎁',
    effect: { food: 15, water: 10 },
    positive: true,
  },
  {
    title: 'Самодельный генератор',
    description: 'Умельцы из команды собрали запасной генератор из подручных материалов.',
    emoji: '⚡',
    effect: { energy: 15 },
    positive: true,
  },
  {
    title: 'Медицинское открытие',
    description: 'Один из специалистов разработал средство против местного заражения.',
    emoji: '💉',
    effect: { medicine: 15, morale: 5 },
    positive: true,
  },
  {
    title: 'Психологический кризис',
    description: 'Несколько людей впали в депрессию от замкнутого пространства.',
    emoji: '😢',
    effect: { morale: -15 },
    positive: false,
  },
  {
    title: 'Успешная вылазка',
    description: 'Разведчики вернулись с добычей. Опасность того стоила.',
    emoji: '🎒',
    effect: { food: 12, medicine: 8 },
    positive: true,
  },
  {
    title: 'Внешнее нападение отражено',
    description: 'Группа пытавшихся проникнуть в бункер отброшена. Но это дало нам o себе знать.',
    emoji: '🛡️',
    effect: { energy: -10, morale: -10 },
    positive: false,
  },
];

// ─── Возраст ──────────────────────────────────────────────────────────────────

function randomAge(): number {
  // Weighted: mostly adults 25-55
  const ranges = [
    { min: 18, max: 25, weight: 10 },
    { min: 25, max: 45, weight: 50 },
    { min: 45, max: 60, weight: 30 },
    { min: 60, max: 80, weight: 10 },
  ];
  const total = ranges.reduce((s, r) => s + r.weight, 0);
  let rnd = Math.random() * total;
  for (const { min, max, weight } of ranges) {
    rnd -= weight;
    if (rnd <= 0) return Math.floor(min + Math.random() * (max - min));
  }
  return 35;
}

// ─── Генерация персонажа ──────────────────────────────────────────────────────

// ALL_TRAIT_KEYS is imported from types.ts (canonical source)

// How many traits to reveal after round 1 (rounds 2…N).
// Must be ≤ ALL_TRAIT_KEYS.length (6). Currently 4 → 5 total rounds.
const TRAITS_TO_REVEAL = 4;

export function generateCharacter(playerName: string): BunkerCharacter {
  const revealOrder = shuffle<TraitKey>([...ALL_TRAIT_KEYS]).slice(0, TRAITS_TO_REVEAL);

  return {
    playerName,
    age: randomAge(),
    gender: Math.random() > 0.5 ? 'М' : 'Ж',
    profession: pickRandom(PROFESSIONS),
    health: pickRandom(HEALTH_CONDITIONS),
    hobby: pickRandom(HOBBIES),
    phobia: pickRandom(PHOBIAS),
    trait: pickRandom(TRAITS),
    item: pickRandom(ITEMS),
    specialFact: pickRandom(SPECIAL_FACTS),
    revealOrder,
  };
}

// ─── Расчёт выживания ─────────────────────────────────────────────────────────

export function calculateSurvival(
  bunkerTeam: BunkerCharacter[],
  scenario: CatastropheScenario,
  events: SurvivalEvent[]
): { resources: BunkerResources; outcome: 'full_victory' | 'partial' | 'pyrrhic' | 'defeat' } {
  const base: BunkerResources = { food: 100, water: 100, medicine: 100, energy: 100, morale: 100 };

  // Apply scenario penalty
  applyBonus(base, scenario.resourcePenalty);

  // Apply team bonuses (scaled by team size to avoid stacking)
  const teamScale = Math.max(0.4, 1 - (bunkerTeam.length - 2) * 0.08);
  for (const char of bunkerTeam) {
    const attrs = [
      char.profession,
      char.health,
      char.hobby,
      char.trait,
      char.item,
      char.specialFact,
      char.phobia,
    ];
    for (const attr of attrs) {
      applyBonusScaled(base, attr.bonus, teamScale);
    }
  }

  // Apply random events
  for (const event of events) {
    applyBonus(base, event.effect);
  }

  // Clamp to [0, 100]
  (Object.keys(base) as ResourceKey[]).forEach((k) => {
    base[k] = Math.max(0, Math.min(100, Math.round(base[k])));
  });

  // Determine outcome
  const values = Object.values(base);
  const criticalCount = values.filter((v) => v <= 0).length;
  const lowCount = values.filter((v) => v < 20).length;
  const goodCount = values.filter((v) => v >= 40).length;

  let outcome: 'full_victory' | 'partial' | 'pyrrhic' | 'defeat';
  if (criticalCount >= 1) {
    outcome = 'defeat';
  } else if (lowCount >= 3) {
    outcome = 'pyrrhic';
  } else if (goodCount >= 3) {
    outcome = 'full_victory';
  } else {
    outcome = 'partial';
  }

  return { resources: base, outcome };
}

function applyBonus(res: BunkerResources, bonus: Partial<BunkerResources>): void {
  (Object.entries(bonus) as [ResourceKey, number][]).forEach(([k, v]) => {
    res[k] += v;
  });
}

function applyBonusScaled(
  res: BunkerResources,
  bonus: Partial<BunkerResources>,
  scale: number
): void {
  (Object.entries(bonus) as [ResourceKey, number][]).forEach(([k, v]) => {
    res[k] += Math.round(v * scale);
  });
}
