import { RotateCcw, Trophy } from 'lucide-react';
import { motion } from 'motion/react';
import React from 'react';

import { TEAM_NAME_KEY, TEAM_STYLES } from '../constants';
import type { Team } from '../types';

import { AnimatedNumber } from '@/shared/components/AnimatedNumber';
import { PrimaryButton } from '@/shared/components/PrimaryButton';
import { Typography } from '@/shared/components/Typography';
import { VictoryHero } from '@/shared/components/VictoryHero';
import { useTranslation } from '@/shared/i18n';
import { NS } from '@/shared/i18n/keys';
import { SPRING } from '@/shared/theme/motion';

/** Когда после «приземления» кубка выезжает таблица, с */
const TABLE_DELAY = 0.9;
const ROW_STAGGER = 0.1;

interface GameOverPhaseProps {
  winner: Team;
  teams: Team[];
  onBack: () => void;
}

export const GameOverPhase: React.FC<GameOverPhaseProps> = ({ winner, teams, onBack }) => {
  const { t } = useTranslation();
  const style = TEAM_STYLES[winner.color];
  const teamName = (team: Team) => t(`${NS.CROCODILE}.${TEAM_NAME_KEY[team.color]}`);
  const ranked = [...teams].sort((a, b) => b.score - a.score);

  return (
    <motion.div
      key="game_over"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex h-full flex-col items-center justify-center gap-8 overflow-x-hidden overflow-y-auto p-6 text-center"
    >
      <VictoryHero
        icon={Trophy}
        color={winner.color}
        iconClassName={style.text}
        title={t(`${NS.CROCODILE}.victory`)}
        subtitle={t(`${NS.CROCODILE}.winningTeam`, { name: teamName(winner) })}
        subtitleColor={style.typo}
      />

      <div className="relative flex w-full flex-col gap-2">
        {ranked.map((team, i) => {
          const delay = TABLE_DELAY + i * ROW_STAGGER;
          return (
            <motion.div
              key={team.color}
              initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ ...SPRING.soft, delay }}
              className={`rounded-premium-lg flex items-center justify-between gap-3 border px-4 py-3 ${TEAM_STYLES[team.color].card}`}
            >
              <Typography.Label size="md" color={TEAM_STYLES[team.color].typo} className="min-w-0">
                {teamName(team)}
              </Typography.Label>
              <Typography.Score color={TEAM_STYLES[team.color].typo}>
                <AnimatedNumber value={team.score} from={0} delay={delay} />
              </Typography.Score>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        className="relative w-full"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...SPRING.soft, delay: TABLE_DELAY + ranked.length * ROW_STAGGER }}
      >
        <PrimaryButton onClick={onBack} icon={RotateCcw} variant={style.button}>
          {t(`${NS.CROCODILE}.mainMenu`)}
        </PrimaryButton>
      </motion.div>
    </motion.div>
  );
};
