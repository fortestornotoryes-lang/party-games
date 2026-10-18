import { Play, Shuffle } from 'lucide-react';
import { AnimatePresence, LayoutGroup, motion } from 'motion/react';
import React, { useState } from 'react';

import { MIN_TEAM_SIZE, MIN_TEAMS, TARGET_SCORES, TEAM_NAME_KEY, TEAM_STYLES } from '../constants';
import { getMaxTeams, isTeamsValid } from '../helpers';
import type { Team } from '../types';

import { PrimaryButton } from '@/shared/components/PrimaryButton';
import { Typography } from '@/shared/components/Typography';
import { useTranslation } from '@/shared/i18n';
import { NS } from '@/shared/i18n/keys';
import { PHASE_VARIANTS, SHAKE_X, SPRING, STAGGER_ITEM } from '@/shared/theme/motion';

/** Совпадает с rounded-premium-lg: layout-анимация корректирует радиус только из style */
const TEAM_CARD_RADIUS = 20;

interface SetupPhaseProps {
  teams: Team[];
  playersCount: number;
  targetScore: number;
  onTargetScoreChange: (score: number) => void;
  onTeamsCountChange: (count: number) => void;
  onShuffle: () => void;
  onMovePlayer: (player: string) => void;
  onStart: () => void;
}

const optionClass = (active: boolean) =>
  `font-display relative h-11 min-w-11 rounded-full border px-3 text-sm font-black transition-colors ${
    active ? 'border-white/30 text-white' : 'border-white/5 text-white/30'
  }`;

/** Подсветка выбранной опции — переезжает между кнопками группы */
const ActivePill: React.FC<{ layoutId: string }> = ({ layoutId }) => (
  <motion.span
    layoutId={layoutId}
    transition={SPRING.snappy}
    className="absolute inset-0 rounded-full bg-white/10"
  />
);

export const SetupPhase: React.FC<SetupPhaseProps> = ({
  teams,
  playersCount,
  targetScore,
  onTargetScoreChange,
  onTeamsCountChange,
  onShuffle,
  onMovePlayer,
  onStart,
}) => {
  const { t } = useTranslation();
  // Счётчик нажатий «Перемешать» — на него крутится иконка
  const [shuffles, setShuffles] = useState(0);
  const maxTeams = getMaxTeams(playersCount);
  const counts = Array.from({ length: maxTeams - MIN_TEAMS + 1 }, (_, i) => MIN_TEAMS + i);
  const valid = isTeamsValid(teams);

  return (
    <motion.div
      key="setup"
      variants={PHASE_VARIANTS}
      initial="initial"
      animate="animate"
      exit="exit"
      layoutScroll
      className="flex h-full flex-col gap-4 overflow-y-auto p-6"
    >
      <motion.div variants={STAGGER_ITEM} className="flex flex-col gap-3">
        <Typography.Label size="md" color="faint" className="min-w-0">
          {t(`${NS.CROCODILE}.targetScore`)}
        </Typography.Label>
        <div className="flex flex-wrap gap-2">
          {TARGET_SCORES.map((score) => (
            <button
              key={score}
              type="button"
              onClick={() => {
                onTargetScoreChange(score);
              }}
              className={optionClass(score === targetScore)}
            >
              {score === targetScore && <ActivePill layoutId="croc-target-score" />}
              <span className="relative">{score}</span>
            </button>
          ))}
        </div>
      </motion.div>

      <motion.div variants={STAGGER_ITEM} className="flex items-center justify-between gap-3">
        <Typography.Label size="md" color="faint" className="min-w-0">
          {t(`${NS.CROCODILE}.teamsCount`)}
        </Typography.Label>
        <div className="flex gap-2">
          {counts.map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => {
                onTeamsCountChange(n);
              }}
              className={optionClass(n === teams.length)}
            >
              {n === teams.length && <ActivePill layoutId="croc-teams-count" />}
              <span className="relative">{n}</span>
            </button>
          ))}
        </div>
      </motion.div>

      <LayoutGroup>
        <div className="flex flex-col gap-3">
          <AnimatePresence mode="popLayout">
            {teams.map((team) => {
              const style = TEAM_STYLES[team.color];
              const tooSmall = team.players.length < MIN_TEAM_SIZE;
              return (
                <motion.div
                  key={team.color}
                  layout
                  variants={STAGGER_ITEM}
                  exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                  transition={SPRING.snappy}
                  style={{ borderRadius: TEAM_CARD_RADIUS }}
                  className={`border p-4 ${style.card}`}
                >
                  <motion.div
                    layout="position"
                    className="mb-3 flex items-center justify-between gap-3"
                  >
                    <Typography.Label size="md" color={style.typo} className="min-w-0">
                      {t(`${NS.CROCODILE}.${TEAM_NAME_KEY[team.color]}`)}
                    </Typography.Label>
                    <motion.span
                      key={`${team.players.length}-${tooSmall}`}
                      initial={{ scale: 1.6 }}
                      animate={{ scale: 1, x: tooSmall ? SHAKE_X : 0 }}
                      transition={{ scale: SPRING.pop, x: { duration: 0.45 } }}
                      className={`inline-block text-xs font-black ${tooSmall ? 'text-premium-red' : 'text-white/30'}`}
                    >
                      {team.players.length}
                    </motion.span>
                  </motion.div>
                  <div className="flex flex-wrap gap-2">
                    {team.players.map((player) => (
                      <motion.button
                        key={player}
                        layoutId={`croc-player-${player}`}
                        layout="position"
                        transition={SPRING.snappy}
                        whileTap={{ scale: 0.9 }}
                        type="button"
                        onClick={() => {
                          onMovePlayer(player);
                        }}
                        className={`min-h-11 max-w-full rounded-full border px-4 text-sm font-bold wrap-anywhere ${style.chip}`}
                      >
                        {player}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </LayoutGroup>

      <motion.div variants={STAGGER_ITEM}>
        <Typography.Caption color="dimmer" align="center">
          {valid
            ? t(`${NS.CROCODILE}.moveHint`)
            : t(`${NS.CROCODILE}.teamTooSmall`, { n: MIN_TEAM_SIZE })}
        </Typography.Caption>
      </motion.div>

      <motion.div variants={STAGGER_ITEM} className="mt-auto flex flex-col gap-3">
        <PrimaryButton
          onClick={() => {
            setShuffles((n) => n + 1);
            onShuffle();
          }}
          iconElement={
            <motion.span
              className="relative z-10 flex"
              animate={{ rotate: shuffles * 360 }}
              transition={{ type: 'spring', stiffness: 200, damping: 18 }}
            >
              <Shuffle className="h-6 w-6" />
            </motion.span>
          }
          variant="outline"
        >
          {t(`${NS.CROCODILE}.shuffleTeams`)}
        </PrimaryButton>
        <PrimaryButton onClick={onStart} icon={Play} disabled={!valid}>
          {t(`${NS.CROCODILE}.startGame`)}
        </PrimaryButton>
      </motion.div>
    </motion.div>
  );
};
