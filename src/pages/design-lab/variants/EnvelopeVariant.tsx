import { Check, Shuffle } from 'lucide-react';
import { LayoutGroup, motion } from 'motion/react';
import React, { useEffect, useState } from 'react';

import {
  DIFFICULTY_COLOR,
  DIFFICULTY_LABEL,
  formatSeconds,
  PICK_DELAY_MS,
  pointsLabel,
} from '../demoData';
import type {
  ChooseProps,
  LabOption,
  LabVariant,
  PassProps,
  RevealProps,
  TeamsProps,
} from '../types';
import { useHoldProgress } from '../useHoldProgress';

import { FitText } from '@/shared/components/FitText';
import { rgba } from '@/shared/theme/colors';
import { PHASE_VARIANTS, SPRING, STAGGER_ITEM } from '@/shared/theme/motion';
import type { Difficulty } from '@/shared/types';

/*
 * Вариант 2 «Конверт» — тихая секретность.
 * Тёмная бумага, волосяные линии, Cormorant Garamond с курсивом. Цвет игры — только сургуч.
 * Главное — приватность: конверт вскрывается удержанием печати, слово видно,
 * пока палец на листе, а «зачёркнутая» плашка не выдаёт длину слова.
 */

const PAPER = '#1b1726';
const FLAP = '#2b2640';
const INK = '#ece8f4';
const HAIR = 'rgba(236,232,244,0.12)';

const HOLD_MS = 800;
/** Пауза после вскрытия: успевает открыться клапан, мс */
const OPEN_DELAY_MS = 700;
const SEAL_RING_R = 44;

const DIFFICULTY_RANK: Record<Difficulty, number> = { easy: 1, medium: 2, hard: 3 };

interface InkButtonProps {
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}

const InkButton: React.FC<InkButtonProps> = ({ onClick, disabled, children }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className="min-h-14 w-full rounded-full px-6 text-base font-semibold transition-[opacity,transform] duration-150 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white active:scale-[0.98] disabled:opacity-25"
    style={{ background: INK, color: PAPER }}
  >
    {children}
  </button>
);

const TextButton: React.FC<InkButtonProps> = ({ onClick, disabled, children }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className="mx-auto flex min-h-11 items-center gap-2 px-3 text-sm font-medium text-white/60 underline decoration-white/25 underline-offset-4 disabled:opacity-30"
  >
    {children}
  </button>
);

// ─── Передача телефона ────────────────────────────────────────────────────────

const EnvelopePass: React.FC<PassProps> = ({ player, index, total, accent, onDone }) => {
  const [opened, setOpened] = useState(false);
  const { progress, handlers } = useHoldProgress(HOLD_MS, () => {
    setOpened(true);
  });

  useEffect(() => {
    if (!opened) return;
    const id = window.setTimeout(onDone, OPEN_DELAY_MS);
    return () => {
      window.clearTimeout(id);
    };
  }, [opened, onDone]);

  return (
    <motion.div
      variants={PHASE_VARIANTS}
      initial="initial"
      animate="animate"
      exit="exit"
      className="flex flex-1 flex-col items-center justify-center gap-8 p-6"
    >
      <motion.div variants={STAGGER_ITEM} className="relative z-10 w-full text-center">
        <p className="text-sm text-white/45">
          Лично в руки, письмо {index} из {total}
        </p>
        <FitText
          as="h2"
          minFontSize={22}
          className="lab-font-serif mt-2 text-[60px] leading-none font-medium italic"
          style={{ color: INK }}
        >
          {player}
        </FitText>
      </motion.div>

      <motion.div variants={STAGGER_ITEM} className="w-full max-w-sm perspective-distant">
        <div
          className="relative aspect-[3/2] w-full rounded-[10px]"
          style={{
            background: PAPER,
            border: `1px solid ${HAIR}`,
            boxShadow: '0 30px 60px rgba(0,0,0,0.5)',
          }}
        >
          {/* Нижние сгибы конверта */}
          <svg
            className="absolute inset-0 h-full w-full"
            viewBox="0 0 300 200"
            preserveAspectRatio="none"
            aria-hidden
          >
            <path
              d="M0 200 L150 105 L300 200"
              fill="none"
              stroke={HAIR}
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
          {/* Клапан: открывается вверх после вскрытия печати */}
          <motion.div
            className="absolute inset-x-0 top-0 h-[58%] origin-top"
            style={{ clipPath: 'polygon(0 0, 100% 0, 50% 100%)', background: FLAP }}
            animate={{ rotateX: opened ? 180 : 0, opacity: opened ? 0 : 1 }}
            transition={{ rotateX: SPRING.flip, opacity: { duration: 0.45, ease: 'easeIn' } }}
          />
          {/* Печать на кончике клапана */}
          <motion.button
            type="button"
            aria-label={`Удерживай, чтобы вскрыть письмо для ${player}`}
            {...handlers}
            animate={opened ? { scale: 1.4, opacity: 0 } : { scale: 1, opacity: 1 }}
            transition={{ duration: 0.35 }}
            className="lab-hold absolute top-[58%] left-1/2 flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            <svg
              className="absolute inset-0 h-full w-full -rotate-90"
              viewBox="0 0 96 96"
              aria-hidden
            >
              <circle cx="48" cy="48" r={SEAL_RING_R} fill="none" stroke={HAIR} strokeWidth="2" />
              <motion.circle
                cx="48"
                cy="48"
                r={SEAL_RING_R}
                fill="none"
                stroke={INK}
                strokeWidth="2"
                strokeLinecap="butt"
                style={{ pathLength: progress }}
              />
            </svg>
            <span
              className="lab-font-serif flex h-[70px] w-[70px] items-center justify-center rounded-full text-4xl font-semibold text-white/90 italic"
              style={{
                background: `radial-gradient(circle at 35% 30%, ${rgba(accent, 1)}, ${rgba(accent, 0.55)} 70%)`,
                boxShadow: `0 0 0 4px ${rgba(accent, 0.25)}, 0 6px 14px rgba(0,0,0,0.45)`,
              }}
            >
              {player.charAt(0).toUpperCase()}
            </span>
          </motion.button>
        </div>
      </motion.div>

      <motion.p variants={STAGGER_ITEM} className="text-sm text-white/55">
        Удерживай печать, чтобы вскрыть
      </motion.p>
    </motion.div>
  );
};

// ─── Показ слова ──────────────────────────────────────────────────────────────

const EnvelopeReveal: React.FC<RevealProps> = ({ player, word, accent, onDone }) => {
  const [peeking, setPeeking] = useState(false);
  const [seen, setSeen] = useState(false);

  const show = () => {
    setPeeking(true);
    setSeen(true);
  };
  const hide = () => {
    setPeeking(false);
  };

  return (
    <motion.div
      variants={PHASE_VARIANTS}
      initial="initial"
      animate="animate"
      exit="exit"
      className="flex flex-1 flex-col gap-6 p-6"
    >
      <motion.div variants={STAGGER_ITEM} className="flex flex-1 items-center">
        <button
          type="button"
          onPointerDown={show}
          onPointerUp={hide}
          onPointerLeave={hide}
          onPointerCancel={hide}
          onKeyDown={(e) => {
            if (e.key === ' ' || e.key === 'Enter') show();
          }}
          onKeyUp={hide}
          onContextMenu={(e) => {
            e.preventDefault();
          }}
          className="lab-hold relative w-full rounded-[10px] px-7 pt-10 pb-8 text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          style={{
            background: PAPER,
            border: `1px solid ${HAIR}`,
            boxShadow: '0 30px 60px rgba(0,0,0,0.5)',
          }}
        >
          <span
            className="absolute inset-x-7 top-0 h-[3px]"
            style={{ background: rgba(accent, 0.9) }}
          />
          <p className="lab-font-serif text-[30px] leading-tight wrap-anywhere text-white/70 italic">
            {player},
            <br />
            твоё слово:
          </p>
          <div className="relative mt-6 flex min-h-24 items-center">
            <motion.div
              className="w-full"
              animate={{ opacity: peeking ? 1 : 0 }}
              transition={{ duration: 0.12 }}
            >
              <FitText
                as="p"
                minFontSize={18}
                className="lab-font-serif text-[56px] leading-none font-semibold"
                style={{ color: INK }}
              >
                {word}
              </FitText>
            </motion.div>
            {/* Зачёркнутая плашка одной ширины для любого слова — не выдаёт длину */}
            <motion.span
              aria-hidden
              className="absolute inset-y-4 left-0 w-[78%] origin-left rounded-[3px]"
              style={{
                background:
                  'repeating-linear-gradient(-45deg, rgba(236,232,244,0.16) 0 6px, rgba(236,232,244,0.07) 6px 12px)',
              }}
              animate={{ scaleX: peeking ? 0 : 1 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
            />
          </div>
          <p className="mt-6 text-sm text-white/45">
            {peeking
              ? 'Отпусти, и слово снова спрячется'
              : 'Слово видно, пока держишь палец на листе'}
          </p>
        </button>
      </motion.div>

      <motion.div variants={STAGGER_ITEM}>
        <InkButton onClick={onDone} disabled={!seen}>
          Прочитано, передать дальше
        </InkButton>
      </motion.div>
    </motion.div>
  );
};

// ─── Выбор слова ──────────────────────────────────────────────────────────────

const EnvelopeChoose: React.FC<ChooseProps> = ({ options, accent, onPick, onReplace }) => {
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
      className="flex flex-1 flex-col gap-6 p-6"
    >
      <motion.div variants={STAGGER_ITEM}>
        <h2
          className="lab-font-serif text-[42px] leading-none font-medium italic"
          style={{ color: INK }}
        >
          Выбери слово
        </h2>
        <p className="mt-2 text-sm text-white/45">Чем сложнее, тем больше очков и времени</p>
      </motion.div>

      <div className="flex flex-1 flex-col justify-center gap-4">
        {options.map((option) => {
          const isPicked = picked?.word === option.word;
          const isDimmed = picked !== null && !isPicked;
          const rank = DIFFICULTY_RANK[option.difficulty];
          return (
            <motion.div key={option.word} variants={STAGGER_ITEM}>
              <motion.button
                type="button"
                onClick={() => {
                  if (!picked) setPicked(option);
                }}
                animate={{ opacity: isDimmed ? 0.25 : 1 }}
                transition={{ duration: 0.25 }}
                className="relative w-full rounded-[10px] px-5 py-5 text-left transition-colors"
                style={{
                  background: PAPER,
                  border: `1px solid ${isPicked ? rgba(accent, 0.8) : HAIR}`,
                }}
              >
                <span className="flex items-end justify-between gap-4">
                  <FitText
                    as="span"
                    minFontSize={16}
                    className="lab-font-serif min-w-0 text-[34px] leading-none font-semibold"
                    style={{ color: INK }}
                  >
                    {option.word}
                  </FitText>
                  <span className="lab-font-serif shrink-0 text-xl text-white/60 italic">
                    {pointsLabel(option.points)}
                  </span>
                </span>
                <span className="mt-3 flex items-center gap-2 text-sm text-white/45">
                  <span className="flex gap-1" aria-hidden>
                    {[1, 2, 3].map((dot) => (
                      <span
                        key={dot}
                        className="h-1.5 w-1.5 rounded-full"
                        style={{
                          background:
                            dot <= rank ? rgba(DIFFICULTY_COLOR[option.difficulty], 1) : HAIR,
                        }}
                      />
                    ))}
                  </span>
                  {DIFFICULTY_LABEL[option.difficulty]}, {formatSeconds(option.seconds)} на
                  объяснение
                </span>
                {isPicked && (
                  <motion.span
                    aria-hidden
                    className="absolute -top-4 -right-3 flex h-12 w-12 items-center justify-center rounded-full text-white"
                    style={{
                      background: `radial-gradient(circle at 35% 30%, ${rgba(accent, 1)}, ${rgba(accent, 0.6)} 70%)`,
                      boxShadow: `0 0 0 3px ${rgba(accent, 0.25)}, 0 6px 14px rgba(0,0,0,0.45)`,
                    }}
                    initial={{ scale: 2.2, opacity: 0, rotate: -30 }}
                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                    transition={SPRING.pop}
                  >
                    <Check className="h-6 w-6" strokeWidth={2.5} />
                  </motion.span>
                )}
              </motion.button>
            </motion.div>
          );
        })}
      </div>

      <motion.div variants={STAGGER_ITEM}>
        <TextButton onClick={onReplace} disabled={picked !== null}>
          Взять другие слова (−1 очко)
        </TextButton>
      </motion.div>
    </motion.div>
  );
};

// ─── Команды ──────────────────────────────────────────────────────────────────

const playersLabel = (n: number): string => {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return `${n} игрок`;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return `${n} игрока`;
  return `${n} игроков`;
};

const EnvelopeTeams: React.FC<TeamsProps> = ({
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
    className="flex flex-1 flex-col gap-7 p-6"
  >
    <motion.div variants={STAGGER_ITEM} className="flex items-end justify-between gap-3">
      <h2
        className="lab-font-serif text-[42px] leading-none font-medium italic"
        style={{ color: INK }}
      >
        Команды
      </h2>
      <div className="flex" role="group" aria-label="Число команд">
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
              className={`lab-font-serif relative h-11 w-11 text-[26px] transition-colors ${active ? 'text-white' : 'text-white/35'}`}
            >
              {n}
              {active && (
                <motion.span
                  layoutId="envelope-teams-count"
                  transition={SPRING.snappy}
                  className="absolute inset-x-3 bottom-1 h-px"
                  style={{ background: INK }}
                />
              )}
            </button>
          );
        })}
      </div>
    </motion.div>

    <LayoutGroup>
      <div className="flex flex-col gap-8">
        {teams.map((team) => (
          <motion.section key={team.color} layout transition={SPRING.snappy}>
            <motion.div
              layout="position"
              className="flex items-baseline justify-between gap-3 border-b pb-2"
              style={{ borderColor: rgba(team.color, 0.55) }}
            >
              <h3
                className="lab-font-serif min-w-0 text-[30px] leading-none font-medium wrap-anywhere italic"
                style={{ color: rgba(team.color, 1) }}
              >
                {team.name}
              </h3>
              <span className="lab-font-serif shrink-0 text-lg text-white/45 italic">
                {playersLabel(team.players.length)}
              </span>
            </motion.div>
            <ul>
              {team.players.map((player) => (
                <motion.li
                  key={player}
                  layoutId={`envelope-player-${player}`}
                  layout="position"
                  transition={SPRING.snappy}
                >
                  <button
                    type="button"
                    onClick={() => {
                      onMove(player);
                    }}
                    className="lab-font-serif flex min-h-12 w-full items-center border-b py-2 text-left text-[24px] leading-tight wrap-anywhere transition-colors active:bg-white/5"
                    style={{ borderColor: HAIR, color: INK }}
                  >
                    {player}
                  </button>
                </motion.li>
              ))}
            </ul>
          </motion.section>
        ))}
      </div>
    </LayoutGroup>

    <motion.p variants={STAGGER_ITEM} className="text-sm text-white/45">
      Нажми на имя, чтобы пересадить игрока в следующую команду
    </motion.p>

    <motion.div variants={STAGGER_ITEM} className="mt-auto flex flex-col gap-2">
      <InkButton onClick={onStart}>Начать игру</InkButton>
      <TextButton onClick={onShuffle}>
        <Shuffle className="h-4 w-4" />
        Перемешать
      </TextButton>
    </motion.div>
  </motion.div>
);

export const ENVELOPE_VARIANT: LabVariant = {
  id: 'envelope',
  title: 'Конверт',
  summary:
    'Тихая секретность: конверт вскрывается удержанием печати, слово видно только пока держишь палец.',
  Pass: EnvelopePass,
  Reveal: EnvelopeReveal,
  Choose: EnvelopeChoose,
  Teams: EnvelopeTeams,
};
