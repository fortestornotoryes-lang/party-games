import { AlertOctagon, Key, KeyRound, Trophy, Users } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import React, { useEffect } from 'react';


import { CaptainCluesPhase } from './components/CaptainCluesPhase';
import { EnemyInterceptPhase } from './components/EnemyInterceptPhase';
import { PassScreen } from './components/PassScreen';
import { ScoreRow } from './components/ScoreRow';
import { TeamGuessPhase } from './components/TeamGuessPhase';
import { tBadge, tBg, teamLabel, tText } from './helpers';
import { useDecryptoContent } from './model/useDecryptoContent';
import type { TeamColor, TeamState } from './types';
import { DecryptoPhase } from './types';

import { GameHeader } from '@/components/GameHeader';
import { useGameSettings } from '@/entities/game/model/GameSettingsContext';
import { GAMES_REGISTRY } from '@/entities/game/registry';
import { GameKey } from '@/entities/game/types';
import { DECRYPTO_MODES } from '@/games/DecryptoGame/constants.ts';
import { PrimaryButton } from '@/shared/components/PrimaryButton';
import { randomInt, shuffle } from '@/shared/helpers/random';
import { usePersistedState } from '@/shared/hooks/usePersistedState';
import { useTranslation } from '@/shared/i18n';
import { NS } from '@/shared/i18n/keys';

interface DecryptoGameProps {
  playerNames: string[];
  onBack: () => void;
}

export const DecryptoGame: React.FC<DecryptoGameProps> = ({ playerNames, onBack }) => {
  const { t } = useTranslation();
  const { difficulty, mode } = useGameSettings();
  const wordCount =
    mode === DECRYPTO_MODES.EXTENDED_5 ? 5 : mode === DECRYPTO_MODES.EXTENDED_6 ? 6 : 4;

  const K = GameKey.Decrypto;
  const [phase, setPhase] = usePersistedState<DecryptoPhase>(K, 'phase', DecryptoPhase.Setup);
  const [round, setRound] = usePersistedState(K, 'round', 1);
  const [activeTeam, setActiveTeam] = usePersistedState<TeamColor>(K, 'activeTeam', 'red');

  const [redState, setRedState] = usePersistedState<TeamState | null>(K, 'redState', null);
  const [blueState, setBlueState] = usePersistedState<TeamState | null>(K, 'blueState', null);

  const [currentCode, setCurrentCode] = usePersistedState<number[]>(K, 'currentCode', []);
  const [clues, setClues] = usePersistedState<string[]>(K, 'clues', ['', '', '']);
  const [interceptGuess, setInterceptGuess] = usePersistedState<(number | '')[]>(
    K,
    'interceptGuess',
    ['', '', '']
  );
  const [teamGuess, setTeamGuess] = usePersistedState<(number | '')[]>(K, 'teamGuess', [
    '',
    '',
    '',
  ]);
  const [winner, setWinner] = usePersistedState<TeamColor | null>(K, 'winner', null);

  useEffect(() => {
    // Состояние команд уже восстановлено из сессии — не пересоздаём партию.
    if (redState !== null) return;
    initGame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playerNames]);

  const generateCode = (): number[] => {
    const nums = Array.from({ length: wordCount }, (_, i) => i + 1);
    return shuffle(nums).slice(0, 3);
  };

  const initGame = () => {
    const shuffled = shuffle([...playerNames]);
    const half = Math.ceil(shuffled.length / 2);
    setRedState({
      words: useDecryptoContent(difficulty, wordCount),
      players: shuffled.slice(0, half),
      interceptions: 0,
      fails: 0,
      history: [],
      captainIndex: randomInt(0, half - 1),
    });
    setBlueState({
      words: useDecryptoContent(difficulty, wordCount),
      players: shuffled.slice(half),
      interceptions: 0,
      fails: 0,
      history: [],
      captainIndex: randomInt(0, shuffled.length - half - 1),
    });
    setRound(1);
    setActiveTeam('red');
    setPhase(DecryptoPhase.Setup);
    setWinner(null);
  };

  const startRound = () => {
    setCurrentCode(generateCode());
    setClues(['', '', '']);
    setInterceptGuess(['', '', '']);
    setTeamGuess(['', '', '']);
    setPhase(DecryptoPhase.PassCaptain);
  };

  const getCaptainName = (team: TeamColor) => {
    const s = team === 'red' ? redState : blueState;
    return s ? s.players[s.captainIndex % s.players.length] : '';
  };

  const continueAfterReveal = () => {
    if (!redState || !blueState) return;
    const curBase = activeTeam === 'red' ? redState : blueState;
    const envBase = activeTeam === 'red' ? blueState : redState;
    const cur: TeamState = { ...curBase, history: [...curBase.history] };
    const env: TeamState = { ...envBase };

    const intercepted = round > 1 && (interceptGuess as number[]).join('') === currentCode.join('');
    const failed = (teamGuess as number[]).join('') !== currentCode.join('');

    if (intercepted) env.interceptions += 1;
    if (failed) cur.fails += 1;

    cur.history.push({
      code: currentCode,
      clues,
      interceptionGuess: round > 1 ? (interceptGuess as number[]) : null,
      teamGuess: teamGuess as number[],
    });

    const newRed = activeTeam === 'red' ? cur : env;
    const newBlue = activeTeam === 'red' ? env : cur;

    if (env.interceptions >= 2 || cur.fails >= 2) {
      setRedState(newRed);
      setBlueState(newBlue);
      setWinner(activeTeam === 'red' ? 'blue' : 'red');
      setPhase(DecryptoPhase.GameOver);
      return;
    }

    if (activeTeam === 'red') {
      setRedState(newRed);
      setBlueState(newBlue);
      setActiveTeam('blue');
    } else {
      setRedState(newRed);
      setBlueState(newBlue);
      setActiveTeam('red');
      setRound((r) => r + 1);
    }

    setCurrentCode(generateCode());
    setClues(['', '', '']);
    setInterceptGuess(['', '', '']);
    setTeamGuess(['', '', '']);
    setPhase(DecryptoPhase.PassCaptain);
  };

  if (!redState || !blueState) return null;

  const curState = activeTeam === 'red' ? redState : blueState;
  const enemyColor = activeTeam === 'red' ? 'blue' : 'red';
  const intercepted = round > 1 && (interceptGuess as number[]).join('') === currentCode.join('');
  const guessCorrect = (teamGuess as number[]).join('') === currentCode.join('');

  return (
    <div className="flex min-h-screen flex-col pb-20 text-white">
      <GameHeader
        title={GAMES_REGISTRY.decrypto.title}
        subtitle={t(`${NS.DECRYPTO}.subtitle`)}
        icon={Key}
        theme="purple"
        onBack={onBack}
      />

      <div className="mx-auto flex w-full max-w-lg flex-1 flex-col p-4 pt-10">
        <AnimatePresence mode="wait">
          {/* ── SETUP ── */}
          {phase === DecryptoPhase.Setup && (
            <motion.div
              key="setup"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-1 flex-col justify-center space-y-6"
            >
              <h2 className="text-premium-purple text-center text-2xl font-black tracking-widest uppercase">
                {t(`${NS.DECRYPTO}.teamsTitle`)}
              </h2>
              <p className="text-center text-sm text-white/30">
                {t(`${NS.DECRYPTO}.teamsSubtitle`)}
              </p>
              <div className="grid gap-3">
                {(
                  [
                    ['red', redState],
                    ['blue', blueState],
                  ] as [TeamColor, TeamState][]
                ).map(([color, state]) => (
                  <div key={color} className={`p-4 ${tBg(color)} rounded-premium-md border`}>
                    <h3
                      className={`${tText(color)} mb-2 flex items-center gap-2 text-xs font-bold uppercase`}
                    >
                      <Users className="h-4 w-4" />
                      {t(`${NS.DECRYPTO}.teamLabelFull`, { name: teamLabel(color, t) })}
                    </h3>
                    <p className={`text-sm ${tText(color)} opacity-70`}>
                      {state.players.join(', ')}
                    </p>
                  </div>
                ))}
              </div>
              <PrimaryButton onClick={startRound} variant="purple" className="mt-8">
                {t(`${NS.DECRYPTO}.startRound1`)}
              </PrimaryButton>
            </motion.div>
          )}

          {/* ── PASS CAPTAIN ── */}
          {phase === DecryptoPhase.PassCaptain && (
            <PassScreen
              key="pass_captain"
              icon={KeyRound}
              team={activeTeam}
              subtitle={t(`${NS.DECRYPTO}.othersNoSee`)}
              buttonLabel={t(`${NS.DECRYPTO}.showCode`)}
              onContinue={() => {
                setPhase(DecryptoPhase.CaptainClues);
              }}
              red={redState}
              blue={blueState}
            >
              <div className="space-y-1">
                <p className="text-sm font-bold tracking-widest text-white/30 uppercase">
                  {t(`${NS.DECRYPTO}.roundCaptain`, { n: round })}
                </p>
                <h2 className={`text-5xl font-black tracking-tight uppercase ${tText(activeTeam)}`}>
                  {getCaptainName(activeTeam)}
                </h2>
                <span
                  className={`inline-block rounded-full px-4 py-1.5 text-xs font-bold tracking-widest uppercase ${tBadge(activeTeam)}`}
                >
                  {t(`${NS.DECRYPTO}.teamLabelFull`, { name: teamLabel(activeTeam, t) })}
                </span>
              </div>
            </PassScreen>
          )}

          {/* ── CAPTAIN CLUES ── */}
          {phase === DecryptoPhase.CaptainClues && (
            <CaptainCluesPhase
              key="captain_clues"
              words={curState.words}
              currentCode={currentCode}
              clues={clues}
              activeTeam={activeTeam}
              onChange={setClues}
              onSubmit={() => {
                setPhase(round > 1 ? DecryptoPhase.PassEnemy : DecryptoPhase.PassTeam);
              }}
            />
          )}

          {/* ── PASS ENEMY ── */}
          {phase === DecryptoPhase.PassEnemy && (
            <PassScreen
              key="pass_enemy"
              icon={AlertOctagon}
              team={enemyColor}
              subtitle={t(`${NS.DECRYPTO}.passToEnemy`)}
              buttonLabel={t(`${NS.DECRYPTO}.interceptBtn`)}
              onContinue={() => {
                setPhase(DecryptoPhase.EnemyIntercept);
              }}
              red={redState}
              blue={blueState}
            />
          )}

          {/* ── ENEMY INTERCEPT ── */}
          {phase === DecryptoPhase.EnemyIntercept && (
            <EnemyInterceptPhase
              key="enemy_intercept"
              enemyHistory={curState.history}
              clues={clues}
              interceptGuess={interceptGuess}
              wordCount={wordCount}
              enemyColor={enemyColor}
              onChange={setInterceptGuess}
              onSubmit={() => {
                setPhase(DecryptoPhase.PassTeam);
              }}
            />
          )}

          {/* ── PASS TEAM ── */}
          {phase === DecryptoPhase.PassTeam && (
            <PassScreen
              key="pass_team"
              icon={Users}
              team={activeTeam}
              subtitle={t(`${NS.DECRYPTO}.passToTeam`)}
              buttonLabel={t(`${NS.DECRYPTO}.decodeCodeBtn`)}
              onContinue={() => {
                setPhase(DecryptoPhase.TeamGuess);
              }}
              red={redState}
              blue={blueState}
            />
          )}

          {/* ── TEAM GUESS ── */}
          {phase === DecryptoPhase.TeamGuess && (
            <TeamGuessPhase
              key="team_guess"
              words={curState.words}
              clues={clues}
              teamGuess={teamGuess}
              wordCount={wordCount}
              activeTeam={activeTeam}
              onChange={setTeamGuess}
              onSubmit={() => {
                setPhase(DecryptoPhase.Reveal);
              }}
            />
          )}

          {/* ── REVEAL ── */}
          {phase === DecryptoPhase.Reveal && (
            <motion.div
              key="reveal"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex w-full flex-1 flex-col items-center justify-center gap-6 text-center"
            >
              <div className="w-full">
                <h2 className="mb-4 border-b border-white/20 pb-3 text-2xl font-black tracking-[0.2em] text-white uppercase">
                  {t(`${NS.DECRYPTO}.roundResults`)}
                </h2>
              </div>

              <div className="w-full space-y-3">
                {round > 1 && (
                  <div
                    className={`rounded-premium-md flex w-full items-center justify-between border p-5 ${intercepted ? 'bg-premium-red/10 border-premium-red/30' : 'border-white/10 bg-white/5'}`}
                  >
                    <div className="text-left">
                      <p className="text-xs font-bold text-white/40 uppercase">
                        {t(`${NS.DECRYPTO}.interceptionLabel`, {
                          name: teamLabel(enemyColor, t),
                        })}
                      </p>
                      <p className="mt-1 text-2xl font-black tracking-[0.2em] text-white">
                        {(interceptGuess as number[]).join(' - ')}
                      </p>
                    </div>
                    <span
                      className={`rounded-premium-sm border px-4 py-2 text-sm font-black ${intercepted ? 'text-premium-red bg-premium-red/15 border-premium-red/30' : 'border-white/10 bg-white/5 text-white/30'}`}
                    >
                      {intercepted ? t(`${NS.DECRYPTO}.intercepted`) : t(`${NS.DECRYPTO}.missed`)}
                    </span>
                  </div>
                )}

                <div
                  className={`rounded-premium-md flex w-full items-center justify-between border p-5 ${guessCorrect ? 'bg-premium-green/10 border-premium-green/30' : 'bg-premium-red/10 border-premium-red/30'}`}
                >
                  <div className="text-left">
                    <p className="text-xs font-bold text-white/40 uppercase">
                      {t(`${NS.DECRYPTO}.teamLabelFull`, { name: teamLabel(activeTeam, t) })}
                    </p>
                    <p className="mt-1 text-2xl font-black tracking-[0.2em] text-white">
                      {(teamGuess as number[]).join(' - ')}
                    </p>
                  </div>
                  <span
                    className={`rounded-premium-sm border px-4 py-2 text-sm font-black ${guessCorrect ? 'text-premium-green bg-premium-green/15 border-premium-green/30' : 'text-premium-red bg-premium-red/15 border-premium-red/30'}`}
                  >
                    {guessCorrect ? t(`${NS.DECRYPTO}.success`) : t(`${NS.DECRYPTO}.wrong`)}
                  </span>
                </div>
              </div>

              <ScoreRow red={redState} blue={blueState} />

              <PrimaryButton
                onClick={continueAfterReveal}
                variant="white"
                className="h-16 w-full text-lg tracking-widest"
              >
                {t(`${NS.DECRYPTO}.nextBtn`)}
              </PrimaryButton>
            </motion.div>
          )}

          {/* ── GAME OVER ── */}
          {phase === DecryptoPhase.GameOver && (
            <motion.div
              key="game_over"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-1 flex-col items-center justify-center gap-8 text-center"
            >
              <Trophy className={`h-24 w-24 ${winner ? tText(winner) : 'text-white'}`} />
              <div className="space-y-2">
                <p className="text-premium-green text-sm font-bold tracking-widest uppercase">
                  {t(`${NS.COMMON}.gameOver`)}
                </p>
                <h2 className={`text-5xl font-black uppercase ${winner ? tText(winner) : ''}`}>
                  {winner ? t(`${NS.DECRYPTO}.victory`, { name: teamLabel(winner, t) }) : ''}
                </h2>
              </div>
              <div className="flex gap-4">
                {(
                  [
                    ['red', redState],
                    ['blue', blueState],
                  ] as [TeamColor, TeamState][]
                ).map(([color, state]) => (
                  <div
                    key={color}
                    className={`rounded-premium-md border px-5 py-3 ${tBg(color)} text-center`}
                  >
                    <p className={`text-micro font-black uppercase ${tText(color)} mb-1`}>
                      {teamLabel(color, t)}
                    </p>
                    <p className="text-xs text-white/40">
                      {t(`${NS.DECRYPTO}.interceptCount`, { n: state.interceptions })}
                    </p>
                    <p className="text-xs text-white/40">
                      {t(`${NS.DECRYPTO}.failCount`, { n: state.fails })}
                    </p>
                  </div>
                ))}
              </div>
              <PrimaryButton onClick={initGame} variant="white">
                {t(`${NS.DECRYPTO}.newGame`)}
              </PrimaryButton>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
