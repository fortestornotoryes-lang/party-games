import { Play, Shuffle } from 'lucide-react';
import { LayoutGroup, motion } from 'motion/react';
import React, { useState } from 'react';

import { FitText } from '@/shared/components/FitText';
import { PrimaryButton } from '@/shared/components/PrimaryButton';
import { Typography } from '@/shared/components/Typography';
import { useTranslation } from '@/shared/i18n';
import { NS } from '@/shared/i18n/keys';
import { rgba } from '@/shared/theme/colors';
import { PHASE_VARIANTS, SHAKE_X, SPRING, STAGGER_ITEM } from '@/shared/theme/motion';
import type { GameTheme } from '@/shared/types';

export interface TeamSetupTeam {
  color: GameTheme;
  name: string;
  players: string[];
}

interface TeamSetupLabels {
  teamsCount: string;
  moveHint: string;
  /** С подстановкой {{n}} уже выполненной */
  teamTooSmall: string;
  shuffle: string;
  start: string;
}

interface TeamSetupPhaseProps {
  teams: TeamSetupTeam[];
  teamCounts: number[];
  minTeamSize: number;
  /** Цвет игры: подчёркивание выбора и кнопка старта */
  accent: GameTheme;
  /** Префикс layoutId — перелёты игроков разных игр не пересекаются */
  layoutIdPrefix: string;
  labels: TeamSetupLabels;
  onTeamsCountChange: (count: number) => void;
  onMovePlayer: (player: string) => void;
  onShuffle: () => void;
  onStart: () => void;
  /** Доп. настройки над командами (цель партии в Крокодиле) */
  children?: React.ReactNode;
}

/** Совпадает с rounded-premium-sm: layout-анимация корректирует радиус только из style */
const PLAYER_ROW_RADIUS = 12;
const DISPLAY = 'font-black italic uppercase tracking-tighter';

interface NeonOptionProps {
  active: boolean;
  accent: GameTheme;
  /** Общий layoutId подчёркивания внутри группы — оно переезжает между кнопками */
  layoutId: string;
  onClick: () => void;
  children: React.ReactNode;
}

/** Числовая опция с неоновым подчёркиванием (число команд, цель партии) */
export const NeonOption: React.FC<NeonOptionProps> = ({
  active,
  accent,
  layoutId,
  onClick,
  children,
}) => (
  <button
    type="button"
    aria-pressed={active}
    onClick={onClick}
    className={`relative h-11 min-w-11 px-1.5 text-2xl transition-colors ${DISPLAY} ${active ? 'text-white' : 'text-white/25'}`}
  >
    {children}
    {active && (
      <motion.span
        layoutId={layoutId}
        transition={SPRING.snappy}
        className="absolute inset-x-2.5 bottom-1 h-[3px] rounded-full"
        style={{ background: rgba(accent, 1), boxShadow: `0 0 12px ${rgba(accent, 0.9)}` }}
      />
    )}
  </button>
);

/**
 * Деление на команды: списки игроков под неоновыми названиями команд.
 * Нажатие на игрока переводит его в следующую команду (перелёт через layoutId).
 */
export const TeamSetupPhase: React.FC<TeamSetupPhaseProps> = ({
  teams,
  teamCounts,
  minTeamSize,
  accent,
  layoutIdPrefix,
  labels,
  onTeamsCountChange,
  onMovePlayer,
  onShuffle,
  onStart,
  children,
}) => {
  const { t } = useTranslation();
  // Счётчик нажатий «Перемешать» — на него крутится иконка
  const [shuffles, setShuffles] = useState(0);
  const valid = teams.every((team) => team.players.length >= minTeamSize);

  return (
    <motion.div
      key="setup"
      variants={PHASE_VARIANTS}
      initial="initial"
      animate="animate"
      exit="exit"
      layoutScroll
      className="flex h-full flex-col gap-7 overflow-y-auto p-6"
    >
      {children}

      <motion.div variants={STAGGER_ITEM} className="flex items-center justify-between gap-3">
        <Typography.Title color="white" as="h2">
          {t(`${NS.COMMON}.teams`)}
        </Typography.Title>
        <div className="flex shrink-0" role="group" aria-label={labels.teamsCount}>
          {teamCounts.map((n) => (
            <NeonOption
              key={n}
              active={n === teams.length}
              accent={accent}
              layoutId={`${layoutIdPrefix}-teams-count`}
              onClick={() => {
                onTeamsCountChange(n);
              }}
            >
              {n}
            </NeonOption>
          ))}
        </div>
      </motion.div>

      <LayoutGroup>
        <div className="flex flex-col gap-8">
          {teams.map((team) => {
            const tooSmall = team.players.length < minTeamSize;
            return (
              <motion.section
                key={team.color}
                layout
                variants={STAGGER_ITEM}
                exit={{ opacity: 0, transition: { duration: 0.2 } }}
                transition={SPRING.snappy}
              >
                <motion.div layout="position">
                  <div className="flex items-end justify-between gap-3 pb-2">
                    <FitText
                      as="h3"
                      minFontSize={14}
                      className={`min-w-0 text-2xl leading-none ${DISPLAY}`}
                      style={{
                        color: rgba(team.color, 1),
                        textShadow: `0 0 32px ${rgba(team.color, 0.55)}`,
                      }}
                    >
                      {team.name}
                    </FitText>
                    <motion.span
                      key={`${team.players.length}-${tooSmall}`}
                      initial={{ scale: 1.6 }}
                      animate={{ scale: 1, x: tooSmall ? SHAKE_X : 0 }}
                      transition={{ scale: SPRING.pop, x: { duration: 0.45 } }}
                      className={`inline-block shrink-0 text-lg ${DISPLAY} ${tooSmall ? 'text-premium-red' : 'text-white/40'}`}
                    >
                      {team.players.length}
                    </motion.span>
                  </div>
                  <span
                    aria-hidden
                    className="block h-[2px] rounded-full"
                    style={{
                      background: rgba(team.color, 0.9),
                      boxShadow: `0 0 12px ${rgba(team.color, 0.8)}`,
                    }}
                  />
                </motion.div>
                <ul className="mt-3 flex min-h-12 flex-col gap-2">
                  {team.players.map((player) => (
                    <motion.li
                      key={player}
                      layoutId={`${layoutIdPrefix}-player-${player}`}
                      layout="position"
                      transition={SPRING.snappy}
                    >
                      <motion.button
                        type="button"
                        whileTap={{ scale: 0.97 }}
                        onClick={() => {
                          onMovePlayer(player);
                        }}
                        className="glass-card relative flex min-h-12 w-full items-center py-2 pr-3 pl-5 text-left text-base leading-tight font-bold wrap-anywhere text-white/90 transition-colors active:bg-white/8"
                        style={{ borderRadius: PLAYER_ROW_RADIUS }}
                      >
                        {/* Цветная полоска слева — как у карточек игр в меню */}
                        <span
                          aria-hidden
                          className="absolute top-2.5 bottom-2.5 left-0 w-[3px] rounded-r-full"
                          style={{
                            background: rgba(team.color, 1),
                            boxShadow: `0 0 10px ${rgba(team.color, 0.8)}`,
                          }}
                        />
                        {player}
                      </motion.button>
                    </motion.li>
                  ))}
                </ul>
              </motion.section>
            );
          })}
        </div>
      </LayoutGroup>

      <motion.div variants={STAGGER_ITEM}>
        <Typography.Body size="sm" color={valid ? 'muted' : 'red'} align="center">
          {valid ? labels.moveHint : labels.teamTooSmall}
        </Typography.Body>
      </motion.div>

      <motion.div variants={STAGGER_ITEM} className="mt-auto flex flex-col gap-2">
        <PrimaryButton theme={accent} icon={Play} onClick={onStart} disabled={!valid}>
          {labels.start}
        </PrimaryButton>
        <button
          type="button"
          onClick={() => {
            setShuffles((n) => n + 1);
            onShuffle();
          }}
          className="mx-auto flex min-h-11 items-center gap-2 px-4 text-xs font-black tracking-[0.2em] text-white/50 uppercase transition-colors active:text-white"
        >
          <motion.span
            className="flex"
            animate={{ rotate: shuffles * 360 }}
            transition={{ type: 'spring', stiffness: 200, damping: 18 }}
          >
            <Shuffle className="h-4 w-4" />
          </motion.span>
          {labels.shuffle}
        </button>
      </motion.div>
    </motion.div>
  );
};
