import React from 'react';

type AccentName = 'red' | 'orange' | 'sky' | 'green' | 'purple' | 'yellow';

const AC: Record<AccentName, { row: string; text: string; badge: string }> = {
  red: {
    row: 'border-premium-red/50 bg-premium-red/10',
    text: 'text-premium-red',
    badge: 'text-premium-red/70 bg-premium-red/10',
  },
  orange: {
    row: 'border-premium-orange/50 bg-premium-orange/10',
    text: 'text-premium-orange',
    badge: 'text-premium-orange/70 bg-premium-orange/10',
  },
  sky: {
    row: 'border-premium-sky/50 bg-premium-sky/10',
    text: 'text-premium-sky',
    badge: 'text-premium-sky/70 bg-premium-sky/10',
  },
  green: {
    row: 'border-premium-green/50 bg-premium-green/10',
    text: 'text-premium-green',
    badge: 'text-premium-green/70 bg-premium-green/10',
  },
  purple: {
    row: 'border-premium-purple/50 bg-premium-purple/10',
    text: 'text-premium-purple',
    badge: 'text-premium-purple/70 bg-premium-purple/10',
  },
  yellow: {
    row: 'border-premium-yellow/50 bg-premium-yellow/10',
    text: 'text-premium-yellow',
    badge: 'text-premium-yellow/70 bg-premium-yellow/10',
  },
};

interface PlayerScoreListProps {
  players: string[];
  scores: Record<string, number>;
  /** Player highlighted with the accent color */
  activePlayer?: string;
  /** Badge shown next to active player, defaults to "объясняет" */
  activeLabel?: string;
  accentColor?: AccentName;
  /** Renders team badges for non-active players */
  teams?: [string[], string[]];
  className?: string;
}

export const PlayerScoreList: React.FC<PlayerScoreListProps> = ({
  players,
  scores,
  activePlayer,
  activeLabel,
  accentColor = 'red',
  teams,
  className,
}) => {
  const ac = AC[accentColor];

  const teamBadge = (player: string) => {
    if (!teams) return null;
    const idx = teams[0].includes(player) ? 0 : teams[1].includes(player) ? 1 : null;
    if (idx === null) return null;
    return (
      <span
        className={`text-micro shrink-0 rounded-full px-2 py-0.5 font-black tracking-widest uppercase ${
          idx === 0
            ? 'text-premium-orange/80 bg-premium-orange/10'
            : 'text-premium-sky/80 bg-premium-sky/10'
        }`}
      >
        {idx === 0 ? 'Команда 1' : 'Команда 2'}
      </span>
    );
  };

  const sorted = [...players].sort((a, b) => (scores[b] ?? 0) - (scores[a] ?? 0));

  return (
    <div className={`w-full max-w-sm space-y-2 ${className}`}>
      <p className="text-micro mb-3 text-center font-black tracking-widest text-white/30 uppercase">
        Счёт
      </p>
      {sorted.map((player) => {
        const isActive = player === activePlayer;
        return (
          <div
            key={player}
            className={`rounded-premium-md flex items-center justify-between border px-4 py-3 transition-all ${
              isActive ? ac.row : 'border-white/10 bg-white/5'
            }`}
          >
            <div className="flex min-w-0 items-center gap-2">
              <span className={`truncate font-black ${isActive ? ac.text : 'text-white/70'}`}>
                {player}
              </span>
              {isActive && (
                <span
                  className={`text-micro shrink-0 rounded-full px-2 py-0.5 font-black tracking-widest uppercase ${ac.badge}`}
                >
                  {activeLabel}
                </span>
              )}
              {!isActive && teamBadge(player)}
            </div>
            <span
              className={`ml-3 text-2xl font-black italic tabular-nums ${isActive ? ac.text : 'text-white'}`}
            >
              {scores[player] ?? 0}
            </span>
          </div>
        );
      })}
    </div>
  );
};
