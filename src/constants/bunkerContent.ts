import type {
    AttributeEntry,
    BunkerCharacter,
    BunkerResources,
    CatastropheScenario, ResourceBonus,
    ResourceKey,
    SurvivalEvent,
    TraitKey,
} from '../games/BunkerGame/types';
import {ALL_TRAIT_KEYS} from '../games/BunkerGame/types';
import {pickRandom, shuffle} from '../utils/random';

export const BUNKER_MODES = {
    CLASSIC: 'classic',
    DICTATOR: 'dictator',
    TRIBUNAL: 'tribunal',
} as const;

// ─── Катастрофы ───────────────────────────────────────────────────────────────

export const CATASTROPHE_SCENARIOS: CatastropheScenario[] = [
    {
        title: 'Ядерная война',
        emoji: '☢️',
        description:
            'Сверхдержавы обменялись ракетными ударами. Города в руинах, радиация накрывает полушарие. Бункер рассчитан на 3 года.',
        resourcePenalty: {food: -15, water: -10},
    },
    {
        title: 'Пандемия нового вируса',
        emoji: '🦠',
        description:
            'Мутировавший патоген с летальностью 94%. Вакцина не разработана. В живых остались единицы — и они бегут к укрытиям.',
        resourcePenalty: {medicine: -20, morale: -10},
    },
    {
        title: 'Извержение супервулкана',
        emoji: '🌋',
        description:
            'Йеллоустоун проснулся. Вулканический пепел закрыл солнце на десятилетие. Температура упала на 12°C. Сельское хозяйство уничтожено.',
        resourcePenalty: {food: -20, energy: -29},
    },
    {
        title: 'Падение астероида',
        emoji: '☄️',
        description:
            'Объект диаметром 2 км столкнулся с Землёй. Ударная волна, цунами, ядерная зима. Поверхность стала непригодной для жизни.',
        resourcePenalty: {food: -15, water: -15},
    },
    {
        title: 'Восстание ИИ',
        emoji: '🤖',
        description:
            'Сеть AGI-систем вышла из-под контроля и взяла управление инфраструктурой. Электросети отключены. Дроны охотятся на выживших.',
        resourcePenalty: {energy: -25, morale: -10},
    },
    {
        title: 'Глобальный потоп',
        emoji: '🌊',
        description:
            'Антарктические ледники рухнули разом. Океан поглотил прибрежные зоны. 80% суши под водой. Питьевая вода парадоксально в дефиците.',
        resourcePenalty: {food: -20, energy: -29},
    },
    {
        title: 'Химическая атака',
        emoji: '☣️',
        description:
            'Террористы распылили нервно-паралитическое вещество VX в атмосфере. Воздух над городами смертоносен. Укрытия — единственный шанс.',
        resourcePenalty: {medicine: -20, water: -15},
    },
    {
        title: 'Ядерная зима',
        emoji: '🌫️',
        description:
            'После серии взрывов облако пыли накрыло планету. Температура упала ниже нуля даже на экваторе. Урожаи уничтожены навсегда.',
        resourcePenalty: {food: -25, energy: -29},
    },
    {
        title: 'Магнитная буря',
        emoji: '🌐',
        description:
            'Вспышка класса X42 уничтожила электронику по всему миру. Цивилизация рухнула за сутки. Хаос, мародёрство, войны за ресурсы.',
        resourcePenalty: {energy: -44, morale: -15},
    },
    {
        title: 'Биологический теракт',
        emoji: '🧫',
        description:
            'Инженерный прионный вирус распространился через водопровод. Поражает нервную систему. Противоядие не найдено.',
        resourcePenalty: {medicine: -25, water: -10},
    },
    {
        title: 'Зомби-апокалипсис',
        emoji: '🧟',
        description:
            'Кордицепс-мутант поразил 40% населения. Инфицированные агрессивны и неуправляемы. Поверхность смертельно опасна.',
        resourcePenalty: {morale: -20, food: -10},
    },
    {
        title: 'Солнечная катастрофа',
        emoji: '🌞',
        description:
            'Солнечная вспышка сожгла озоновый слой. УФ-радиация на поверхности летальна. Дневной свет — смерть.',
        resourcePenalty: {energy: -15, food: -15},
    },
    {
        title: 'Инопланетное вторжение',
        emoji: '👽',
        description:
            'Зонды-разведчики уничтожают крупные объекты. Военные бессильны. Сигнал "уйдите под землю" прозвучал по всем каналам.',
        resourcePenalty: {morale: -25, energy: -29},
    },
    {
        title: 'Взрыв АЭС',
        emoji: '💥',
        description:
            'Каскадный взрыв 12 реакторов после теракта. Европа накрыта радиоактивным облаком. Уровень радиации несовместим с жизнью на поверхности.',
        resourcePenalty: {medicine: -15, food: -15},
    },
    {
        title: 'Нанотехнологическая катастрофа',
        emoji: '⚗️',
        description:
            'Серые нанороботы вышли из лабораторий и поглощают органику. Поверхность Земли превращается в серую слизь.',
        resourcePenalty: {food: -20, medicine: -10},
    },
    {
        title: 'Глобальная засуха',
        emoji: '🏜️',
        description:
            'Осадки исчезли на годы. Реки высохли, водохранилища опустели, урожаи погибли. Вода стала дороже золота.',
        resourcePenalty: {water: -25, food: -15},
    },
    {
        title: 'Ледниковый период',
        emoji: '🧊',
        description:
            'Температура по всей планете стремительно падает. Метели не прекращаются месяцами. Выживают только те, у кого есть тепло и запасы.',
        resourcePenalty: {energy: -25, food: -10},
    },
    {
        title: 'Глобальное землетрясение',
        emoji: '🌍',
        description:
            'Серия тектонических разломов разрушила города и инфраструктуру. Тоннели обрушены, линии снабжения уничтожены.',
        resourcePenalty: {energy: -15, morale: -15},
    },
    {
        title: 'Цепочка цунами',
        emoji: '🌊',
        description:
            'Подводные разломы вызвали волну гигантских цунами. Прибрежные мегаполисы смыты, связь с внешним миром потеряна.',
        resourcePenalty: {water: -10, food: -20},
    },
    {
        title: 'Супершторм',
        emoji: '🌪️',
        description:
            'Атмосфера вошла в хаотический режим. Ураганы и торнадо возникают ежедневно, разрушая всё на поверхности.',
        resourcePenalty: {energy: -44, morale: -10},
    },
    {
        title: 'Кислотные дожди',
        emoji: '🌧️',
        description:
            'Химические выбросы превратили осадки в едкую кислоту. Открытые поверхности разрушаются, вода загрязнена.',
        resourcePenalty: {water: -20, medicine: -10},
    },
    {
        title: 'Токсичный смог',
        emoji: '😷',
        description:
            'Города укрыты плотным слоем ядовитого смога. Дыхание без фильтра смертельно, а вентиляция быстро выходит из строя.',
        resourcePenalty: {medicine: -15, energy: -15},
    },
    {
        title: 'Коллапс экосистемы',
        emoji: '🐜',
        description:
            'Массовое вымирание насекомых и растений обрушило пищевые цепочки. Фермы пусты, животные гибнут, природа мертвеет.',
        resourcePenalty: {food: -25, morale: -10},
    },
    {
        title: 'Грибковая чума',
        emoji: '🍄',
        description:
            'Агрессивный грибок заражает людей, животных и запасы пищи. Споры проникают даже в защищённые помещения.',
        resourcePenalty: {food: -15, medicine: -20},
    },
    {
        title: 'Паразитарная инвазия',
        emoji: '🪱',
        description:
            'Новый вид паразитов распространяется через воду и кровь. Болезнь развивается скрытно, а лечение почти не помогает.',
        resourcePenalty: {medicine: -20, water: -10},
    },
    {
        title: 'Генетическая мутация',
        emoji: '🧬',
        description:
            'Неудачный эксперимент изменил ДНК вирусов и людей. Рождаются нестабильные формы жизни, иммунитет человечества бесполезен.',
        resourcePenalty: {medicine: -25, morale: -10},
    },
    {
        title: 'Побег лабораторных существ',
        emoji: '🧪',
        description:
            'Из биолабораторий вырвались экспериментальные организмы. Они быстро размножаются и атакуют всё живое.',
        resourcePenalty: {morale: -20, medicine: -10},
    },
    {
        title: 'Массовое безумие',
        emoji: '🌀',
        description:
            'Неизвестный психотропный фактор вызывает агрессию, бред и саморазрушение. Никому нельзя доверять полностью.',
        resourcePenalty: {morale: -25, medicine: -10},
    },
    {
        title: 'Гражданская война за ресурсы',
        emoji: '⚔️',
        description:
            'Государства распались, вооружённые группировки делят склады и источники воды. Любой выход наружу — смертельный риск.',
        resourcePenalty: {morale: -25, food: -10},
    },
    {
        title: 'Мировой энергетический крах',
        emoji: '🔌',
        description:
            'Топливо закончилось, энергосети обрушились, резервные станции молчат. Мир откатился на столетия назад за одну неделю.',
        resourcePenalty: {energy: -30, morale: -25},
    },
    {
        title: 'Обвал финансовой системы',
        emoji: '💸',
        description:
            'Валюта и логистика потеряли смысл. Паника, мародёрство и голод уничтожили общественный порядок быстрее любой войны.',
        resourcePenalty: {food: -15, morale: -20},
    },
    {
        title: 'Киберапокалипсис',
        emoji: '💻',
        description:
            'Вредоносная сеть стерла данные, отключила спутники и взломала критическую инфраструктуру. Автоматика стала опаснее людей.',
        resourcePenalty: {energy: -44, morale: -15},
    },
    {
        title: 'Орбитальная бомбардировка',
        emoji: '🛰️',
        description:
            'Автономные военные спутники начали наносить удары по тепловым и радиосигнатурам. Любая активность на поверхности выдаёт укрытие.',
        resourcePenalty: {morale: -20, energy: -15},
    },
    {
        title: 'Падение спутниковой сети',
        emoji: '📡',
        description:
            'Тысячи спутников сошли с орбиты и вызвали цепные разрушения. Навигация, связь и разведка больше не работают.',
        resourcePenalty: {energy: -15, morale: -15},
    },
    {
        title: 'Лунная пыль',
        emoji: '🌕',
        description:
            'После аварии на орбитальном комплексе атмосферу накрыло облаком абразивной пыли. Фильтры забиваются за считаные дни.',
        resourcePenalty: {energy: -15, medicine: -15},
    },
    {
        title: 'Разлом магнитосферы',
        emoji: '🧲',
        description:
            'Защита Земли ослабла, космическое излучение проникает к поверхности. Болезни, ожоги и отказ техники стали нормой.',
        resourcePenalty: {medicine: -20, energy: -29},
    },
    {
        title: 'Метеоритный дождь',
        emoji: '🌠',
        description:
            'Рой обломков проходит через атмосферу сутками. Пожары, разрушения и пробоины делают поверхность непригодной.',
        resourcePenalty: {morale: -20, food: -10},
    },
    {
        title: 'Чёрный снег',
        emoji: '🖤',
        description:
            'Неизвестные частицы выпадают в виде тёмного снега. Они заражают воду, почву и лёгкие, постепенно убивая всё живое.',
        resourcePenalty: {water: -20, medicine: -15},
    },
    {
        title: 'Аномалия времени',
        emoji: '⏳',
        description:
            'Во многих регионах время течёт нестабильно. Люди исчезают, техника ломается, а прогнозировать последствия невозможно.',
        resourcePenalty: {morale: -20, energy: -29},
    },
    {
        title: 'Гравитационные сбои',
        emoji: '🪐',
        description:
            'Локальные всплески гравитации рушат здания и ломают механизмы. Перемещение по поверхности стало почти невозможным.',
        resourcePenalty: {morale: -20, energy: -29},
    },
    {
        title: 'Темная материя в атмосфере',
        emoji: '🌌',
        description:
            'Неизвестное космическое вещество взаимодействует с биологией и техникой. Приборы сходят с ума, а люди слабеют без причин.',
        resourcePenalty: {medicine: -15, energy: -15},
    },
    {
        title: 'Религиозный экстремизм',
        emoji: '🔥',
        description:
            'После катастрофы мир погрузился в фанатизм. Культы охотятся на выживших и уничтожают убежища «неверных».',
        resourcePenalty: {morale: -20, food: -5},
    },
    {
        title: 'Вторжение мутировавшей фауны',
        emoji: '🐺',
        description:
            'Животные изменились под воздействием среды и стали агрессивнее в десятки раз. Поверхность принадлежит новым хищникам.',
        resourcePenalty: {morale: -20, food: -10},
    },
    {
        title: 'Океаническая инфекция',
        emoji: '🪼',
        description:
            'Мировой океан заражён биолюминесцентной бактерией, выделяющей токсины. Рыба мертва, испарения отравляют побережья.',
        resourcePenalty: {water: -20, food: -15},
    },
    {
        title: 'Исчезновение Солнца',
        emoji: '🌑',
        description:
            'Светило внезапно скрылось за неизвестной космической аномалией. Темнота, холод и паника охватили планету за считаные часы.',
        resourcePenalty: {energy: -25, morale: -20},
    },
    {
        title: 'Парадокс реальности',
        emoji: '🧩',
        description:
            'Законы физики начали конфликтовать сами с собой. Объекты исчезают при наблюдении, причинно-следственные связи нестабильны.',
        resourcePenalty: { morale: -20, energy: -15 },
    },
    {
        title: 'Глобальный сбой памяти',
        emoji: '🧠',
        description:
            'Люди массово теряют воспоминания последних лет. Навыки и знания исчезают без объяснения.',
        resourcePenalty: { morale: -25, medicine: -10 },
    },
    {
        title: 'Солнечный шторм ультра-класса',
        emoji: '🌞',
        description:
            'Повторная вспышка выводит из строя остатки электроники. Электросети не подлежат восстановлению.',
        resourcePenalty: { energy: -40, morale: -10 },
    },
    {
        title: 'Гравитационный шторм',
        emoji: '🪐',
        description:
            'Гравитация нестабильна: предметы становятся легче или тяжелее без предупреждения.',
        resourcePenalty: { energy: -25, morale: -15 },
    },
    {
        title: 'Тихая эпидемия сна',
        emoji: '😴',
        description:
            'Люди засыпают и не просыпаются сутками. Бункеры перегружены спящими.',
        resourcePenalty: { morale: -20, food: -10 },
    },
    {
        title: 'Разрушение озонового слоя',
        emoji: '☀️',
        description:
            'Поверхность стала смертельной из-за ультрафиолета. Даже краткий выход опасен.',
        resourcePenalty: { energy: -15, medicine: -10 },
    },
    {
        title: 'Психоакустический феномен',
        emoji: '🔊',
        description:
            'Низкочастотные звуки вызывают панические атаки и агрессию у выживших.',
        resourcePenalty: { morale: -30, medicine: -10 },
    },
    {
        title: 'Саморазрушение инфраструктуры',
        emoji: '🏗️',
        description:
            'Здания и мосты начинают разрушаться без внешних причин. Металл теряет прочность.',
        resourcePenalty: { energy: -20, morale: -15 },
    },
    {
        title: 'Орбитальный коллапс',
        emoji: '🛰️',
        description:
            'Спутники сталкиваются друг с другом, создавая каскад обломков на орбите.',
        resourcePenalty: { energy: -25, morale: -10 },
    },
    {
        title: 'Сбой биоритмов',
        emoji: '⏰',
        description:
            'У людей сбивается цикл сна и бодрствования. Коллективная дезориентация.',
        resourcePenalty: { morale: -20, energy: -10 },
    },

    {
        title: 'Микропластиковая буря',
        emoji: '🧴',
        description:
            'Атмосфера насыщена микрочастицами пластика. Фильтры быстро забиваются.',
        resourcePenalty: { water: -15, medicine: -10 },
    },
    {
        title: 'Кислородный дефицит',
        emoji: '🌬️',
        description:
            'Концентрация кислорода в атмосфере падает. Дыхание становится затруднённым.',
        resourcePenalty: { energy: -20, medicine: -10 },
    },
    {
        title: 'Аномальные осадки металла',
        emoji: '⚙️',
        description:
            'С неба падают частицы тяжёлых металлов. Почва и вода загрязнены.',
        resourcePenalty: { water: -20, food: -10 },
    },
    {
        title: 'Сбой магнитных полей человека',
        emoji: '🧲',
        description:
            'Люди теряют ориентацию и чувство направления. Навигация внутри бункера нарушена.',
        resourcePenalty: { morale: -15, energy: -10 },
    },
    {
        title: 'Генерация ложных воспоминаний',
        emoji: '🪞',
        description:
            'Мозг создаёт несуществующие события. Конфликты внутри группы усиливаются.',
        resourcePenalty: { morale: -25, medicine: -10 },
    },

    {
        title: 'Гиперинфляция ресурсов',
        emoji: '📉',
        description:
            'Ресурсы теряют ценность внутри системы обмена. Паника в распределении запасов.',
        resourcePenalty: { food: -15, morale: -20 },
    },
    {
        title: 'Разрыв интернет-реальности',
        emoji: '🌐',
        description:
            'Сеть и реальность перестали синхронизироваться. Данные больше не соответствуют миру.',
        resourcePenalty: { energy: -20, morale: -15 },
    },
    {
        title: 'Синдром коллективной агрессии',
        emoji: '🧨',
        description:
            'Малейшие конфликты перерастают в насилие. Социальная структура рушится.',
        resourcePenalty: { morale: -35, medicine: -10 },
    },
    {
        title: 'Обратное старение материи',
        emoji: '🧬',
        description:
            'Материалы деградируют в обратном порядке. Постройки теряют форму.',
        resourcePenalty: { energy: -25, food: -10 },
    },
    {
        title: 'Термодинамический сбой',
        emoji: '🔥',
        description:
            'Температура в закрытых системах становится непредсказуемой.',
        resourcePenalty: { energy: -30, medicine: -10 },
    },

    {
        title: 'Потеря гравитационного центра Земли',
        emoji: '🌍',
        description:
            'Объекты начинают вести себя так, будто центр массы смещён.',
        resourcePenalty: { energy: -25, morale: -15 },
    },
    {
        title: 'Сдвиг тектонических плит ускоряется',
        emoji: '🌋',
        description:
            'Земная кора становится нестабильной. Подземные убежища трещат.',
        resourcePenalty: { energy: -20, food: -10 },
    },
    {
        title: 'Биолюминесцентная вспышка',
        emoji: '✨',
        description:
            'Все живые организмы начинают светиться, привлекая хищников.',
        resourcePenalty: { morale: -20, medicine: -10 },
    },
    {
        title: 'Разрушение языка',
        emoji: '🗣️',
        description:
            'Люди начинают забывать слова. Коммуникация становится невозможной.',
        resourcePenalty: { morale: -30, medicine: -10 },
    },
    {
        title: 'Эхо будущего',
        emoji: '📡',
        description:
            'Сигналы из будущего вмешиваются в настоящее, создавая хаос решений.',
        resourcePenalty: { morale: -20, energy: -15 },
    },

    {
        title: 'Инверсия сна и бодрствования',
        emoji: '🌙',
        description:
            'Днём люди спят, ночью активны. Производственные циклы рушатся.',
        resourcePenalty: { energy: -20, food: -10 },
    },
    {
        title: 'Пылевая биосфера',
        emoji: '🌫️',
        description:
            'Пыль становится носителем органических процессов. Она “живёт”.',
        resourcePenalty: { food: -20, medicine: -10 },
    },
    {
        title: 'Сбой химических реакций',
        emoji: '⚗️',
        description:
            'Привычные химические процессы перестают работать стабильно.',
        resourcePenalty: { medicine: -25, energy: -15 },
    },
    {
        title: 'Глобальная тишина',
        emoji: '🔇',
        description:
            'Звук исчезает в атмосфере. Коммуникация и координация нарушены.',
        resourcePenalty: { morale: -20, energy: -10 },
    },
    {
        title: 'Распад социальных связей',
        emoji: '🧑‍🤝‍🧑',
        description:
            'Люди теряют доверие даже к близким. Группы распадаются.',
        resourcePenalty: { morale: -35, food: -10 },
    },

    {
        title: 'Кристаллизация воды в атмосфере',
        emoji: '❄️',
        description:
            'Вода начинает кристаллизоваться в воздухе. Осадки опасны.',
        resourcePenalty: { water: -25, energy: -10 },
    },
    {
        title: 'Временные петли локального уровня',
        emoji: '⏳',
        description:
            'Некоторые события повторяются снова и снова без объяснения.',
        resourcePenalty: { morale: -20, energy: -15 },
    },
    {
        title: 'Сбой иммунной системы планеты',
        emoji: '🧫',
        description:
            'Биосфера больше не регулирует патогены. Болезни распространяются свободно.',
        resourcePenalty: { medicine: -30, food: -10 },
    },
    {
        title: 'Гравитационный шум',
        emoji: '📶',
        description:
            'Гравитация колеблется волнами, вызывая хаотичные падения объектов.',
        resourcePenalty: { energy: -20, morale: -10 },
    },
    {
        title: 'Исчезновение микрожизни',
        emoji: '🔬',
        description:
            'Бактерии и микробы исчезли. Экосистемы начинают рушиться.',
        resourcePenalty: { food: -25, medicine: -10 },
    },
];

const PROFESSIONS: AttributeEntry[] = [
    {name: 'Хирург', emoji: '🩺', tier: 'S', bonus: {medicine: 25, morale: 5}, isPositive: true},
    {name: 'Инженер-энергетик', emoji: '⚡', tier: 'S', bonus: {energy: 25, food: 5}, isPositive: true},
    {name: 'Агроном', emoji: '🌾', tier: 'S', bonus: {food: 25, water: 5}, isPositive: true},
    {name: 'Психолог', emoji: '🧠', tier: 'A', bonus: {morale: 20, energy: 5}, isPositive: true},
    {name: 'Военный офицер', emoji: '🎖️', tier: 'A', bonus: {morale: 10, energy: 10, food: 5}, isPositive: true},
    {name: 'Эпидемиолог', emoji: '🔬', tier: 'A', bonus: {medicine: 20, food: 5}, isPositive: true},
    {name: 'Медсестра', emoji: '💊', tier: 'A', bonus: {medicine: 15, morale: 10}, isPositive: true},
    {name: 'Повар-шеф', emoji: '👨‍🍳', tier: 'B', bonus: {food: 15, morale: 8}, isPositive: true},
    {name: 'Охранник', emoji: '🛡️', tier: 'B', bonus: {morale: 10, energy: 8}, isPositive: true},
    {name: 'Механик', emoji: '🔧', tier: 'B', bonus: {energy: 15, food: 5}, isPositive: true},
    {name: 'Учёный-биолог', emoji: '🧬', tier: 'B', bonus: {medicine: 12, food: 5}, isPositive: true},
    {name: 'Учитель', emoji: '📚', tier: 'C', bonus: {morale: 12}, isPositive: true},
    {name: 'Программист', emoji: '💻', tier: 'C', bonus: {energy: 10}, isPositive: true},
    {name: 'Юрист', emoji: '⚖️', tier: 'C', bonus: {morale: 8}, isPositive: true},
    {name: 'Блогер-инфлюенсер', emoji: '📱', tier: 'C', bonus: {morale: 5}, isPositive: true},
    {name: 'Священник', emoji: '✝️', tier: 'C', bonus: {morale: 10}, isPositive: true},
    {name: 'Полицейский', emoji: '👮', tier: 'B', bonus: {morale: 12, energy: 5}, isPositive: true},
    {name: 'Биохимик', emoji: '🧪', tier: 'A', bonus: {medicine: 18, water: 5}, isPositive: true},
    {name: 'Терапевт', emoji: '🩹', tier: 'A', bonus: {medicine: 16, morale: 6}, isPositive: true},
    {name: 'Анестезиолог', emoji: '😴', tier: 'A', bonus: {medicine: 18, energy: 4}, isPositive: true},
    {name: 'Лаборант', emoji: '🧫', tier: 'B', bonus: {medicine: 12, water: 4}, isPositive: true},
    {name: 'Стоматолог', emoji: '🦷', tier: 'B', bonus: {medicine: 10, morale: 4}, isPositive: true},
    {name: 'Фармацевт', emoji: '💊', tier: 'A', bonus: {medicine: 17, food: 3}, isPositive: true},
    {name: 'Генетик', emoji: '🧬', tier: 'A', bonus: {medicine: 16, morale: 4}, isPositive: true},
    {name: 'Микробиолог', emoji: '🦠', tier: 'A', bonus: {medicine: 18, water: 3}, isPositive: true},
    {name: 'Сварщик', emoji: '🔥', tier: 'B', bonus: {energy: 14, water: 4}, isPositive: true},
    {name: 'Шахтёр', emoji: '⛏️', tier: 'B', bonus: {energy: 12, food: 4}, isPositive: true},
    {name: 'Геолог', emoji: '🪨', tier: 'B', bonus: {water: 10, energy: 5}, isPositive: true},
    {name: 'Метеоролог', emoji: '🌦️', tier: 'C', bonus: {morale: 6, water: 6}, isPositive: true},
    {name: 'Лесник', emoji: '🌲', tier: 'B', bonus: {food: 12, energy: 4}, isPositive: true},
    {name: 'Пасечник', emoji: '🐝', tier: 'C', bonus: {food: 8, morale: 5}, isPositive: true},
    {name: 'Пекарь', emoji: '🥖', tier: 'B', bonus: {food: 12, morale: 5}, isPositive: true},
    {name: 'Диетолог', emoji: '🥗', tier: 'C', bonus: {food: 8, medicine: 5}, isPositive: true},
    {name: 'Социальный работник', emoji: '🤝', tier: 'B', bonus: {morale: 14}, isPositive: true},
    {name: 'Переводчик', emoji: '🌐', tier: 'C', bonus: {morale: 7, water: 3}, isPositive: true},
    {name: 'Тактик', emoji: '🗺️', tier: 'A', bonus: {morale: 10, energy: 8, water: 4}, isPositive: true},
    {name: 'Инженер по вентиляции', emoji: '🌀', tier: 'A', bonus: {energy: 16, medicine: 4}, isPositive: true},
    {name: 'Кладовщик', emoji: '📦', tier: 'B', bonus: {food: 8, water: 8, morale: 3}, isPositive: true},
    {name: 'Ветеринар', emoji: '🐕', tier: 'A', bonus: {medicine: 14, food: 4}, isPositive: true},
    {name: 'Пожарный', emoji: '🚒', tier: 'A', bonus: {energy: 15, morale: 5}, isPositive: true},
    {name: 'Спасатель МЧС', emoji: '🆘', tier: 'S', bonus: {energy: 18, morale: 8}, isPositive: true},
    {name: 'Архитектор', emoji: '🏛️', tier: 'B', bonus: {energy: 10, morale: 4}, isPositive: true},
    {name: 'Строитель', emoji: '🧱', tier: 'A', bonus: {energy: 15, water: 4}, isPositive: true},
    {name: 'Сантехник', emoji: '🚰', tier: 'A', bonus: {water: 18}, isPositive: true},
    {name: 'Фермер', emoji: '🚜', tier: 'S', bonus: {food: 20, water: 5}, isPositive: true},
    {name: 'Зоотехник', emoji: '🐄', tier: 'B', bonus: {food: 12, morale: 4}, isPositive: true},
    {name: 'Кинолог', emoji: '🐕‍🦺', tier: 'B', bonus: {morale: 8, food: 5}, isPositive: true},
    {name: 'Пилот гражданской авиации', emoji: '✈️', tier: 'B', bonus: {morale: 8, energy: 6}, isPositive: true},
    {name: 'Диспетчер авиасообщения', emoji: '🎧', tier: 'B', bonus: {morale: 8, energy: 6}, isPositive: true},
    {name: 'Капитан дальнего плавания', emoji: '🚢', tier: 'A', bonus: {water: 12, morale: 6}, isPositive: true},
    {name: 'Моряк', emoji: '⚓', tier: 'B', bonus: {water: 10, energy: 6}, isPositive: true},
    {name: 'Водолаз', emoji: '🤿', tier: 'A', bonus: {water: 14, energy: 5}, isPositive: true},
    {name: 'Океанолог', emoji: '🌊', tier: 'B', bonus: {water: 12, medicine: 4}, isPositive: true},
    {name: 'Химик', emoji: '⚗️', tier: 'A', bonus: {medicine: 16, water: 4}, isPositive: true},
    {name: 'Физик', emoji: '🔭', tier: 'B', bonus: {energy: 12, morale: 3}, isPositive: true},
    {name: 'Инженер-робототехник', emoji: '🤖', tier: 'A', bonus: {energy: 18}, isPositive: true},
    {name: 'Системный администратор', emoji: '🖥️', tier: 'C', bonus: {energy: 10, morale: 2}, isPositive: true},
    {name: 'Специалист по кибербезопасности', emoji: '🔐', tier: 'B', bonus: {energy: 12, morale: 4}, isPositive: true},
    {name: 'Токарь', emoji: '⚙️', tier: 'B', bonus: {energy: 13, food: 3}, isPositive: true},
    {name: 'Фрезеровщик', emoji: '🔩', tier: 'B', bonus: {energy: 13}, isPositive: true},
    {name: 'Слесарь', emoji: '🛠️', tier: 'B', bonus: {energy: 14}, isPositive: true},
    {name: 'Кузнец', emoji: '🔨', tier: 'A', bonus: {energy: 15, morale: 4}, isPositive: true},
    {name: 'Плотник', emoji: '🪚', tier: 'B', bonus: {energy: 12, food: 3}, isPositive: true},
    {name: 'Каменщик', emoji: '🧱', tier: 'B', bonus: {energy: 12, water: 3}, isPositive: true},
    {name: 'Электромонтёр', emoji: '⚡', tier: 'A', bonus: {energy: 18}, isPositive: true},
    {name: 'Монтажник связи', emoji: '📡', tier: 'B', bonus: {energy: 12, morale: 3}, isPositive: true},
    {name: 'Оператор дронов', emoji: '🚁', tier: 'B', bonus: {energy: 10, morale: 5}, isPositive: true},
    {name: 'Картограф', emoji: '🗺️', tier: 'B', bonus: {water: 8, morale: 5}, isPositive: true},
    {name: 'Археолог', emoji: '🏺', tier: 'C', bonus: {morale: 8, food: 3}, isPositive: true},
    {name: 'Антрополог', emoji: '🦴', tier: 'C', bonus: {morale: 8, medicine: 3}, isPositive: true},
    {name: 'Историк', emoji: '📜', tier: 'C', bonus: {morale: 10}, isPositive: true},
    {name: 'Библиотекарь', emoji: '📚', tier: 'C', bonus: {morale: 9}, isPositive: true},
    {name: 'Журналист', emoji: '📰', tier: 'C', bonus: {morale: 8, energy: 3}, isPositive: true},
    {name: 'Фотограф', emoji: '📷', tier: 'C', bonus: {morale: 8}, isPositive: true},
    {name: 'Режиссёр', emoji: '🎬', tier: 'C', bonus: {morale: 10}, isPositive: true},
    {name: 'Музыкант', emoji: '🎻', tier: 'C', bonus: {morale: 12}, isPositive: true},
    {name: 'Актёр', emoji: '🎭', tier: 'C', bonus: {morale: 11}, isPositive: true},
    {name: 'Стендап-комик', emoji: '🎤', tier: 'C', bonus: {morale: 14}, isPositive: true},
    {name: 'Бармен', emoji: '🍹', tier: 'C', bonus: {morale: 10, food: 3}, isPositive: true},
    {name: 'Ресторатор', emoji: '🍽️', tier: 'B', bonus: {food: 10, morale: 6}, isPositive: true},
    {name: 'Логист', emoji: '📦', tier: 'B', bonus: {food: 8, water: 8}, isPositive: true},
    {name: 'Менеджер проектов', emoji: '📋', tier: 'B', bonus: {morale: 10, energy: 4}, isPositive: true},
    {name: 'Предприниматель', emoji: '💼', tier: 'C', bonus: {morale: 8, food: 4}, isPositive: true},
    {name: 'Космонавт', emoji: '🚀', tier: 'S', bonus: {energy: 18, morale: 8, water: 4}, isPositive: true},
    {name: 'Астрофизик', emoji: '🌌', tier: 'B', bonus: {energy: 10, morale: 5}, isPositive: true},
    {name: 'Селекционер растений', emoji: '🌿', tier: 'A', bonus: {food: 18, water: 4}, isPositive: true},
    {name: 'Технолог пищевого производства', emoji: '🥫', tier: 'A', bonus: {food: 16, medicine: 4}, isPositive: true},

    // Отрицательные и мусорные профессии (Tier C, isPositive: false)
    {name: 'Безработный', emoji: '🪑', tier: 'C', bonus: {morale: -5, energy: -5}, isPositive: false},
    {name: 'Банкир', emoji: '🏦', tier: 'C', bonus: {morale: -10, food: -5}, isPositive: false}, // Изменен знак бонуса
    {name: 'Разнорабочий на свалке', emoji: '🗑️', tier: 'C', bonus: {medicine: -10, morale: -5}, isPositive: false},
    {name: 'Профессиональный дегустатор фастфуда', emoji: '🍔', tier: 'C', bonus: {food: -12, energy: -6}, isPositive: false},
    {name: 'Ночной сторож', emoji: '🔦', tier: 'C', bonus: {energy: -14, morale: -4}, isPositive: false},
    {name: 'Продавец-консультант', emoji: '🏪', tier: 'C', bonus: {morale: -12}, isPositive: false},
    {name: 'Менеджер по холодным звонкам', emoji: '📞', tier: 'C', bonus: {morale: -15, energy: -4}, isPositive: false},
    {name: 'Фасовщик угля', emoji: '🪵', tier: 'C', bonus: {medicine: -8, energy: -6}, isPositive: false},
    {name: 'Уборщик химотходов', emoji: '☣️', tier: 'C', bonus: {medicine: -14}, isPositive: false},
    {name: 'Кинокритик', emoji: '🍿', tier: 'C', bonus: {energy: -10, food: -4}, isPositive: false},
    {name: 'Бухгалтер в период отчетов', emoji: '📊', tier: 'C', bonus: {morale: -14, energy: -8}, isPositive: false},
    {name: 'Дворник в метель', emoji: '🧹', tier: 'C', bonus: {energy: -15, water: -4}, isPositive: false},
    {name: 'Профессиональный геймер', emoji: '🎮', tier: 'C', bonus: {energy: -12, medicine: -6}, isPositive: false},
    {name: 'Копирайтер на бирже', emoji: '⌨️', tier: 'C', bonus: {morale: -10, energy: -5}, isPositive: false},
    {name: 'Курьер службы доставки', emoji: '🚴', tier: 'C', bonus: {energy: -14, food: -5}, isPositive: false},
    {name: 'Тестировщик матрасов', emoji: '🛌', tier: 'C', bonus: {energy: -18, morale: -4}, isPositive: false},
    {name: 'Сотрудник архива', emoji: '📁', tier: 'C', bonus: {morale: -8, energy: -4}, isPositive: false},
    {name: 'Оператор конвейера', emoji: '🏭', tier: 'C', bonus: {morale: -12, energy: -6}, isPositive: false},
    {name: 'Коридорный в отеле', emoji: '🛎️', tier: 'C', bonus: {energy: -10}, isPositive: false},
    {name: 'Модельер обуви', emoji: '👠', tier: 'C', bonus: {morale: -6, food: -4}, isPositive: false},
    {name: 'Уличный мим', emoji: '🤍', tier: 'C', bonus: {morale: -14}, isPositive: false},
    {name: 'Ассистент фокусника', emoji: '🐇', tier: 'C', bonus: {energy: -8, morale: -4}, isPositive: false},
    {name: 'Дегустатор дешевого алкоголя', emoji: '🍾', tier: 'C', bonus: {medicine: -12, water: -8}, isPositive: false},
];

const HEALTH_CONDITIONS: AttributeEntry[] = [
    {name: 'Идеальное зрение', emoji: '👀', bonus: {energy: 4, morale: 4}, isPositive: true},
    {name: 'Спортивное сердце', emoji: '❤️', bonus: {energy: 8}, isPositive: true},
    {name: 'Марафонец', emoji: '🏃‍♂️', bonus: {energy: 12}, isPositive: true},
    {name: 'Мастер дыхательных практик', emoji: '🫁', bonus: {energy: 8, morale: 4}, isPositive: true},
    {name: 'Иммунитет выше среднего', emoji: '🛡️', bonus: {medicine: 8}, isPositive: true},
    {name: 'Редко болеет', emoji: '🌟', bonus: {medicine: 6, morale: 3}, isPositive: true},
    {name: 'Сильный иммунитет', emoji: '🛡️', bonus: {medicine: 12}, isPositive: true},
    {name: 'Быстрый метаболизм', emoji: '⚡', bonus: {energy: 6}, isPositive: true},
    {name: 'Спортивное телосложение', emoji: '🏋️', bonus: {energy: 10}, isPositive: true},
    {name: 'Чемпион по плаванию', emoji: '🏊', bonus: {energy: 8, water: 4}, isPositive: true},
    {name: 'Отличная реакция', emoji: '⚡', bonus: {energy: 8}, isPositive: true},
    {name: 'Хорошая генетика', emoji: '🧬', bonus: {energy: 6, medicine: 4}, isPositive: true},
    {name: 'Быстро заживляют раны', emoji: '✨', bonus: {medicine: 10}, isPositive: true},
    {name: 'Отличный вестибулярный аппарат', emoji: '🧭', bonus: {energy: 5}, isPositive: true},
    {name: 'Крепкие суставы', emoji: '🦴', bonus: {energy: 6}, isPositive: true},
    {name: 'Сильный организм', emoji: '💪', bonus: {energy: 10}, isPositive: true},
    {name: 'Крепкий сон', emoji: '🛏️', bonus: {energy: 6, morale: 4}, isPositive: true},
    {name: 'Высокая стрессоустойчивость', emoji: '🧘', bonus: {morale: 10}, isPositive: true},
    {name: 'Железное здоровье', emoji: '🏅', bonus: {energy: 12, morale: 6}, isPositive: true},
    {
        name: 'Абсолютно здоров',
        emoji: '💪',
        bonus: {food: 5, water: 5, medicine: 5, energy: 5, morale: 5},
        isPositive: true,
    },
    {
        name: 'Отличная физподготовка',
        emoji: '🏃',
        bonus: {energy: 15, morale: 5},
        isPositive: true,
    },
    {name: 'Крепкое здоровье', emoji: '🌟', bonus: {energy: 8, morale: 8}, isPositive: true},
    {name: 'Железная выносливость', emoji: '🦾', bonus: {energy: 14, food: 4}, isPositive: true},
    {
        name: 'Быстрое восстановление',
        emoji: '✨',
        bonus: {medicine: 8, energy: 6, morale: 4},
        isPositive: true,
    },
    {name: 'Высокий болевой порог', emoji: '🪨', bonus: {morale: 8, energy: 5}, isPositive: true},
    {name: 'Хорошая координация', emoji: '🎯', bonus: {energy: 8, morale: 4}, isPositive: true},

    // 33 новых положительных состояния здоровья для выравнивания баланса
    {name: 'Отличный слух', emoji: '🦻', bonus: {morale: 6, energy: 4}, isPositive: true},
    {name: 'Здоровые зубы', emoji: '🦷', bonus: {morale: 5, food: 5}, isPositive: true},
    {name: 'Гибкость суставов', emoji: '🤸', bonus: {energy: 8}, isPositive: true},
    {name: 'Устойчивость к простудам', emoji: '🌡️', bonus: {medicine: 6}, isPositive: true},
    {name: 'Выносливое сердце', emoji: '🫀', bonus: {energy: 10}, isPositive: true},
    {name: 'Превосходное ночное зрение', emoji: '🦉', bonus: {energy: 6, morale: 4}, isPositive: true},
    {name: 'Эффективное пищеварение', emoji: '🍎', bonus: {food: 8}, isPositive: true},
    {name: 'Устойчивость к токсинам', emoji: '🧪', bonus: {medicine: 10}, isPositive: true},
    {name: 'Быстрая регенерация мышц', emoji: '⚡', bonus: {energy: 8}, isPositive: true},
    {name: 'Идеальная осанка', emoji: '🧍', bonus: {energy: 6, morale: 2}, isPositive: true},
    {name: 'Низкая потребность в воде', emoji: '🌵', bonus: {water: 12}, isPositive: true},
    {name: 'Низкая потребность в пище', emoji: '🐪', bonus: {food: 12}, isPositive: true},
    {name: 'Природный мышечный тонус', emoji: '💪', bonus: {energy: 8}, isPositive: true},
    {name: 'Устойчивость к морской болезни', emoji: '🤢', bonus: {energy: 5, morale: 5}, isPositive: true},
    {name: 'Здоровые легкие', emoji: '🫁', bonus: {energy: 10}, isPositive: true},
    {name: 'Высокий уровень гемоглобина', emoji: '🩸', bonus: {energy: 12}, isPositive: true},
    {name: 'Стабильное кровяное давление', emoji: '📊', bonus: {energy: 8}, isPositive: true},
    {name: 'Крепкая нервная система', emoji: '🧠', bonus: {morale: 12}, isPositive: true},
    {name: 'Острый нюх и осязание', emoji: '👃', bonus: {food: 4, energy: 4}, isPositive: true},
    {name: 'Устойчивый гормональный фон', emoji: '⚖️', bonus: {morale: 8, energy: 4}, isPositive: true},
    {name: 'Здоровая кожа (без инфекций)', emoji: '🧼', bonus: {medicine: 6, morale: 2}, isPositive: true},
    {name: 'Высокий тонус сосудов', emoji: '📈', bonus: {energy: 8}, isPositive: true},
    {name: 'Отличная терморегуляция организма', emoji: '❄️', bonus: {energy: 8, water: 4}, isPositive: true},
    {name: 'Устойчивость к аллергенам', emoji: '🌿', bonus: {medicine: 8}, isPositive: true},
    {name: 'Здоровая микрофлора кишечника', emoji: '🥛', bonus: {food: 8, morale: 2}, isPositive: true},
    {name: 'Высокая скорость лимфотока', emoji: '💧', bonus: {medicine: 6, energy: 4}, isPositive: true},
    {name: 'Крепкие кости', emoji: '🦴', bonus: {energy: 7}, isPositive: true},
    {name: 'Отсутствие хронических болезней', emoji: '🛡️', bonus: {medicine: 10, morale: 4}, isPositive: true},
    {name: 'Быстрая акклиматизация', emoji: '🌍', bonus: {energy: 6, morale: 4}, isPositive: true},
    {name: 'Выносливость к дефициту сна', emoji: '🦉', bonus: {energy: 10}, isPositive: true},
    {name: 'Здоровые почки', emoji: '🧬', bonus: {water: 8}, isPositive: true},
    {name: 'Хорошее периферическое зрение', emoji: '🕶️', bonus: {energy: 5, morale: 3}, isPositive: true},
    {name: 'Общий высокий жизненный потенциал', emoji: '🔥', bonus: {energy: 10, morale: 5}, isPositive: true},

    // Отрицательные состояния здоровья (сглаженные штрафы, дубли удалены)
    {name: 'Бессонница', emoji: '🌙', bonus: {energy: -15}, isPositive: false},
    {name: 'Хроническая мигрень', emoji: '🤕', bonus: {morale: -12, energy: -10}, isPositive: false},
    {name: 'Плохое зрение', emoji: '👓', bonus: {energy: -12}, isPositive: false},
    {name: 'Глухота', emoji: '🦻', bonus: {morale: -15}, isPositive: false},
    {name: 'Частичная потеря зрения', emoji: '🩹', bonus: {energy: -15}, isPositive: false},
    {name: 'Проблемы со спиной', emoji: '🦴', bonus: {energy: -15}, isPositive: false},
    {name: 'Гастрит', emoji: '🍽️', bonus: {food: -10}, isPositive: false},
    {name: 'Хроническая усталость', emoji: '😪', bonus: {energy: -12}, isPositive: false},
    {name: 'Подагра', emoji: '🦶', bonus: {energy: -14}, isPositive: false},
    {name: 'Тахикардия', emoji: '💓', bonus: {energy: -12, medicine: -5}, isPositive: false},
    {name: 'Аритмия', emoji: '❤️‍🩹', bonus: {energy: -12, medicine: -5}, isPositive: false},
    {name: 'Плохие зубы', emoji: '🦷', bonus: {morale: -10, medicine: -5}, isPositive: false},
    {name: 'Протез ноги', emoji: '🦿', bonus: {energy: -15}, isPositive: false},
    {name: 'Протез руки', emoji: '🦾', bonus: {energy: -14}, isPositive: false},
    {name: 'Плохой слух', emoji: '👂', bonus: {morale: -10}, isPositive: false},
    {name: 'Проблемы со щитовидкой', emoji: '🩺', bonus: {energy: -14}, isPositive: false},
    {name: 'Плоскостопие', emoji: '🦶', bonus: {energy: -12}, isPositive: false},
    {name: 'Заикание', emoji: '🗣️', bonus: {morale: -14}, isPositive: false},
    {name: 'Хронический гайморит', emoji: '🤧', bonus: {medicine: -6}, isPositive: false},
    {name: 'Слабые лёгкие', emoji: '🫁', bonus: {energy: -15}, isPositive: false},
    {name: 'Катаракта', emoji: '👁', bonus: {energy: -14}, isPositive: false},
    {name: 'Синдром раздражённого кишечника', emoji: '🥴', bonus: {food: -10}, isPositive: false},
    {name: 'Повышенная тревожность', emoji: '😟', bonus: {morale: -14}, isPositive: false},
    {name: 'Нарколепсия', emoji: '😴', bonus: {energy: -12}, isPositive: false},
    {name: 'Проблемы с печенью', emoji: '🫀', bonus: {medicine: -10}, isPositive: false},
    {name: 'Хронический отит', emoji: '👂', bonus: {morale: -10}, isPositive: false},
    {name: 'Дальнозоркость', emoji: '🔍', bonus: {energy: -10}, isPositive: false},
    {name: 'Низкая выносливость', emoji: '😮‍💨', bonus: {energy: -15}, isPositive: false},
    {name: 'Гипермобильность суставов', emoji: '🤸', bonus: {energy: -12}, isPositive: false},
    {name: 'Обмороки при стрессе', emoji: '😵', bonus: {morale: -12, energy: -12}, isPositive: false},
    {name: 'Перелом позвоночника в прошлом', emoji: '🩻', bonus: {energy: -12}, isPositive: false},
    {name: 'Хроническая астма', emoji: '😤', bonus: {energy: -15, medicine: -5}, isPositive: false},
    {name: 'Сахарный диабет', emoji: '💉', bonus: {food: -12, medicine: -8}, isPositive: false},
    {
        name: 'Сердечная недостаточность',
        emoji: '❤️‍🩹',
        bonus: {medicine: -12, morale: -15},
        isPositive: false,
    },
    {name: 'Депрессия', emoji: '😔', bonus: {morale: -12, energy: -12}, isPositive: false},
    {
        name: 'Алкогольная зависимость',
        emoji: '🍶',
        bonus: {morale: -12, food: -6},
        isPositive: false,
    },
    {name: 'Ожирение 2 степени', emoji: '🍔', bonus: {food: -12, energy: -14}, isPositive: false},
    {name: 'Небольшая близорукость', emoji: '👓', bonus: {morale: -10}, isPositive: false},
    {
        name: 'Онкология в ремиссии',
        emoji: '🎗️',
        bonus: {medicine: -12, morale: -15},
        isPositive: false,
    },
    {
        name: 'Хронический бронхит',
        emoji: '🫁',
        bonus: {energy: -14, medicine: -5},
        isPositive: false,
    },
    {name: 'Аллергия на пыль', emoji: '🤧', bonus: {energy: -12, morale: -10}, isPositive: false},
    {name: 'ВИЧ-позитивный', emoji: '🩸', bonus: {medicine: -15, morale: -15}, isPositive: false},
    {
        name: 'Беременность', // Перенесена в негативные из-за преобладающих штрафов на ресурсы
        emoji: '🤱',
        bonus: {morale: 10, food: -12, medicine: -6},
        isPositive: false,
    },
    {name: 'Слабый иммунитет', emoji: '🦠', bonus: {medicine: -12, morale: -10}, isPositive: false},
    {name: 'Гипертония', emoji: '📈', bonus: {medicine: -8, energy: -14}, isPositive: false},
    {name: 'Анемия', emoji: '🩸', bonus: {energy: -15, morale: -10}, isPositive: false},
    {name: 'Артрит', emoji: '🦴', bonus: {energy: -14, food: -4}, isPositive: false},
    {name: 'Язва желудка', emoji: '🥴', bonus: {food: -12, morale: -10}, isPositive: false},
    {name: 'ПТСР', emoji: '🎇', bonus: {morale: -12, energy: -12}, isPositive: false},
    {name: 'Эпилепсия', emoji: '⚠️', bonus: {medicine: -12, energy: -12}, isPositive: false},
    {name: 'Тремор рук', emoji: '✋', bonus: {medicine: -8, energy: -12}, isPositive: false},
    {name: 'Сколиоз', emoji: '🧍', bonus: {energy: -14, morale: -10}, isPositive: false},
    {name: 'Дальтонизм', emoji: '🎨', bonus: {morale: -4}, isPositive: false},
    {name: 'Старые травмы колена', emoji: '🦵', bonus: {energy: -14}, isPositive: false},
    {name: 'Проблемы с почками', emoji: '💧', bonus: {water: -12, medicine: -6}, isPositive: false},
    {name: 'Лактозная непереносимость', emoji: '🥛', bonus: {food: -14, morale: -4}, isPositive: false},
    {name: 'Глухота на одно ухо', emoji: '👂', bonus: {morale: -10, energy: -10}, isPositive: false},
];

// ─── Хобби (Баффы увеличены на ~75% для перевеса над фобиями на 20%) ──────────

const HOBBIES: AttributeEntry[] = [
    {name: 'Кузнечное дело', emoji: '⚒️', bonus: {energy: 18, morale: 5}, isPositive: true},
    {name: 'Электроника', emoji: '🔌', bonus: {energy: 20}, isPositive: true},
    {name: '3D-моделирование', emoji: '🖥️', bonus: {energy: 10, morale: 8}, isPositive: true},
    {name: 'Программирование', emoji: '💻', bonus: {energy: 16}, isPositive: true},
    {name: 'Робототехника', emoji: '🤖', bonus: {energy: 18}, isPositive: true},
    {name: 'Археология', emoji: '🏺', bonus: {food: 8, morale: 10}, isPositive: true},
    {name: 'Геокешинг', emoji: '📍', bonus: {food: 10, water: 10}, isPositive: true},
    {name: 'Туризм', emoji: '🎒', bonus: {energy: 14, morale: 8}, isPositive: true},
    {name: 'Спелеология', emoji: '🕳️', bonus: {water: 12, energy: 8}, isPositive: true},
    {name: 'Парусный спорт', emoji: '⛵', bonus: {water: 18}, isPositive: true},
    {name: 'Гребля', emoji: '🚣', bonus: {energy: 14, water: 6}, isPositive: true},
    {name: 'Лыжный спорт', emoji: '🎿', bonus: {energy: 18}, isPositive: true},
    {name: 'Паркур', emoji: '🏃', bonus: {energy: 14, morale: 4}, isPositive: true},
    {name: 'Фехтование', emoji: '🤺', bonus: {energy: 14, morale: 6}, isPositive: true},
    {name: 'Стрельба из лука', emoji: '🏹', bonus: {food: 10, energy: 8}, isPositive: true},
    {name: 'Шахматы', emoji: '♟️', bonus: {morale: 14, energy: 4}, isPositive: true},
    {name: 'Настольные игры', emoji: '🎲', bonus: {morale: 16}, isPositive: true},
    {name: 'Решение головоломок', emoji: '🧩', bonus: {morale: 12, energy: 6}, isPositive: true},
    {name: 'Каллиграфия', emoji: '✒️', bonus: {morale: 14}, isPositive: true},
    {name: 'Поэзия', emoji: '📜', bonus: {morale: 15}, isPositive: true},
    {name: 'Написание рассказов', emoji: '📚', bonus: {morale: 15}, isPositive: true},
    {name: 'Ведение дневника', emoji: '📔', bonus: {morale: 14}, isPositive: true},
    {name: 'Рисование', emoji: '🎨', bonus: {morale: 18}, isPositive: true},
    {name: 'Скульптура', emoji: '🗿', bonus: {morale: 12, energy: 6}, isPositive: true},
    {name: 'Гончарное дело', emoji: '🏺', bonus: {water: 8, morale: 10}, isPositive: true},
    {name: 'Вязание', emoji: '🧶', bonus: {morale: 12, medicine: 6}, isPositive: true},
    {name: 'Макраме', emoji: '🪢', bonus: {morale: 10, energy: 6}, isPositive: true},
    {name: 'Изготовление свечей', emoji: '🕯️', bonus: {morale: 12, energy: 5}, isPositive: true},
    {name: 'Мыловарение', emoji: '🧼', bonus: {medicine: 16}, isPositive: true},
    {name: 'Кожевенное дело', emoji: '👜', bonus: {energy: 12, morale: 6}, isPositive: true},
    {name: 'Таксидермия', emoji: '🦌', bonus: {food: 10, morale: 6}, isPositive: true},
    {name: 'Собирательство грибов', emoji: '🍄', bonus: {food: 18}, isPositive: true},
    {name: 'Собирательство ягод', emoji: '🫐', bonus: {food: 16}, isPositive: true},
    {name: 'Выращивание специй', emoji: '🌶️', bonus: {food: 12, morale: 6}, isPositive: true},
    {name: 'Аквариумистика', emoji: '🐠', bonus: {morale: 12, water: 5}, isPositive: true},
    {name: 'Разведение птиц', emoji: '🐔', bonus: {food: 16}, isPositive: true},
    {name: 'Дрессировка животных', emoji: '🐕', bonus: {morale: 12, food: 6}, isPositive: true},
    {name: 'Коневодство', emoji: '🐎', bonus: {energy: 14, morale: 6}, isPositive: true},
    {name: 'Следопытство', emoji: '👣', bonus: {food: 12, water: 6}, isPositive: true},
    {name: 'Ориентирование на местности', emoji: '🧭', bonus: {energy: 12, water: 6}, isPositive: true},
    {name: 'Радиоконструирование', emoji: '📻', bonus: {energy: 18}, isPositive: true},
    {name: 'Сборка дронов', emoji: '🚁', bonus: {energy: 14, morale: 6}, isPositive: true},
    {name: 'Авиамоделизм', emoji: '🛩️', bonus: {energy: 12, morale: 6}, isPositive: true},
    {name: 'Судомоделизм', emoji: '🚢', bonus: {water: 8, morale: 8}, isPositive: true},
    {name: 'Металлоискательство', emoji: '🔍', bonus: {food: 8, energy: 8}, isPositive: true},
    {name: 'Реставрация вещей', emoji: '🛠️', bonus: {energy: 16}, isPositive: true},
    {name: 'Замочное дело', emoji: '🔐', bonus: {energy: 12, morale: 6}, isPositive: true},
    {name: 'Пирография (выжигание)', emoji: '🔥', bonus: {morale: 12, energy: 5}, isPositive: true},
    {name: 'Фокусничество', emoji: '🎩', bonus: {morale: 18}, isPositive: true},
    {name: 'Организация праздников', emoji: '🎊', bonus: {morale: 20}, isPositive: true},
    {name: 'Огородничество', emoji: '🌱', bonus: {food: 18}, isPositive: true},
    {name: 'Рыболовство', emoji: '🎣', bonus: {food: 18}, isPositive: true},
    {name: 'Выживание в дикой природе', emoji: '🏕️', bonus: {food: 12, energy: 12}, isPositive: true},
    {name: 'Оказание первой помощи', emoji: '🩹', bonus: {medicine: 20}, isPositive: true},
    {name: 'Ремонт техники', emoji: '🔩', bonus: {energy: 16}, isPositive: true},
    {name: 'Кулинария', emoji: '🍳', bonus: {food: 14, morale: 6}, isPositive: true},
    {name: 'Фитнес и спорт', emoji: '🏋️', bonus: {energy: 14, morale: 8}, isPositive: true},
    {name: 'Музыка и пение', emoji: '🎸', bonus: {morale: 18}, isPositive: true},
    {name: 'Охота и стрельба', emoji: '🎯', bonus: {food: 12, energy: 8}, isPositive: true},
    {name: 'Медитация и йога', emoji: '🧘', bonus: {morale: 18}, isPositive: true},
    {name: 'Видеоигры', emoji: '🎮', bonus: {morale: 12, energy: 4}, isPositive: true},
    {name: 'Чтение', emoji: '📖', bonus: {morale: 15}, isPositive: true},
    {name: 'Изучение языков', emoji: '🗣️', bonus: {morale: 14}, isPositive: true},
    {name: 'Пауэрлифтинг', emoji: '🏆', bonus: {energy: 18}, isPositive: true},
    {name: 'Бойцовские искусства', emoji: '🥊', bonus: {energy: 12, morale: 8}, isPositive: true},
    {name: 'Сапожное дело', emoji: '👞', bonus: {morale: 8, energy: 8}, isPositive: true},
    {name: 'Шитьё', emoji: '🧵', bonus: {morale: 10, medicine: 6}, isPositive: true},
    {name: 'Столярное дело', emoji: '🪚', bonus: {energy: 14, morale: 5}, isPositive: true},
    {name: 'Резьба по дереву', emoji: '🪵', bonus: {morale: 12, energy: 5}, isPositive: true},
    {name: 'Сбор лекарственных трав', emoji: '🌿', bonus: {medicine: 15, food: 5}, isPositive: true},
    {name: 'Пчеловодство', emoji: '🍯', bonus: {food: 12, morale: 8}, isPositive: true},
    {name: 'Выпечка', emoji: '🧁', bonus: {food: 12, morale: 10}, isPositive: true},
    {name: 'Консервирование', emoji: '🥫', bonus: {food: 18}, isPositive: true},
    {name: 'Самогоноварение', emoji: '🍾', bonus: {morale: 16, water: -2}, isPositive: true},
    {name: 'Фотография', emoji: '📷', bonus: {morale: 14}, isPositive: true},
    {name: 'Журналистика', emoji: '📰', bonus: {morale: 14}, isPositive: true},
    {name: 'Актёрское мастерство', emoji: '🎭', bonus: {morale: 16}, isPositive: true},
    {name: 'Ораторское искусство', emoji: '🎤', bonus: {morale: 16}, isPositive: true},
    {name: 'Астрономия', emoji: '🔭', bonus: {morale: 10, energy: 6}, isPositive: true},
    {name: 'Картография', emoji: '🗺️', bonus: {energy: 10, water: 6}, isPositive: true},
    {name: 'Скалолазание', emoji: '🧗', bonus: {energy: 14, morale: 5}, isPositive: true},
    {name: 'Плавание', emoji: '🏊', bonus: {energy: 12, water: 8}, isPositive: true},
    {name: 'Велотуризм', emoji: '🚴', bonus: {energy: 12, morale: 6}, isPositive: true},
    {name: 'Садоводство', emoji: '🪴', bonus: {food: 14, morale: 5}, isPositive: true},
    {name: 'Радиосвязь', emoji: '📡', bonus: {energy: 12, morale: 5}, isPositive: true},
];

// ─── Фобии (Штрафы оставлены в исходном диапазоне для сохранения хардкора) ──

const PHOBIAS: AttributeEntry[] = [
    {name: 'Клаустрофобия', emoji: '😱', bonus: {morale: -15, energy: -12}, isPositive: false},
    {name: 'Боязнь темноты', emoji: '🌑', bonus: {morale: -12, energy: -12}, isPositive: false},
    {name: 'Мизофобия (страх микробов)', emoji: '🦠', bonus: {morale: -10, medicine: -5}, isPositive: false},
    {name: 'Трипанофобия (страх игл)', emoji: '💉', bonus: {medicine: -10, morale: -15}, isPositive: false},
    {name: 'Социофобия', emoji: '👥', bonus: {morale: -15}, isPositive: false},
    {name: 'Панические атаки', emoji: '💨', bonus: {morale: -12, energy: -15}, isPositive: false},
    {name: 'Пирофобия (страх огня)', emoji: '🔥', bonus: {morale: -14, energy: -12}, isPositive: false},
    {name: 'Боязнь крови', emoji: '🩸', bonus: {medicine: -8, morale: -15}, isPositive: false},
    {name: 'Паранойя', emoji: '🔍', bonus: {morale: -10, energy: -15}, isPositive: false},
    {name: 'Арахнофобия', emoji: '🕷️', bonus: {morale: -15}, isPositive: false},
    {name: 'Агорафобия', emoji: '🏙️', bonus: {morale: -12, energy: -14}, isPositive: false},
    {name: 'Аквафобия', emoji: '🌊', bonus: {water: -8, morale: -15}, isPositive: false},
    {name: 'Акрофобия (страх высоты)', emoji: '🏔️', bonus: {energy: -14, morale: -12}, isPositive: false},
    {name: 'Никтофобия (страх ночи)', emoji: '🌌', bonus: {morale: -10, energy: -14}, isPositive: false},
    {name: 'Танатофобия (страх смерти)', emoji: '⚰️', bonus: {morale: -12}, isPositive: false},
    {name: 'Гематофобия (страх ран и травм)', emoji: '🩹', bonus: {medicine: -8, morale: -14}, isPositive: false},
    {name: 'Аэрофобия (страх шума сирен и полёта)', emoji: '✈️', bonus: {morale: -14, energy: -12}, isPositive: false},
    {name: 'Зоофобия', emoji: '🐺', bonus: {food: -5, morale: -15}, isPositive: false},
    {name: 'Охлофобия (страх толпы)', emoji: '🧍', bonus: {morale: -10}, isPositive: false},
    {name: 'Тафофобия (страх быть погребённым заживо)', emoji: '🪦', bonus: {morale: -14, energy: -13}, isPositive: false},
    {name: 'Гермофобия', emoji: '🧼', bonus: {morale: -14, medicine: -4}, isPositive: false},
    {name: 'Кинофобия (страх собак)', emoji: '🐕', bonus: {morale: -12, food: -10}, isPositive: false},
    {name: 'Офидиофобия (страх змей)', emoji: '🐍', bonus: {morale: -14}, isPositive: false},
    {name: 'Эметофобия (страх рвоты и тошноты)', emoji: '🤢', bonus: {medicine: -6, morale: -15}, isPositive: false},
    {name: 'Астрафобия (страх грома)', emoji: '⛈️', bonus: {morale: -14, energy: -13}, isPositive: false},
    {name: 'Технофобия', emoji: '📟', bonus: {energy: -15}, isPositive: false},
    {name: 'Глоссофобия (страх выступлений)', emoji: '🎤', bonus: {morale: -14}, isPositive: false},
    {name: 'Некрофобия', emoji: '☠️', bonus: {morale: -10, medicine: -3}, isPositive: false},
    {name: 'Катоптрофобия (страх зеркал и отражений)', emoji: '🪞', bonus: {morale: -15}, isPositive: false},
    {name: 'Бронтофобия (страх взрывов)', emoji: '💥', bonus: {morale: -10, energy: -14}, isPositive: false},
    {name: 'Гидрофобия (страх глубокой воды)', emoji: '🌊', bonus: {water: -10, morale: -14}, isPositive: false},
    {name: 'Дентофобия (страх стоматологов)', emoji: '🦷', bonus: {medicine: -8}, isPositive: false},
    {name: 'Коулрофобия (страх клоунов)', emoji: '🤡', bonus: {morale: -15}, isPositive: false},
    {name: 'Амаксофобия (страх транспорта)', emoji: '🚗', bonus: {energy: -14}, isPositive: false},
    {name: 'Киберфобия (страх компьютеров)', emoji: '💻', bonus: {energy: -15}, isPositive: false},
    {name: 'Гоплофобия (страх оружия)', emoji: '🔫', bonus: {morale: -14, energy: -12}, isPositive: false},
    {name: 'Хемофобия (страх химикатов)', emoji: '☣️', bonus: {medicine: -6, energy: -12}, isPositive: false},
    {name: 'Фонофобия (страх громких звуков)', emoji: '🔊', bonus: {morale: -10}, isPositive: false},
    {name: 'Скоптофобия (страх осуждения)', emoji: '👀', bonus: {morale: -12}, isPositive: false},
    {name: 'Ксенофобия (страх незнакомцев)', emoji: '🚷', bonus: {morale: -10}, isPositive: false},
    {name: 'Энтомофобия (страх насекомых)', emoji: '🪲', bonus: {morale: -14}, isPositive: false},
    {name: 'Мусофобия (страх мышей)', emoji: '🐭', bonus: {food: -10, morale: -15}, isPositive: false},
    {name: 'Орнитофобия (страх птиц)', emoji: '🦅', bonus: {morale: -12}, isPositive: false},
    {name: 'Батрахофобия (страх лягушек)', emoji: '🐸', bonus: {morale: -11}, isPositive: false},
    {name: 'Ихтиофобия (страх рыбы)', emoji: '🐟', bonus: {food: -6}, isPositive: false},
    {name: 'Кардиофобия (страх сердечного приступа)', emoji: '❤️', bonus: {morale: -14, energy: -12}, isPositive: false},
    {name: 'Нозофобия (страх болезней)', emoji: '🤒', bonus: {medicine: -8, morale: -12}, isPositive: false},
    {name: 'Фармакофобия (страх лекарств)', emoji: '💊', bonus: {medicine: -12}, isPositive: false},
    {name: 'Токсикофобия (страх отравления)', emoji: '☠️', bonus: {food: -5, water: -5}, isPositive: false},
    {name: 'Электрофобия (страх электричества)', emoji: '⚡', bonus: {energy: -12}, isPositive: false},
    {name: 'Гелиофобия (страх солнечного света)', emoji: '☀️', bonus: {morale: -14}, isPositive: false},
    {name: 'Селенофобия (страх луны)', emoji: '🌕', bonus: {morale: -15}, isPositive: false},
    {name: 'Хронофобия (страх течения времени)', emoji: '⏳', bonus: {morale: -10}, isPositive: false},
    {name: 'Гефирофобия (страх мостов)', emoji: '🌉', bonus: {energy: -14}, isPositive: false},
    {name: 'Талассофобия (страх океана)', emoji: '🌊', bonus: {water: -6, morale: -15}, isPositive: false},
    {name: 'Лимнофобия (страх озёр)', emoji: '🏞️', bonus: {water: -8}, isPositive: false},
    {name: 'Дендрофобия (страх деревьев)', emoji: '🌳', bonus: {food: -10}, isPositive: false},
    {name: 'Антрофобия (страх людей)', emoji: '🧍', bonus: {morale: -12}, isPositive: false},
    {name: 'Гинофобия (страх женщин)', emoji: '👩', bonus: {morale: -10}, isPositive: false},
    {name: 'Андрофобия (страх мужчин)', emoji: '👨', bonus: {morale: -10}, isPositive: false},
    {name: 'Педиофобия (страх кукол)', emoji: '🪆', bonus: {morale: -12}, isPositive: false},
    {name: 'Автофобия (страх одиночества)', emoji: '🚪', bonus: {morale: -14}, isPositive: false},
    {name: 'Гипнофобия (страх сна)', emoji: '😴', bonus: {energy: -18}, isPositive: false},
    {name: 'Омброфобия (страх дождя)', emoji: '🌧️', bonus: {water: -6}, isPositive: false},
    {name: 'Криофобия (страх холода)', emoji: '❄️', bonus: {energy: -14}, isPositive: false},
    {name: 'Термофобия (страх жары)', emoji: '🥵', bonus: {water: -10}, isPositive: false},
    {name: 'Демонофобия (страх сверхъестественного)', emoji: '👻', bonus: {morale: -12}, isPositive: false},
    {name: 'Нумерофобия (страх цифр и расчётов)', emoji: '🔢', bonus: {energy: -12, morale: -8}, isPositive: false},
    {name: 'Логофобия (страх слов и разговоров)', emoji: '🗣️', bonus: {morale: -10}, isPositive: false},
    {name: 'Фотофобия (страх яркого света)', emoji: '💡', bonus: {energy: -12, morale: -10}, isPositive: false},
    {name: 'Ателофобия (страх совершить ошибку)', emoji: '❌', bonus: {morale: -10}, isPositive: false},
    {name: 'Какоррафиофобия (страх неудачи)', emoji: '📉', bonus: {morale: -12}, isPositive: false},
    {name: 'Фобофобия (страх собственных страхов)', emoji: '😨', bonus: {morale: -14}, isPositive: false},
    {name: 'Кенофобия (страх пустых помещений)', emoji: '🏚️', bonus: {morale: -8}, isPositive: false},
    {name: 'Сидерофобия (страх звёздного неба)', emoji: '✨', bonus: {morale: -15}, isPositive: false},
    {name: 'Топофобия (страх определённых мест)', emoji: '📍', bonus: {morale: -12}, isPositive: false},
    {name: 'Верминофобия (страх червей)', emoji: '🪱', bonus: {food: -10, morale: -10}, isPositive: false},
    {name: 'Трихофобия (страх волос)', emoji: '💇', bonus: {morale: -10}, isPositive: false},
    {name: 'Хирофобия (страх рук и прикосновений)', emoji: '🤝', bonus: {morale: -12}, isPositive: false},
    {name: 'Дисморфофобия (навязчивое недовольство собой)', emoji: '🪞', bonus: {morale: -12}, isPositive: false},
    {name: 'Погонофобия (страх перед бородами)', emoji: '🧔', bonus: {morale: -8}, isPositive: false},
    {name: 'Микофобия (страх перед грибами)', emoji: '🍄', bonus: {food: -8, morale: -6}, isPositive: false},
    {name: 'Кинетофобия (страх движения и транспорта)', emoji: '🏃', bonus: {energy: -12}, isPositive: false},
    {name: 'Барофобия (страх гравитации и давления)', emoji: '🏋️', bonus: {energy: -14}, isPositive: false},
    {name: 'Метеорофобия (страх изменений погоды)', emoji: '☁️', bonus: {morale: -10}, isPositive: false},
];

// ─── Черты характера ──────────────────────────────────────────────────────────

const TRAITS: AttributeEntry[] = [
    {name: 'Прирождённый лидер', emoji: '🦁', bonus: {morale: 15}, isPositive: true},
    {name: 'Хладнокровие', emoji: '🧊', bonus: {morale: 10, energy: 5}, isPositive: true},
    {name: 'Изобретательность', emoji: '💡', bonus: {energy: 8, food: 5}, isPositive: true},
    {name: 'Сильная эмпатия', emoji: '🤝', bonus: {morale: 12}, isPositive: true},
    {name: 'Стальная воля', emoji: '⚙️', bonus: {morale: 10, energy: 5}, isPositive: true},
    {name: 'Вспыльчивость', emoji: '😤', bonus: {morale: -12}, isPositive: false},
    {name: 'Эгоцентризм', emoji: '🙄', bonus: {morale: -10, food: -5}, isPositive: false},
    {name: 'Хроническая тревожность', emoji: '😟', bonus: {morale: -10}, isPositive: false},
    {name: 'Манипулятор', emoji: '🎭', bonus: {morale: -18}, isPositive: false},
    {name: 'Безграничный оптимизм', emoji: '😊', bonus: {morale: 10}, isPositive: true},
    {name: 'Дисциплинированность', emoji: '📏', bonus: {energy: 8, morale: 5}, isPositive: true},
    {name: 'Самопожертвование', emoji: '🕊️', bonus: {morale: 12, medicine: 4}, isPositive: true},
    {name: 'Терпеливость', emoji: '⏳', bonus: {morale: 8, food: 4}, isPositive: true},
    {name: 'Практичность', emoji: '🧰', bonus: {energy: 7, water: 4}, isPositive: true},
    {name: 'Командность', emoji: '👥', bonus: {morale: 10}, isPositive: true},
    {name: 'Наблюдательность', emoji: '👁️', bonus: {food: 5, energy: 5}, isPositive: true},
    {name: 'Бережливость', emoji: '💼', bonus: {food: 6, water: 6}, isPositive: true},
    {name: 'Харизма', emoji: '✨', bonus: {morale: 14}, isPositive: true},
    {name: 'Ответственность', emoji: '🧾', bonus: {morale: 8, medicine: 4}, isPositive: true},
    {name: 'Упорство', emoji: '🪨', bonus: {energy: 10, morale: 4}, isPositive: true},
    {name: 'Жадность', emoji: '🪙', bonus: {food: -8, morale: -18}, isPositive: false},
    {name: 'Лень', emoji: '🛋️', bonus: {energy: -29, morale: -14}, isPositive: false},
    {name: 'Трусость', emoji: '🐇', bonus: {morale: -10, energy: -25}, isPositive: false},
    {name: 'Подозрительность', emoji: '🕵️', bonus: {morale: -18}, isPositive: false},
    {name: 'Упрямство', emoji: '🫏', bonus: {morale: -7, energy: -13}, isPositive: false},
    {name: 'Неряшливость', emoji: '🧹', bonus: {medicine: -8, morale: -14}, isPositive: false},
    {name: 'Истеричность', emoji: '🎭', bonus: {morale: -12}, isPositive: false},
    {name: 'Злопамятность', emoji: '🧠', bonus: {morale: -7}, isPositive: false},
    {name: 'Безответственность', emoji: '📉', bonus: {energy: -26, morale: -16}, isPositive: false},
    {name: 'Самовлюблённость', emoji: '🪞', bonus: {morale: -18, food: -14}, isPositive: false},
    {name: 'Стратегическое мышление', emoji: '♟️', bonus: {morale: 8, energy: 5}, isPositive: true},
    {name: 'Самообладание', emoji: '🧘', bonus: {morale: 12}, isPositive: true},
    {name: 'Любознательность', emoji: '🔍', bonus: {medicine: 4, energy: 4}, isPositive: true},
    {name: 'Находчивость', emoji: '🎯', bonus: {food: 5, energy: 5}, isPositive: true},
    {name: 'Чувство юмора', emoji: '😂', bonus: {morale: 15}, isPositive: true},
    {name: 'Добродушие', emoji: '😊', bonus: {morale: 10}, isPositive: true},
    {name: 'Верность слову', emoji: '🤝', bonus: {morale: 10}, isPositive: true},
    {name: 'Справедливость', emoji: '⚖️', bonus: {morale: 12}, isPositive: true},
    {name: 'Осторожность', emoji: '🚧', bonus: {food: 4, water: 4, morale: 4}, isPositive: true},
    {name: 'Трудолюбие', emoji: '🔨', bonus: {energy: 12}, isPositive: true},
    {name: 'Стрессоустойчивость', emoji: '🛡️', bonus: {morale: 10, energy: 4}, isPositive: true},
    {name: 'Настойчивость', emoji: '🐂', bonus: {energy: 10}, isPositive: true},
    {name: 'Аккуратность', emoji: '📐', bonus: {medicine: 5, morale: 5}, isPositive: true},
    {name: 'Дальновидность', emoji: '🔭', bonus: {food: 4, water: 4, morale: 4}, isPositive: true},
    {name: 'Смелость', emoji: '🦅', bonus: {energy: 10, morale: 5}, isPositive: true},
    {name: 'Адаптивность', emoji: '🦎', bonus: {energy: 6, food: 4, water: 4}, isPositive: true},
    {name: 'Пунктуальность', emoji: '⏰', bonus: {energy: 6, morale: 4}, isPositive: true},
    {name: 'Миролюбие', emoji: '☮️', bonus: {morale: 14}, isPositive: true},
    {name: 'Скромность', emoji: '🙂', bonus: {morale: 8, food: 4}, isPositive: true},
    {name: 'Жизнерадостность', emoji: '🌞', bonus: {morale: 14}, isPositive: true},
    {name: 'Перфекционизм', emoji: '📏', bonus: {energy: -4, morale: -6}, isPositive: false},
    {name: 'Импульсивность', emoji: '⚡', bonus: {energy: -10, morale: -8}, isPositive: false},
    {name: 'Пессимизм', emoji: '🌧️', bonus: {morale: -15}, isPositive: false},
    {name: 'Высокомерие', emoji: '👑', bonus: {morale: -12}, isPositive: false},
    {name: 'Завистливость', emoji: '🐍', bonus: {morale: -10}, isPositive: false},
    {name: 'Саркастичность', emoji: '😏', bonus: {morale: -8}, isPositive: false},
    {name: 'Мстительность', emoji: '🗡️', bonus: {morale: -12}, isPositive: false},
    {name: 'Конфликтность', emoji: '🥊', bonus: {morale: -15}, isPositive: false},
    {name: 'Бестактность', emoji: '📢', bonus: {morale: -10}, isPositive: false},
    {name: 'Безынициативность', emoji: '🪫', bonus: {energy: -12}, isPositive: false},
    {name: 'Прокрастинация', emoji: '⌛', bonus: {energy: -14}, isPositive: false},
    {name: 'Рассеянность', emoji: '🌀', bonus: {medicine: -5, energy: -8}, isPositive: false},
    {name: 'Наивность', emoji: '🐣', bonus: {morale: -6, food: -4}, isPositive: false},
    {name: 'Зависимость от чужого мнения', emoji: '👥', bonus: {morale: -12}, isPositive: false},
    {name: 'Нетерпеливость', emoji: '🏃', bonus: {morale: -6, energy: -8}, isPositive: false},
    {name: 'Ревнивость', emoji: '💚', bonus: {morale: -10}, isPositive: false},
    {name: 'Уныние', emoji: '😞', bonus: {morale: -14}, isPositive: false},
    {name: 'Циничность', emoji: '🗿', bonus: {morale: -8}, isPositive: false},
    {name: 'Грубость', emoji: '🤬', bonus: {morale: -12}, isPositive: false},
    {name: 'Нытьё по любому поводу', emoji: '😭', bonus: {morale: -15}, isPositive: false},
    {name: 'Авантюризм', emoji: '🎲', bonus: {energy: 8, morale: -4}, isPositive: true},
    {name: 'Убедительность', emoji: '🗣️', bonus: {morale: 10}, isPositive: true},
    {name: 'Самостоятельность', emoji: '🧭', bonus: {energy: 8, morale: 4}, isPositive: true},
    {name: 'Способность к обучению', emoji: '📖', bonus: {medicine: 4, morale: 4}, isPositive: true},
    {name: 'Решительность', emoji: '⚔️', bonus: {energy: 10, morale: 4}, isPositive: true},
    {name: 'Внимательность к деталям', emoji: '🔬', bonus: {medicine: 6, energy: 4}, isPositive: true},
    {name: 'Надёжность', emoji: '🏗️', bonus: {morale: 10, energy: 4}, isPositive: true},
    {name: 'Организованность', emoji: '📋', bonus: {food: 4, water: 4, morale: 4}, isPositive: true},
    {name: 'Умение вдохновлять', emoji: '🔥', bonus: {morale: 15}, isPositive: true},
    {name: 'Железная дисциплина', emoji: '🪖', bonus: {energy: 10, morale: 5}, isPositive: true},
    {name: 'Черствость', emoji: '🪵', bonus: {morale: -10}, isPositive: false},
    {name: 'Фанатичность', emoji: '🧎', bonus: {morale: -14, energy: -6}, isPositive: false},
    {name: 'Расточительность', emoji: '💸', bonus: {food: -10, water: -10}, isPositive: false},
    {name: 'Брезгливость', emoji: '🤢', bonus: {medicine: -8, food: -5}, isPositive: false},
    {name: 'Апатичность', emoji: '💤', bonus: {energy: -20, morale: -10}, isPositive: false},
    {name: 'Мнительность', emoji: '💊', bonus: {medicine: -12, morale: -6}, isPositive: false},
    {name: 'Эгоизм', emoji: '🍏', bonus: {food: -12, morale: -4}, isPositive: false},
    {name: 'Паникёрство', emoji: '📢', bonus: {morale: -18}, isPositive: false},
    {name: 'Черный пессимизм', emoji: '🕶️', bonus: {morale: -20}, isPositive: false},
    {name: 'Слабохарактерность', emoji: '🎈', bonus: {energy: -15, morale: -8}, isPositive: false},
];

// ─── Предметы ─────────────────────────────────────────────────────────────────

const ITEMS: AttributeEntry[] = [
    {name: '3D-принтер', emoji: '🖨️', bonus: {energy: 10, morale: 4}, isPositive: true},
    {name: 'Спутниковый телефон', emoji: '📞', bonus: {morale: 10}, isPositive: true},
    {name: 'Теплица в контейнере', emoji: '🌱', bonus: {food: 20}, isPositive: true},
    {name: 'Набор хирургических инструментов', emoji: '🩺', bonus: {medicine: 18}, isPositive: true},
    {name: 'Портативный генератор', emoji: '⚡', bonus: {energy: 20}, isPositive: true},
    {name: 'Коробка шоколада', emoji: '🍫', bonus: {morale: 8}, isPositive: true},
    {name: 'Настольные игры', emoji: '🎲', bonus: {morale: 12}, isPositive: true},
    {name: 'Запас кофе', emoji: '☕', bonus: {energy: 8, morale: 4}, isPositive: true},
    {name: 'Медицинский справочник', emoji: '📘', bonus: {medicine: 10}, isPositive: true},
    {name: 'Лук и стрелы', emoji: '🏹', bonus: {food: 10, energy: 4}, isPositive: true},
    {name: 'Портативная солнечная электростанция', emoji: '☀️', bonus: {energy: 25}, isPositive: true},
    {name: 'Ящик сухпайков', emoji: '🍱', bonus: {food: 18}, isPositive: true},
    {name: 'Комплект фильтров', emoji: '💧', bonus: {water: 18}, isPositive: true},
    {name: 'Ноутбук с офлайн-библиотекой', emoji: '💻', bonus: {morale: 8, energy: 4}, isPositive: true},
    {name: 'Сейф с золотом', emoji: '💰', bonus: {morale: -2}, isPositive: false},
    {name: 'Домашний кот', emoji: '🐈', bonus: {morale: 12}, isPositive: true},
    {name: 'Домашняя собака', emoji: '🐕', bonus: {morale: 10}, isPositive: true},
    {name: 'Инкубатор для птиц', emoji: '🥚', bonus: {food: 15}, isPositive: true},
    {name: 'Мини-лаборатория', emoji: '🧪', bonus: {medicine: 15}, isPositive: true},
    {name: 'Металлоискатель', emoji: '📡', bonus: {energy: 6}, isPositive: true},
    {name: 'Арбалет', emoji: '🏹', bonus: {food: 8, morale: 4}, isPositive: true},
    {name: 'Топор', emoji: '🪓', bonus: {energy: 8}, isPositive: true},
    {name: 'Бензопила', emoji: '🪚', bonus: {energy: 12}, isPositive: true},
    {name: 'Складной велосипед', emoji: '🚲', bonus: {energy: 8}, isPositive: true},
    {name: 'Аквариум с рыбами', emoji: '🐟', bonus: {morale: 8}, isPositive: true},
    {name: 'Книга рецептов', emoji: '📖', bonus: {food: 6, morale: 5}, isPositive: true},
    {name: 'Термокостюм', emoji: '🥶', bonus: {energy: 10}, isPositive: true},
    {name: 'Газовый баллон', emoji: '🛢️', bonus: {energy: 15}, isPositive: true},
    {name: 'Мини-ветряк', emoji: '🌬️', bonus: {energy: 14}, isPositive: true},
    {name: 'Запас соли', emoji: '🧂', bonus: {food: 8}, isPositive: true},
    {name: 'Книга по психологии', emoji: '📚', bonus: {morale: 8}, isPositive: true},
    {name: 'Гитара', emoji: '🎸', bonus: {morale: 12}, isPositive: true},
    {name: 'Проектор', emoji: '📽️', bonus: {morale: 10}, isPositive: true},
    {name: 'Шахматы', emoji: '♟️', bonus: {morale: 8}, isPositive: true},
    {name: 'Комплект спецодежды', emoji: '🥾', bonus: {energy: 6}, isPositive: true},
    {name: 'Надувная лодка', emoji: '🚣', bonus: {water: 10}, isPositive: true},
    {name: 'Бочка мёда', emoji: '🍯', bonus: {food: 15, morale: 4}, isPositive: true},
    {name: 'Мини-пивоварня', emoji: '🍺', bonus: {morale: 12}, isPositive: true},
    {name: 'Коробка книг', emoji: '📚', bonus: {morale: 10}, isPositive: true},
    {name: 'Набор для ремонта обуви', emoji: '👞', bonus: {energy: 5, morale: 3}, isPositive: true},
    {name: 'Сломанный генератор', emoji: '⚡', bonus: {energy: -28}, isPositive: false},
    {name: 'Пустая канистра', emoji: '🛢️', bonus: {morale: -13}, isPositive: false},
    {name: 'Просроченные лекарства', emoji: '💊', bonus: {medicine: -8}, isPositive: false},
    {name: 'Сломанная рация', emoji: '📻', bonus: {morale: -14}, isPositive: false},
    {name: 'Коллекция мемов на флешке', emoji: '😂', bonus: {morale: 10}, isPositive: true},
    {name: 'Робот-пылесос', emoji: '🤖', bonus: {morale: 5, medicine: 4}, isPositive: true},
    {name: 'Комплект солнечных батарей', emoji: '🔋', bonus: {energy: 20}, isPositive: true},
    {name: 'Библия выживальщика', emoji: '📕', bonus: {food: 4, water: 4, energy: 4, morale: 4}, isPositive: true},
    {name: 'Тепловизор', emoji: '🌡️', bonus: {energy: 8}, isPositive: true},
    {name: 'Контейнер с удобрениями', emoji: '🌾', bonus: {food: 12}, isPositive: true},
    {name: 'Профессиональная аптечка', emoji: '🧰', bonus: {medicine: 20}, isPositive: true},
    {name: 'Мультитул Leatherman', emoji: '🔧', bonus: {energy: 12}, isPositive: true},
    {name: 'Пакет семян (10 культур)', emoji: '🌰', bonus: {food: 20}, isPositive: true},
    {name: 'Запас антибиотиков', emoji: '💊', bonus: {medicine: 15}, isPositive: true},
    {name: 'Запчасти к генератору', emoji: '⚙️', bonus: {energy: 15}, isPositive: true},
    {name: 'Ящик консервов', emoji: '🥫', bonus: {food: 15}, isPositive: true},
    {name: 'Охотничий нож', emoji: '🗡️', bonus: {food: 8, energy: 5}, isPositive: true},
    {name: 'Портативная рация', emoji: '📡', bonus: {morale: 10}, isPositive: true},
    {name: 'Переносной фильтр воды', emoji: '💧', bonus: {water: 18}, isPositive: true},
    {
        name: 'Энциклопедия выживания',
        emoji: '📕',
        bonus: {food: 5, medicine: 5, energy: 5},
        isPositive: true,
    },
    {name: 'Ничего', emoji: '✋', bonus: {}, isPositive: false},
    {name: 'Сломанный телефон', emoji: '📵', bonus: {morale: -13}, isPositive: false},
    {name: 'Иконы и молитвенник', emoji: '🙏', bonus: {morale: 8}, isPositive: true},
    {name: 'Семейный альбом', emoji: '📷', bonus: {morale: 5}, isPositive: true},
    {name: 'Арсенал оружия', emoji: '🔫', bonus: {energy: 8, morale: 5}, isPositive: true},
    {name: 'Канистра питьевой воды', emoji: '🚰', bonus: {water: 20}, isPositive: true},
    {name: 'Солнечная панель', emoji: '🔋', bonus: {energy: 18}, isPositive: true},
    {name: 'Тёплое одеяло', emoji: '🛏️', bonus: {morale: 8, energy: 4}, isPositive: true},
    {name: 'Походная плитка', emoji: '🔥', bonus: {food: 8, energy: 6}, isPositive: true},
    {name: 'Набор инструментов', emoji: '🧰', bonus: {energy: 14}, isPositive: true},
    {name: 'Мешок крупы', emoji: '🌾', bonus: {food: 18}, isPositive: true},
    {name: 'Запас батареек', emoji: '🔋', bonus: {energy: 12, morale: 3}, isPositive: true},
    {name: 'Термос с чистой водой', emoji: '🥤', bonus: {water: 12, morale: 3}, isPositive: true},
    {
        name: 'Рюкзак выживальщика',
        emoji: '🎒',
        bonus: {food: 5, water: 5, energy: 5},
        isPositive: true,
    },
    {
        name: 'Таблетки для обеззараживания',
        emoji: '🫧',
        bonus: {water: 15, medicine: 5},
        isPositive: true,
    },
    {name: 'Рыболовные снасти', emoji: '🪝', bonus: {food: 12}, isPositive: true},
    {name: 'Спальный мешок', emoji: '🛌', bonus: {energy: 8, morale: 5}, isPositive: true},
    {name: 'Фонарь с динамо-ручкой', emoji: '🔦', bonus: {energy: 10}, isPositive: true},
    {name: 'Газовая горелка', emoji: '🫕', bonus: {food: 8, energy: 5}, isPositive: true},
    {name: 'Набор витаминов', emoji: '💊', bonus: {medicine: 10, morale: 4}, isPositive: true},
    {name: 'Колода карт', emoji: '🃏', bonus: {morale: 8}, isPositive: true},
    {
        name: 'Полевой справочник растений',
        emoji: '📗',
        bonus: {food: 6, medicine: 6},
        isPositive: true,
    },
    {name: 'Фляга спирта', emoji: '🧴', bonus: {medicine: 8, morale: 4}, isPositive: true},
    {name: 'Пустая банка хлама', emoji: '🗑️', bonus: {morale: -14}, isPositive: false},
    {
        name: 'Просроченные консервы',
        emoji: '🥫',
        bonus: {food: 4, medicine: -6},
        isPositive: false,
    },
];

// ─── Особые факты ─────────────────────────────────────────────────────────────

const SPECIAL_FACTS: AttributeEntry[] = [
    {name: 'Бывший спецназовец', emoji: '⚔️', bonus: {energy: 15, morale: 5}, isPositive: true},
    {
        name: 'Знает рецепты народной медицины',
        emoji: '🌿',
        bonus: {medicine: 12},
        isPositive: true,
    },
    {
        name: 'Снайпер с опытом боевых действий',
        emoji: '🎯',
        bonus: {energy: 15},
        isPositive: true,
    },
    {
        name: 'Выжил при прошлой эпидемии',
        emoji: '🏅',
        bonus: {medicine: 10, morale: 10},
        isPositive: true,
    },
    {
        name: 'Знает тайный запасной вход',
        emoji: '🔒',
        bonus: {energy: 10, food: 5},
        isPositive: true,
    },
    {
        name: 'Работал на строительстве бункера',
        emoji: '🏗️',
        bonus: {energy: 12, water: 5},
        isPositive: true,
    },
    {
        name: 'Имеет радиолюбительскую лицензию',
        emoji: '📻',
        bonus: {morale: 10, energy: 5},
        isPositive: true,
    },
    {
        name: 'Был в экспедиции в Антарктиде',
        emoji: '🧊',
        bonus: {food: 8, morale: 8},
        isPositive: true,
    },
    {
        name: 'Создавал системы жизнеобеспечения',
        emoji: '🏭',
        bonus: {energy: 15},
        isPositive: true,
    },
    {name: 'Владеет 5 языками', emoji: '🌐', bonus: {morale: 8}, isPositive: true},
    {name: 'Бывший заключённый', emoji: '⛓️', bonus: {morale: -18, energy: 5}, isPositive: false},
    {
        name: 'Имеет хронический конфликт с коллегами',
        emoji: '😠',
        bonus: {morale: -10},
        isPositive: false,
    },
    {
        name: 'Отличник и перфекционист',
        emoji: '🎓',
        bonus: {morale: 5, medicine: 5},
        isPositive: true,
    },
    {
        name: 'Богатый инвестор (без полезных навыков)',
        emoji: '💰',
        bonus: {morale: -25},
        isPositive: false,
    },
    {
        name: 'Прожил год в изоляции',
        emoji: '🏔️',
        bonus: {morale: 10, energy: 5},
        isPositive: true,
    },
    {
        name: 'Прошёл курсы тактической медицины',
        emoji: '🩹',
        bonus: {medicine: 14, energy: 4},
        isPositive: true,
    },
    {name: 'Жил в автономном доме', emoji: '🏡', bonus: {energy: 10, water: 8}, isPositive: true},
    {
        name: 'Умеет чинить фильтры воды',
        emoji: '💧',
        bonus: {water: 14, energy: 4},
        isPositive: true,
    },
    {
        name: 'Организовывал гуманитарные миссии',
        emoji: '📦',
        bonus: {morale: 12, food: 4},
        isPositive: true,
    },
    {
        name: 'Работал в тепличном комплексе',
        emoji: '🌿',
        bonus: {food: 14, water: 4},
        isPositive: true,
    },
    {name: 'Служил связистом', emoji: '📡', bonus: {energy: 10, morale: 5}, isPositive: true},
    {
        name: 'Вырос в деревне без удобств',
        emoji: '🚜',
        bonus: {food: 8, water: 6, morale: 4},
        isPositive: true,
    },
    {
        name: 'Участвовал в арктической зимовке',
        emoji: '🧊',
        bonus: {energy: 8, morale: 8},
        isPositive: true,
    },
    {
        name: 'Был волонтёром Красного Креста',
        emoji: '⛑️',
        bonus: {medicine: 12, morale: 6},
        isPositive: true,
    },
    {
        name: 'Собирал тревожные рюкзаки до катастрофы',
        emoji: '🎒',
        bonus: {food: 6, water: 6, energy: 6},
        isPositive: true,
    },
    {
        name: 'Работал диспетчером кризисного центра',
        emoji: '☎️',
        bonus: {morale: 10, energy: 4},
        isPositive: true,
    },
    {
        name: 'Имеет опыт жизни на подлодке',
        emoji: '🚢',
        bonus: {morale: 10, energy: 5},
        isPositive: true,
    },
    {
        name: 'Проходил курсы химзащиты',
        emoji: '☣️',
        bonus: {medicine: 10, water: 5},
        isPositive: true,
    },
    {
        name: 'Умеет добывать огонь без спичек',
        emoji: '🔥',
        bonus: {energy: 10, morale: 3},
        isPositive: true,
    },
    {
        name: 'Был старостой спасательного лагеря',
        emoji: '🏕️',
        bonus: {morale: 12, food: 3},
        isPositive: true,
    },
    {
        name: 'Долги и криминальные связи',
        emoji: '💸',
        bonus: {morale: -10, energy: 4},
        isPositive: false,
    },
    {
        name: 'Склонен скрывать важную информацию',
        emoji: '🤐',
        bonus: {morale: -18},
        isPositive: false,
    },
    {
        name: 'Сбежал из секты выживальщиков',
        emoji: '🕯️',
        bonus: {morale: -25, food: 5, energy: 5},
        isPositive: false,
    },
    {
        name: 'Потерял семью в первые дни катастрофы',
        emoji: '🖤',
        bonus: {morale: -10, energy: 3},
        isPositive: false,
    },
    {
        name: 'Имеет репутацию мародёра',
        emoji: '🪓',
        bonus: {food: 5, morale: -12},
        isPositive: false,
    },
    {
        name: 'Пережил авиакатастрофу',
        emoji: '✈️',
        bonus: {morale: 10, energy: 8},
        isPositive: true,
    },
    {
        name: 'Участвовал в кругосветной экспедиции',
        emoji: '🌍',
        bonus: {water: 8, morale: 8},
        isPositive: true,
    },
    {
        name: 'Знает координаты заброшенного военного склада',
        emoji: '🪖',
        bonus: {food: 10, energy: 10},
        isPositive: true,
    },
    {
        name: 'Имеет собственную библиотеку по выживанию',
        emoji: '📚',
        bonus: {morale: 8, medicine: 5},
        isPositive: true,
    },
    {
        name: 'Сдал нормативы спецназа',
        emoji: '🎖️',
        bonus: {energy: 15},
        isPositive: true,
    },
    {
        name: 'Чемпион по спортивному ориентированию',
        emoji: '🧭',
        bonus: {water: 8, energy: 8},
        isPositive: true,
    },
    {
        name: 'Построил дом своими руками',
        emoji: '🏠',
        bonus: {energy: 12, morale: 4},
        isPositive: true,
    },
    {
        name: 'Имеет лицензию пилота',
        emoji: '🛩️',
        bonus: {energy: 10, morale: 5},
        isPositive: true,
    },
    {
        name: 'Работал инструктором по выживанию',
        emoji: '🏕️',
        bonus: {food: 10, water: 10},
        isPositive: true,
    },
    {
        name: 'Собрал коллекцию редких семян',
        emoji: '🌱',
        bonus: {food: 15},
        isPositive: true,
    },

    {
        name: 'Выиграл международную олимпиаду',
        emoji: '🥇',
        bonus: {morale: 10, medicine: 4},
        isPositive: true,
    },
    {
        name: 'Профессионально занимается альпинизмом',
        emoji: '🧗',
        bonus: {energy: 12, morale: 4},
        isPositive: true,
    },
    {
        name: 'Прошёл курс первой помощи НАТО',
        emoji: '🚑',
        bonus: {medicine: 15},
        isPositive: true,
    },
    {
        name: 'Работал на полярной станции',
        emoji: '❄️',
        bonus: {energy: 10, morale: 6},
        isPositive: true,
    },
    {
        name: 'Выжил после нападения акулы',
        emoji: '🦈',
        bonus: {morale: 12, energy: 4},
        isPositive: true,
    },
    {
        name: 'Мастер по ремонту генераторов',
        emoji: '⚙️',
        bonus: {energy: 15},
        isPositive: true,
    },
    {
        name: 'Участвовал в археологических экспедициях',
        emoji: '🏺',
        bonus: {food: 5, morale: 8},
        isPositive: true,
    },
    {
        name: 'Служил миротворцем ООН',
        emoji: '🕊️',
        bonus: {morale: 12, energy: 4},
        isPositive: true,
    },
    {
        name: 'Был инструктором по дайвингу',
        emoji: '🤿',
        bonus: {water: 14},
        isPositive: true,
    },
    {
        name: 'Победитель соревнований по стрельбе',
        emoji: '🎯',
        bonus: {energy: 12},
        isPositive: true,
    },

    {
        name: 'Панически боится принимать решения',
        emoji: '😰',
        bonus: {morale: -12},
        isPositive: false,
    },
    {
        name: 'Был уволен за халатность',
        emoji: '📄',
        bonus: {morale: -18},
        isPositive: false,
    },
    {
        name: 'Постоянно провоцирует конфликты',
        emoji: '💢',
        bonus: {morale: -14},
        isPositive: false,
    },
    {
        name: 'Имеет зависимость от азартных игр',
        emoji: '🎰',
        bonus: {morale: -10},
        isPositive: false,
    },
    {
        name: 'Никогда не жил самостоятельно',
        emoji: '🍼',
        bonus: {morale: -16, energy: -24},
        isPositive: false,
    },
    {
        name: 'Скрывает тяжёлое преступление',
        emoji: '🚔',
        bonus: {morale: -15},
        isPositive: false,
    },
    {
        name: 'Был исключён из армии',
        emoji: '🎖️',
        bonus: {morale: -18, energy: -12},
        isPositive: false,
    },
    {
        name: 'Регулярно саботирует работу команды',
        emoji: '🪓',
        bonus: {morale: -15},
        isPositive: false,
    },
    {
        name: 'Не умеет плавать',
        emoji: '🌊',
        bonus: {water: -8},
        isPositive: false,
    },
    {
        name: 'Катастрофически невезучий',
        emoji: '🐈‍⬛',
        bonus: {morale: -10},
        isPositive: false,
    },

    {
        name: 'Умеет выращивать грибы',
        emoji: '🍄',
        bonus: {food: 12},
        isPositive: true,
    },
    {
        name: 'Знает устройство солнечных панелей',
        emoji: '☀️',
        bonus: {energy: 14},
        isPositive: true,
    },
    {
        name: 'Содержал большую ферму',
        emoji: '🐄',
        bonus: {food: 15},
        isPositive: true,
    },
    {
        name: 'Пережил месяц в дикой природе',
        emoji: '🌲',
        bonus: {food: 8, water: 8},
        isPositive: true,
    },
    {
        name: 'Был капитаном спортивной команды',
        emoji: '🏆',
        bonus: {morale: 12},
        isPositive: true,
    },
    {
        name: 'Умеет собирать солнечные опреснители',
        emoji: '💧',
        bonus: {water: 15},
        isPositive: true,
    },
    {
        name: 'Знает рецепты длительного хранения продуктов',
        emoji: '🥫',
        bonus: {food: 14},
        isPositive: true,
    },
    {
        name: 'Имеет доступ к закрытому убежищу',
        emoji: '🚪',
        bonus: {food: 8, water: 8, morale: 5},
        isPositive: true,
    },
    {
        name: 'Пережил три серьёзные операции',
        emoji: '🏥',
        bonus: {morale: 10, medicine: 5},
        isPositive: true,
    },
    {
        name: 'Был координатором поисково-спасательных работ',
        emoji: '🚁',
        bonus: {energy: 10, morale: 8},
        isPositive: true,
    },

    {
        name: 'Верит в теории заговора и навязывает их всем',
        emoji: '🛸',
        bonus: {morale: -10},
        isPositive: false,
    },
    {
        name: 'Постоянно нарушает дисциплину',
        emoji: '🚫',
        bonus: {morale: -12},
        isPositive: false,
    },
    {
        name: 'Не переносит замкнутые пространства',
        emoji: '📦',
        bonus: {morale: -10},
        isPositive: false,
    },
    {
        name: 'Считает себя лидером независимо от мнения группы',
        emoji: '👑',
        bonus: {morale: -18},
        isPositive: false,
    },
    {
        name: 'Склонен к панике во время кризиса',
        emoji: '😱',
        bonus: {morale: -12},
        isPositive: false,
    },
    {
        name: 'Ненавидит физический труд',
        emoji: '🛋️',
        bonus: {energy: -28},
        isPositive: false,
    },
    {
        name: 'Участвовал в реалити-шоу про выживание',
        emoji: '📺',
        bonus: {food: 5, water: 5, morale: 5},
        isPositive: true,
    },
    {
        name: 'Имеет фотографическую память',
        emoji: '🧠',
        bonus: {medicine: 6, morale: 8},
        isPositive: true,
    },
    {
        name: 'Знает карту местности наизусть',
        emoji: '🗺️',
        bonus: {water: 10, energy: 5},
        isPositive: true,
    },
    {
        name: 'Выиграл чемпионат по шахматам',
        emoji: '♟️',
        bonus: {morale: 10, energy: 4},
        isPositive: true,
    },
    {
        name: 'Крайне эгоистичен в распределении еды',
        emoji: '🍏',
        bonus: { food: -12 },
        isPositive: false,
    },
    {
        name: 'Страдает бессонницей и будит остальных',
        emoji: '🦉',
        bonus: { energy: -15, morale: -5 },
        isPositive: false,
    },
    {
        name: 'Гипохондрик, тратит лекарства впустую',
        emoji: '🧪',
        bonus: { medicine: -14 },
        isPositive: false,
    },
    {
        name: 'Не умеет экономно расходовать воду',
        emoji: '🚰',
        bonus: { water: -12 },
        isPositive: false,
    },
    {
        name: 'Часто впадает в глубокую апатию',
        emoji: '🌧️',
        bonus: { morale: -20, energy: -10 },
        isPositive: false,
    },
    {
        name: 'Абсолютно не умеет обращаться с техникой',
        emoji: '🔨',
        bonus: { energy: -18 },
        isPositive: false,
    },
    {
        name: 'Постоянно теряет выданные инструменты',
        emoji: '🔧',
        bonus: { energy: -12, morale: -4 },
        isPositive: false,
    },
    {
        name: 'Тяжело переносит любые изменения рациона',
        emoji: '🤢',
        bonus: { food: -10, morale: -10 },
        isPositive: false,
    },
    {
        name: 'Патологический лжец и манипулятор',
        emoji: '🎭',
        bonus: { morale: -22 },
        isPositive: false,
    },
    {
        name: 'Имеет слабую дыхательную систему',
        emoji: '🫁',
        bonus: { medicine: -10, energy: -8 },
        isPositive: false,
    },
    {
        name: 'Привык к роскоши, деморализует команду жалобами',
        emoji: '💅',
        bonus: { morale: -18 },
        isPositive: false,
    },
    {
        name: 'Неосторожен, постоянно получает мелкие травмы',
        emoji: '🩹',
        bonus: { medicine: -12, energy: -6 },
        isPositive: false,
    },
    {
        name: 'Бросает начатые дела при малейших трудностях',
        emoji: '🏳️',
        bonus: { energy: -15 },
        isPositive: false,
    },
    {
        name: 'Панически боится темноты и замкнутых пространств',
        emoji: '👁️‍🗨️',
        bonus: { morale: -15, energy: -10 },
        isPositive: false,
    },
    {
        name: 'Склонен портить чужие вещи в порыве злости',
        emoji: '🗯️',
        bonus: { morale: -14 },
        isPositive: false,
    },
];

// ─── События выживания ────────────────────────────────────────────────────────

export const SURVIVAL_EVENTS: SurvivalEvent[] = [
    {
        title: 'Разгерметизация сектора',
        description: 'В одном из жилых отсеков произошла утечка воздуха.',
        emoji: '🧯',
        effect: { energy: -20, morale: -15 },
        positive: false,
    },
    {
        title: 'Пожар на складе медикаментов',
        description: 'Огонь уничтожил значительную часть медицинских запасов.',
        emoji: '🔥',
        effect: { medicine: -30, morale: -10 },
        positive: false,
    },
    {
        title: 'Загрязнение теплицы',
        description: 'Неизвестная болезнь уничтожила большую часть урожая.',
        emoji: '🦠',
        effect: { food: -35 },
        positive: false,
    },
    {
        title: 'Отказ реактора',
        description: 'Основной источник энергии остановлен до завершения ремонта.',
        emoji: '⚛️',
        effect: { energy: -40, morale: -10 },
        positive: false,
    },
    {
        title: 'Массовое пищевое отравление',
        description: 'Испорченные продукты привели к вспышке болезни.',
        emoji: '🤢',
        effect: { food: -15, medicine: -25, morale: -15 },
        positive: false,
    },
    {
        title: 'Серия краж',
        description: 'Кто-то систематически похищал припасы со складов.',
        emoji: '🕵️',
        effect: { food: -20, water: -20, morale: -20 },
        positive: false,
    },
    {
        title: 'Бунт рабочих',
        description: 'Часть жителей отказалась выполнять свои обязанности.',
        emoji: '⚒️',
        effect: { morale: -35, energy: -15 },
        positive: false,
    },
    {
        title: 'Разрушение водохранилища',
        description: 'Трещина в резервуаре привела к потере запасов воды.',
        emoji: '💧',
        effect: { water: -40 },
        positive: false,
    },
    {
        title: 'Эпидемия неизвестной инфекции',
        description: 'Болезнь быстро распространяется среди жителей.',
        emoji: '☣️',
        effect: { medicine: -30, morale: -20 },
        positive: false,
    },
    {
        title: 'Критический износ фильтров',
        description: 'Система очистки воздуха почти вышла из строя.',
        emoji: '🌫️',
        effect: { energy: -20, medicine: -15, morale: -15 },
        positive: false,
    },
    {
        title: 'Провал экспедиции',
        description: 'Разведчики не вернулись, а ресурсы были потрачены впустую.',
        emoji: '🗺️',
        effect: { food: -15, energy: -20, morale: -20 },
        positive: false,
    },
    {
        title: 'Радиационная утечка',
        description: 'Повреждённый контейнер вызвал заражение части комплекса.',
        emoji: '☢️',
        effect: { medicine: -20, energy: -20, morale: -20 },
        positive: false,
    },
    {
        title: 'Падение морального духа',
        description: 'Жители начинают сомневаться, что спасение вообще возможно.',
        emoji: '😔',
        effect: { morale: -40 },
        positive: false,
    },
    {
        title: 'Обрушение фермы',
        description: 'Конструкция гидропонной фермы не выдержала нагрузки.',
        emoji: '🌱',
        effect: { food: -30, energy: -10 },
        positive: false,
    },
    {
        title: 'Поломка насосной станции',
        description: 'Вода перестала поступать в жилые отсеки.',
        emoji: '🚰',
        effect: { water: -30, energy: -10 },
        positive: false,
    },
    {
        title: 'Смертельная плесень',
        description: 'Опасный грибок распространился по жилым помещениям.',
        emoji: '🍄',
        effect: { medicine: -20, food: -20, morale: -15 },
        positive: false,
    },
    {
        title: 'Диверсия в энергосети',
        description: 'Неизвестный вывел из строя несколько ключевых систем.',
        emoji: '💣',
        effect: { energy: -35, morale: -15 },
        positive: false,
    },
    {
        title: 'Черный рынок',
        description: 'Подпольная торговля привела к исчезновению запасов.',
        emoji: '💰',
        effect: { food: -15, medicine: -15, morale: -20 },
        positive: false,
    },
    {
        title: 'Отказ системы очистки воды',
        description: 'Большая часть запасов оказалась заражена.',
        emoji: '🚱',
        effect: { water: -35, medicine: -15 },
        positive: false,
    },
    {
        title: 'Катастрофическая авария',
        description: 'Сразу несколько систем жизнеобеспечения вышли из строя.',
        emoji: '💥',
        effect: {
            food: -15,
            water: -15,
            energy: -25,
            medicine: -15,
            morale: -25,
        },
        positive: false,
    },
    {
        title: 'Неисправный датчик радиации',
        description: 'Несколько недель система показывала ложную тревогу.',
        emoji: '📟',
        effect: { morale: 10 },
        positive: true,
    },
    {
        title: 'Тайный запас шоколада',
        description: 'Кто-то обнаружил спрятанные сладости прошлых владельцев.',
        emoji: '🍫',
        effect: { morale: 15 },
        positive: true,
    },
    {
        title: 'Засор фильтров',
        description: 'Воздух стал тяжелее, пришлось срочно менять фильтры.',
        emoji: '😷',
        effect: { energy: -10, morale: -10 },
        positive: false,
    },
    {
        title: 'Успешная рыбалка',
        description: 'Подземное озеро оказалось богато рыбой.',
        emoji: '🎣',
        effect: { food: 20 },
        positive: true,
    },
    {
        title: 'Поломка холодильников',
        description: 'Часть продуктов испортилась.',
        emoji: '🧊',
        effect: { food: -18 },
        positive: false,
    },
    {
        title: 'Найден технический архив',
        description: 'В старых документах обнаружены полезные инструкции.',
        emoji: '📚',
        effect: { energy: 10, morale: 15 },
        positive: true,
    },
    {
        title: 'Драка в столовой',
        description: 'Очередной спор за пайки закончился потасовкой.',
        emoji: '🥊',
        effect: { morale: -18 },
        positive: false,
    },
    {
        title: 'Старый склад батарей',
        description: 'Удалось восстановить часть энергосистемы.',
        emoji: '🔋',
        effect: { energy: 20 },
        positive: true,
    },
    {
        title: 'Неудачная охота',
        description: 'Разведчики вернулись ни с чем.',
        emoji: '🏹',
        effect: { energy: -20, morale: -20 },
        positive: false,
    },
    {
        title: 'День талантов',
        description: 'Жители устроили концерт и подняли настроение.',
        emoji: '🎭',
        effect: { morale: 18 },
        positive: true,
    },
    {
        title: 'Короткое замыкание',
        description: 'Несколько отсеков временно остались без света.',
        emoji: '💡',
        effect: { energy: -35 },
        positive: false,
    },
    {
        title: 'Новый сорт растений',
        description: 'Учёным удалось вывести урожайную культуру.',
        emoji: '🪴',
        effect: { food: 15 },
        positive: true,
    },
    {
        title: 'Саботаж оборудования',
        description: 'Кто-то намеренно повредил системы жизнеобеспечения.',
        emoji: '🔧',
        effect: { energy: -15, morale: -15 },
        positive: false,
    },
    {
        title: 'Радиопередача надежды',
        description: 'Получен сигнал от других выживших.',
        emoji: '📻',
        effect: { morale: 20 },
        positive: true,
    },
    {
        title: 'Мышиная эпидемия',
        description: 'Грызуны размножились быстрее, чем ожидалось.',
        emoji: '🐁',
        effect: { food: -32, morale: -28 },
        positive: false,
    },
    {
        title: 'Самодельный очиститель',
        description: 'Инженеры улучшили систему очистки воды.',
        emoji: '🚿',
        effect: { water: 30 },
        positive: true,
    },
    {
        title: 'Сломанный лифт',
        description: 'Доставка грузов между уровнями усложнилась.',
        emoji: '🛗',
        effect: { energy: -10 },
        positive: false,
    },
    {
        title: 'Тренировка добровольцев',
        description: 'Жители стали организованнее и увереннее.',
        emoji: '🏋️',
        effect: { morale: 12 },
        positive: true,
    },
    {
        title: 'Потеря медикаментов',
        description: 'Часть препаратов испортилась из-за неправильного хранения.',
        emoji: '💊',
        effect: { medicine: -15 },
        positive: false,
    },
    {
        title: 'Открытие грибной фермы',
        description: 'Появился новый стабильный источник пищи.',
        emoji: '🍄',
        effect: { food: 18 },
        positive: true,
    },
    {
        title: 'Протечка потолка',
        description: 'Вода повредила оборудование.',
        emoji: '💦',
        effect: { water: -20, energy: -20 },
        positive: false,
    },
    {
        title: 'Неожиданное наследство',
        description: 'В личном шкафчике найдены забытые припасы.',
        emoji: '🎒',
        effect: { food: 10, medicine: 10 },
        positive: true,
    },
    {
        title: 'Ложная тревога',
        description: 'Паника возникла из-за сбоя системы оповещения.',
        emoji: '🚨',
        effect: { morale: -15 },
        positive: false,
    },
    {
        title: 'Успешный ремонт реактора',
        description: 'Основной источник энергии стабилизирован.',
        emoji: '⚛️',
        effect: { energy: 25 },
        positive: true,
    },
    {
        title: 'Сломан инкубатор',
        description: 'Часть сельскохозяйственного проекта потеряна.',
        emoji: '🥚',
        effect: { food: -10 },
        positive: false,
    },
    {
        title: 'Курс первой помощи',
        description: 'Многие жители освоили медицинские навыки.',
        emoji: '⛑️',
        effect: { medicine: 10, morale: 15 },
        positive: true,
    },
    {
        title: 'Подозрение на шпиона',
        description: 'Никто никому не доверяет.',
        emoji: '🕶️',
        effect: { morale: -20 },
        positive: false,
    },
    {
        title: 'Теплица расширена',
        description: 'Площадь выращивания культур увеличена.',
        emoji: '🏡',
        effect: { food: 20 },
        positive: true,
    },
    {
        title: 'Перегрев оборудования',
        description: 'Системы работали на пределе возможностей.',
        emoji: '🌡️',
        effect: { energy: -20 },
        positive: false,
    },
    {
        title: 'Обнаружена артезианская скважина',
        description: 'Запасы воды значительно выросли.',
        emoji: '🚰',
        effect: { water: 30 },
        positive: true,
    },
    {
        title: 'Ссора соседей',
        description: 'Мелкий конфликт расколол коллектив.',
        emoji: '😡',
        effect: { morale: -10 },
        positive: false,
    },
    {
        title: 'Письмо из прошлого',
        description: 'Найдены дневники прежних жителей бункера.',
        emoji: '📜',
        effect: { morale: 10 },
        positive: true,
    },
    {
        title: 'Голодные дни',
        description: 'Пришлось сократить пайки.',
        emoji: '🍽️',
        effect: { food: -15, morale: -15 },
        positive: false,
    },
    {
        title: 'Система рециркуляции улучшена',
        description: 'Расход воды удалось снизить.',
        emoji: '♻️',
        effect: { water: 15 },
        positive: true,
    },
    {
        title: 'Сломался бур',
        description: 'Разведка подземных тоннелей остановлена.',
        emoji: '⛏️',
        effect: { energy: -10 },
        positive: false,
    },
    {
        title: 'Детский праздник',
        description: 'Смех и радость напомнили людям о нормальной жизни.',
        emoji: '🎈',
        effect: { morale: 20 },
        positive: true,
    },
    {
        title: 'Плесень в жилом секторе',
        description: 'Пришлось проводить санитарную обработку.',
        emoji: '🦠',
        effect: { medicine: -10, morale: -10 },
        positive: false,
    },
    {
        title: 'Найден склад инструментов',
        description: 'Ремонтные работы стали проще.',
        emoji: '🧰',
        effect: { energy: 10 },
        positive: true,
    },
    {
        title: 'Нехватка сна',
        description: 'Постоянный шум мешает людям отдыхать.',
        emoji: '😴',
        effect: { morale: -15 },
        positive: false,
    },
    {
        title: 'Урожай картофеля',
        description: 'Теплица порадовала неожиданно хорошим результатом.',
        emoji: '🥔',
        effect: { food: 22 },
        positive: true,
    },
    {
        title: 'Старая травма напомнила о себе',
        description: 'Одному из жителей понадобилось лечение.',
        emoji: '🩼',
        effect: { medicine: -10 },
        positive: false,
    },
    {
        title: 'Удачная находка аккумуляторов',
        description: 'Восстановлены резервные системы.',
        emoji: '🔋',
        effect: { energy: 15 },
        positive: true,
    },
    {
        title: 'Поломка насоса',
        description: 'Подача воды временно ограничена.',
        emoji: '🚿',
        effect: { water: -28 },
        positive: false,
    },
    {
        title: 'Фестиваль кино',
        description: 'Старые фильмы помогли отвлечься от проблем.',
        emoji: '🎬',
        effect: { morale: 15 },
        positive: true,
    },
    {
        title: 'Загрязнение резервуара',
        description: 'Часть воды оказалась непригодна для использования.',
        emoji: '🛢️',
        effect: { water: -15 },
        positive: false,
    },
    {
        title: 'Удачный обмен по радио',
        description: 'Удалось договориться о поставке медикаментов.',
        emoji: '📡',
        effect: { medicine: 15 },
        positive: true,
    },
    {
        title: 'Мятеж недовольных',
        description: 'Группа жителей отказалась подчиняться правилам.',
        emoji: '⚔️',
        effect: { morale: -45 },
        positive: false,
    },
    {
        title: 'Открытие подземного сада',
        description: 'Заброшенный сектор оказался пригоден для выращивания еды.',
        emoji: '🌳',
        effect: { food: 25, morale: 10 },
        positive: true,
    },
    {
        title: 'Повреждение кабелей',
        description: 'Часть энергосети вышла из строя.',
        emoji: '🔌',
        effect: { energy: -28 },
        positive: false,
    },
    {
        title: 'День единства',
        description: 'Жители вместе отпраздновали очередной год выживания.',
        emoji: '🎊',
        effect: { morale: 25 },
        positive: true,
    },
    {
        title: 'Прорыв трубы',
        description:
            'Водопроводная труба лопнула из-за перепада давления. Часть запасов воды потеряна.',
        emoji: '🚰',
        effect: {water: -20},
        positive: false,
    },
    {
        title: 'Пожар в генераторной',
        description: 'Короткое замыкание вызвало возгорание. Команда едва успела потушить.',
        emoji: '🔥',
        effect: {energy: -44},
        positive: false,
    },
    {
        title: 'Заражение продовольствия',
        description: 'Плесень поразила часть продовольственных запасов. Их пришлось уничтожить.',
        emoji: '🍄',
        effect: {food: -20},
        positive: false,
    },
    {
        title: 'Паника в бункере',
        description: 'Кто-то нашёл скрытые факты о запасах. Напряжение переросло в конфликт.',
        emoji: '😰',
        effect: {morale: -20},
        positive: false,
    },
    {
        title: 'Вирус распространяется',
        description: 'Один из выживших заболел. Команда вынуждена потратить медикаменты.',
        emoji: '🤒',
        effect: {medicine: -20, morale: -25},
        positive: false,
    },
    {
        title: 'Сбой вентиляции',
        description: 'Система воздухообмена дала сбой. Техники трудятся круглосуточно.',
        emoji: '💨',
        effect: {energy: -15, morale: -25},
        positive: false,
    },
    {
        title: 'Найдены дополнительные запасы',
        description: 'В техническом отсеке обнаружен забытый склад с консервами и водой.',
        emoji: '🎁',
        effect: {food: 15, water: 10},
        positive: true,
    },
    {
        title: 'Самодельный генератор',
        description: 'Умельцы из команды собрали запасной генератор из подручных материалов.',
        emoji: '⚡',
        effect: {energy: 15},
        positive: true,
    },
    {
        title: 'Медицинское открытие',
        description: 'Один из специалистов разработал средство против местного заражения.',
        emoji: '💉',
        effect: {medicine: 15, morale: 5},
        positive: true,
    },
    {
        title: 'Психологический кризис',
        description: 'Несколько людей впали в депрессию от замкнутого пространства.',
        emoji: '😢',
        effect: {morale: -15},
        positive: false,
    },
    {
        title: 'Успешная вылазка',
        description: 'Разведчики вернулись с добычей. Опасность того стоила.',
        emoji: '🎒',
        effect: {food: 12, medicine: 8},
        positive: true,
    },
    {
        title: 'Внешнее нападение отражено',
        description: 'Группа пытавшихся проникнуть в бункер отброшена. Но это дало нам o себе знать.',
        emoji: '🛡️',
        effect: {energy: -29, morale: -10},
        positive: false,
    },
    {
        title: 'Обнаружен подземный источник',
        description: 'После нескольких дней бурения найден чистый источник воды.',
        emoji: '💧',
        effect: {water: 25},
        positive: true,
    },
    {
        title: 'Нашли заброшенный склад',
        description: 'Разведчики обнаружили старый склад с уцелевшими припасами.',
        emoji: '📦',
        effect: {food: 20, medicine: 10},
        positive: true,
    },
    {
        title: 'Урожай в гидропонной ферме',
        description: 'Первый полноценный урожай превзошёл ожидания.',
        emoji: '🌱',
        effect: {food: 18, morale: 5},
        positive: true,
    },
    {
        title: 'Неожиданный союзник',
        description: 'По радио вышла на связь дружественная группа выживших.',
        emoji: '🤝',
        effect: {morale: 15, food: 5},
        positive: true,
    },
    {
        title: 'Успешный ремонт вентиляции',
        description: 'Инженеры модернизировали систему воздухообмена.',
        emoji: '🌀',
        effect: {energy: 10, morale: 10},
        positive: true,
    },
    {
        title: 'Найдена аптечка военного образца',
        description: 'Во время вылазки обнаружен медицинский контейнер.',
        emoji: '🩹',
        effect: {medicine: 20},
        positive: true,
    },
    {
        title: 'Удачная охота',
        description: 'Разведчики принесли крупную добычу.',
        emoji: '🦌',
        effect: {food: 20},
        positive: true,
    },
    {
        title: 'Праздник в бункере',
        description: 'Команда устроила вечер отдыха и игр.',
        emoji: '🎉',
        effect: {morale: 20},
        positive: true,
    },
    {
        title: 'Солнечные батареи заработали',
        description: 'Удалось подключить найденные панели.',
        emoji: '☀️',
        effect: {energy: 20},
        positive: true,
    },
    {
        title: 'Собран дождевой коллектор',
        description: 'Система сбора воды работает эффективно.',
        emoji: '🌧️',
        effect: {water: 18},
        positive: true,
    },

    {
        title: 'Крысы добрались до склада',
        description: 'Часть продовольствия уничтожена грызунами.',
        emoji: '🐀',
        effect: {food: -35},
        positive: false,
    },
    {
        title: 'Эпидемия гриппа',
        description: 'Несколько человек заболели одновременно.',
        emoji: '🤧',
        effect: {medicine: -35, morale: -30},
        positive: false,
    },
    {
        title: 'Утечка топлива',
        description: 'Повреждена система хранения топлива.',
        emoji: '⛽',
        effect: {energy: -44},
        positive: false,
    },
    {
        title: 'Потоп в техническом отсеке',
        description: 'Вода затопила часть оборудования.',
        emoji: '🌊',
        effect: {energy: -15, water: -20},
        positive: false,
    },
    {
        title: 'Массовая бессонница',
        description: 'Несколько недель люди не могут нормально отдыхать.',
        emoji: '😵‍💫',
        effect: {morale: -15},
        positive: false,
    },
    {
        title: 'Отравление водой',
        description: 'Система фильтрации дала сбой.',
        emoji: '☠️',
        effect: {water: -15, medicine: -10},
        positive: false,
    },
    {
        title: 'Обвал тоннеля',
        description: 'Один из запасных выходов полностью завален.',
        emoji: '🪨',
        effect: {energy: -15},
        positive: false,
    },
    {
        title: 'Кража припасов',
        description: 'Кто-то из жителей тайно присваивал ресурсы.',
        emoji: '🕵️',
        effect: {food: -30, morale: -45},
        positive: false,
    },
    {
        title: 'Смерть домашнего питомца',
        description: 'Любимец бункера погиб во время аварии.',
        emoji: '🐕',
        effect: {morale: -20},
        positive: false,
    },
    {
        title: 'Поломка очистителей',
        description: 'Система очистки воды временно вышла из строя.',
        emoji: '🚱',
        effect: {water: -20},
        positive: false,
    },

    {
        title: 'Рискованная вылазка',
        description: 'Команда принесла ресурсы, но понесла потери сил.',
        emoji: '🎒',
        effect: {food: 15, energy: -29},
        positive: true,
    },
    {
        title: 'Обмен с выжившими',
        description: 'Удалось выгодно обменять медикаменты на продукты.',
        emoji: '🔄',
        effect: {food: 35, medicine: -20},
        positive: true,
    },
    {
        title: 'Экономия ресурсов',
        description: 'Жёсткие ограничения подняли запасы, но испортили настроение.',
        emoji: '📉',
        effect: {food: 10, water: 10, morale: -35},
        positive: false,
    },
    {
        title: 'Новый жилец',
        description: 'В бункер проник выживший с полезными знаниями.',
        emoji: '🚪',
        effect: {morale: 10, food: -10},
        positive: true,
    },
    {
        title: 'Военный тайник',
        description: 'Обнаружены полезные запасы, но часть команды пострадала при поиске.',
        emoji: '🪖',
        effect: {medicine: 15, energy: -28},
        positive: true,
    },
    {
        title: 'Секретный склад алкоголя',
        description: 'Настроение улучшилось, дисциплина ухудшилась.',
        emoji: '🍾',
        effect: {morale: 25, energy: -38},
        positive: true,
    },
    {
        title: 'Ускоренное выращивание культур',
        description: 'Для урожая пришлось потратить дополнительные ресурсы.',
        emoji: '🌾',
        effect: {food: 30, water: -20},
        positive: true,
    },
    {
        title: 'Генератор на пределе',
        description: 'Удалось получить больше энергии ценой износа системы.',
        emoji: '⚡',
        effect: {energy: 20, morale: -25},
        positive: true,
    },
    {
        title: 'Спор о лидерстве',
        description: 'После голосования группа раскололась на два лагеря.',
        emoji: '👑',
        effect: {morale: -18},
        positive: false,
    },
    {
        title: 'Радиационный шторм снаружи',
        description: 'Пришлось срочно герметизировать часть бункера.',
        emoji: '☢️',
        effect: {    energy: -45,
            water: -25,
            morale: -20,},
        positive: false,
    },
    {
        title: 'Удачная фильтрация',
        description: 'Инженеры смогли очистить заблокированные резервуары, вернув воду в систему.',
        emoji: '🧪',
        effect: { water: 25 },
        positive: true,
    },
    {
        title: 'Оптимизация энергосети',
        description: 'Новый алгоритм распределения питания снизил нагрузку на генераторы.',
        emoji: '📈',
        effect: { energy: 20 },
        positive: true,
    },
    {
        title: 'День отдыха',
        description: 'Руководство объявило внеочередной выходной. Люди смогли выспаться.',
        emoji: '🛋️',
        effect: { morale: 25 },
        positive: true,
    },
    {
        title: 'Подземная грибница',
        description: 'В вентиляционных шахтах обнаружен съедобный и питательный мох.',
        emoji: '🍄',
        effect: { food: 15 },
        positive: true,
    },
    {
        title: 'Старый армейский стимулятор',
        description: 'В забытом ящике медика нашли партию эффективных витаминов.',
        emoji: '🧪',
        effect: { medicine: 20 },
        positive: true,
    },
    {
        title: 'Чистая случайность',
        description: 'Обнаружен скрытый кабель от соседнего заброшенного узла связи.',
        emoji: '🔌',
        effect: { energy: 15, morale: 10 },
        positive: true,
    },
    {
        title: 'Конкурс поваров',
        description: 'Из стандартных пайков удалось приготовить потрясающий праздничный ужин.',
        emoji: '👨‍🍳',
        effect: { food: 15, morale: 15 },
        positive: true,
    },
    {
        title: 'Естественный дренаж',
        description: 'Стены бункера пропустили чистую грунтовую воду прямо в очистительную систему.',
        emoji: '⛲',
        effect: { water: 20 },
        positive: true,
    },
    {
        title: 'Тайник инженера',
        description: 'Найден ящик с деталями, которые давно считались дефицитными.',
        emoji: '🛠️',
        effect: { energy: 25 },
        positive: true,
    },
    {
        title: 'Примирение фракций',
        description: 'Лидеры спорящих групп смогли договориться. Напряжение в бункере спало.',
        emoji: '🤝',
        effect: { morale: 30 },
        positive: true,
    },
    {
        title: 'Сверхэффективный антибиотик',
        description: 'Лаборатория синтезировала сильное лекарство из местной плесени.',
        emoji: '🧪',
        effect: { medicine: 25 },
        positive: true,
    },
    {
        title: 'Аномальный приток энергии',
        description: 'Внешняя буря создала наводку на внешние контуры, зарядив батареи.',
        emoji: '⚡',
        effect: { energy: 30 },
        positive: true,
    },
    {
        title: 'Психологическая разгрузка',
        description: 'Старый игровой автомат снова заработал в зоне отдыха.',
        emoji: '🕹️',
        effect: { morale: 20 },
        positive: true,
    },
    {
        title: 'Склад гидропоники',
        description: 'В запечатанном ящике найдены концентрированные питательные растворы.',
        emoji: '🧪',
        effect: { food: 25 },
        positive: true,
    },
    {
        title: 'Конденсаторный сборщик',
        description: 'Техники собрали установку, улавливающую влагу из горячего воздуха турбин.',
        emoji: '💧',
        effect: { water: 15 },
        positive: true,
    },
    {
        title: 'Хорошие новости по радио',
        description: 'Сквозь помехи пробился отчет о стабилизации ситуации на поверхности.',
        emoji: '📻',
        effect: { morale: 35 },
        positive: true,
    },
    {
        title: 'Армейские сухпайки',
        description: 'Разведчики нашли заваленный люк с нетронутыми рационами высокой калорийности.',
        emoji: '🥫',
        effect: { food: 30 },
        positive: true,
    },
    {
        title: 'Резервные предохранители',
        description: 'Замена сгоревших узлов предотвратила регулярные перебои со светом.',
        emoji: '🎛️',
        effect: { energy: 20 },
        positive: true,
    },
    {
        title: 'Иммунитет укреплен',
        description: 'Успешная профилактика снизила общую заболеваемость в жилом секторе.',
        emoji: '🏥',
        effect: { medicine: 15, morale: 10 },
        positive: true,
    },
    {
        title: 'Новый источник света',
        description: 'Замена старых ламп на энергосберегающие диоды сделала отсеки уютнее.',
        emoji: '💡',
        effect: { energy: 15, morale: 15 },
        positive: true,
    },
    {
        title: 'Качественная изоляция',
        description: 'Герметизация стыков снизила потери тепла и очищенного воздуха.',
        emoji: '🏗️',
        effect: { energy: 15, water: 10 },
        positive: true,
    },
    {
        title: 'Музыкальная трансляция',
        description: 'Радист настроился на старую автоматическую станцию, крутящую джаз.',
        emoji: '🎶',
        effect: { morale: 20 },
        positive: true,
    },
];

// ─── Возраст ──────────────────────────────────────────────────────────────────

function randomAge(): number {
    const ranges = [
        {min: 18, max: 25, weight: 30},
        {min: 25, max: 35, weight: 50},
        {min: 35, max: 45, weight: 40},
        {min: 45, max: 60, weight: 30},
        {min: 60, max: 80, weight: 10},
    ];
    const total = ranges.reduce((s, r) => s + r.weight, 0);
    let rnd = Math.random() * total;
    for (const {min, max, weight} of ranges) {
        rnd -= weight;
        if (rnd <= 0) return Math.floor(min + Math.random() * (max - min));
    }
    return 35;
}

// ─── Генерация персонажа ──────────────────────────────────────────────────────

// ALL_TRAIT_KEYS is imported from types.ts (canonical source)

// How many traits to reveal after round 1 (rounds 2…N).
// Must be ≤ ALL_TRAIT_KEYS.length (6). Currently 4 → 5 total rounds.
const TRAITS_TO_REVEAL = ALL_TRAIT_KEYS.length;

export function generateCharacter(playerName: string): BunkerCharacter {
    const revealOrder = shuffle<TraitKey>([...ALL_TRAIT_KEYS]).slice(0, TRAITS_TO_REVEAL);

    return {
        playerName,
        age: randomAge(),
        gender: Math.random() > 0.5 ? 'Мужчина' : 'Женщина',
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

/** Resource bonus derived from age bracket. Applied scaled alongside attribute bonuses. */
export function getAgeBonuses(age: number): ResourceBonus {
    if (age <= 25) return {energy: 5, morale: 5, medicine: -1,water:3};
    if (age <= 35) return {energy: 3, food: 5, morale: 2};
    if (age <= 45) return {food: 3, water: 2, morale: 3, energy: 1};
    if (age <= 55) return {medicine: 6, morale: 4, energy: -13};
    return {medicine: 5, morale: 7, energy: -25, food: 2};
}

const DIFFICULTY_BASE_OFFSET: Record<string, number> = {easy: 10, medium: 0, hard: -8};
const DIFFICULTY_SCENARIO_SCALE: Record<string, number> = {easy: 0.65, medium: 1.0, hard: 1.35};
const RESOURCE_KEYS_CALC: ResourceKey[] = ['food', 'water', 'medicine', 'energy', 'morale'];

export function calculateSurvival(
    bunkerTeam: BunkerCharacter[],
    scenario: CatastropheScenario,
    events: SurvivalEvent[],
    options?: {revealedTraitsOnly?: boolean; totalRounds?: number; difficulty?: 'easy' | 'medium' | 'hard'}
): { resources: BunkerResources; outcome: 'full_victory' | 'partial' | 'pyrrhic' | 'defeat' } {
    const base: BunkerResources = {food: 35, water: 50, medicine: 50, energy: 65, morale: 65};

    // Apply difficulty base offset
    const diffOffset = DIFFICULTY_BASE_OFFSET[options?.difficulty ?? 'medium'] ?? 0;
    if (diffOffset !== 0) {
        RESOURCE_KEYS_CALC.forEach(k => { base[k] += diffOffset; });
    }

    // Apply difficulty-scaled scenario penalty
    const scenarioScale = DIFFICULTY_SCENARIO_SCALE[options?.difficulty ?? 'medium'] ?? 1.0;
    (Object.entries(scenario.resourcePenalty) as [ResourceKey, number][])
        .forEach(([k, v]) => { base[k] += Math.round(v * scenarioScale); });

    // Apply team bonuses (scaled by team size to avoid stacking)
    const teamScale = Math.max(0.4, 1 - (bunkerTeam.length - 2) * 0.08);
    for (const char of bunkerTeam) {
        let attrs: AttributeEntry[];
        if (options?.revealedTraitsOnly) {
            const revealed = new Set<string>(['profession', ...char.revealOrder.slice(0, (options.totalRounds ?? 0) - 1)]);
            attrs = (
                [
                    ['profession', char.profession],
                    ['health',     char.health],
                    ['hobby',      char.hobby],
                    ['phobia',     char.phobia],
                    ['trait',      char.trait],
                    ['item',       char.item],
                    ['specialFact',char.specialFact],
                ] as [string, AttributeEntry][]
            ).filter(([k]) => revealed.has(k)).map(([, a]) => a);
        } else {
            attrs = [char.profession, char.health, char.hobby, char.trait, char.item, char.specialFact, char.phobia];
        }
        for (const attr of attrs) {
            applyBonusScaled(base, attr.bonus, teamScale);
        }
        applyBonusScaled(base, getAgeBonuses(char.age), teamScale);
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
    const lowCount = values.filter((v) => v < 25).length;
    const goodCount = values.filter((v) => v >= 40).length;

    let outcome: 'full_victory' | 'partial' | 'pyrrhic' | 'defeat';
    if (criticalCount >= 1) {
        outcome = 'defeat';
    } else if (lowCount >= 2) {
        outcome = 'pyrrhic';
    } else if (goodCount >= 5) {
        outcome = 'full_victory';
    } else {
        outcome = 'partial';
    }

    return {resources: base, outcome};
}

/** Returns the raw sum of all attribute resource bonuses for a single character. */
export function getPlayerResourceContribution(char: BunkerCharacter): BunkerResources {
    const result: BunkerResources = {food: 0, water: 0, medicine: 0, energy: 0, morale: 0};
    const attrs = [char.profession, char.health, char.hobby, char.trait, char.item, char.specialFact, char.phobia];
    for (const attr of attrs) {
        (Object.entries(attr.bonus) as [ResourceKey, number][]).forEach(([k, v]) => {
            result[k] += v;
        });
    }
    return result;
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
