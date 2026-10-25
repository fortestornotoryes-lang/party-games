import type { LucideIcon } from 'lucide-react';
import { ChevronUp, Play, RefreshCw, Shuffle } from 'lucide-react';
import type { PanInfo } from 'motion/react';
import { LayoutGroup, motion } from 'motion/react';
import React, { useEffect, useState } from 'react';

import { DIFFICULTY_COLOR, DIFFICULTY_LABEL, formatSeconds, PICK_DELAY_MS } from '../demoData';
import type {
  ChooseProps,
  LabOption,
  LabVariant,
  PassProps,
  RevealProps,
  TeamsProps,
} from '../types';

import { FitText } from '@/shared/components/FitText';
import { rgba } from '@/shared/theme/colors';
import { PHASE_VARIANTS, SPRING, STAGGER_ITEM } from '@/shared/theme/motion';
import type { Difficulty, GameTheme } from '@/shared/types';

/*
 * Вариант 3 «Колода» — настольная игра в руках.
 * Светлые лица карт и узорные рубашки цвета игры, Rubik + Rubik Mono One на индексах.
 * Тактильно: карту смахивают, переворачивают, игроки — карточки, которые сдаются по командам.
 */

const FACE = '#f4f3f9';
const INK = '#1b1730';
const INK_SOFT = 'rgba(27,23,48,0.55)';
const CARD_RADIUS = 22;
const CARD_SHADOW = '0 18px 40px rgba(0,0,0,0.45)';

/** Смахивание карты: достаточно протащить на столько px вверх или бросить с такой скоростью */
const SWIPE_DISTANCE = 90;
const SWIPE_VELOCITY = 500;
/** Карта улетает — потом следующий игрок, мс */
const FLY_AWAY_MS = 320;
/** Карта переворачивается обратно — потом передача, мс */
const FLIP_BACK_MS = 520;

/** Масть дублирует цвет сложности формой — различима и без цвета */
const SUIT: Record<Difficulty, string> = { easy: '♣', medium: '♦', hard: '♠' };
/** Карты «в руке» чуть разъезжаются по наклону */
const HAND_TILT = [-1.5, 1, -0.6];

const cardBack = (color: GameTheme): React.CSSProperties => ({
  background: [
    'repeating-linear-gradient(45deg, rgba(255,255,255,0.14) 0 2px, transparent 2px 13px)',
    'repeating-linear-gradient(-45deg, rgba(255,255,255,0.14) 0 2px, transparent 2px 13px)',
    `radial-gradient(circle at 50% 40%, ${rgba(color, 1)}, ${rgba(color, 0.72)})`,
  ].join(', '),
});

const BackFrame: React.FC = () => (
  <span aria-hidden className="absolute inset-3 rounded-[15px] border-2 border-white/55" />
);

interface DeckButtonProps {
  tone: 'face' | 'ghost';
  onClick: () => void;
  disabled?: boolean;
  icon?: LucideIcon;
  children: React.ReactNode;
}

const DeckButton: React.FC<DeckButtonProps> = ({
  tone,
  onClick,
  disabled,
  icon: Icon,
  children,
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className={`lab-font-deck flex min-h-14 w-full items-center justify-center gap-2.5 rounded-[16px] px-6 text-lg font-bold transition-[opacity,transform] duration-150 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white active:scale-[0.97] disabled:opacity-30 ${
      tone === 'ghost' ? 'border-2 border-white/20 text-white' : ''
    }`}
    style={tone === 'face' ? { background: FACE, color: INK, boxShadow: CARD_SHADOW } : undefined}
  >
    {Icon && <Icon className="h-5 w-5 shrink-0" strokeWidth={2.5} />}
    {children}
  </button>
);

// ─── Передача телефона ────────────────────────────────────────────────────────

const DeckPass: React.FC<PassProps> = ({ player, index, total, accent, onDone }) => {
  const [gone, setGone] = useState(false);
  const remaining = Math.min(2, total - index);
  const initial = player.charAt(0).toUpperCase();

  useEffect(() => {
    if (!gone) return;
    const id = window.setTimeout(onDone, FLY_AWAY_MS);
    return () => {
      window.clearTimeout(id);
    };
  }, [gone, onDone]);

  const onDragEnd = (_: PointerEvent, info: PanInfo) => {
    if (info.offset.y < -SWIPE_DISTANCE || info.velocity.y < -SWIPE_VELOCITY) setGone(true);
  };

  return (
    <motion.div
      variants={PHASE_VARIANTS}
      initial="initial"
      animate="animate"
      exit="exit"
      className="flex flex-1 flex-col items-center justify-center gap-7 p-6"
    >
      <motion.p
        variants={STAGGER_ITEM}
        className="lab-font-deck text-base font-medium text-white/50"
      >
        Карта {index} из {total}
      </motion.p>

      <motion.div variants={STAGGER_ITEM} className="relative aspect-[5/7] w-full max-w-[290px]">
        {/* Остаток колоды под верхней картой */}
        {Array.from({ length: remaining }, (_, i) => remaining - i).map((depth) => (
          <span
            key={depth}
            aria-hidden
            className="absolute inset-0 opacity-60"
            style={{
              ...cardBack(accent),
              borderRadius: CARD_RADIUS,
              transform: `translateY(${depth * 9}px) rotate(${depth * 2.5}deg)`,
            }}
          />
        ))}
        <motion.div
          drag={gone ? false : 'y'}
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={0.7}
          onDragEnd={onDragEnd}
          animate={gone ? { y: -720, rotate: -14, opacity: 0 } : { y: 0, rotate: 0, opacity: 1 }}
          transition={gone ? { duration: FLY_AWAY_MS / 1000, ease: 'easeIn' } : SPRING.snappy}
          className="absolute inset-0 cursor-grab touch-none overflow-hidden active:cursor-grabbing"
          style={{ ...cardBack(accent), borderRadius: CARD_RADIUS, boxShadow: CARD_SHADOW }}
        >
          <BackFrame />
          <span className="lab-font-index absolute top-6 left-6 text-xl text-white/85">
            {initial}
          </span>
          <span className="lab-font-index absolute right-6 bottom-6 rotate-180 text-xl text-white/85">
            {initial}
          </span>
          <div
            className="absolute inset-x-6 top-1/2 -translate-y-1/2 rounded-[14px] px-4 py-5 text-center"
            style={{ background: FACE, color: INK, boxShadow: '0 8px 20px rgba(0,0,0,0.25)' }}
          >
            <p className="lab-font-deck text-sm font-medium" style={{ color: INK_SOFT }}>
              Карта для
            </p>
            <FitText
              as="p"
              minFontSize={16}
              className="lab-font-deck mt-1 text-[38px] leading-none font-black"
            >
              {player}
            </FitText>
          </div>
        </motion.div>
      </motion.div>

      <motion.div variants={STAGGER_ITEM} className="flex w-full flex-col items-center gap-3">
        <ChevronUp className="lab-nudge h-6 w-6 text-white/60" aria-hidden />
        <p className="lab-font-deck text-center text-sm font-medium text-white/60">
          Смахни карту вверх, когда телефон у тебя
        </p>
        <DeckButton
          tone="ghost"
          onClick={() => {
            setGone(true);
          }}
          disabled={gone}
        >
          Взять карту
        </DeckButton>
      </motion.div>
    </motion.div>
  );
};

// ─── Показ слова ──────────────────────────────────────────────────────────────

const DeckReveal: React.FC<RevealProps> = ({ player, word, accent, onDone }) => {
  const [flipped, setFlipped] = useState(false);
  const [returning, setReturning] = useState(false);
  const index = word.charAt(0).toUpperCase();

  useEffect(() => {
    if (!returning) return;
    const id = window.setTimeout(onDone, FLIP_BACK_MS);
    return () => {
      window.clearTimeout(id);
    };
  }, [returning, onDone]);

  const corner = (
    <span className="flex flex-col items-center leading-none">
      <span className="lab-font-index text-2xl">{index}</span>
      <span className="mt-1 text-lg" style={{ color: rgba(accent, 1) }}>
        ♦
      </span>
    </span>
  );

  return (
    <motion.div
      variants={PHASE_VARIANTS}
      initial="initial"
      animate="animate"
      exit="exit"
      className="flex flex-1 flex-col items-center justify-center gap-7 p-6"
    >
      <motion.p
        variants={STAGGER_ITEM}
        className="lab-font-deck text-center text-lg font-bold wrap-anywhere text-white/70"
      >
        {player}, это твоя карта
      </motion.p>

      <motion.div variants={STAGGER_ITEM} className="w-full max-w-[290px] perspective-distant">
        <motion.button
          type="button"
          onClick={() => {
            setFlipped(true);
          }}
          disabled={flipped}
          animate={{ rotateY: flipped && !returning ? 180 : 0 }}
          transition={SPRING.flip}
          className="relative block aspect-[5/7] w-full transform-3d"
        >
          {/* Рубашка */}
          <span
            className="absolute inset-0 flex flex-col items-center justify-center gap-4 overflow-hidden backface-hidden"
            style={{ ...cardBack(accent), borderRadius: CARD_RADIUS, boxShadow: CARD_SHADOW }}
          >
            <BackFrame />
            <span
              className="lab-font-index flex h-20 w-20 items-center justify-center rounded-full text-4xl"
              style={{ background: FACE, color: rgba(accent, 1) }}
            >
              ?
            </span>
            <span className="lab-font-deck relative rounded-full bg-black/35 px-4 py-1.5 text-sm font-bold text-white">
              Нажми, чтобы перевернуть
            </span>
          </span>
          {/* Лицо карты */}
          <span
            className="absolute inset-0 flex rotate-y-180 flex-col items-center justify-center gap-3 px-6 backface-hidden"
            style={{
              background: FACE,
              color: INK,
              borderRadius: CARD_RADIUS,
              boxShadow: CARD_SHADOW,
            }}
          >
            <span className="absolute top-5 left-5">{corner}</span>
            <span className="absolute right-5 bottom-5 rotate-180">{corner}</span>
            <FitText
              as="span"
              minFontSize={16}
              className="lab-font-deck text-[46px] leading-[1.02] font-black"
            >
              {word}
            </FitText>
            <span className="lab-font-deck text-sm font-medium" style={{ color: INK_SOFT }}>
              Объясняешь ты
            </span>
          </span>
        </motion.button>
      </motion.div>

      <motion.div variants={STAGGER_ITEM} className="w-full">
        <DeckButton
          tone="face"
          onClick={() => {
            setReturning(true);
          }}
          disabled={!flipped || returning}
        >
          Перевернуть и передать
        </DeckButton>
      </motion.div>
    </motion.div>
  );
};

// ─── Выбор слова ──────────────────────────────────────────────────────────────

const DeckChoose: React.FC<ChooseProps> = ({ options, onPick, onReplace }) => {
  const [picked, setPicked] = useState<LabOption | null>(null);

  useEffect(() => {
    if (!picked) return;
    const id = window.setTimeout(() => {
      onPick(picked);
    }, PICK_DELAY_MS);
    return () => {
      window.clearTimeout(id);
    };
  }, [picked, onPick]);

  return (
    <motion.div
      variants={PHASE_VARIANTS}
      initial="initial"
      animate="animate"
      exit="exit"
      className="flex flex-1 flex-col gap-5 p-6"
    >
      <motion.div variants={STAGGER_ITEM}>
        <h2 className="lab-font-deck text-[30px] leading-none font-black text-white">
          Выбери карту
        </h2>
        <p className="lab-font-deck mt-2 text-sm font-medium text-white/50">
          Номинал карты — очки за слово
        </p>
      </motion.div>

      <div className="flex flex-1 flex-col justify-center gap-4">
        {options.map((option, i) => {
          const color = DIFFICULTY_COLOR[option.difficulty];
          const isPicked = picked?.word === option.word;
          const isDimmed = picked !== null && !isPicked;
          return (
            <motion.div key={option.word} variants={STAGGER_ITEM}>
              <motion.button
                type="button"
                onClick={() => {
                  if (!picked) setPicked(option);
                }}
                whileTap={picked ? undefined : { scale: 0.97 }}
                animate={{
                  y: isPicked ? -8 : isDimmed ? 10 : 0,
                  rotate: isPicked ? 0 : HAND_TILT[i % HAND_TILT.length],
                  scale: isPicked ? 1.04 : 1,
                  opacity: isDimmed ? 0.2 : 1,
                }}
                transition={SPRING.pop}
                className="flex w-full items-stretch gap-4 p-3 pr-5 text-left"
                style={{ background: FACE, color: INK, borderRadius: 18, boxShadow: CARD_SHADOW }}
              >
                <span
                  className="flex w-14 shrink-0 flex-col items-center justify-center gap-1 rounded-[12px] py-2"
                  style={{ background: rgba(color, 1), color: INK }}
                >
                  <span className="lab-font-index text-[26px] leading-none">{option.points}</span>
                  <span className="text-lg leading-none">{SUIT[option.difficulty]}</span>
                </span>
                <span className="flex min-w-0 flex-1 flex-col justify-center py-1">
                  <FitText
                    as="span"
                    minFontSize={14}
                    className="lab-font-deck text-[28px] leading-tight font-black"
                  >
                    {option.word}
                  </FitText>
                  <span
                    className="lab-font-deck mt-0.5 text-sm font-medium"
                    style={{ color: INK_SOFT }}
                  >
                    {DIFFICULTY_LABEL[option.difficulty]}, {formatSeconds(option.seconds)}
                  </span>
                </span>
              </motion.button>
            </motion.div>
          );
        })}
      </div>

      <motion.div variants={STAGGER_ITEM}>
        <DeckButton tone="ghost" icon={RefreshCw} onClick={onReplace} disabled={picked !== null}>
          Новые карты (−1 очко)
        </DeckButton>
      </motion.div>
    </motion.div>
  );
};

// ─── Команды ──────────────────────────────────────────────────────────────────

const PLAYER_CARD_RADIUS = 10;

const DeckTeams: React.FC<TeamsProps> = ({
  teams,
  teamCounts,
  onTeamsCount,
  onMove,
  onShuffle,
  onStart,
}) => (
  <motion.div
    variants={PHASE_VARIANTS}
    initial="initial"
    animate="animate"
    exit="exit"
    layoutScroll
    className="flex flex-1 flex-col gap-5 p-6"
  >
    <motion.div variants={STAGGER_ITEM} className="flex items-center justify-between gap-3">
      <h2 className="lab-font-deck text-[30px] leading-none font-black text-white">Команды</h2>
      <div className="flex gap-2" role="group" aria-label="Число команд">
        {teamCounts.map((n) => {
          const active = n === teams.length;
          return (
            <button
              key={n}
              type="button"
              aria-pressed={active}
              onClick={() => {
                onTeamsCount(n);
              }}
              className={`lab-font-index h-12 w-10 rounded-[8px] text-lg transition-colors ${
                active ? '' : 'border-2 border-white/20 text-white/45'
              }`}
              style={active ? { background: FACE, color: INK, boxShadow: CARD_SHADOW } : undefined}
            >
              {n}
            </button>
          );
        })}
      </div>
    </motion.div>

    <LayoutGroup>
      <div
        className="grid items-start gap-3"
        style={{ gridTemplateColumns: `repeat(${teams.length}, minmax(0, 1fr))` }}
      >
        {teams.map((team) => (
          <motion.div key={team.color} layout="position" className="flex min-w-0 flex-col gap-2">
            <div
              className="relative overflow-hidden px-3 py-3"
              style={{ ...cardBack(team.color), color: INK, borderRadius: 14 }}
            >
              <FitText
                as="p"
                minFontSize={11}
                className="lab-font-deck relative text-lg leading-tight font-black"
              >
                {team.name}
              </FitText>
              <p className="lab-font-index relative mt-1 text-sm">{team.players.length}</p>
            </div>
            {team.players.map((player) => (
              <motion.button
                key={player}
                type="button"
                layoutId={`deck-player-${player}`}
                layout="position"
                transition={SPRING.snappy}
                whileTap={{ scale: 0.94 }}
                onClick={() => {
                  onMove(player);
                }}
                className="lab-font-deck flex min-h-12 items-center px-3 py-2 text-left text-[15px] leading-tight font-bold wrap-anywhere"
                style={{
                  background: FACE,
                  color: INK,
                  borderLeft: `5px solid ${rgba(team.color, 1)}`,
                  borderRadius: PLAYER_CARD_RADIUS,
                  boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
                }}
              >
                {player}
              </motion.button>
            ))}
          </motion.div>
        ))}
      </div>
    </LayoutGroup>

    <motion.p
      variants={STAGGER_ITEM}
      className="lab-font-deck text-center text-sm font-medium text-white/45"
    >
      Нажми на карточку игрока, чтобы переложить её в другую команду
    </motion.p>

    <motion.div variants={STAGGER_ITEM} className="mt-auto flex flex-col gap-3">
      <DeckButton tone="ghost" icon={Shuffle} onClick={onShuffle}>
        Перетасовать
      </DeckButton>
      <DeckButton tone="face" icon={Play} onClick={onStart}>
        Начать игру
      </DeckButton>
    </motion.div>
  </motion.div>
);

export const DECK_VARIANT: LabVariant = {
  id: 'deck',
  title: 'Колода',
  summary:
    'Настольная игра в руках: карту смахивают и переворачивают, игроки сдаются по командам как карты.',
  Pass: DeckPass,
  Reveal: DeckReveal,
  Choose: DeckChoose,
  Teams: DeckTeams,
};
