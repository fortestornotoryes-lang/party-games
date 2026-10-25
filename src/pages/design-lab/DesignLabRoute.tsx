import { ArrowLeft, RotateCcw } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

import {
  dealTeams,
  LAB_ACCENTS,
  LAB_OPTION_SETS,
  LAB_PLAYERS,
  LAB_TEAM_COUNTS,
  LAB_WORDS,
  moveToNextTeam,
  shuffled,
} from './demoData';
import type { LabOption, LabVariant } from './types';
import { DECK_VARIANT } from './variants/DeckVariant';
import { ENVELOPE_VARIANT } from './variants/EnvelopeVariant';
import { SHOW_VARIANT } from './variants/ShowVariant';

import { rgba } from '@/shared/theme/colors';
import { SPRING } from '@/shared/theme/motion';
import type { GameTheme } from '@/shared/types';

import './designLab.css';

/*
 * Дизайн-лаборатория (dev-only, /design-lab): три варианта общих элементов игр —
 * передача телефона, показ слова, выбор слова, деление на команды — на живых демо-данных.
 * Выбранный вариант потом переносится в shared/components и features, а лаборатория удаляется.
 */

const ELEMENTS = [
  { id: 'pass', label: 'Передача' },
  { id: 'reveal', label: 'Показ слова' },
  { id: 'choose', label: 'Выбор слова' },
  { id: 'teams', label: 'Команды' },
] as const;
type ElementId = (typeof ELEMENTS)[number]['id'];

const VARIANTS: LabVariant[] = [SHOW_VARIANT, ENVELOPE_VARIANT, DECK_VARIANT];

const TOAST_MS = 1600;
const DEFAULT_TEAM_COUNT = 2;

export function DesignLabRoute() {
  const navigate = useNavigate();
  const [element, setElement] = useState<ElementId>('pass');
  const [variantIdx, setVariantIdx] = useState(0);
  const [accent, setAccent] = useState<GameTheme>(LAB_ACCENTS[0]);
  // Счётчик ходов демо: чей ход и какое слово
  const [step, setStep] = useState(0);
  const [optionSet, setOptionSet] = useState(0);
  const [teams, setTeams] = useState(() => dealTeams(LAB_PLAYERS, DEFAULT_TEAM_COUNT));
  const [toast, setToast] = useState<string | null>(null);
  // Перезапуск текущего экрана с нуля
  const [run, setRun] = useState(0);

  const variant = VARIANTS[variantIdx];
  const playerIdx = step % LAB_PLAYERS.length;
  const player = LAB_PLAYERS[playerIdx];
  const word = LAB_WORDS[step % LAB_WORDS.length];

  useEffect(() => {
    if (!toast) return;
    const id = window.setTimeout(() => {
      setToast(null);
    }, TOAST_MS);
    return () => {
      window.clearTimeout(id);
    };
  }, [toast]);

  const nextStep = useCallback(() => {
    setStep((s) => s + 1);
  }, []);
  const nextOptions = useCallback(() => {
    setOptionSet((n) => (n + 1) % LAB_OPTION_SETS.length);
  }, []);
  const onPick = useCallback(
    (option: LabOption) => {
      setToast(`Выбрано: ${option.word}`);
      nextOptions();
    },
    [nextOptions]
  );

  const restart = () => {
    setStep(0);
    setOptionSet(0);
    setTeams(dealTeams(LAB_PLAYERS, DEFAULT_TEAM_COUNT));
    setRun((n) => n + 1);
  };

  const stageKey = `${variant.id}-${element}-${run}-${
    element === 'choose' ? optionSet : element === 'teams' ? 0 : step
  }`;

  const renderStage = () => {
    switch (element) {
      case 'pass':
        return (
          <variant.Pass
            key={stageKey}
            player={player}
            index={playerIdx + 1}
            total={LAB_PLAYERS.length}
            accent={accent}
            onDone={nextStep}
          />
        );
      case 'reveal':
        return (
          <variant.Reveal
            key={stageKey}
            player={player}
            word={word}
            accent={accent}
            onDone={nextStep}
          />
        );
      case 'choose':
        return (
          <variant.Choose
            key={stageKey}
            options={LAB_OPTION_SETS[optionSet]}
            accent={accent}
            onPick={onPick}
            onReplace={() => {
              setToast('Слова заменены, команда теряет 1 очко');
              nextOptions();
            }}
          />
        );
      case 'teams':
        return (
          <variant.Teams
            key={stageKey}
            teams={teams}
            accent={accent}
            teamCounts={LAB_TEAM_COUNTS}
            onTeamsCount={(n) => {
              setTeams(dealTeams(LAB_PLAYERS, n));
            }}
            onMove={(p) => {
              setTeams((current) => moveToNextTeam(current, p));
            }}
            onShuffle={() => {
              setTeams((current) => dealTeams(shuffled(LAB_PLAYERS), current.length));
            }}
            onStart={() => {
              setToast('В лаборатории игра не запускается');
            }}
          />
        );
    }
  };

  return (
    <div className="flex min-h-dvh flex-col">
      <header
        className="sticky top-0 z-20 flex flex-col gap-3 border-b border-white/8 px-4 pt-3 pb-3"
        style={{ background: 'rgba(11,9,21,0.96)' }}
      >
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="В меню"
            onClick={() => void navigate('/')}
            className="-ml-2 flex h-11 w-11 items-center justify-center rounded-full text-white/60 active:bg-white/10"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="min-w-0 flex-1 text-base font-bold text-white">Дизайн общих экранов</h1>
          <button
            type="button"
            onClick={restart}
            className="flex h-11 items-center gap-2 rounded-full px-3 text-sm font-semibold text-white/60 active:bg-white/10"
          >
            <RotateCcw className="h-4 w-4" />
            Сначала
          </button>
        </div>

        <div className="-mx-4 flex gap-2 overflow-x-auto px-4" role="tablist" aria-label="Элемент">
          {ELEMENTS.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={item.id === element}
              onClick={() => {
                setElement(item.id);
              }}
              className={`h-10 shrink-0 rounded-full border px-4 text-sm font-semibold transition-colors ${
                item.id === element
                  ? 'border-white bg-white text-black'
                  : 'border-white/12 text-white/60'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div
          className="grid grid-cols-3 gap-1 rounded-[14px] bg-white/6 p-1"
          role="tablist"
          aria-label="Вариант"
        >
          {VARIANTS.map((v, i) => (
            <button
              key={v.id}
              type="button"
              role="tab"
              aria-selected={i === variantIdx}
              onClick={() => {
                setVariantIdx(i);
              }}
              className={`relative h-10 rounded-[10px] text-sm font-semibold transition-colors ${
                i === variantIdx ? 'text-black' : 'text-white/60'
              }`}
            >
              {i === variantIdx && (
                <motion.span
                  layoutId="lab-variant"
                  transition={SPRING.snappy}
                  className="absolute inset-0 rounded-[10px] bg-white"
                />
              )}
              <span className="relative">
                {i + 1}. {v.title}
              </span>
            </button>
          ))}
        </div>

        <div className="flex items-start justify-between gap-4">
          <p className="min-w-0 text-xs leading-snug text-white/45">{variant.summary}</p>
          <div className="flex shrink-0 gap-1" role="radiogroup" aria-label="Цвет игры">
            {LAB_ACCENTS.map((color) => (
              <button
                key={color}
                type="button"
                role="radio"
                aria-checked={color === accent}
                aria-label={color}
                onClick={() => {
                  setAccent(color);
                }}
                className="flex h-8 w-7 items-center justify-center"
              >
                <span
                  className="h-4 w-4 rounded-full transition-transform"
                  style={{
                    background: rgba(color, 1),
                    transform: color === accent ? 'scale(1.25)' : undefined,
                    boxShadow: color === accent ? '0 0 0 2px #0b0915, 0 0 0 3.5px #fff' : undefined,
                  }}
                />
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="relative flex flex-1 flex-col overflow-x-hidden">
        <AnimatePresence mode="wait">{renderStage()}</AnimatePresence>

        <AnimatePresence>
          {toast && (
            <motion.div
              key={toast}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              className="pointer-events-none fixed inset-x-0 bottom-[calc(1.5rem+env(safe-area-inset-bottom))] z-30 flex justify-center px-4"
            >
              <span className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-black shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                {toast}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
