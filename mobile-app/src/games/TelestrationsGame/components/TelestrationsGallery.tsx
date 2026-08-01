import { Home, Shuffle } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import React from 'react';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { Step } from '../types';
import { STEP_TYPE } from '../types';

import { useTranslation } from '@/shared/i18n';
import { NS } from '@/shared/i18n/keys';

interface Props {
  initialWord: string;
  steps: Step[];
  onNewGame: () => void;
  onBack: () => void;
}

export const TelestrationsGallery: React.FC<Props> = ({
  initialWord,
  steps,
  onNewGame,
  onBack,
}) => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  return (
    <MotiView
      key="gallery"
      from={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ type: 'timing', duration: 250 }}
      className="absolute inset-0"
    >
      <ScrollView contentContainerStyle={{ gap: 24, padding: 24, paddingBottom: 160 }}>
        <View className="items-center gap-1">
          <Text className="text-center text-3xl font-black uppercase italic text-white">
            {t(`${NS.TELESTRATIONS}.chainEnd`)}
          </Text>
          <Text className="text-sm text-white/30">{t(`${NS.TELESTRATIONS}.seeHowWordChanged`)}</Text>
        </View>

        <View className="flex-row items-center gap-4">
          <View className="bg-premium-orange/10 border-premium-orange/20 h-11 w-11 items-center justify-center rounded-full border">
            <Text className="text-micro text-premium-orange font-black">START</Text>
          </View>
          <View className="bg-premium-orange/10 border-premium-orange/20 rounded-premium-md flex-1 border p-4">
            <Text
              className="text-premium-orange mb-1 text-xs font-black uppercase"
              style={{ letterSpacing: 1 }}
            >
              {t(`${NS.TELESTRATIONS}.originalWord`)}
            </Text>
            <Text className="text-xl font-bold italic text-white">{initialWord}</Text>
          </View>
        </View>

        {steps.map((step, idx) => (
          <MotiView
            key={idx}
            from={{ opacity: 0, translateY: 16 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ delay: idx * 80 }}
            className="gap-2"
          >
            <View className="flex-row items-center gap-3">
              <View
                className={`h-11 w-11 items-center justify-center rounded-full border ${
                  step.type === STEP_TYPE.Draw
                    ? 'bg-premium-orange/10 border-premium-orange/20'
                    : 'border-white/10 bg-white/5'
                }`}
              >
                <Text className="text-sm font-black">
                  {step.type === STEP_TYPE.Draw ? '✏️' : '💬'}
                </Text>
              </View>
              <Text
                className="text-xs font-black uppercase text-white/30"
                style={{ letterSpacing: 1.6 }}
              >
                {step.author}
              </Text>
            </View>
            <View className="rounded-premium-lg overflow-hidden border border-white/5 bg-white/5 p-3" style={{ marginLeft: 56 }}>
              {step.type === STEP_TYPE.Draw ? (
                <Image
                  source={{ uri: step.content }}
                  style={{ width: '100%', aspectRatio: 4 / 3 }}
                  resizeMode="contain"
                />
              ) : (
                <View className="items-center p-3">
                  <Text className="text-center text-xl font-black italic text-white">
                    {step.content}
                  </Text>
                </View>
              )}
            </View>
          </MotiView>
        ))}
      </ScrollView>

      <View pointerEvents="box-none" className="absolute bottom-0 left-0 right-0">
        <LinearGradient
          colors={['transparent', 'rgba(10,5,2,0.95)', '#0a0502']}
          style={{ paddingTop: 40, paddingHorizontal: 20, paddingBottom: insets.bottom + 20 }}
        >
          <View className="mx-auto w-full max-w-sm gap-3">
            <Pressable
              onPress={onNewGame}
              className="rounded-premium-md w-full flex-row items-center justify-center gap-3 bg-white py-5"
              style={({ pressed }) => (pressed ? { transform: [{ scale: 0.95 }] } : undefined)}
            >
              <Shuffle size={20} color="#000" />
              <Text className="font-black uppercase text-black" style={{ letterSpacing: 2 }}>
                {t(`${NS.TELESTRATIONS}.newGame`)}
              </Text>
            </Pressable>
            <Pressable
              onPress={onBack}
              className="rounded-premium-md w-full flex-row items-center justify-center gap-2 border border-white/10 bg-white/5 py-4"
              style={({ pressed }) => (pressed ? { transform: [{ scale: 0.95 }] } : undefined)}
            >
              <Home size={16} color="rgba(255,255,255,0.4)" />
              <Text
                className="text-xs font-bold uppercase text-white/40"
                style={{ letterSpacing: 2 }}
              >
                {t(`${NS.TELESTRATIONS}.toMenu`)}
              </Text>
            </Pressable>
          </View>
        </LinearGradient>
      </View>
    </MotiView>
  );
};
