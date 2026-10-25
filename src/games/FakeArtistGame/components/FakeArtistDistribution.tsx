import { Palette } from 'lucide-react';
import React, { useMemo } from 'react';

import { getFakeArtistWord } from '../model/fakeArtistContent';

import { useGameSettings } from '@/entities/game/model/GameSettingsContext';
import type { Player } from '@/entities/player/types';
import { DistributionFlow } from '@/features/role-distribution/components/DistributionFlow';
import { SecretDetail, SecretWordCard } from '@/shared/components/SecretWordCard';
import { Typography } from '@/shared/components/Typography';
import { useTranslation } from '@/shared/i18n';
import { NS } from '@/shared/i18n/keys';
import { DIFFICULTY } from '@/shared/types';

interface Props {
  players: Player[];
  onFinish: (word: string, category: string, rounds: number, timerSeconds: number) => void;
}

/** Цвет раздачи — один для всех ролей, чтобы экран не выдавал самозванца */
const ACCENT = 'sky';

export const FakeArtistDistribution: React.FC<Props> = ({ players, onFinish }) => {
  const { difficulty, rounds, timerSeconds } = useGameSettings();
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
      passIcon={Palette}
      passAccentColor={ACCENT}
      getCardStyle={() => ({ bare: true })}
      renderCard={(player, isLast, onNext) => (
        // Обе роли — одна и та же карточка «держи палец»: отличается только скрытое содержимое
        <SecretWordCard
          playerName={player.name}
          label={t(`${NS.COMMON}.secretCard`)}
          word={player.isSpy ? t(`${NS.FAKE_ARTIST}.imposter`) : word}
          details={
            <div className="space-y-3">
              <SecretDetail
                label={t(`${NS.FAKE_ARTIST}.categoryLabel`)}
                value={category}
                accent={ACCENT}
              />
              <Typography.Body size="sm" color="muted" className="whitespace-pre-line">
                {player.isSpy
                  ? t(`${NS.FAKE_ARTIST}.imposterHint`)
                  : t(`${NS.FAKE_ARTIST}.artistHint`)}
              </Typography.Body>
            </div>
          }
          accent={ACCENT}
          doneLabel={isLast ? t(`${NS.FAKE_ARTIST}.startGame`) : t(`${NS.FAKE_ARTIST}.gotIt`)}
          onDone={onNext}
        />
      )}
    />
  );
};
