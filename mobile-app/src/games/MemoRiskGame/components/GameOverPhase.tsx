import { Home, RotateCcw, Trophy } from 'lucide-react-native';
import React, { useEffect } from 'react';
import { Text, View } from 'react-native';

import { LeaderboardList } from '@/entities/player/components/LeaderboardList';
import { PrimaryButton } from '@/shared/components/PrimaryButton';
import { useTranslation } from '@/shared/i18n';
import { NS } from '@/shared/i18n/keys';
import { feedbackService } from '@/shared/services/feedbackService';
import { rgba } from '@/shared/theme/colors';

interface GameOverPhaseProps {
  playerNames: string[];
  scores: Record<string, number>;
  onRestart: () => void;
  onBack: () => void;
}

export const GameOverPhase: React.FC<GameOverPhaseProps> = ({
  playerNames,
  scores,
  onRestart,
  onBack,
}) => {
  const { t } = useTranslation();

  useEffect(() => {
    feedbackService.celebrate('board', { colors: ['#ff2eb4', '#c77bff', '#ffcc1f', '#ffffff'] });
  }, []);

  return (
    <View className="mx-auto w-full max-w-sm items-center gap-6">
      <View className="items-center gap-2">
        <Trophy size={48} color={rgba('yellow', 1)} />
        <Text className="text-center text-2xl font-black uppercase italic text-white">
          {t(`${NS.COMMON}.gameOver`)}
        </Text>
        <Text
          className="text-micro text-center font-black uppercase text-white/30"
          style={{ letterSpacing: 3 }}
        >
          {t(`${NS.MEMO_RISK}.deckEmpty`)}
        </Text>
      </View>

      <LeaderboardList players={playerNames} scores={scores} />

      <View className="w-full gap-3">
        <PrimaryButton onClick={onRestart} icon={RotateCcw} variant="purple">
          {t(`${NS.MEMO_RISK}.newGame`)}
        </PrimaryButton>
        <PrimaryButton onClick={onBack} icon={Home} variant="outline">
          {t(`${NS.MEMO_RISK}.toMenu`)}
        </PrimaryButton>
      </View>
    </View>
  );
};
