import type { LucideIcon } from 'lucide-react';
import { ArrowLeft, HelpCircle, Play, Shuffle, UserPlus, Users } from 'lucide-react';
import { motion, Reorder } from 'motion/react';
import React, { useEffect, useState } from 'react';

import { useGameSettings } from '@/entities/game/model/GameSettingsContext';
import { DEFAULT_NAMES, PlayerRow } from '@/entities/player/components/PlayerRow';
import type { PlayerEntry } from '@/entities/player/types';
import { InstructionsModal } from '@/shared/components/InstructionsModal';
import { PrimaryButton } from '@/shared/components/PrimaryButton';
import { Typography } from '@/shared/components/Typography';
import { shuffle } from '@/shared/helpers/random';
import { storageService } from '@/shared/services/storageService';
import { getTheme } from '@/shared/theme/colors';
import { DIFFICULTY, type GameTheme } from '@/shared/types';

interface SetupProps {
  onStart: (playerNames: string[]) => void;
  onBack: () => void;
  title: string;
  subtitle: string;
  icon: LucideIcon;
  themeColor: GameTheme;
  playerPlaceholder: string;
  addPlayerLabel: string;
  instructions: { title: string; content: string }[];
  description?: string;
  minPlayers: number;
  maxPlayers?: number;
  children?: React.ReactNode;
}

let _idCounter = 0;
const makeId = () => `p-${++_idCounter}-${Math.random().toString(36).slice(2, 6)}`;

export const Setup: React.FC<SetupProps> = ({
  onStart,
  onBack,
  title,
  subtitle,
  themeColor,
  playerPlaceholder,
  instructions,
  description,
  minPlayers,
  maxPlayers = 12,
  children,
}) => {
  const { difficulty } = useGameSettings();
  const config = getTheme(themeColor);
  // TODO: RN — replace with useEffect async load (useState lazy initializer incompatible with async)
  const [players, setPlayers] = useState<PlayerEntry[]>(() => {
    const savedNames = storageService.getPlayers();
    if (savedNames.length >= minPlayers) {
      return savedNames.slice(0, maxPlayers).map((name) => ({ id: makeId(), name }));
    }
    const shuffled = shuffle(DEFAULT_NAMES);
    return Array.from({ length: minPlayers }, (_, i) => ({
      id: makeId(),
      name: shuffled[i] ?? `${playerPlaceholder} ${i + 1}`,
    }));
  });
  const [showInstructions, setShowInstructions] = useState(false);

  useEffect(() => {
    const names = players.map((p) => p.name);
    if (names.some((n) => n.trim() !== '')) {
      storageService.savePlayers(names);
    }
  }, [players]);

  const addPlayer = () => {
    if (players.length < maxPlayers)
      setPlayers((prev) => [
        ...prev,
        {
          id: makeId(),
          name: `${playerPlaceholder} ${prev.length + 1}`,
        },
      ]);
  };
  const removePlayer = (id: string) => {
    if (players.length > minPlayers) setPlayers((prev) => prev.filter((p) => p.id !== id));
  };
  const handleNameChange = (id: string, name: string) => {
    setPlayers((prev) => prev.map((p) => (p.id === id ? { ...p, name } : p)));
  };
  const shufflePlayers = () => {
    setPlayers((prev) => shuffle(prev));
  };

  const isReady = players.every((p) => p.name.trim() !== '');
  const canRemove = players.length > minPlayers;
  const titleWords = title.split(' ');

  return (
    <div className="relative flex min-h-screen flex-col items-center px-6 pt-6 pb-24">
      {/* Ambient Background Gradient */}

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Header Section */}
        <div className="relative mb-12">
          <div className="mb-4 flex items-center justify-between">
            <button
              onClick={onBack}
              className="glass-card z-50 flex h-12 w-12 items-center justify-center rounded-full border-none text-white transition-all active:scale-90"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <Typography.Title className="text-center leading-[0.75] tracking-tighter">
              {titleWords.length > 1 ? (
                <>
                  {titleWords.slice(0, -1).join(' ')} <br />
                  <span className={`${config.text} drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]`}>
                    {titleWords.at(-1)}
                  </span>
                </>
              ) : (
                <span className={config.text}>{title}</span>
              )}
            </Typography.Title>
          </div>

          <div className="px-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`h-3 w-1 rounded-full ${config.text} bg-current`} />
                <span className="text-tag font-black tracking-[0.4em] text-white/80 uppercase italic">
                  {subtitle}
                </span>
              </div>
              <div
                className={`rounded-premium-sm glass-card text-tag font-display border-none px-4 py-1.5 font-black tracking-[0.2em] uppercase italic ${difficulty === DIFFICULTY.EASY ? 'text-premium-green' : difficulty === DIFFICULTY.MEDIUM ? 'text-premium-sky' : 'text-premium-red'}`}
              >
                {difficulty === DIFFICULTY.EASY
                  ? 'ЛЕГКО'
                  : difficulty === DIFFICULTY.MEDIUM
                    ? 'НОРМА'
                    : 'ПРОФИ'}
              </div>
            </div>
          </div>
        </div>

        {/* Participants Section */}
        <div className="mb-10">
          <div className="mb-6 flex items-center justify-between px-1">
            <div className="flex items-center gap-3">
              <Users className={`h-4 w-4 ${config.text}`} />
              <span className="text-tag font-black tracking-[0.4em] text-white/80 uppercase">
                УЧАСТНИКИ
              </span>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={shufflePlayers}
                className="text-white/20 transition-all hover:text-white/50 active:scale-90"
              >
                <Shuffle className="h-5 w-5" />
              </button>
              <div
                className={`rounded-premium-sm text-label border border-white/5 bg-white/3 px-4 py-1 font-black tracking-tighter text-white/80 italic`}
              >
                {players.length} / {maxPlayers}
              </div>
            </div>
          </div>

          <Reorder.Group values={players} onReorder={setPlayers} className="flex flex-col gap-4">
            {players.map((p, i) => (
              <PlayerRow
                key={p.id}
                player={p}
                index={i}
                canRemove={canRemove}
                config={config}
                placeholder={playerPlaceholder}
                onRemove={removePlayer}
                onChange={handleNameChange}
              />
            ))}
          </Reorder.Group>

          {players.length < maxPlayers && (
            <button
              onClick={addPlayer}
              className={`rounded-premium-lg text-label mt-4 flex h-12 w-full items-center justify-center gap-4 border-2 border-dashed border-white/25 font-black tracking-[0.4em] text-white/50 uppercase transition-all ${config.addHover} hover:border-dashed`}
            >
              <UserPlus className="h-5 w-5" />
              <span>Добавить</span>
            </button>
          )}
        </div>

        {!!children && <div className="mt-12">{children}</div>}
      </motion.div>

      {/* Footer Buttons */}
      <div className="fixed right-0 bottom-0 left-0 z-50 bg-linear-to-t from-[#0B0915] via-[#0B0915]/95 to-transparent p-6">
        <div className="mx-auto grid max-w-md grid-cols-[1fr_2fr] gap-5">
          <button
            onClick={() => {
              setShowInstructions(true);
            }}
            className="glass-card rounded-premium-md group flex h-16 items-center justify-center gap-3 border-white/5 text-white/80 transition-all active:scale-95"
          >
            <HelpCircle className="h-7 w-7 transition-colors group-hover:text-white/60" />
          </button>

          <PrimaryButton
            disabled={!isReady}
            iconElement={<Play className="relative z-10 h-6 w-6 fill-current" />}
            onClick={() => {
              onStart(players.map((p) => p.name));
            }}
            className={`h-16 ${config.button} rounded-premium-md group relative flex items-center justify-center gap-4 overflow-hidden border-none text-white transition-all active:scale-95 disabled:opacity-30`}
          >
            <span className="relative z-10 text-2xl leading-none font-black tracking-tighter uppercase italic">
              СТАРТ
            </span>
          </PrimaryButton>
        </div>
      </div>

      <InstructionsModal
        open={showInstructions}
        onClose={() => {
          setShowInstructions(false);
        }}
        title={title}
        instructions={instructions}
        description={description}
        theme={themeColor}
      />
    </div>
  );
};
