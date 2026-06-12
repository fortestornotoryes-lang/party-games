import { ChevronRight, Crown, Shield } from 'lucide-react';
import { motion } from 'motion/react';
import React, { useState } from 'react';

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex min-h-full flex-col gap-6 px-5 py-6"
    >
      {/* Header */}
      <div className="mt-2 space-y-2 text-center">
        <div className="flex items-center justify-center gap-2">
          <Crown className="h-4 w-4" style={{ color: 'var(--color-premium-yellow)' }} />
          <Typography.Label size="sm" color="muted">
            {t(`${NS.BUNKER}.modeDictator`)}
          </Typography.Label>
        </div>
        <Typography.Heading size="md" color="white" align="center">
          {t(`${NS.BUNKER}.directorElected`)}
        </Typography.Heading>
        <Typography.Body size="sm" color="muted" align="center">
          {t(`${NS.BUNKER}.directorDesc`)}
        </Typography.Body>
      </div>

      {/* Reveal area */}
      <div className="flex flex-1 items-center justify-center">
        {!isRevealed ? (
          <motion.button
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={handleReveal}
            className="rounded-premium-2xl w-full space-y-4 p-10 text-center transition-transform active:scale-[0.98]"
            style={{
              background: `linear-gradient(160deg, ${rgba('yellow', 0.08)} 0%, rgba(0,0,0,0.3) 100%)`,
              border: `1.5px dashed ${rgba('yellow', 0.3)}`,
            }}
          >
            <Crown
              className="mx-auto h-12 w-12"
              style={{ color: 'var(--color-premium-yellow)', opacity: 0.4 }}
            />
            <Typography.Heading size="sm" color="muted" align="center">
              {t(`${NS.BUNKER}.tapToRevealDirector`)}
            </Typography.Heading>
          </motion.button>
        ) : (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 280, damping: 22 }}
            className="rounded-premium-2xl w-full space-y-4 p-8 text-center"
            style={{
              background: `linear-gradient(160deg, ${rgba('yellow', 0.15)} 0%, rgba(0,0,0,0.3) 100%)`,
              border: `1.5px solid ${rgba('yellow', 0.4)}`,
              boxShadow: `0 0 60px ${rgba('yellow', 0.2)}, 0 24px 48px rgba(0,0,0,0.5)`,
            }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: 'spring', stiffness: 260 }}
              className="text-5xl leading-none"
            >
              👑
            </motion.div>

            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Typography.Display size="sm" color="white" glow align="center">
                {directorName.toUpperCase()}
              </Typography.Display>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
              className="inline-flex items-center gap-2 rounded-full px-4 py-1.5"
              style={{
                background: rgba('yellow', 0.15),
                border: `1px solid ${rgba('yellow', 0.3)}`,
              }}
            >
              <Shield className="h-3.5 w-3.5" style={{ color: 'var(--color-premium-yellow)' }} />
              <span
                className="text-tag font-black tracking-[0.25em] uppercase"
                style={{ color: 'var(--color-premium-yellow)' }}
              >
                {t(`${NS.BUNKER}.guaranteedSpot`)}
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Typography.Caption color="faint" align="center">
                {t(`${NS.BUNKER}.notInVoting`)}
              </Typography.Caption>
            </motion.div>
          </motion.div>
        )}
      </div>

      {!!isRevealed && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-auto"
        >
          <PrimaryButton onClick={handleContinue} variant="outline" icon={ChevronRight}>
            {t(`${NS.BUNKER}.toRevealTraits`)}
          </PrimaryButton>
        </motion.div>
      )}
    </motion.div>
  );
};
