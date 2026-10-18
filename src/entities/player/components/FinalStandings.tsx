import { Crown } from 'lucide-react';
import { motion } from 'motion/react';
import React from 'react';

import { LeaderboardList } from '@/entities/player/components/LeaderboardList';
import { PrimaryButton } from '@/shared/components/PrimaryButton';
import { VictoryHero } from '@/shared/components/VictoryHero';
import { useTranslation } from '@/shared/i18n';
import { SPRING } from '@/shared/theme/motion';
import type { GameTheme } from '@/shared/types';

/** Когда после «приземления» короны выезжает таблица, с */
const TABLE_DELAY = 0.9;
/** Шаг каскада строк в LeaderboardList — для расчёта появления кнопки, с */
const ROW_STAGGER = 0.12;

interface FinalStandingsProps {
  players: string[];
  scores: Record<string, number>;
  /** Цвет свечения короны (тема игры) */
  color: GameTheme;
  /** Tailwind-класс цвета короны */
  iconClassName: string;
  scoreboardLabel: string;
  buttonLabel: string;
  onBack: () => void;
}

/**
 * Финал игры на очки: корона с лучами, победитель(и), таблица, выезжающая снизу вверх.
 * Конфетти/звук запускает сама игра (по смене фазы), как в остальных играх.
 */
export const FinalStandings: React.FC<FinalStandingsProps> = ({
  players,
  scores,
  color,
  iconClassName,
  scoreboardLabel,
  buttonLabel,
  onBack,
}) => {
  const { t } = useTranslation();
  const top = Math.max(0, ...players.map((p) => scores[p] ?? 0));
  const winners = top > 0 ? players.filter((p) => (scores[p] ?? 0) === top) : [];

  return (
    <div className="flex min-h-full flex-col items-center justify-center gap-6 overflow-x-hidden p-6 text-center">
      <VictoryHero
        icon={Crown}
        color={color}
        iconClassName={iconClassName}
        title={t('common.gameOver')}
        subtitle={winners.length > 0 ? `${t('common.winner')}: ${winners.join(', ')}` : undefined}
        subtitleColor="yellow"
      />

      <motion.div
        className="relative w-full max-w-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: TABLE_DELAY - 0.2 }}
      >
        <p className="text-micro mb-3 font-black tracking-[0.3em] text-white/40 uppercase">
          {scoreboardLabel}
        </p>
        <LeaderboardList players={players} scores={scores} animated animationDelay={TABLE_DELAY} />
      </motion.div>

      <motion.div
        className="relative w-full"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...SPRING.soft, delay: TABLE_DELAY + players.length * ROW_STAGGER }}
      >
        <PrimaryButton onClick={onBack}>{buttonLabel}</PrimaryButton>
      </motion.div>
    </div>
  );
};
