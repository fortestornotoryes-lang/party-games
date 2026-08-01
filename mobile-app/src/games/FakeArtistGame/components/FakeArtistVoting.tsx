import { Ghost, Maximize2, X } from 'lucide-react-native';
import { AnimatePresence, MotiView } from 'moti';
import React, { useState } from 'react';
import { Image, Modal, Pressable, Text, View } from 'react-native';

import type { Player } from '@/entities/player/types';
import { useTranslation } from '@/shared/i18n';
import { NS } from '@/shared/i18n/keys';
import { rgba } from '@/shared/theme/colors';

interface FakeArtistVotingProps {
  players: Player[];
  canvasImage: string;
  onReveal: () => void;
}

export const FakeArtistVoting: React.FC<FakeArtistVotingProps> = ({
  players,
  canvasImage,
  onReveal,
}) => {
  const { t } = useTranslation();
  const [revealed, setRevealed] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const spy = players.find((p) => p.isSpy);

  return (
    <View className="flex-1 items-center justify-center p-6">
      <View className="w-full max-w-md gap-8">
        {!!canvasImage && (
          <MotiView
            from={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="rounded-premium-lg w-full overflow-hidden border border-white/10"
          >
            <Image
              source={{ uri: canvasImage }}
              className="w-full bg-white"
              style={{ height: 280 }}
              resizeMode="contain"
            />
            <Pressable
              onPress={() => {
                setFullscreen(true);
              }}
              className="rounded-premium-sm absolute right-3 top-3 h-9 w-9 items-center justify-center bg-black/50"
            >
              <Maximize2 size={16} color="rgba(255,255,255,0.8)" />
            </Pressable>
          </MotiView>
        )}

        <Modal visible={fullscreen} transparent animationType="fade">
          <Pressable
            className="flex-1 items-center justify-center bg-black"
            onPress={() => {
              setFullscreen(false);
            }}
          >
            <Image
              source={{ uri: canvasImage }}
              className="h-full w-full"
              resizeMode="contain"
            />
            <Pressable
              onPress={() => {
                setFullscreen(false);
              }}
              className="rounded-premium-md absolute right-5 top-5 h-10 w-10 items-center justify-center bg-white/10"
            >
              <X size={20} color="#fff" />
            </Pressable>
          </Pressable>
        </Modal>

        <AnimatePresence exitBeforeEnter>
          {!revealed ? (
            <MotiView key="voting" from={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="gap-6">
              <Text
                className="text-center text-sm uppercase italic text-white/20"
                style={{ letterSpacing: 2 }}
              >
                {t(`${NS.FAKE_ARTIST}.voteSimultaneously`)}
              </Text>
              <Pressable
                onPress={() => {
                  setRevealed(true);
                }}
                className="rounded-premium-lg w-full items-center bg-white py-6"
                style={({ pressed }) => (pressed ? { transform: [{ scale: 0.95 }] } : undefined)}
              >
                <Text className="font-black uppercase text-black" style={{ letterSpacing: 2 }}>
                  {t(`${NS.FAKE_ARTIST}.revealImpostor`)}
                </Text>
              </Pressable>
            </MotiView>
          ) : (
            <MotiView
              key="result"
              from={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="items-center gap-8"
            >
              <View className="bg-premium-red/10 border-premium-red/20 rounded-premium-3xl w-full items-center gap-4 border p-10">
                <Ghost size={64} color={rgba('red', 1)} />
                <Text className="text-premium-red text-center text-3xl font-black uppercase italic">
                  {t(`${NS.FAKE_ARTIST}.imposter`)}
                </Text>
                <Text className="text-center text-4xl font-black text-white">{spy?.name}</Text>
              </View>

              <Pressable
                onPress={onReveal}
                className="rounded-premium-lg w-full items-center border border-white/20 bg-white/10 py-6"
              >
                <Text
                  className="font-black uppercase text-white"
                  style={{ letterSpacing: 2 }}
                >
                  {t(`${NS.FAKE_ARTIST}.mainMenu`)}
                </Text>
              </Pressable>
            </MotiView>
          )}
        </AnimatePresence>
      </View>
    </View>
  );
};
