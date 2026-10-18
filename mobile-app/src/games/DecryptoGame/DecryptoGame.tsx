import { AlertOctagon, Key, KeyRound, Trophy, Users } from 'lucide-react-native';
import { AnimatePresence, MotiView } from 'moti';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CaptainCluesPhase } from './components/CaptainCluesPhase';
import { EnemyInterceptPhase } from './components/EnemyInterceptPhase';
import { PassScreen } from './components/PassScreen';
import { ScoreRow } from './components/ScoreRow';
import { TeamGuessPhase } from './components/TeamGuessPhase';
import { tBadge, tBg, teamLabel, tText } from './helpers';
import { getDecryptoWords } from './model/decryptoContent';
import type { RoundState, TeamColor, TeamState } from './types';
import { DecryptoPhase, EMPTY_ROUND } from './types';

import { useGameConfig } from '@/entities/game/model/GameSettingsContext';
import { GameKey } from '@/entities/game/types';
import { DECRYPTO_MODES } from '@/games/DecryptoGame/constants';
import { GameHeader } from '@/shared/components/GameHeader';
import { PrimaryButton } from '@/shared/components/PrimaryButton';
import { randomInt, shuffle } from '@/shared/helpers/random';
import { splitInHalf } from '@/shared/helpers/teams';
import { useGameInit } from '@/shared/hooks/useGameInit';
import { usePersistedState } from '@/shared/hooks/usePersistedState';
import { useTranslation } from '@/shared/i18n';
import { NS } from '@/shared/i18n/keys';
import { rgba } from '@/shared/theme/colors';

interface DecryptoGameProps {
  playerNames: string[];
  onBack: () => void;
}

export const DecryptoGame: React.FC<DecryptoGameProps> = ({ playerNames, onBack }) => {
  const { t } = useTranslation();
  const { difficulty, mode } = useGameConfig();
  const insets = useSafeAreaInsets();
  const wordCount =
    mode === DECRYPTO_MODES.EXTENDED_5 ? 5 : mode === DECRYPTO_MODES.EXTENDED_6 ? 6 : 4;

  const K = GameKey.Decrypto;
  const [phase, setPhase] = usePersistedState<DecryptoPhase>(K, 'phase', DecryptoPhase.Setup);
  const [round, setRound] = usePersistedState(K, 'round', 1);
  const [activeTeam, setActiveTeam] = usePersistedState<TeamColor>(K, 'activeTeam', 'red');

  const [redState, setRedState] = usePersistedState<TeamState | null>(K, 'redState', null);
  const [blueState, setBlueState] = usePersistedState<TeamState | null>(K, 'blueState', null);

  // Эфемерное состояние раунда (код/подсказки/догадки) — одним объектом, чтобы сброс на новый
  // раунд (startRound/continueAfterReveal) не мог случайно забыть одно из полей.
  const [roundState, setRoundState] = usePersistedState<RoundState>(K, 'roundState', EMPTY_ROUND);
  const { currentCode, clues, interceptGuess, teamGuess } = roundState;

  const [winner, setWinner] = usePersistedState<TeamColor | null>(K, 'winner', null);

  const generateCode = (): number[] => {
    const nums = Array.from({ length: wordCount }, (_, i) => i + 1);
    return shuffle(nums).slice(0, 3);
  };

  const initGame = () => {
    const [redPlayers, bluePlayers] = splitInHalf(shuffle([...playerNames]));
    setRedState({
      words: getDecryptoWords(difficulty, wordCount),
      players: redPlayers,
      interceptions: 0,
      fails: 0,
      history: [],
      captainIndex: randomInt(0, redPlayers.length - 1),
    });
    setBlueState({
      words: getDecryptoWords(difficulty, wordCount),
      players: bluePlayers,
      interceptions: 0,
      fails: 0,
      history: [],
      captainIndex: randomInt(0, bluePlayers.length - 1),
    });
    setRound(1);
    setActiveTeam('red');
    setPhase(DecryptoPhase.Setup);
    setWinner(null);
  };

  useGameInit(redState !== null, initGame, [playerNames]);

  const startRound = () => {
    setRoundState({ ...EMPTY_ROUND, currentCode: generateCode() });
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

    setRoundState({ ...EMPTY_ROUND, currentCode: generateCode() });
    setPhase(DecryptoPhase.PassCaptain);
  };

  if (!redState || !blueState) return null;

  const curState = activeTeam === 'red' ? redState : blueState;
  const enemyColor = activeTeam === 'red' ? 'blue' : 'red';
  const intercepted = round > 1 && (interceptGuess as number[]).join('') === currentCode.join('');
  const guessCorrect = (teamGuess as number[]).join('') === currentCode.join('');

  return (
    <View className="flex-1" style={{ paddingTop: insets.top }}>
      <GameHeader
        title={t('registry.games.decrypto.title')}
        subtitle={t(`${NS.DECRYPTO}.subtitle`)}
        icon={Key}
        theme="purple"
        onBack={onBack}
      />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1, paddingBottom: insets.bottom + 80 }}
      >
        <View className="mx-auto w-full max-w-lg flex-1 p-4 pt-10">
          <AnimatePresence exitBeforeEnter>
            {/* ── НАСТРОЙКА ── */}
            {phase === DecryptoPhase.Setup && (
              <MotiView
                key="setup"
                from={{ opacity: 0, translateY: 20 }}
                animate={{ opacity: 1, translateY: 0 }}
                exit={{ opacity: 0, translateY: -20 }}
                transition={{ type: 'timing', duration: 200 }}
                className="flex-1 justify-center gap-6"
              >
                <Text
                  className="text-premium-purple text-center text-2xl font-black uppercase"
                  style={{ letterSpacing: 2 }}
                >
                  {t(`${NS.DECRYPTO}.teamsTitle`)}
                </Text>
                <Text className="text-center text-sm text-white/30">
                  {t(`${NS.DECRYPTO}.teamsSubtitle`)}
                </Text>
                <View className="gap-3">
                  {(
                    [
                      ['red', redState],
                      ['blue', blueState],
                    ] as [TeamColor, TeamState][]
                  ).map(([color, state]) => (
                    <View key={color} className={`rounded-premium-md border p-4 ${tBg(color)}`}>
                      <View className="mb-2 flex-row items-center justify-center gap-2">
                        <Users size={16} color={rgba(color, 1)} />
                        <Text className={`text-xs font-bold uppercase ${tText(color)}`}>
                          {t(`${NS.DECRYPTO}.teamLabelFull`, { name: teamLabel(color, t) })}
                        </Text>
                      </View>
                      <Text className={`text-center text-sm ${tText(color)} opacity-70`}>
                        {state.players.join(', ')}
                      </Text>
                    </View>
                  ))}
                </View>
                <View className="mt-8">
                  <PrimaryButton onClick={startRound} variant="purple">
                    {t(`${NS.DECRYPTO}.startRound1`)}
                  </PrimaryButton>
                </View>
              </MotiView>
            )}

            {/* ── ПЕРЕДАЙ КАПИТАНУ ── */}
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
                <View className="items-center gap-1">
                  <Text className="text-sm font-bold uppercase text-white/30">
                    {t(`${NS.DECRYPTO}.roundCaptain`, { n: round })}
                  </Text>
                  <Text className={`text-center text-4xl font-black uppercase ${tText(activeTeam)}`}>
                    {getCaptainName(activeTeam)}
                  </Text>
                  <View className={`rounded-full px-4 py-1.5 ${tBadge(activeTeam)}`}>
                    <Text className="text-xs font-bold uppercase text-white">
                      {t(`${NS.DECRYPTO}.teamLabelFull`, { name: teamLabel(activeTeam, t) })}
                    </Text>
                  </View>
                </View>
              </PassScreen>
            )}

            {/* ── ПОДСКАЗКИ КАПИТАНА ── */}
            {phase === DecryptoPhase.CaptainClues && (
              <CaptainCluesPhase
                key="captain_clues"
                words={curState.words}
                currentCode={currentCode}
                clues={clues}
                activeTeam={activeTeam}
                onChange={(v) => {
                  setRoundState((s) => ({ ...s, clues: v }));
                }}
                onSubmit={() => {
                  setPhase(round > 1 ? DecryptoPhase.PassEnemy : DecryptoPhase.PassTeam);
                }}
              />
            )}

            {/* ── ПЕРЕДАЙ ВРАГУ ── */}
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

            {/* ── ПЕРЕХВАТ ВРАГА ── */}
            {phase === DecryptoPhase.EnemyIntercept && (
              <EnemyInterceptPhase
                key="enemy_intercept"
                enemyHistory={curState.history}
                clues={clues}
                interceptGuess={interceptGuess}
                wordCount={wordCount}
                enemyColor={enemyColor}
                onChange={(v) => {
                  setRoundState((s) => ({ ...s, interceptGuess: v }));
                }}
                onSubmit={() => {
                  setPhase(DecryptoPhase.PassTeam);
                }}
              />
            )}

            {/* ── ПЕРЕДАЙ КОМАНДЕ ── */}
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

            {/* ── ДОГАДКА КОМАНДЫ ── */}
            {phase === DecryptoPhase.TeamGuess && (
              <TeamGuessPhase
                key="team_guess"
                words={curState.words}
                clues={clues}
                teamGuess={teamGuess}
                wordCount={wordCount}
                activeTeam={activeTeam}
                onChange={(v) => {
                  setRoundState((s) => ({ ...s, teamGuess: v }));
                }}
                onSubmit={() => {
                  setPhase(DecryptoPhase.Reveal);
                }}
              />
            )}

            {/* ── РАСКРЫТИЕ ── */}
            {phase === DecryptoPhase.Reveal && (
              <MotiView
                key="reveal"
                from={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ type: 'timing', duration: 200 }}
                className="w-full flex-1 items-center justify-center gap-6"
              >
                <View className="w-full">
                  <Text
                    className="mb-4 border-b border-white/20 pb-3 text-center text-2xl font-black uppercase text-white"
                    style={{ letterSpacing: 4 }}
                  >
                    {t(`${NS.DECRYPTO}.roundResults`)}
                  </Text>
                </View>

                <View className="w-full gap-3">
                  {round > 1 && (
                    <View
                      className={`rounded-premium-md w-full flex-row items-center justify-between border p-5 ${
                        intercepted
                          ? 'bg-premium-red/10 border-premium-red/30'
                          : 'border-white/10 bg-white/5'
                      }`}
                    >
                      <View className="flex-1">
                        <Text className="text-xs font-bold uppercase text-white/40">
                          {t(`${NS.DECRYPTO}.interceptionLabel`, {
                            name: teamLabel(enemyColor, t),
                          })}
                        </Text>
                        <Text
                          className="mt-1 text-2xl font-black text-white"
                          style={{ letterSpacing: 4 }}
                        >
                          {(interceptGuess as number[]).join(' - ')}
                        </Text>
                      </View>
                      <View
                        className={`rounded-premium-sm border px-4 py-2 ${
                          intercepted
                            ? 'text-premium-red bg-premium-red/15 border-premium-red/30'
                            : 'border-white/10 bg-white/5'
                        }`}
                      >
                        <Text
                          className={`text-sm font-black ${intercepted ? 'text-premium-red' : 'text-white/30'}`}
                        >
                          {intercepted ? t(`${NS.DECRYPTO}.intercepted`) : t(`${NS.DECRYPTO}.missed`)}
                        </Text>
                      </View>
                    </View>
                  )}

                  <View
                    className={`rounded-premium-md w-full flex-row items-center justify-between border p-5 ${
                      guessCorrect
                        ? 'bg-premium-green/10 border-premium-green/30'
                        : 'bg-premium-red/10 border-premium-red/30'
                    }`}
                  >
                    <View className="flex-1">
                      <Text className="text-xs font-bold uppercase text-white/40">
                        {t(`${NS.DECRYPTO}.teamLabelFull`, { name: teamLabel(activeTeam, t) })}
                      </Text>
                      <Text
                        className="mt-1 text-2xl font-black text-white"
                        style={{ letterSpacing: 4 }}
                      >
                        {(teamGuess as number[]).join(' - ')}
                      </Text>
                    </View>
                    <View
                      className={`rounded-premium-sm border px-4 py-2 ${
                        guessCorrect
                          ? 'bg-premium-green/15 border-premium-green/30'
                          : 'bg-premium-red/15 border-premium-red/30'
                      }`}
                    >
                      <Text
                        className={`text-sm font-black ${guessCorrect ? 'text-premium-green' : 'text-premium-red'}`}
                      >
                        {guessCorrect ? t(`${NS.DECRYPTO}.success`) : t(`${NS.DECRYPTO}.wrong`)}
                      </Text>
                    </View>
                  </View>
                </View>

                <ScoreRow red={redState} blue={blueState} />

                <PrimaryButton onClick={continueAfterReveal} variant="white" className="h-16">
                  {t(`${NS.DECRYPTO}.nextBtn`)}
                </PrimaryButton>
              </MotiView>
            )}

            {/* ── КОНЕЦ ИГРЫ ── */}
            {phase === DecryptoPhase.GameOver && (
              <MotiView
                key="game_over"
                from={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ type: 'timing', duration: 200 }}
                className="flex-1 items-center justify-center gap-8"
              >
                <Trophy size={96} color={winner ? rgba(winner, 1) : '#fff'} />
                <View className="items-center gap-2">
                  <Text
                    className="text-premium-green text-center text-sm font-bold uppercase"
                    style={{ letterSpacing: 2 }}
                  >
                    {t(`${NS.COMMON}.gameOver`)}
                  </Text>
                  <Text
                    className={`text-center font-black uppercase ${winner ? tText(winner) : 'text-white'}`}
                    style={{ fontSize: 48, lineHeight: 52 }}
                  >
                    {winner ? t(`${NS.DECRYPTO}.victory`, { name: teamLabel(winner, t) }) : ''}
                  </Text>
                </View>
                <View className="flex-row gap-4">
                  {(
                    [
                      ['red', redState],
                      ['blue', blueState],
                    ] as [TeamColor, TeamState][]
                  ).map(([color, state]) => (
                    <View
                      key={color}
                      className={`rounded-premium-md items-center border px-5 py-3 ${tBg(color)}`}
                    >
                      <Text className={`text-micro mb-1 font-black uppercase ${tText(color)}`}>
                        {teamLabel(color, t)}
                      </Text>
                      <Text className="text-xs text-white/40">
                        {t(`${NS.DECRYPTO}.interceptCount`, { n: state.interceptions })}
                      </Text>
                      <Text className="text-xs text-white/40">
                        {t(`${NS.DECRYPTO}.failCount`, { n: state.fails })}
                      </Text>
                    </View>
                  ))}
                </View>
                <PrimaryButton onClick={initGame} variant="white">
                  {t(`${NS.DECRYPTO}.newGame`)}
                </PrimaryButton>
              </MotiView>
            )}
          </AnimatePresence>
        </View>
      </ScrollView>
    </View>
  );
};
