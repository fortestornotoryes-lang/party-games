import { Check, UserX, Vote } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import React, { useState } from 'react';

import { ResourceContribRow } from '../components/ResourceContribRow';
import { getPlayerResourceContribution, getRevealedTrait } from '../helpers';
import { type BunkerCharacter, type DifficultyLevel } from '../types';

import { PrimaryButton } from '@/shared/components/PrimaryButton';
import { Typography } from '@/shared/components/Typography';
import { useTranslation } from '@/shared/i18n';
import { NS } from '@/shared/i18n/keys';
import { feedbackService, VIBRATE } from '@/shared/services/feedbackService';
import { DIFFICULTY } from '@/shared/types';

interface VotingPhaseProps {
  characters: BunkerCharacter[];
  bunkerCapacity: number;
  totalRounds: number;
  difficulty: DifficultyLevel;
  directorName?: string | null;
  onConfirm: (eliminatedNames: string[]) => void;
}

export const VotingPhase: React.FC<VotingPhaseProps> = ({
  characters,
  bunkerCapacity,
  totalRounds,
  difficulty,
  directorName,
  onConfirm,
}) => {
  const { t } = useTranslation();

  // Director occupies one guaranteed spot — exclude from voting
  const votable = directorName
    ? characters.filter((c) => c.playerName !== directorName)
    : characters;
  const toEliminate = Math.max(0, characters.length - bunkerCapacity);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const toggle = (name: string) => {
    feedbackService.vibrate(VIBRATE.tap);
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(name)) {
        next.delete(name);
      } else if (next.size < toEliminate) {
        next.add(name);
      }
      return next;
    });
  };

  const handleConfirm = () => {
    if (selected.size !== toEliminate) return;
    feedbackService.vibrate(VIBRATE.win);
    onConfirm(Array.from(selected));
  };

  const remaining = toEliminate - selected.size;

  return (
    <motion.div
      key="voting"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex min-h-full flex-col gap-5 px-5 py-6"
    >
      {/* Header */}
      <div className="space-y-1 text-center">
        <div className="flex items-center justify-center gap-2">
          <Vote className="text-premium-red h-4 w-4" />
          <Typography.Label size="sm" color="red">
            {t(`${NS.BUNKER}.votingLabel`)}
          </Typography.Label>
        </div>
        <Typography.Title size="sm" color="white" align="center">
          {t(`${NS.BUNKER}.whoWontEnter`)}
        </Typography.Title>
      </div>

      {/* Counter */}
      <div
        className="rounded-premium-md p-3 text-center"
        style={{
          background: remaining > 0 ? 'rgba(255,46,77,0.08)' : 'rgba(0,216,138,0.08)',
          border: `1px solid ${remaining > 0 ? 'rgba(255,46,77,0.25)' : 'rgba(0,216,138,0.25)'}`,
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={remaining}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
          >
            {remaining > 0 ? (
              <Typography.Body size="sm" color="body" align="center">
                {t(`${NS.BUNKER}.selectMore`, { n: remaining })}
              </Typography.Body>
            ) : (
              <Typography.Body size="sm" color="green" align="center">
                {t(`${NS.BUNKER}.selectionDone`, { n: toEliminate })}
              </Typography.Body>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Director safe badge */}
      {!!directorName && (
        <div
          className="rounded-premium-md flex items-center gap-3 px-4 py-3"
          style={{
            background: 'rgba(255,204,31,0.07)',
            border: '1px solid rgba(255,204,31,0.25)',
          }}
        >
          <span className="text-lg">👑</span>
          <div className="min-w-0 flex-1">
            <span className="font-black text-white uppercase italic">{directorName}</span>
            <span
              className="text-tag ml-2 font-black tracking-wider uppercase"
              style={{ color: 'var(--color-premium-yellow)' }}
            >
              {t(`${NS.BUNKER}.directorProtected`)}
            </span>
          </div>
        </div>
      )}

      {/* Player list */}
      <div className="min-h-0 flex-1 space-y-2 overflow-y-auto">
        {votable.map((char) => {
          const isSelected = selected.has(char.playerName);
          const revealed = Array.from({ length: totalRounds }, (_, i) => i + 1)
            .map((r) => getRevealedTrait(char, r))
            .filter(Boolean) as { label: string; entry: { emoji: string; name: string } }[];
          const contrib =
            difficulty === DIFFICULTY.EASY ? getPlayerResourceContribution(char) : null;

          return (
            <motion.button
              key={char.playerName}
              onClick={() => {
                toggle(char.playerName);
              }}
              whileTap={{ scale: 0.97 }}
              className="rounded-premium-md w-full text-left transition-all"
              style={{
                background: isSelected ? 'rgba(255,46,77,0.1)' : 'rgba(255,255,255,0.04)',
                border: isSelected
                  ? '1.5px solid rgba(255,46,77,0.4)'
                  : '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <div className="p-3.5">
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="rounded-premium-xs flex h-5 w-5 flex-shrink-0 items-center justify-center border-2 transition-all"
                      style={{
                        borderColor: isSelected ? 'rgba(255,46,77,0.8)' : 'rgba(255,255,255,0.2)',
                        background: isSelected ? 'rgba(255,46,77,0.8)' : 'transparent',
                      }}
                    >
                      {!!isSelected && <Check className="h-3 w-3 text-white" />}
                    </div>
                    <span className="text-lg leading-none font-black text-white uppercase italic">
                      {char.playerName}
                    </span>
                    {!!isSelected && (
                      <div className="flex items-center gap-1">
                        <UserX className="text-premium-red h-3.5 w-3.5" />
                        <span className="text-tag text-premium-red font-black tracking-wider uppercase">
                          {t(`${NS.BUNKER}.eliminatedBadge`)}
                        </span>
                      </div>
                    )}
                  </div>
                  <span className="text-xs font-bold text-white/30">
                    {char.gender} · {char.age}
                  </span>
                </div>

                {/* Revealed traits */}
                <div className="flex flex-wrap gap-1.5">
                  {revealed.map((rev, i) => (
                    <span
                      key={i}
                      className="rounded-premium-xs text-tag inline-flex items-center gap-1 px-2 py-0.5 font-bold"
                      style={{
                        background: 'rgba(255,255,255,0.06)',
                        color: isSelected ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.65)',
                      }}
                    >
                      {rev.entry.emoji} {rev.entry.name}
                    </span>
                  ))}
                </div>

                {/* Resource contribution (easy/medium only) */}
                {!!contrib && (
                  <ResourceContribRow contrib={contrib} className="mt-1.5 flex flex-wrap gap-2" />
                )}
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Confirm */}
      <PrimaryButton
        onClick={handleConfirm}
        disabled={selected.size !== toEliminate}
        variant="red"
        icon={UserX}
      >
        {t(`${NS.BUNKER}.confirmVoteBtn`)}
      </PrimaryButton>
    </motion.div>
  );
};
