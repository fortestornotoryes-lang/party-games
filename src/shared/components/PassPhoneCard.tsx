import type { LucideIcon } from 'lucide-react';
import { ChevronUp } from 'lucide-react';
import type { PanInfo } from 'motion/react';
import { motion, useAnimationControls } from 'motion/react';
import React, { useRef, useState } from 'react';

import { FitText } from '@/shared/components/FitText';
import { PrimaryButton } from '@/shared/components/PrimaryButton';
import { Typography } from '@/shared/components/Typography';
import { useTranslation } from '@/shared/i18n';
import { NS } from '@/shared/i18n/keys';
import { feedbackService, VIBRATE } from '@/shared/services/feedbackService';
import { rgba } from '@/shared/theme/colors';
import { SPRING } from '@/shared/theme/motion';
import type { GameTheme } from '@/shared/types';

interface PassPhoneCardProps {
  playerName: string;
  /** Подпись над именем; по умолчанию «Передай телефон» */
  playerLabel?: string;
  /** Чип действия/роли над именем («Объясняет», «Голосует») */
  badge?: string;
  /** Пояснение под именем */
  instruction?: string;
  /** Иконка в углах карты; без неё — первая буква имени */
  icon?: LucideIcon;
  accentColor?: GameTheme;
  /** Сколько карт колоды видно под верхней (0–2) */
  deckDepth?: number;
  onClick: () => void;
}

/** Смахивание засчитывается после стольких px вверх или при броске с такой скоростью */
const SWIPE_DISTANCE = 90;
const SWIPE_VELOCITY = 500;
/** Карта улетает вверх — потом onClick, мс */
const FLY_AWAY_MS = 260;
const CARD_RADIUS = 28;
const DEFAULT_DECK_DEPTH = 2;

/** Фон неоновой карты — как у карточек ролей */
const CARD_BG = 'linear-gradient(160deg, #1b1630 0%, #0d0a18 100%)';
const DISPLAY = 'font-black italic uppercase tracking-tighter';

/** Неоновая «рубашка»: тёмная карта с сеткой цвета игры и свечением сверху */
const cardBack = (accent: GameTheme, borderAlpha: number): React.CSSProperties => ({
  background: [
    `radial-gradient(circle at 50% 0%, ${rgba(accent, 0.3)}, transparent 65%)`,
    `repeating-linear-gradient(45deg, ${rgba(accent, 0.07)} 0 1px, transparent 1px 14px)`,
    `repeating-linear-gradient(-45deg, ${rgba(accent, 0.07)} 0 1px, transparent 1px 14px)`,
    CARD_BG,
  ].join(', '),
  border: `1.5px solid ${rgba(accent, borderAlpha)}`,
  borderRadius: CARD_RADIUS,
});

/**
 * Передача телефона: колода, верхняя карта подписана именем игрока.
 * Карту смахивают вверх (или кнопка «Взять карту») — она улетает, и вызывается onClick.
 */
export const PassPhoneCard: React.FC<PassPhoneCardProps> = ({
  playerName,
  playerLabel,
  badge,
  instruction,
  icon: Icon,
  accentColor = 'purple',
  deckDepth = DEFAULT_DECK_DEPTH,
  onClick,
}) => {
  const { t } = useTranslation();
  const [gone, setGone] = useState(false);
  const completed = useRef(false);
  const controls = useAnimationControls();
  const accent = accentColor;

  const leave = () => {
    if (gone || completed.current) return;
    setGone(true);
    void controls
      .start({
        y: -720,
        rotate: -14,
        opacity: 0,
        transition: { duration: FLY_AWAY_MS / 1000, ease: 'easeIn' },
      })
      .then(() => {
        if (completed.current) return;
        completed.current = true;
        onClick();
      });
  };

  // Звук и вибрацию кнопки даёт PrimaryButton, смахиванию — свои
  const onDragEnd = (_: PointerEvent, info: PanInfo) => {
    if (info.offset.y > -SWIPE_DISTANCE && info.velocity.y > -SWIPE_VELOCITY) {
      void controls.start({ y: 0, transition: SPRING.snappy });
      return;
    }
    feedbackService.playSound('click');
    feedbackService.vibrate(VIBRATE.tap);
    leave();
  };

  const glow = { color: rgba(accent, 1), filter: `drop-shadow(0 0 8px ${rgba(accent, 0.8)})` };
  const corner = Icon ? (
    <Icon className="h-6 w-6" style={glow} />
  ) : (
    <span
      className={`text-2xl ${DISPLAY}`}
      style={{ color: rgba(accent, 1), textShadow: `0 0 24px ${rgba(accent, 0.8)}` }}
    >
      {playerName.charAt(0).toUpperCase()}
    </span>
  );

  return (
    <div className="flex w-full flex-col items-center gap-6 select-none">
      <div className="relative aspect-[5/7] w-full max-w-[290px]">
        {/* Свечение остаётся под колодой: большая тень не расширяет слой, который двигается за пальцем. */}
        <span
          aria-hidden
          className="absolute inset-0 rounded-[28px]"
          style={{ boxShadow: `0 0 70px ${rgba(accent, 0.25)}, var(--shadow-card)` }}
        />
        {/* Остаток колоды под верхней картой */}
        {Array.from({ length: deckDepth }, (_, i) => deckDepth - i).map((depth) => (
          <span
            key={depth}
            aria-hidden
            className="absolute inset-0 opacity-50"
            style={{
              ...cardBack(accent, 0.25),
              transform: `translateY(${depth * 10}px) rotate(${depth * 2.5}deg)`,
            }}
          />
        ))}
        {/* Без dragConstraints: их отскок начинается раньше onDragEnd и спорит с вылетом карты. */}
        <motion.div
          drag={gone ? false : 'y'}
          dragMomentum={false}
          onDragEnd={onDragEnd}
          initial={{ y: 0, rotate: 0, opacity: 1 }}
          animate={controls}
          className="absolute inset-0 cursor-grab touch-none overflow-hidden active:cursor-grabbing"
          style={{
            ...cardBack(accent, 0.55),
            boxShadow: `inset 0 1px 0 ${rgba(accent, 0.14)}`,
            willChange: 'transform, opacity',
          }}
        >
          <span
            aria-hidden
            className="absolute inset-3 rounded-[20px] border"
            style={{
              borderColor: rgba(accent, 0.3),
              boxShadow: `inset 0 0 24px ${rgba(accent, 0.12)}`,
            }}
          />
          <span aria-hidden className="absolute top-6 left-6">
            {corner}
          </span>
          <span aria-hidden className="absolute right-6 bottom-6 rotate-180">
            {corner}
          </span>

          <div
            className="rounded-premium-lg absolute inset-x-5 top-1/2 -translate-y-1/2 bg-black/50 px-4 py-5 text-center"
            style={{ border: `1.5px solid ${rgba(accent, 0.35)}` }}
          >
            {badge && (
              <span
                className="text-micro mb-3 inline-block rounded-full px-3 py-1 font-black tracking-widest uppercase"
                style={{
                  color: rgba(accent, 1),
                  background: rgba(accent, 0.12),
                  border: `1px solid ${rgba(accent, 0.3)}`,
                }}
              >
                {badge}
              </span>
            )}
            <Typography.Label size="xs" color="muted" align="center">
              {playerLabel ?? t(`${NS.COMMON}.passPhone`)}
            </Typography.Label>
            <FitText
              as="h2"
              minFontSize={16}
              className={`mt-2 text-[44px] leading-none text-white ${DISPLAY}`}
              style={{ textShadow: `0 0 32px ${rgba(accent, 0.6)}` }}
            >
              {playerName}
            </FitText>
            {instruction && (
              <Typography.Body size="xs" color="muted" align="center" className="mt-3 leading-snug">
                {instruction}
              </Typography.Body>
            )}
          </div>
        </motion.div>
      </div>

      <div className="flex w-full max-w-sm flex-col items-center gap-3">
        <ChevronUp aria-hidden className="animate-nudge h-7 w-7" style={glow} />
        <Typography.Body size="sm" color="muted" align="center">
          {t(`${NS.COMMON}.passSwipeHint`)}
        </Typography.Body>
        <PrimaryButton variant="premium" onClick={leave} disabled={gone}>
          {t(`${NS.COMMON}.passTakeCard`)}
        </PrimaryButton>
      </div>
    </div>
  );
};
