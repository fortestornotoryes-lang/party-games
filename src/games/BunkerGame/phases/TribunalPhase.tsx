import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, Scale, X } from 'lucide-react';
import { PrimaryButton, Typography } from '@/components/UI';
import { feedbackService, VIBRATE } from '@/services/feedbackService';
import { rgba } from '@/theme/colors';
import { getHiddenTraits, type BunkerCharacter, type AttributeEntry, type TraitKey } from '../types';
import { pickRandom } from '@/utils/random';

interface TribunalPhaseProps {
  characters:      BunkerCharacter[];
  eliminatedNames: string[];
  bunkerTeam:      BunkerCharacter[];
  onDone: (finalEliminatedNames: string[]) => void;
}

type TribunalStep = 'choose' | 'reveal' | 'vote' | 'swap' | 'result';

interface AppealTrait {
  key:   TraitKey;
  label: string;
  entry: AttributeEntry;
}

const SLIDE = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -20 } } as const;

export const TribunalPhase: React.FC<TribunalPhaseProps> = ({
  characters,
  eliminatedNames,
  bunkerTeam,
  onDone,
}) => {
  const [step,        setStep]        = useState<TribunalStep>('choose');
  const [appellant,   setAppellant]   = useState<BunkerCharacter | null>(null);
  const [appealTrait, setAppealTrait] = useState<AppealTrait | null>(null);
  const [voteResult,  setVoteResult]  = useState<'pardoned' | 'rejected' | null>(null);
  const [swapTarget,  setSwapTarget]  = useState<string | null>(null);

  const eliminated = characters.filter(c => eliminatedNames.includes(c.playerName));

  const handleAppeal = (char: BunkerCharacter) => {
    feedbackService.vibrate(VIBRATE.tap);
    const hidden = getHiddenTraits(char);
    setAppellant(char);
    if (hidden.length > 0) {
      setAppealTrait(pickRandom(hidden));
      setStep('reveal');
    } else {
      // All traits already revealed — skip straight to vote
      setAppealTrait(null);
      setStep('vote');
    }
  };

  const handleSkip = () => {
    feedbackService.vibrate(VIBRATE.tap);
    onDone(eliminatedNames);
  };

  const handleRevealContinue = () => {
    feedbackService.vibrate(VIBRATE.tap);
    setStep('vote');
  };

  const handleVote = (result: 'pardoned' | 'rejected') => {
    feedbackService.vibrate(result === 'pardoned' ? VIBRATE.win : VIBRATE.tap);
    setVoteResult(result);
    setStep(result === 'pardoned' ? 'swap' : 'result');
  };

  const handleSwap = (targetName: string) => {
    feedbackService.vibrate(VIBRATE.tap);
    setSwapTarget(targetName);
    setStep('result');
  };

  const handleFinish = () => {
    feedbackService.vibrate(VIBRATE.tap);
    if (voteResult === 'pardoned' && appellant && swapTarget) {
      onDone([
        ...eliminatedNames.filter(n => n !== appellant.playerName),
        swapTarget,
      ]);
    } else {
      onDone(eliminatedNames);
    }
  };

  const stepContent = (() => {
    // ── CHOOSE ────────────────────────────────────────────────────────────────
    if (step === 'choose') return (
      <motion.div key="choose" {...SLIDE}
        className="flex flex-col min-h-full px-5 py-6 gap-5"
      >
        <div className="text-center space-y-1">
          <div className="flex items-center justify-center gap-2">
            <Scale className="w-4 h-4" style={{ color: 'var(--color-premium-yellow)' }} />
            <Typography.Label size="sm" color="muted">ТРИБУНАЛ</Typography.Label>
          </div>
          <Typography.Title size="sm" color="white" align="center">
            Исключённые могут оспорить решение
          </Typography.Title>
          <Typography.Caption color="faint" align="center">
            Один игрок раскроет скрытую черту и попросит пересмотреть голосование
          </Typography.Caption>
        </div>

        <div className="space-y-2">
          <Typography.Label size="xs" color="muted">Исключённые игроки</Typography.Label>
          <div className="space-y-2">
            {eliminated.map(char => (
              <motion.button
                key={char.playerName}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleAppeal(char)}
                className="w-full flex items-center justify-between p-4 rounded-2xl text-left"
                style={{
                  background: rgba('yellow', 0.05),
                  border: `1px solid ${rgba('yellow', 0.2)}`,
                }}
              >
                <div>
                  <div className="font-black italic uppercase text-white leading-none">
                    {char.playerName}
                  </div>
                  <div className="text-xs text-white/40 mt-1">
                    {char.age} л · {char.gender} · {char.profession.emoji} {char.profession.name}
                  </div>
                </div>
                <div
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl flex-shrink-0"
                  style={{
                    background: rgba('yellow', 0.12),
                    border: `1px solid ${rgba('yellow', 0.3)}`,
                  }}
                >
                  <Scale className="w-3.5 h-3.5" style={{ color: 'var(--color-premium-yellow)' }} />
                  <span
                    className="text-[10px] font-black uppercase tracking-wider"
                    style={{ color: 'var(--color-premium-yellow)' }}
                  >
                    Оспорить
                  </span>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        <div className="mt-auto">
          <PrimaryButton onClick={handleSkip} variant="outline" icon={ChevronRight}>
            ПРОПУСТИТЬ — К СИМУЛЯЦИИ
          </PrimaryButton>
        </div>
      </motion.div>
    );

    // ── REVEAL ────────────────────────────────────────────────────────────────
    if (step === 'reveal' && appellant && appealTrait) return (
      <motion.div key="reveal" {...SLIDE}
        className="flex flex-col min-h-full px-5 py-6 gap-6"
      >
        <div className="text-center space-y-1">
          <Typography.Label size="sm" color="muted">АПЕЛЛЯЦИЯ</Typography.Label>
          <Typography.Title size="sm" color="white" align="center">
            {appellant.playerName} раскрывает скрытую черту
          </Typography.Title>
        </div>

        <div className="flex-1 flex items-center justify-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
            className="w-full rounded-[2rem] p-8 text-center space-y-4"
            style={{
              background: `linear-gradient(160deg, ${rgba('yellow', 0.12)} 0%, rgba(0,0,0,0.3) 100%)`,
              border: `1.5px solid ${rgba('yellow', 0.35)}`,
              boxShadow: `0 0 60px ${rgba('yellow', 0.18)}, 0 24px 48px rgba(0,0,0,0.5)`,
            }}
          >
            <div
              className="inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.3em]"
              style={{
                background: rgba('yellow', 0.15),
                border: `1px solid ${rgba('yellow', 0.3)}`,
                color: 'var(--color-premium-yellow)',
              }}
            >
              {appealTrait.label} — было скрыто
            </div>
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, type: 'spring', stiffness: 300 }}
              className="text-6xl leading-none"
            >
              {appealTrait.entry.emoji}
            </motion.div>
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.18 }}
            >
              <Typography.Display size="sm" color="white" glow align="center">
                {appealTrait.entry.name.toUpperCase()}
              </Typography.Display>
            </motion.div>
          </motion.div>
        </div>

        <PrimaryButton onClick={handleRevealContinue} icon={ChevronRight}>
          К ГОЛОСОВАНИЮ
        </PrimaryButton>
      </motion.div>
    );

    // ── VOTE ──────────────────────────────────────────────────────────────────
    if (step === 'vote' && appellant) return (
      <motion.div key="vote" {...SLIDE}
        className="flex flex-col min-h-full px-5 py-6 gap-6"
      >
        <div className="text-center space-y-1">
          <Typography.Label size="sm" color="muted">ГОЛОСОВАНИЕ ТРИБУНАЛА</Typography.Label>
          <Typography.Title size="sm" color="white" align="center">
            Включить {appellant.playerName} в бункер?
          </Typography.Title>
          <Typography.Caption color="faint" align="center">
            Большинство голосов — решающее
          </Typography.Caption>
        </div>

        <div className="flex-1 flex flex-col justify-center gap-4">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => handleVote('pardoned')}
            className="w-full p-6 rounded-[2rem] text-center space-y-2 active:scale-[0.98] transition-transform"
            style={{
              background: rgba('green', 0.08),
              border: `2px solid ${rgba('green', 0.35)}`,
            }}
          >
            <div className="text-4xl">🕊️</div>
            <Typography.Heading size="sm" color="white" align="center">ПОМИЛОВАТЬ</Typography.Heading>
            <Typography.Caption color="faint" align="center">
              Впустить в бункер, выбрать кто освобождает место
            </Typography.Caption>
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => handleVote('rejected')}
            className="w-full p-6 rounded-[2rem] text-center space-y-2 active:scale-[0.98] transition-transform"
            style={{
              background: rgba('red', 0.06),
              border: `2px solid ${rgba('red', 0.25)}`,
            }}
          >
            <div className="text-4xl">⛔</div>
            <Typography.Heading size="sm" color="white" align="center">ИСКЛЮЧИТЬ</Typography.Heading>
            <Typography.Caption color="faint" align="center">Решение остаётся в силе</Typography.Caption>
          </motion.button>
        </div>
      </motion.div>
    );

    // ── SWAP ──────────────────────────────────────────────────────────────────
    if (step === 'swap' && appellant) return (
      <motion.div key="swap" {...SLIDE}
        className="flex flex-col min-h-full px-5 py-6 gap-5"
      >
        <div className="text-center space-y-2">
          <div
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest"
            style={{
              background: rgba('green', 0.12),
              border: `1px solid ${rgba('green', 0.3)}`,
              color: 'var(--color-premium-green)',
            }}
          >
            🕊️ {appellant.playerName} помилован
          </div>
          <Typography.Title size="sm" color="white" align="center">
            Кто освобождает место?
          </Typography.Title>
          <Typography.Caption color="faint" align="center">
            Выберите одного из тех, кто уже в бункере
          </Typography.Caption>
        </div>

        <div className="flex-1 overflow-y-auto space-y-2 min-h-0">
          {bunkerTeam.map(char => (
            <motion.button
              key={char.playerName}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleSwap(char.playerName)}
              className="w-full flex items-center justify-between p-4 rounded-2xl text-left"
              style={{
                background: rgba('red', 0.05),
                border: `1px solid ${rgba('red', 0.2)}`,
              }}
            >
              <div>
                <div className="font-black italic uppercase text-white leading-none">{char.playerName}</div>
                <div className="text-xs text-white/40 mt-1">
                  {char.age} л · {char.gender} · {char.profession.emoji} {char.profession.name}
                </div>
              </div>
              <div
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl flex-shrink-0"
                style={{ background: rgba('red', 0.12), border: `1px solid ${rgba('red', 0.3)}` }}
              >
                <X className="w-3.5 h-3.5 text-premium-red" />
                <span className="text-[10px] font-black uppercase tracking-wider text-premium-red">
                  Исключить
                </span>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>
    );

    // ── RESULT ────────────────────────────────────────────────────────────────
    if (step === 'result') {
      const pardoned = voteResult === 'pardoned';
      return (
        <motion.div key="result"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, y: -20 }}
          className="flex flex-col min-h-full px-5 py-6 gap-6 items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            className="text-7xl leading-none"
          >
            {pardoned ? '🕊️' : '⛔'}
          </motion.div>

          <div className="text-center space-y-2">
            <Typography.Display size="sm" color="white" glow align="center">
              {pardoned
                ? `${appellant?.playerName} ПОМИЛОВАН`
                : `${appellant?.playerName} ИСКЛЮЧЁН`}
            </Typography.Display>
            {pardoned && swapTarget && (
              <Typography.Body size="sm" color="muted" align="center">
                Место освобождает{' '}
                <span className="text-premium-red font-black">{swapTarget}</span>
              </Typography.Body>
            )}
          </div>

          <div className="w-full mt-auto">
            <PrimaryButton
              onClick={handleFinish}
              variant={pardoned ? 'premium' : 'outline'}
              icon={ChevronRight}
            >
              К СИМУЛЯЦИИ ВЫЖИВАНИЯ
            </PrimaryButton>
          </div>
        </motion.div>
      );
    }

    return null;
  })();

  return (
    <AnimatePresence mode="wait">
      {stepContent}
    </AnimatePresence>
  );
};
