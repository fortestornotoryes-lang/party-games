import { Vote } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import React, { useEffect, useState } from 'react';

import { ROUNDS_COUNT } from './constants';
import { addScores, getTopPlayers, scoreWhoAmongUsRound, tallyVotes } from './helpers';
import { getWhoAmongUsQuestion } from './model/whoAmongUsContent';
import { QuestionPhase } from './phases/QuestionPhase';
import { ResultPhase } from './phases/ResultPhase';
import { VotePhase } from './phases/VotePhase';
import { WhoAmongUsPhase } from './types';

import { GameKey } from '@/entities/game/types';
import { FinalStandings } from '@/entities/player/components/FinalStandings';
import { GameHeader } from '@/shared/components/GameHeader';
import { PassPhoneCard } from '@/shared/components/PassPhoneCard';
import { usePersistedState } from '@/shared/hooks/usePersistedState';
import { useTranslation } from '@/shared/i18n';
import { NS } from '@/shared/i18n/keys';
import { feedbackService, VIBRATE } from '@/shared/services/feedbackService';
import { CARD_DEAL_VARIANTS, PHASE_VARIANTS } from '@/shared/theme/motion';

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

  useEffect(() => {
    if (phase !== WhoAmongUsPhase.Finish) return;
    feedbackService.playSound('win');
    feedbackService.vibrate(VIBRATE.win);
    feedbackService.celebrate('win', { origin: { y: 0.35 } });
  }, [phase]);

  const counts = tallyVotes(votes, playerNames);
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

      <div className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto">
        <AnimatePresence mode="wait">
          {phase === WhoAmongUsPhase.Question && (
            <motion.div
              key={`question-${roundNo}`}
              variants={PHASE_VARIANTS}
              initial="initial"
              animate="animate"
              exit="exit"
              className="flex min-h-full flex-col items-center justify-center gap-8 p-6 text-center perspective-distant"
            >
              <QuestionPhase roundNo={roundNo} question={question} onStartVoting={startVoting} />
            </motion.div>
          )}

          {phase === WhoAmongUsPhase.Voting && (
            <motion.div
              key={`voting-${voterIdx}-${voterReady}`}
              variants={PHASE_VARIANTS}
              initial="initial"
              animate="animate"
              exit="exit"
              className="flex min-h-full flex-col gap-4 p-6 perspective-distant"
            >
              {!voterReady ? (
                <div className="flex min-h-full flex-1 items-center justify-center">
                  <motion.div variants={CARD_DEAL_VARIANTS} className="w-full">
                    <PassPhoneCard
                      playerName={voter}
                      playerLabel={t(`${NS.WHO_AMONG_US}.voterLabel`)}
                      instruction={t(`${NS.WHO_AMONG_US}.voterPass`, { name: voter })}
                      icon={Vote}
                      onClick={() => {
                        setVoterReady(true);
                      }}
                    />
                  </motion.div>
                </div>
              ) : (
                <VotePhase question={question} candidates={candidates} onPick={submitVote} />
              )}
            </motion.div>
          )}

          {phase === WhoAmongUsPhase.Result && (
            <motion.div
              key="result"
              variants={PHASE_VARIANTS}
              initial="initial"
              animate="animate"
              exit="exit"
              className="flex min-h-full flex-col gap-4 p-6"
            >
              <ResultPhase
                question={question}
                players={playerNames}
                counts={counts}
                topPlayers={getTopPlayers(counts)}
                isLastRound={isLastRound}
                onNext={nextRound}
              />
            </motion.div>
          )}

          {phase === WhoAmongUsPhase.Finish && (
            <motion.div
              key="finish"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="min-h-full"
            >
              <FinalStandings
                players={playerNames}
                scores={scores}
                color="pink"
                iconClassName="text-premium-pink"
                scoreboardLabel={t(`${NS.WHO_AMONG_US}.scoreboard`)}
                buttonLabel={t(`${NS.WHO_AMONG_US}.toMenu`)}
                onBack={onBack}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
