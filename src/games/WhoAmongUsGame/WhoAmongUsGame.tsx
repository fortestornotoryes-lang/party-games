import { Vote } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import React, { useState } from 'react';

import { ROUNDS_COUNT } from './constants';
import { addScores, getTopPlayers, scoreWhoAmongUsRound, tallyVotes } from './helpers';
import { getWhoAmongUsQuestion } from './model/whoAmongUsContent';
import { WhoAmongUsPhase } from './types';

import { GameKey } from '@/entities/game/types';
import { GameHeader } from '@/shared/components/GameHeader';
import { PassPhoneCard } from '@/shared/components/PassPhoneCard';
import { PrimaryButton } from '@/shared/components/PrimaryButton';
import { Typography } from '@/shared/components/Typography';
import { usePersistedState } from '@/shared/hooks/usePersistedState';
import { useTranslation } from '@/shared/i18n';
import { NS } from '@/shared/i18n/keys';
import { feedbackService } from '@/shared/services/feedbackService';

interface WhoAmongUsGameProps {
  playerNames: string[];
  onBack: () => void;
}

export const WhoAmongUsGame: React.FC<WhoAmongUsGameProps> = ({ playerNames, onBack }) => {
  const { t } = useTranslation();

  const [phase, setPhase] = usePersistedState<WhoAmongUsPhase>(
    GameKey.WhoAmongUs,
    'phase',
    WhoAmongUsPhase.Question
  );
  const [roundNo, setRoundNo] = usePersistedState(GameKey.WhoAmongUs, 'roundNo', 0);
  const [question, setQuestion] = usePersistedState(GameKey.WhoAmongUs, 'question', () =>
    getWhoAmongUsQuestion()
  );
  const [votes, setVotes] = usePersistedState<Record<string, string>>(
    GameKey.WhoAmongUs,
    'votes',
    {}
  );
  const [voterIdx, setVoterIdx] = usePersistedState(GameKey.WhoAmongUs, 'voterIdx', 0);
  const [scores, setScores] = usePersistedState<Record<string, number>>(
    GameKey.WhoAmongUs,
    'scores',
    {}
  );
  // Экран «передай телефон» перед голосом — не сохраняем, после F5 покажется снова
  const [voterReady, setVoterReady] = useState(false);

  // Голосуют все игроки; за себя голосовать нельзя
  const voter = playerNames[voterIdx] ?? '';
  const candidates = playerNames.filter((p) => p !== voter);

  const startVoting = () => {
    setVotes({});
    setVoterIdx(0);
    setVoterReady(false);
    setPhase(WhoAmongUsPhase.Voting);
  };

  const submitVote = (target: string) => {
    const nextVotes = { ...votes, [voter]: target };
    setVotes(nextVotes);

    if (voterIdx + 1 < playerNames.length) {
      setVoterIdx(voterIdx + 1);
      setVoterReady(false);
      return;
    }

    // Все проголосовали — подсчёт и начисление очков лидерам
    const top = getTopPlayers(tallyVotes(nextVotes, playerNames));
    setScores((prev) => addScores(prev, scoreWhoAmongUsRound(top)));
    feedbackService.playSound('success');
    setPhase(WhoAmongUsPhase.Result);
  };

  const nextRound = () => {
    const played = roundNo + 1;
    setRoundNo(played);

    if (played >= ROUNDS_COUNT) {
      setPhase(WhoAmongUsPhase.Finish);
      return;
    }
    setQuestion(getWhoAmongUsQuestion());
    setVotes({});
    setVoterIdx(0);
    setVoterReady(false);
    setPhase(WhoAmongUsPhase.Question);
  };

  const counts = tallyVotes(votes, playerNames);
  const maxCount = Math.max(1, ...Object.values(counts));
  const topPlayers = getTopPlayers(counts);
  const sortedByVotes = [...playerNames].sort((a, b) => counts[b] - counts[a]);
  const sortedByScore = [...playerNames].sort((a, b) => (scores[b] ?? 0) - (scores[a] ?? 0));
  const isLastRound = roundNo + 1 >= ROUNDS_COUNT;

  return (
    <div className="flex h-dvh flex-col">
      <GameHeader
        title={t('registry.games.who_among_us.title')}
        subtitle={t(`${NS.WHO_AMONG_US}.subtitle`)}
        icon={Vote}
        theme="pink"
        onBack={onBack}
      />

      <div className="min-h-0 flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          {phase === WhoAmongUsPhase.Question && (
            <motion.div
              key={`question-${roundNo}`}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex min-h-full flex-col items-center justify-center gap-8 p-6 text-center"
            >
              <div className="space-y-4">
                <Typography.Caption className="tracking-[0.4em]">
                  {t(`${NS.WHO_AMONG_US}.roundOf`, { n: roundNo + 1, total: ROUNDS_COUNT })}
                </Typography.Caption>
                <Typography.Display size="md" align="center">
                  {question}
                </Typography.Display>
              </div>
              <PrimaryButton onClick={startVoting}>
                {t(`${NS.WHO_AMONG_US}.startVoting`)}
              </PrimaryButton>
            </motion.div>
          )}

          {phase === WhoAmongUsPhase.Voting && (
            <motion.div
              key={`voting-${voterIdx}-${voterReady}`}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              className="flex min-h-full flex-col gap-4 p-6"
            >
              {!voterReady ? (
                <div className="flex min-h-full items-center justify-center">
                  <PassPhoneCard
                    playerName={voter}
                    playerLabel={t(`${NS.WHO_AMONG_US}.voterLabel`)}
                    instruction={t(`${NS.WHO_AMONG_US}.voterPass`, { name: voter })}
                    icon={Vote}
                    onClick={() => {
                      setVoterReady(true);
                    }}
                  />
                </div>
              ) : (
                <>
                  <Typography.Body align="center" color="faint">
                    {question}
                  </Typography.Body>
                  <Typography.Caption className="text-center tracking-[0.3em]">
                    {t(`${NS.WHO_AMONG_US}.pickPlayer`)}
                  </Typography.Caption>
                  <div className="grid grid-cols-2 gap-3">
                    {candidates.map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => {
                          submitVote(p);
                        }}
                        className="glass-card rounded-premium-xl min-w-0 p-4 text-center font-bold break-words transition active:scale-[0.97]"
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </motion.div>
          )}

          {phase === WhoAmongUsPhase.Result && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex min-h-full flex-col gap-4 p-6"
            >
              <div className="space-y-2 text-center">
                <Typography.Caption className="tracking-[0.3em]">{question}</Typography.Caption>
                <Typography.Display size="sm" align="center">
                  {t(`${NS.WHO_AMONG_US}.topPlayers`)}: {topPlayers.join(', ') || '—'}
                </Typography.Display>
              </div>

              <div className="glass-card rounded-premium-xl space-y-3 p-4">
                {sortedByVotes.map((p) => (
                  <div key={p} className="space-y-1">
                    <div className="flex items-center justify-between gap-3 text-sm">
                      <span className="min-w-0 break-words">{p}</span>
                      <span className="shrink-0 font-bold">
                        {t(`${NS.WHO_AMONG_US}.votesCount`, { n: counts[p] })}
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-white/10">
                      <div
                        className="bg-premium-pink h-2 rounded-full transition-all"
                        style={{ width: `${(counts[p] / maxCount) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <PrimaryButton onClick={nextRound} className="mt-2">
                {isLastRound
                  ? t(`${NS.WHO_AMONG_US}.finishGame`)
                  : t(`${NS.WHO_AMONG_US}.nextRound`)}
              </PrimaryButton>
            </motion.div>
          )}

          {phase === WhoAmongUsPhase.Finish && (
            <motion.div
              key="finish"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex min-h-full flex-col items-center justify-center gap-6 p-6 text-center"
            >
              <Typography.Display size="md" align="center">
                {t('common.gameOver')}
              </Typography.Display>
              <div className="glass-card rounded-premium-xl w-full max-w-sm space-y-2 p-4">
                <p className="text-micro font-black tracking-[0.3em] text-white/40 uppercase">
                  {t(`${NS.WHO_AMONG_US}.scoreboard`)}
                </p>
                {sortedByScore.map((p) => (
                  <div key={p} className="flex items-center justify-between gap-3">
                    <span className="min-w-0 break-words">{p}</span>
                    <span className="shrink-0 font-black">{scores[p] ?? 0}</span>
                  </div>
                ))}
              </div>
              <PrimaryButton onClick={onBack}>{t(`${NS.WHO_AMONG_US}.toMenu`)}</PrimaryButton>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
