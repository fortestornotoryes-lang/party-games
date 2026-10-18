import { Play, Trophy, Zap } from 'lucide-react';
import { motion } from 'motion/react';
import React from 'react';

import { TEAM_NAME_KEY, TEAM_STYLES, TROPHY_THRESHOLD, WIN_SCORE } from '../constants';
import { getExplainer } from '../helpers';
import type { Team } from '../types';

import { PrimaryButton } from '@/shared/components/PrimaryButton';
import { Typography } from '@/shared/components/Typography';
import { useTranslation } from '@/shared/i18n';
import { NS } from '@/shared/i18n/keys';
import { rgba } from '@/shared/theme/colors';
import {
  CARD_DEAL_VARIANTS,
  EASE_OUT_EXPO,
  PHASE_VARIANTS,
  SPRING,
  STAGGER_ITEM,
} from '@/shared/theme/motion';

interface StartPhaseProps {
  teams: Team[];
  currentTeamIdx: number;
  onStart: () => void;
}

export const StartPhase: React.FC<StartPhaseProps> = ({ teams, currentTeamIdx, onStart }) => {
  const { t } = useTranslation();
  const currentTeam = teams[currentTeamIdx];
  const style = TEAM_STYLES[currentTeam.color];
  const explainer = getExplainer(currentTeam);
  const guessers = currentTeam.players.filter((p) => p !== explainer);

  const teamName = (team: Team) => t(`${NS.ALIAS}.${TEAM_NAME_KEY[team.color]}`);

  return (
    <motion.div
      key="start"
      variants={PHASE_VARIANTS}
      initial="initial"
      animate="animate"
      exit="exit"
      className="flex h-full flex-col gap-5 overflow-y-auto p-6"
    >
      <div className="flex flex-1 flex-col items-center justify-center gap-5 perspective-distant">
        <motion.div
          variants={CARD_DEAL_VARIANTS}
          className={`rounded-premium-xl relative flex w-full max-w-[280px] flex-col items-center overflow-hidden border-2 px-6 py-6 ${style.card}`}
          style={{ boxShadow: style.glow }}
        >
          {/* Блик, пробегающий по карточке команды */}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 w-1/2 -skew-x-12"
            style={{
              background:
                'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)',
            }}
            initial={{ left: '-60%' }}
            animate={{ left: '130%' }}
            transition={{ duration: 1.1, delay: 0.5, ease: 'easeInOut' }}
          />
          <motion.div
            className="mb-3"
            initial={{ scale: 0, rotate: -40 }}
            animate={{ scale: [0, 1.25, 1], rotate: 0 }}
            transition={{ duration: 0.6, delay: 0.25, ease: EASE_OUT_EXPO }}
          >
            <motion.div
              animate={{ opacity: [1, 0.55, 1, 0.8, 1] }}
              transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 1.2 }}
              style={{ filter: `drop-shadow(0 0 14px ${rgba(currentTeam.color, 0.7)})` }}
            >
              <Zap className={`h-10 w-10 ${style.text}`} />
            </motion.div>
          </motion.div>
          <Typography.Heading size="lg" color={style.typo}>
            {teamName(currentTeam)}
          </Typography.Heading>
          <Typography.Caption color="dimmer" className="mt-2">
            {t(`${NS.ALIAS}.explains`)}
          </Typography.Caption>
          <motion.div
            className="w-full"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ ...SPRING.pop, delay: 0.4 }}
          >
            <Typography.Heading size="md" align="center" className="mt-1 wrap-anywhere">
              {explainer}
            </Typography.Heading>
          </motion.div>
          {guessers.length > 0 && (
            <motion.div
              className="flex flex-col items-center"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...SPRING.soft, delay: 0.55 }}
            >
              <Typography.Caption color="dimmer" className="mt-4">
                {t(`${NS.ALIAS}.guessers`)}
              </Typography.Caption>
              <Typography.Caption color="muted" align="center" className="mt-1 wrap-anywhere">
                {guessers.join(', ')}
              </Typography.Caption>
            </motion.div>
          )}
        </motion.div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {teams.map((team, i) => {
          const s = TEAM_STYLES[team.color];
          const isCurrent = i === currentTeamIdx;
          return (
            <motion.div
              key={team.color}
              variants={STAGGER_ITEM}
              className={`rounded-premium-lg relative border p-4 ${s.card}`}
            >
              {isCurrent ? (
                <motion.div
                  aria-hidden
                  className="rounded-premium-lg pointer-events-none absolute -inset-px border border-white/30"
                  animate={{ opacity: [0.35, 1, 0.35] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                />
              ) : null}
              <div className="mb-1.5 flex items-center justify-between gap-2">
                <Typography.Label
                  size="md"
                  color={s.typo}
                  className="min-w-0 wrap-anywhere opacity-50"
                >
                  {teamName(team)}
                </Typography.Label>
                <Trophy
                  className={`h-3 w-3 shrink-0 ${team.score >= TROPHY_THRESHOLD ? 'text-premium-yellow' : 'text-white/10'}`}
                />
              </div>
              <Typography.Score color={s.typo}>{team.score}</Typography.Score>
              <Typography.Caption color="dimmer" className="mt-0.5">
                / {WIN_SCORE}
              </Typography.Caption>
              {/* Путь до победы */}
              <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/5">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: rgba(team.color, 0.8) }}
                  initial={{ width: 0 }}
                  animate={{
                    width: `${Math.min(100, Math.max(0, (team.score / WIN_SCORE) * 100))}%`,
                  }}
                  transition={{ duration: 0.9, delay: 0.35 + i * 0.08, ease: EASE_OUT_EXPO }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      <motion.div variants={STAGGER_ITEM}>
        <PrimaryButton onClick={onStart} icon={Play}>
          {t(`${NS.ALIAS}.startRound`)}
        </PrimaryButton>
      </motion.div>
    </motion.div>
  );
};
