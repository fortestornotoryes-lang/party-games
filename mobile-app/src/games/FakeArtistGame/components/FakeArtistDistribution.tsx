import { EyeOff, Ghost, Palette } from 'lucide-react-native';
import { MotiView } from 'moti';
import React, { useMemo } from 'react';
import { Text, View } from 'react-native';

import { getFakeArtistWord } from '../model/fakeArtistContent';

import { useGameConfig } from '@/entities/game/model/GameSettingsContext';
import type { Player } from '@/entities/player/types';
import { DistributionFlow } from '@/features/role-distribution/components/DistributionFlow';
import {
  RoleRevealButton,
  RoleRevealCard,
  RoleRevealPanel,
} from '@/features/role-distribution/components/RoleRevealCard';
import { useTranslation } from '@/shared/i18n';
import { NS } from '@/shared/i18n/keys';
import { rgba } from '@/shared/theme/colors';
import { DIFFICULTY } from '@/shared/types';

interface Props {
  players: Player[];
  onFinish: (word: string, category: string, rounds: number, timerSeconds: number) => void;
}

export const FakeArtistDistribution: React.FC<Props> = ({ players, onFinish }) => {
  const { difficulty, rounds, timerSeconds } = useGameConfig();
  const { t } = useTranslation();
  const { word, category } = useMemo(
    () => getFakeArtistWord(difficulty || DIFFICULTY.EASY),
    [difficulty]
  );

  return (
    <DistributionFlow
      players={players}
      onFinish={() => {
        onFinish(word, category, rounds ?? 2, timerSeconds ?? 0);
      }}
      activeColor="bg-premium-sky"
      passIcon={EyeOff}
      passAccentColor="sky"
      getCardStyle={() => ({
        style: { aspectRatio: 3 / 4, borderWidth: 1.5, borderColor: rgba('sky', 0.25) },
      })}
      renderCard={(player, isLast, onNext) => (
        <RoleRevealCard
          gradientColors={['rgba(0,0,0,0.4)', rgba('green', 0.25), 'rgba(0,0,0,0.4)']}
          glowColor={player.isSpy ? rgba('red', 0.55) : rgba('sky', 0.55)}
        >
          {/* ── ШПИОН ── */}
          {!!player?.isSpy && (
            <RoleRevealPanel>
              <View>
                <Text
                  className="text-micro font-black uppercase text-white/80"
                  style={{ letterSpacing: 3.6 }}
                >
                  {t(`${NS.FAKE_ARTIST}.secretRole`)}
                </Text>
                <Text className="text-heading mt-0.5 font-black italic text-white">
                  {player.name}
                </Text>
              </View>

              <View className="items-center gap-3">
                <MotiView
                  from={{ scale: 1 }}
                  animate={{ scale: 1.06 }}
                  transition={{ type: 'timing', duration: 1250, loop: true }}
                >
                  <Ghost size={88} color={rgba('red', 1)} />
                </MotiView>
                <Text
                  className="text-center font-black italic text-white"
                  style={{ fontSize: 30, lineHeight: 33 }}
                >
                  {t(`${NS.FAKE_ARTIST}.imposter`)}
                </Text>
                <View className="bg-premium-red/10 border-premium-red/20 rounded-premium-md items-center border px-4 py-2">
                  <Text className="text-micro text-premium-red/55 mb-0.5 font-black uppercase">
                    {t(`${NS.FAKE_ARTIST}.categoryLabel`)}
                  </Text>
                  <Text className="text-sm font-black uppercase italic text-white">{category}</Text>
                </View>
                <Text className="text-tag text-center text-white/30">
                  {t(`${NS.FAKE_ARTIST}.imposterHint`)}
                </Text>
              </View>

              <RoleRevealButton onClick={onNext} colorClassName="bg-premium-green" textClassName="text-white">
                {isLast ? t(`${NS.FAKE_ARTIST}.startGame`) : t(`${NS.FAKE_ARTIST}.gotIt`)}
              </RoleRevealButton>
            </RoleRevealPanel>
          )}

          {/* ── ХУДОЖНИК ── */}
          {!player.isSpy && (
            <RoleRevealPanel>
              <View>
                <Text
                  className="text-micro text-premium-sky/50 font-black uppercase"
                  style={{ letterSpacing: 3.6 }}
                >
                  {t(`${NS.FAKE_ARTIST}.artistRole`)}
                </Text>
                <Text className="mt-0.5 text-lg font-black italic text-white/50">
                  {player.name}
                </Text>
              </View>

              <View className="items-center gap-4">
                <Palette size={72} color={rgba('sky', 1)} />
                <View className="items-center gap-1">
                  <Text
                    className="text-micro text-premium-sky/50 font-black uppercase"
                    style={{ letterSpacing: 2.8 }}
                  >
                    {t(`${NS.FAKE_ARTIST}.yourWord`)}
                  </Text>
                  <Text
                    className="text-center font-black uppercase italic text-white"
                    style={{ fontSize: 48, lineHeight: 52 }}
                  >
                    {word}
                  </Text>
                </View>
                <View className="bg-premium-sky/10 border-premium-sky/20 rounded-premium-md items-center border px-4 py-3">
                  <Text className="text-micro text-premium-sky/50 mb-1 font-black uppercase">
                    {t(`${NS.FAKE_ARTIST}.categoryLabel`)}
                  </Text>
                  <Text className="text-base font-black uppercase italic text-white">
                    {category}
                  </Text>
                </View>
                <Text className="text-tag text-white/20">{t(`${NS.FAKE_ARTIST}.artistHint`)}</Text>
              </View>

              <RoleRevealButton onClick={onNext} colorClassName="bg-premium-sky" textClassName="text-black">
                {isLast ? t(`${NS.FAKE_ARTIST}.startGame`) : t(`${NS.FAKE_ARTIST}.gotIt`)}
              </RoleRevealButton>
            </RoleRevealPanel>
          )}
        </RoleRevealCard>
      )}
    />
  );
};
