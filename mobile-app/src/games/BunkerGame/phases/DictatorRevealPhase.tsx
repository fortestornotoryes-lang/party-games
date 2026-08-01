import { LinearGradient } from 'expo-linear-gradient';
import { ChevronRight, Crown, Shield } from 'lucide-react-native';
import { MotiView } from 'moti';
import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { PrimaryButton } from '@/shared/components/PrimaryButton';
import { Typography } from '@/shared/components/Typography';
import { useTranslation } from '@/shared/i18n';
import { NS } from '@/shared/i18n/keys';
import { feedbackService, VIBRATE } from '@/shared/services/feedbackService';
import { rgba } from '@/shared/theme/colors';

interface DictatorRevealPhaseProps {
  directorName: string;
  onContinue: () => void;
}

export const DictatorRevealPhase: React.FC<DictatorRevealPhaseProps> = ({
  directorName,
  onContinue,
}) => {
  const { t } = useTranslation();
  const [isRevealed, setIsRevealed] = useState(false);

  const handleReveal = () => {
    feedbackService.vibrate(VIBRATE.tap);
    setIsRevealed(true);
  };

  const handleContinue = () => {
    feedbackService.vibrate(VIBRATE.tap);
    onContinue();
  };

  return (
    <MotiView
      from={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      exit={{ opacity: 0, translateY: -20 }}
      className="flex-1 gap-6 px-5 py-6"
    >
      {/* Шапка */}
      <View className="mt-2 items-center gap-2">
        <View className="flex-row items-center justify-center gap-2">
          <Crown size={16} color={rgba('yellow', 1)} />
          <Typography.Label size="sm" color="muted">
            {t(`${NS.BUNKER}.modeDictator`)}
          </Typography.Label>
        </View>
        <Typography.Heading size="md" color="white" align="center">
          {t(`${NS.BUNKER}.directorElected`)}
        </Typography.Heading>
        <Typography.Body size="sm" color="muted" align="center">
          {t(`${NS.BUNKER}.directorDesc`)}
        </Typography.Body>
      </View>

      {/* Зона раскрытия */}
      <View className="flex-1 items-center justify-center">
        {!isRevealed ? (
          <MotiView
            from={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full"
          >
            <Pressable
              onPress={handleReveal}
              className="rounded-premium-2xl w-full items-center gap-4 overflow-hidden p-10"
              style={({ pressed }) => [
                { borderWidth: 1.5, borderStyle: 'dashed', borderColor: rgba('yellow', 0.3) },
                pressed && { transform: [{ scale: 0.98 }] },
              ]}
            >
              <LinearGradient
                colors={[rgba('yellow', 0.08), 'rgba(0,0,0,0.3)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0.5, y: 1 }}
                style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
              />
              <Crown size={48} color={rgba('yellow', 0.4)} />
              <Typography.Heading size="sm" color="muted" align="center">
                {t(`${NS.BUNKER}.tapToRevealDirector`)}
              </Typography.Heading>
            </Pressable>
          </MotiView>
        ) : (
          <MotiView
            from={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 280, damping: 22 }}
            className="rounded-premium-2xl w-full items-center gap-4 overflow-hidden p-8"
            style={{ borderWidth: 1.5, borderColor: rgba('yellow', 0.4) }}
          >
            <LinearGradient
              colors={[rgba('yellow', 0.15), 'rgba(0,0,0,0.3)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 0.5, y: 1 }}
              style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
            />
            <MotiView
              from={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 100, type: 'spring', stiffness: 260 }}
            >
              <Text style={{ fontSize: 48, lineHeight: 54 }}>👑</Text>
            </MotiView>

            <MotiView
              from={{ translateY: 10, opacity: 0 }}
              animate={{ translateY: 0, opacity: 1 }}
              transition={{ delay: 200 }}
            >
              <Typography.Display size="sm" color="white" glow align="center">
                {directorName.toUpperCase()}
              </Typography.Display>
            </MotiView>

            <MotiView
              from={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 350 }}
              className="flex-row items-center gap-2 rounded-full px-4 py-1.5"
              style={{
                backgroundColor: rgba('yellow', 0.15),
                borderWidth: 1,
                borderColor: rgba('yellow', 0.3),
              }}
            >
              <Shield size={14} color={rgba('yellow', 1)} />
              <Text
                className="text-tag font-black uppercase"
                style={{ color: rgba('yellow', 1), letterSpacing: 2.5 }}
              >
                {t(`${NS.BUNKER}.guaranteedSpot`)}
              </Text>
            </MotiView>

            <MotiView from={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 500 }}>
              <Typography.Caption color="faint" align="center">
                {t(`${NS.BUNKER}.notInVoting`)}
              </Typography.Caption>
            </MotiView>
          </MotiView>
        )}
      </View>

      {!!isRevealed && (
        <MotiView
          from={{ opacity: 0, translateY: 10 }}
          animate={{ opacity: 1, translateY: 0 }}
          className="mt-auto"
        >
          <PrimaryButton onClick={handleContinue} variant="outline" icon={ChevronRight}>
            {t(`${NS.BUNKER}.toRevealTraits`)}
          </PrimaryButton>
        </MotiView>
      )}
    </MotiView>
  );
};
