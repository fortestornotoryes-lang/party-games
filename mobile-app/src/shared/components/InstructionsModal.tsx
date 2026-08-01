import { ArrowLeft } from 'lucide-react-native';
import { MotiView } from 'moti';
import React from 'react';
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { GlassCard } from '@/shared/components/GlassCard';
import { Typography } from '@/shared/components/Typography';
import { useTranslation } from '@/shared/i18n';
import { getTheme } from '@/shared/theme/colors';
import type { GameTheme } from '@/shared/types';

interface InstructionsModalProps {
  open: boolean;
  instructions: readonly { title: string; content: string }[];
  onClose: () => void;
  title?: string;
  theme: GameTheme;
  description?: string;
}

export const InstructionsModal: React.FC<InstructionsModalProps> = ({
  open,
  instructions,
  onClose,
  title,
  theme,
  description,
}) => {
  const { t } = useTranslation();
  const themeConfig = getTheme(theme);
  const insets = useSafeAreaInsets();

  return (
    <Modal visible={open} animationType="fade" transparent onRequestClose={onClose}>
      <View className="flex-1" style={{ backgroundColor: 'rgba(11,9,21,0.98)' }}>
        <ScrollView
          className="flex-1"
          contentContainerStyle={{
            paddingTop: insets.top + 32,
            paddingBottom: insets.bottom + 16,
            paddingHorizontal: 32,
          }}
        >
          <View className="mb-12 flex-row items-center gap-4">
            <Pressable
              onPress={onClose}
              style={({ pressed }) => (pressed ? { transform: [{ scale: 0.9 }] } : undefined)}
            >
              <GlassCard className="h-12 w-12 items-center justify-center rounded-full border-0">
                <ArrowLeft size={28} color="#fff" />
              </GlassCard>
            </Pressable>
            <Typography.Title>{title}</Typography.Title>
          </View>

          <View className="mb-12">
            <View className={`mb-4 h-0.5 w-8 rounded-full opacity-60 ${themeConfig.solid}`} />
            {!!description && (
              <Typography.Body size="base" color="muted">
                {description}
              </Typography.Body>
            )}
          </View>

          <View className="gap-6 pb-10">
            {instructions.map((item, idx) => (
              <MotiView
                key={idx}
                from={{ opacity: 0, translateY: 20 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ type: 'timing', duration: 300, delay: 100 + idx * 100 }}
              >
                <GlassCard className="rounded-premium-lg border-white/5 p-6">
                  <Typography.Heading size="sm" className={`mb-2 ${themeConfig.text}`}>
                    {item.title}
                  </Typography.Heading>
                  <Typography.Body>{item.content}</Typography.Body>
                </GlassCard>
              </MotiView>
            ))}
          </View>

          <Pressable
            onPress={onClose}
            style={({ pressed }) => (pressed ? { transform: [{ scale: 0.98 }] } : undefined)}
          >
            <GlassCard className="rounded-premium-md h-16 items-center justify-center border-0">
              <Text
                className="text-xl font-black uppercase italic text-white"
                style={{ letterSpacing: -0.8 }}
              >
                {t('common.start')}
              </Text>
            </GlassCard>
          </Pressable>
        </ScrollView>
      </View>
    </Modal>
  );
};
