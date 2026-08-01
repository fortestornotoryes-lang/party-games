import {
  Activity,
  ArrowRight,
  CheckCircle2,
  Fingerprint,
  RotateCcw,
  Shield,
  Skull,
  XCircle,
} from 'lucide-react-native';
import { AnimatePresence, MotiView } from 'moti';
import React, { useEffect } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ResistanceDistribution } from './components/ResistanceDistribution';
import { initResistance } from './model/initResistance';
import { ResistancePhase } from './types';

import { GameKey } from '@/entities/game/types';
import type { Player } from '@/entities/player/types';
import { MISSION_SIZES } from '@/games/ResistanceGame/constants';
import { GameHeader } from '@/shared/components/GameHeader';
import { PassPhoneCard } from '@/shared/components/PassPhoneCard';
import { PrimaryButton } from '@/shared/components/PrimaryButton';
import { usePersistedState } from '@/shared/hooks/usePersistedState';
import { useTranslation } from '@/shared/i18n';
import { NS } from '@/shared/i18n/keys';
import { feedbackService } from '@/shared/services/feedbackService';
import { rgba } from '@/shared/theme/colors';

interface ResistanceGameProps {
  playerNames: string[];
  onBack: () => void;
}

/** Точки счёта миссий (3 на команду) */
const ScoreDots: React.FC<{ score: number; activeClass: string; alignEnd?: boolean }> = ({
  score,
  activeClass,
  alignEnd,
}) => (
  <View className={`flex-row items-center gap-2 ${alignEnd ? 'justify-end' : ''}`}>
    {[0, 1, 2].map((_, i) => (
      <View
        key={i}
        className={`h-3 w-3 rounded-full ${
          i < score ? activeClass : 'border border-white/10 bg-white/5'
        }`}
      />
    ))}
  </View>
);

export const ResistanceGame: React.FC<ResistanceGameProps> = ({ playerNames, onBack }) => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const K = GameKey.Resistance;
  const [players] = usePersistedState<Player[]>(
    K,
    'players',
    () => initResistance(playerNames).players
  );
  const [phase, setPhase] = usePersistedState<ResistancePhase>(
    K,
    'phase',
    ResistancePhase.Distributing
  );
  const [missionIndex, setMissionIndex] = usePersistedState(K, 'missionIndex', 0);
  const [resistanceScore, setResistanceScore] = usePersistedState(K, 'resistanceScore', 0);
  const [spiesScore, setSpiesScore] = usePersistedState(K, 'spiesScore', 0);
  const [leaderIndex, setLeaderIndex] = usePersistedState(K, 'leaderIndex', 0);
  const [selectedTeam, setSelectedTeam] = usePersistedState<string[]>(K, 'selectedTeam', []);
  const [missionVotes, setMissionVotes] = usePersistedState<boolean[]>(K, 'missionVotes', []);
  const [winner, setWinner] = usePersistedState<'resistance' | 'spies' | null>(K, 'winner', null);

  useEffect(() => {
    if (phase === ResistancePhase.GameOver && winner) {
      const colors = winner === 'resistance' ? ['#3b82f6', '#ffffff'] : ['#ef4444', '#000000'];
      return feedbackService.fireworks(colors);
    }
  }, [phase, winner]);

  if (players.length === 0) return null;

  if (phase === ResistancePhase.Distributing) {
    return (
      <View className="flex-1" style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}>
        <ResistanceDistribution
          players={players}
          onFinish={() => {
            setPhase(ResistancePhase.Proposing);
          }}
        />
      </View>
    );
  }

  const missionSize = MISSION_SIZES[players.length]?.[missionIndex] ?? 2;
  const currentLeader = players[leaderIndex % players.length];
  const currentVoterId = selectedTeam[missionVotes.length];
  const currentVoter = players.find((p) => p.id === currentVoterId);

  const handleToggle = (id: string) => {
    if (selectedTeam.includes(id)) setSelectedTeam(selectedTeam.filter((pid) => pid !== id));
    else if (selectedTeam.length < missionSize) setSelectedTeam([...selectedTeam, id]);
  };

  const handleMissionVote = (success: boolean) => {
    const nextVotes = [...missionVotes, success];
    setMissionVotes(nextVotes);
    if (nextVotes.length === selectedTeam.length) {
      const failed = nextVotes.includes(false);

      const nextSpiesScore = spiesScore + (failed ? 1 : 0);
      const nextResScore = resistanceScore + (failed ? 0 : 1);
      setSpiesScore(nextSpiesScore);
      setResistanceScore(nextResScore);

      if (nextSpiesScore >= 3 || nextResScore >= 3) {
        setWinner(nextSpiesScore >= 3 ? 'spies' : 'resistance');
        setPhase(ResistancePhase.GameOver);
      } else {
        setPhase(ResistancePhase.MissionResult);
      }
    } else {
      setPhase(ResistancePhase.MissionVoting);
    }
  };

  const nextMission = () => {
    setMissionIndex(missionIndex + 1);
    setLeaderIndex(leaderIndex + 1);
    setSelectedTeam([]);
    setMissionVotes([]);
    setPhase(ResistancePhase.Proposing);
  };

  return (
    <View className="flex-1" style={{ paddingTop: insets.top }}>
      <GameHeader
        title={t('registry.games.resistance.title')}
        subtitle={t(`${NS.RESISTANCE}.missionN`, { n: missionIndex + 1 })}
        icon={Shield}
        theme="blue"
        onBack={onBack}
      />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1, paddingBottom: insets.bottom + 40 }}
      >
        <View className="mx-auto w-full max-w-sm flex-1 gap-6 p-6">
          {/* Табло счёта */}
          <View className="rounded-premium-lg flex-row justify-between border border-white/10 bg-white/5 p-4">
            <View className="items-start">
              <Text
                className="text-tag text-premium-blue mb-1 font-black"
                style={{ letterSpacing: 2 }}
              >
                {t(`${NS.RESISTANCE}.resistanceLabel`)}
              </Text>
              <ScoreDots score={resistanceScore} activeClass="bg-premium-blue" />
            </View>
            <View className="items-end">
              <Text
                className="text-tag text-premium-red mb-1 font-black"
                style={{ letterSpacing: 2 }}
              >
                {t(`${NS.RESISTANCE}.spiesLabel`)}
              </Text>
              <ScoreDots score={spiesScore} activeClass="bg-premium-red" alignEnd />
            </View>
          </View>

          <AnimatePresence exitBeforeEnter>
            {phase === ResistancePhase.Proposing && (
              <MotiView
                key="proposing"
                from={{ opacity: 0, translateX: 20 }}
                animate={{ opacity: 1, translateX: 0 }}
                exit={{ opacity: 0, translateX: -20 }}
                className="gap-6"
              >
                <View className="items-center gap-1">
                  <Text
                    className="text-tag font-black uppercase text-white/80"
                    style={{ letterSpacing: 2 }}
                  >
                    {t(`${NS.RESISTANCE}.missionLeader`)}
                  </Text>
                  <Text
                    className="text-center font-black uppercase italic text-white"
                    style={{ fontSize: 36, lineHeight: 40 }}
                  >
                    {currentLeader.name}
                  </Text>
                  <Text
                    className="text-premium-blue mt-2 text-xs font-bold uppercase"
                    style={{ letterSpacing: 1 }}
                  >
                    {t(`${NS.RESISTANCE}.selectTeam`, { n: missionSize })}
                  </Text>
                </View>

                <View className="gap-2">
                  {players.map((p) => {
                    const selected = selectedTeam.includes(p.id);
                    return (
                      <Pressable
                        key={p.id}
                        onPress={() => {
                          handleToggle(p.id);
                        }}
                        className={`rounded-premium-md flex-row items-center border p-4 ${
                          selected
                            ? 'bg-premium-blue/10 border-premium-blue/50'
                            : 'border-white/5 bg-white/5 opacity-60'
                        }`}
                      >
                        <View
                          className={`mr-4 h-4 w-4 items-center justify-center rounded-full border-2 ${
                            selected ? 'bg-premium-blue border-premium-blue' : 'border-white/20'
                          }`}
                        >
                          {!!selected && <CheckCircle2 size={12} color="#fff" />}
                        </View>
                        <Text
                          className={`text-lg font-black uppercase italic ${
                            selected ? 'text-white' : 'text-white/30'
                          }`}
                          style={{ letterSpacing: -0.4 }}
                        >
                          {p.name}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>

                <PrimaryButton
                  disabled={selectedTeam.length !== missionSize}
                  onClick={() => {
                    setPhase(ResistancePhase.PassingPhone);
                  }}
                  variant="white"
                  icon={ArrowRight}
                >
                  {t(`${NS.RESISTANCE}.startMission`)}
                </PrimaryButton>
              </MotiView>
            )}

            {phase === ResistancePhase.PassingPhone && (
              <MotiView
                key={`pass-${missionVotes.length}`}
                from={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex-1 items-center justify-center"
              >
                <PassPhoneCard
                  playerName={currentVoter?.name ?? ''}
                  badge={t(`${NS.RESISTANCE}.votingBadge`)}
                  badgeColor="sky"
                  instruction={t(`${NS.RESISTANCE}.tapToVote`)}
                  icon={Fingerprint}
                  accentColor="sky"
                  onClick={() => {
                    setPhase(ResistancePhase.MissionVoting);
                  }}
                />
              </MotiView>
            )}

            {phase === ResistancePhase.MissionVoting && (
              <MotiView
                key="voting"
                from={{ opacity: 0, translateY: 20 }}
                animate={{ opacity: 1, translateY: 0 }}
                exit={{ opacity: 0, translateY: 20 }}
                className="flex-1 items-center justify-center gap-8"
              >
                <View className="items-center">
                  <Text
                    className="text-tag text-premium-blue mb-2 font-black uppercase"
                    style={{ letterSpacing: 2 }}
                  >
                    {t(`${NS.RESISTANCE}.votingBadge`)}
                  </Text>
                  <Text
                    className="text-center font-black uppercase italic text-white"
                    style={{ fontSize: 36, lineHeight: 40 }}
                  >
                    {currentVoter?.name}
                  </Text>
                </View>

                <View className="w-full gap-4">
                  <Pressable
                    onPress={() => {
                      handleMissionVote(true);
                    }}
                    className="bg-premium-green/10 border-premium-green/30 rounded-premium-2xl items-center gap-4 border-2 p-8"
                    style={({ pressed }) => (pressed ? { transform: [{ scale: 0.95 }] } : undefined)}
                  >
                    <CheckCircle2 size={48} color={rgba('green', 1)} />
                    <Text
                      className="text-premium-green text-xl font-black uppercase italic"
                      style={{ letterSpacing: 2 }}
                    >
                      {t(`${NS.RESISTANCE}.success`)}
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={() => {
                      handleMissionVote(false);
                    }}
                    className="bg-premium-red/10 border-premium-red/30 rounded-premium-2xl items-center gap-4 border-2 p-8"
                    style={({ pressed }) => (pressed ? { transform: [{ scale: 0.95 }] } : undefined)}
                  >
                    <XCircle size={48} color={rgba('red', 1)} />
                    <Text
                      className="text-premium-red text-xl font-black uppercase italic"
                      style={{ letterSpacing: 2 }}
                    >
                      {t(`${NS.RESISTANCE}.fail`)}
                    </Text>
                  </Pressable>
                </View>
              </MotiView>
            )}

            {phase === ResistancePhase.MissionResult && (
              <MotiView
                key="result"
                from={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="flex-1 items-center justify-center gap-8"
              >
                <View
                  className={`rounded-premium-2xl w-full items-center border-2 p-12 ${
                    missionVotes.includes(false)
                      ? 'bg-premium-red/10 border-premium-red/40'
                      : 'bg-premium-green/10 border-premium-green/40'
                  }`}
                >
                  <View className="mb-4">
                    {missionVotes.includes(false) ? (
                      <Skull size={64} color={rgba('red', 1)} />
                    ) : (
                      <Activity size={64} color={rgba('green', 1)} />
                    )}
                  </View>
                  <Text
                    className={`text-center font-black uppercase italic ${
                      missionVotes.includes(false) ? 'text-premium-red' : 'text-premium-green'
                    }`}
                    style={{ fontSize: 48, lineHeight: 50 }}
                  >
                    {t(`${NS.RESISTANCE}.missionTitle`)}
                    {'\n'}
                    {missionVotes.includes(false)
                      ? t(`${NS.RESISTANCE}.missionFailed`)
                      : t(`${NS.RESISTANCE}.missionSucceeded`)}
                  </Text>
                </View>
                <PrimaryButton onClick={nextMission} variant="outline" icon={ArrowRight}>
                  {t(`${NS.COMMON}.next`)}
                </PrimaryButton>
              </MotiView>
            )}

            {phase === ResistancePhase.GameOver && (
              <MotiView
                key="over"
                from={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="flex-1 items-center justify-center gap-12"
              >
                <View
                  className={`rounded-premium-2xl w-full items-center p-12 ${
                    winner === 'resistance'
                      ? 'bg-premium-blue/10 border-premium-blue/60'
                      : 'bg-premium-red/10 border-premium-red/60'
                  }`}
                  style={{
                    borderWidth: 4,
                    shadowColor: winner === 'resistance' ? '#3b82f6' : '#ef4444',
                    shadowOpacity: 0.3,
                    shadowRadius: 25,
                    shadowOffset: { width: 0, height: 0 },
                    elevation: 10,
                  }}
                >
                  <Text
                    className="text-tag mb-4 text-center font-black uppercase text-white/60"
                    style={{ letterSpacing: 5 }}
                  >
                    {t(`${NS.RESISTANCE}.finalScore`)}
                  </Text>
                  <Text
                    className={`text-center font-black uppercase italic ${
                      winner === 'resistance' ? 'text-premium-blue' : 'text-premium-red'
                    }`}
                    style={{ fontSize: 56, lineHeight: 58 }}
                  >
                    {winner === 'resistance'
                      ? t(`${NS.RESISTANCE}.resistanceLabel`)
                      : t(`${NS.RESISTANCE}.spiesLabel`)}
                    {'\n'}
                    {t(`${NS.RESISTANCE}.won`)}
                  </Text>
                </View>

                <View className="w-full items-center gap-3">
                  <Text
                    className="text-tag font-black uppercase text-white/20"
                    style={{ letterSpacing: 2 }}
                  >
                    {t(`${NS.RESISTANCE}.spyAgents`)}
                  </Text>
                  <View className="w-full flex-row flex-wrap gap-2">
                    {players
                      .filter((p) => p.isSpy)
                      .map((p) => (
                        <View
                          key={p.id}
                          className="bg-premium-red/10 border-premium-red/30 rounded-premium-sm border p-3"
                          style={{ width: '48%', flexGrow: 1 }}
                        >
                          <Text className="text-premium-red text-center font-bold uppercase italic">
                            {p.name}
                          </Text>
                        </View>
                      ))}
                  </View>
                </View>

                <PrimaryButton onClick={onBack} icon={RotateCcw} variant="blue">
                  {t(`${NS.RESISTANCE}.restart`)}
                </PrimaryButton>
              </MotiView>
            )}
          </AnimatePresence>
        </View>
      </ScrollView>
    </View>
  );
};
