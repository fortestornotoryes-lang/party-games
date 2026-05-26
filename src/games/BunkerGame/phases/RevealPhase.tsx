import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, Fingerprint, Megaphone, Eye } from 'lucide-react';
import { PrimaryButton, Typography } from '@/components/UI';
import { feedbackService, VIBRATE } from '@/services/feedbackService';
import { rgba } from '@/theme/colors';
import { getRevealedTrait, type BunkerCharacter } from '../types';

interface RevealPhaseProps {
  characters: BunkerCharacter[];
  revealRound: number;        // 1, 2, or 3
  revealPlayerIdx: number;    // which player is currently revealing
  onConfirm: () => void;      // player confirmed they announced their trait
}

const ROUND_COLORS = ['', 'orange', 'yellow', 'sky', 'green', 'purple'] as const;
const ROUND_LABELS = ['', 'ПЕРВЫЙ', 'ВТОРОЙ', 'ТРЕТИЙ', 'ЧЕТВЁРТЫЙ', 'ПЯТЫЙ'];

export const RevealPhase: React.FC<RevealPhaseProps> = ({
  characters,
  revealRound,
  revealPlayerIdx,
  onConfirm,
}) => {
  const [isRevealed, setIsRevealed] = useState(false);

  const char = characters[revealPlayerIdx];
  const revealed = getRevealedTrait(char, revealRound)!;
  const colorName = ROUND_COLORS[revealRound];
  const isLast = revealPlayerIdx === characters.length - 1;

  const handleReveal = () => {
    feedbackService.vibrate(VIBRATE.tap);
    setIsRevealed(true);
  };

  const handleConfirm = () => {
    feedbackService.vibrate(VIBRATE.tap);
    onConfirm();
  };

  return (
    <motion.div
      key={`reveal-${revealRound}-${revealPlayerIdx}`}
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ type: 'spring', stiffness: 300, damping: 28 }}
      className="flex flex-col h-full px-5 py-6 gap-5"
    >
      {/* Round indicator */}
      <div className="flex items-center justify-center gap-3">
        <div className="flex gap-1.5">
          {[1, 2, 3, 4, 5].map(r => (
            <div
              key={r}
              className="h-1.5 w-8 rounded-full transition-all"
              style={{
                background: r === revealRound
                  ? `var(--color-premium-${colorName})`
                  : r < revealRound
                  ? 'rgba(255,255,255,0.3)'
                  : 'rgba(255,255,255,0.08)',
              }}
            />
          ))}
        </div>
        <Typography.Label size="xs" color="muted">
          РАУНД {ROUND_LABELS[revealRound]}
        </Typography.Label>
      </div>

      {/* Player counter */}
      <div className="text-center">
        <Typography.Caption color="faint">
          {revealPlayerIdx + 1} из {characters.length}
        </Typography.Caption>
      </div>

      {/* Pass-phone card */}
      <div
        className="rounded-2xl p-5 text-center space-y-2 flex flex-col gap-2"
        style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <Fingerprint className="w-8 h-8 text-white/20 mx-auto" />
        <Typography.Label size="xs" color="muted">Передайте телефон</Typography.Label>
        <Typography.Title size="md" color="white" align="center">
          {char.playerName.toUpperCase()}
        </Typography.Title>
        <Typography.Caption color="green" align="center">
          {char.age} л · {char.gender}
        </Typography.Caption>
      </div>

      {/* Trait reveal card — hidden until tap */}
      <AnimatePresence mode="wait">
        {!isRevealed ? (
          /* ── Locked state ── */
          <motion.button
            key="locked"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onClick={handleReveal}
            className="w-full rounded-2xl p-8 text-center space-y-3 active:scale-[0.98] transition-transform"
            style={{
              background: `linear-gradient(160deg, ${rgba(colorName as any, 0.08)} 0%, rgba(0,0,0,0.3) 100%)`,
              border: `1.5px dashed ${rgba(colorName as any, 0.3)}`,
            }}
          >
            <Eye
              className="w-10 h-10 mx-auto"
              style={{ color: `var(--color-premium-${colorName})`, opacity: 0.5 }}
            />
            <Typography.Heading size="sm" color="muted" align="center">
              Нажмите, чтобы увидеть черту
            </Typography.Heading>
            <Typography.Caption color="faint" align="center">
              Только {char.playerName} должен видеть экран
            </Typography.Caption>
          </motion.button>
        ) : (
          /* ── Revealed state ── */
          <motion.div
            key="revealed"
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 280, damping: 22 }}
            className="rounded-2xl p-6 text-center space-y-4"
            style={{
              background: `linear-gradient(160deg, ${rgba(colorName as any, 0.12)} 0%, rgba(0,0,0,0.3) 100%)`,
              border: `1.5px solid ${rgba(colorName as any, 0.35)}`,
              boxShadow: `0 0 60px ${rgba(colorName as any, 0.18)}, 0 24px 48px rgba(0,0,0,0.5)`,
            }}
          >
            {/* Label */}
            <div
              className="inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.3em]"
              style={{
                background: rgba(colorName as any, 0.15),
                border: `1px solid ${rgba(colorName as any, 0.3)}`,
                color: `var(--color-premium-${colorName})`,
              }}
            >
              {revealed.label}
            </div>

            {/* Emoji */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, type: 'spring', stiffness: 300 }}
              className="text-5xl leading-none"
            >
              {revealed.entry.emoji}
            </motion.div>

            {/* Value */}
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.18 }}
            >
              <Typography.Display size="sm" color="white" glow align="center">
                {revealed.entry.name.toUpperCase()}
              </Typography.Display>
            </motion.div>

            {/* Instruction */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex items-center justify-center gap-2"
            >
              <Megaphone className="w-4 h-4 text-white/30" />
              <Typography.Body size="xs" color="muted" align="center">
                Объявите это вслух всей группе
              </Typography.Body>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirm button — only shown after reveal */}
      <AnimatePresence>
        {isRevealed && (
          <motion.div
            key="confirm-btn"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="mt-auto"
          >
            <PrimaryButton onClick={handleConfirm} variant="outline" icon={ChevronRight}>
              {isLast ? 'ВСЕ ОБЪЯВИЛИ — К ОБСУЖДЕНИЮ' : 'ОБЪЯВИЛ — СЛЕДУЮЩИЙ'}
            </PrimaryButton>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
