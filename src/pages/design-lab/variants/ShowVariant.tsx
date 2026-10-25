import type { LucideIcon } from 'lucide-react';
import { Play, RefreshCw, Shuffle, Smartphone } from 'lucide-react';
import { LayoutGroup, motion } from 'motion/react';
import React, { useEffect, useState } from 'react';

import {
  DIFFICULTY_COLOR,
  DIFFICULTY_LABEL,
  formatSeconds,
  PICK_DELAY_MS,
  tiltOf,
} from '../demoData';
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
import { CARD_DEAL_VARIANTS, PHASE_VARIANTS, SPRING, STAGGER_ITEM } from '@/shared/theme/motion';
import type { GameTheme } from '@/shared/types';

/*
 * Вариант 1 «Шоу» — вечернее телешоу и аркадные кнопки.
 * Плотные цветные плиты с «глубиной» (нижняя грань — тот же цвет темнее), лампочки табло,
 * Dela Gothic One на всё крупное. Громко, читается с вытянутой руки.
 */

const BULBS = 11;
const BULB_STEP_S = 0.11;
/** Нижняя «грань» плиты — тот же цвет на тёмном фоне выглядит темнее */
const DEPTH_ALPHA = 0.42;

const slab = (color: GameTheme, depth: number): React.CSSProperties => ({
  background: rgba(color, 1),
  boxShadow: `0 ${depth}px 0 ${rgba(color, DEPTH_ALPHA)}, inset 0 2px 0 rgba(255,255,255,0.35)`,
});

const Bulbs: React.FC = () => (
  <div className="flex justify-between px-5 py-3" aria-hidden>
    {Array.from({ length: BULBS }, (_, i) => (
      <span
        key={i}
        className="lab-bulb h-2.5 w-2.5 rounded-full bg-[#fff3b0]"
        style={{
          animationDelay: `${i * BULB_STEP_S}s`,
          boxShadow: '0 0 10px rgba(255,236,150,0.9)',
        }}
      />
    ))}
  </div>
);

type ShowButtonTone = GameTheme | 'white' | 'ghost';

interface ShowButtonProps {
  tone: ShowButtonTone;
  onClick: () => void;
  disabled?: boolean;
  icon?: LucideIcon;
  children: React.ReactNode;
}

/** Аркадная клавиша: при нажатии «проваливается» в свою нижнюю грань */
const ShowButton: React.FC<ShowButtonProps> = ({
  tone,
  onClick,
  disabled,
  icon: Icon,
  children,
}) => {
  const isGhost = tone === 'ghost';
  const fill = isGhost ? 'transparent' : tone === 'white' ? '#fff' : rgba(tone, 1);
  const depth = isGhost
    ? 'rgba(255,255,255,0.14)'
    : tone === 'white'
      ? 'rgba(255,255,255,0.32)'
      : rgba(tone, DEPTH_ALPHA);
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`lab-font-show flex min-h-16 w-full items-center justify-center gap-3 rounded-[20px] px-6 text-lg shadow-[0_6px_0_var(--depth)] transition-[transform,box-shadow,opacity] duration-75 focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-white active:translate-y-1.5 active:shadow-[0_0_0_var(--depth)] disabled:pointer-events-none disabled:opacity-30 ${
        isGhost ? 'border-[3px] border-white/20 text-white' : 'text-black'
      }`}
      style={{ background: fill, '--depth': depth } as React.CSSProperties}
    >
      {Icon && <Icon className="h-6 w-6 shrink-0" strokeWidth={2.5} />}
      {children}
    </button>
  );
};

// ─── Передача телефона ────────────────────────────────────────────────────────

const ShowPass: React.FC<PassProps> = ({ player, index, total, accent, onDone }) => (
  <motion.div
    variants={PHASE_VARIANTS}
    initial="initial"
    animate="animate"
    exit="exit"
    className="flex flex-1 flex-col gap-6 p-6 perspective-distant"
  >
    <motion.div variants={STAGGER_ITEM} className="flex items-center justify-between gap-4">
      <span className="text-sm font-semibold text-white/50">
        Игрок {index} из {total}
      </span>
      <div className="flex gap-1.5" aria-hidden>
        {Array.from({ length: total }, (_, i) => (
          <span
            key={i}
            className="h-3 w-3 rounded-[3px]"
            style={{ background: i < index ? rgba(accent, 1) : 'rgba(255,255,255,0.12)' }}
          />
        ))}
      </div>
    </motion.div>

    <motion.div
      variants={CARD_DEAL_VARIANTS}
      className="flex flex-1 flex-col overflow-hidden rounded-[28px]"
      style={slab(accent, 8)}
    >
      <div className="bg-black/20">
        <Bulbs />
      </div>
      <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-8 text-center text-black">
        <p className="text-base font-semibold text-black/60">Телефон переходит к</p>
        <FitText as="h2" minFontSize={22} className="lab-font-show text-[64px] leading-[0.95]">
          {player}
        </FitText>
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-black">
          <Smartphone className="lab-tilt h-9 w-9" style={{ color: rgba(accent, 1) }} />
        </div>
        <p className="text-sm font-semibold text-black/60">Остальным не подглядывать</p>
      </div>
      <div className="bg-black/20">
        <Bulbs />
      </div>
    </motion.div>

    <motion.div variants={STAGGER_ITEM}>
      <ShowButton tone="white" onClick={onDone}>
        Это я, открыть
      </ShowButton>
    </motion.div>
  </motion.div>
);

// ─── Показ слова ──────────────────────────────────────────────────────────────

const ShowReveal: React.FC<RevealProps> = ({ player, word, accent, onDone }) => {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      variants={PHASE_VARIANTS}
      initial="initial"
      animate="animate"
      exit="exit"
      className="flex flex-1 flex-col gap-6 p-6"
    >
      <motion.p
        variants={STAGGER_ITEM}
        className="lab-font-show text-center text-2xl wrap-anywhere text-white"
      >
        {player}, твоё слово
      </motion.p>

      <motion.div variants={STAGGER_ITEM} className="flex flex-1 items-center perspective-distant">
        <motion.button
          type="button"
          onClick={() => {
            setOpen(true);
          }}
          disabled={open}
          animate={{ rotateY: open ? 180 : 0 }}
          transition={SPRING.flip}
          className="relative block aspect-[4/5] max-h-[60dvh] w-full transform-3d"
        >
          {/* Рубашка табло: вопрос и лампочки */}
          <div
            className="absolute inset-0 flex flex-col overflow-hidden rounded-[28px] border-[3px] bg-black backface-hidden"
            style={{ borderColor: rgba(accent, 1) }}
          >
            <Bulbs />
            <div className="flex flex-1 flex-col items-center justify-center gap-3">
              <span
                className="lab-font-show text-[140px] leading-none"
                style={{ color: rgba(accent, 1) }}
              >
                ?
              </span>
              <span className="text-base font-semibold text-white/60">Нажми, чтобы открыть</span>
            </div>
            <Bulbs />
          </div>
          {/* Лицевая сторона со словом */}
          <div
            className="absolute inset-0 flex rotate-y-180 flex-col items-center justify-center gap-4 rounded-[28px] px-6 text-black backface-hidden"
            style={slab(accent, 0)}
          >
            <FitText as="p" minFontSize={18} className="lab-font-show text-[52px] leading-[1.02]">
              {word}
            </FitText>
            <span className="text-base font-semibold text-black/60">Объясняешь ты</span>
          </div>
        </motion.button>
      </motion.div>

      <motion.div variants={STAGGER_ITEM}>
        <ShowButton tone="white" onClick={onDone} disabled={!open}>
          Готово, спрятать
        </ShowButton>
      </motion.div>
    </motion.div>
  );
};

// ─── Выбор слова ──────────────────────────────────────────────────────────────

const ShowChoose: React.FC<ChooseProps> = ({ options, onPick, onReplace }) => {
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
      <motion.div variants={STAGGER_ITEM} className="space-y-2">
        <h2 className="lab-font-show text-[30px] leading-none text-white">Выбери слово</h2>
        <p className="text-sm font-medium text-white/50">Сложнее слово — больше очков и времени</p>
      </motion.div>

      <div className="flex flex-1 flex-col justify-center gap-5">
        {options.map((option) => {
          const color = DIFFICULTY_COLOR[option.difficulty];
          const isPicked = picked?.word === option.word;
          const isDimmed = picked !== null && !isPicked;
          return (
            // Каскад и собственная анимация — на разных элементах (см. gotchas.md)
            <motion.div key={option.word} variants={STAGGER_ITEM}>
              <motion.button
                type="button"
                onClick={() => {
                  if (!picked) setPicked(option);
                }}
                animate={{
                  scale: isPicked ? 1.04 : isDimmed ? 0.96 : 1,
                  opacity: isDimmed ? 0.2 : 1,
                }}
                transition={SPRING.pop}
                className="flex w-full items-center gap-4 rounded-[22px] p-3 pr-5 text-left text-black transition-[translate] duration-75 active:translate-y-1"
                style={slab(color, 6)}
              >
                <span
                  className="lab-font-show flex h-16 w-16 shrink-0 items-center justify-center rounded-[16px] bg-black text-2xl"
                  style={{ color: rgba(color, 1) }}
                >
                  +{option.points}
                </span>
                <span className="min-w-0 flex-1">
                  <FitText
                    as="span"
                    minFontSize={14}
                    className="lab-font-show text-[28px] leading-tight"
                  >
                    {option.word}
                  </FitText>
                  <span className="mt-0.5 block text-sm font-semibold text-black/60">
                    {DIFFICULTY_LABEL[option.difficulty]}, {formatSeconds(option.seconds)} на
                    объяснение
                  </span>
                </span>
              </motion.button>
            </motion.div>
          );
        })}
      </div>

      <motion.div variants={STAGGER_ITEM}>
        <ShowButton tone="ghost" icon={RefreshCw} onClick={onReplace} disabled={picked !== null}>
          Другие слова (−1 очко)
        </ShowButton>
      </motion.div>
    </motion.div>
  );
};

// ─── Команды ──────────────────────────────────────────────────────────────────

const STICKER_TILT_DEG = 3;
const TEAM_RADIUS = 24;
const STICKER_RADIUS = 12;

const ShowTeams: React.FC<TeamsProps> = ({
  teams,
  accent,
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
      <h2 className="lab-font-show text-[28px] leading-none text-white">Команды</h2>
      <div className="flex gap-2">
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
              className={`lab-font-show h-12 w-12 rounded-[14px] text-lg transition-[transform,box-shadow] duration-75 active:translate-y-1 ${
                active
                  ? 'bg-white text-black shadow-[0_5px_0_rgba(255,255,255,0.3)]'
                  : 'bg-white/8 text-white/45 shadow-[0_5px_0_rgba(255,255,255,0.05)]'
              }`}
            >
              {n}
            </button>
          );
        })}
      </div>
    </motion.div>

    <LayoutGroup>
      <div className="flex flex-col gap-5">
        {teams.map((team) => (
          <motion.div
            key={team.color}
            layout
            transition={SPRING.snappy}
            className="p-4 text-black"
            style={{ ...slab(team.color, 6), borderRadius: TEAM_RADIUS }}
          >
            <motion.div layout="position" className="mb-3 flex items-center justify-between gap-3">
              <h3 className="lab-font-show min-w-0 text-xl wrap-anywhere">{team.name}</h3>
              <span
                className="lab-font-show shrink-0 rounded-full bg-black px-3 py-1 text-sm"
                style={{ color: rgba(team.color, 1) }}
              >
                {team.players.length}
              </span>
            </motion.div>
            <div className="flex min-h-11 flex-wrap gap-2">
              {team.players.map((player) => (
                <motion.button
                  key={player}
                  type="button"
                  layoutId={`show-player-${player}`}
                  layout="position"
                  transition={SPRING.snappy}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    onMove(player);
                  }}
                  className="min-h-11 max-w-full bg-white px-4 text-base leading-tight font-bold wrap-anywhere text-black shadow-[0_3px_0_rgba(0,0,0,0.3)]"
                  style={{ rotate: tiltOf(player, STICKER_TILT_DEG), borderRadius: STICKER_RADIUS }}
                >
                  {player}
                </motion.button>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </LayoutGroup>

    <motion.p variants={STAGGER_ITEM} className="text-center text-sm font-medium text-white/45">
      Нажми на игрока, чтобы перевести его в другую команду
    </motion.p>

    <motion.div variants={STAGGER_ITEM} className="mt-auto flex flex-col gap-4">
      <ShowButton tone="white" icon={Shuffle} onClick={onShuffle}>
        Перемешать
      </ShowButton>
      <ShowButton tone={accent} icon={Play} onClick={onStart}>
        Играть
      </ShowButton>
    </motion.div>
  </motion.div>
);

export const SHOW_VARIANT: LabVariant = {
  id: 'show',
  title: 'Шоу',
  summary: 'Телешоу и аркадные кнопки: цветные плиты с глубиной, лампочки табло, жирный гротеск.',
  Pass: ShowPass,
  Reveal: ShowReveal,
  Choose: ShowChoose,
  Teams: ShowTeams,
};
