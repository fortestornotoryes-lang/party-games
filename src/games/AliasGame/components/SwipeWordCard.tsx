import type { PanInfo, Variants } from 'motion/react';
import { animate, motion, useIsPresent, useMotionValue, useTransform } from 'motion/react';
import React from 'react';

import { SWIPE_OFFSET, SWIPE_VELOCITY } from '../constants';

import { FitText } from '@/shared/components/FitText';
import { rgba } from '@/shared/theme/colors';
import { SPRING } from '@/shared/theme/motion';

/** Куда ушла карточка: 1 — угадано (вправо), -1 — пропуск (влево), 0 — без ответа */
export type SwipeDirection = -1 | 0 | 1;

/** Насколько далеко улетает карточка при ответе, px */
const FLY_DISTANCE = 460;
/** Наклон карточки на краю свайпа, градусы */
const MAX_TILT = 16;
/** Сдвиг, с которого начинает проявляться штамп ответа, px */
const STAMP_START = 24;

const NEUTRAL_BORDER = 'rgba(255,255,255,0.08)';
const NO_GLOW = '0 0 0px rgba(0,0,0,0)';

// exit получает направление из AnimatePresence custom — карточка улетает в сторону ответа,
// даже если ответили кнопкой, а не свайпом
const cardVariants: Variants = {
  initial: { opacity: 0, scale: 0.86, y: 40 },
  animate: { opacity: 1, scale: 1, y: 0, transition: SPRING.soft },
  exit: (direction: SwipeDirection) => ({
    x: direction * FLY_DISTANCE,
    y: direction === 0 ? -24 : 30,
    opacity: 0,
    transition: { duration: 0.34, ease: [0.4, 0, 1, 1] },
  }),
};

interface SwipeWordCardProps {
  word: string;
  label: string;
  correctLabel: string;
  skipLabel: string;
  onSwipe: (direction: 1 | -1) => void;
}

/** Карточка слова: тянется пальцем, наклоняется и подсвечивается зелёным/красным. */
export const SwipeWordCard: React.FC<SwipeWordCardProps> = ({
  word,
  label,
  correctLabel,
  skipLabel,
  onSwipe,
}) => {
  // Улетающая карточка ещё в DOM — повторный свайп по ней не должен засчитаться второй раз
  const isPresent = useIsPresent();
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-260, 260], [-MAX_TILT, MAX_TILT]);
  const correctOpacity = useTransform(x, [STAMP_START, SWIPE_OFFSET], [0, 1]);
  const skipOpacity = useTransform(x, [-SWIPE_OFFSET, -STAMP_START], [1, 0]);
  const borderColor = useTransform(
    x,
    [-SWIPE_OFFSET, 0, SWIPE_OFFSET],
    [rgba('red', 0.7), NEUTRAL_BORDER, rgba('green', 0.7)]
  );
  const boxShadow = useTransform(
    x,
    [-SWIPE_OFFSET, 0, SWIPE_OFFSET],
    [`0 0 60px ${rgba('red', 0.35)}`, NO_GLOW, `0 0 60px ${rgba('green', 0.35)}`]
  );

  const handleDragEnd = (_: unknown, { offset, velocity }: PanInfo) => {
    if (!isPresent) return;
    if (offset.x > SWIPE_OFFSET || (velocity.x > SWIPE_VELOCITY && offset.x > 0)) {
      onSwipe(1);
    } else if (offset.x < -SWIPE_OFFSET || (velocity.x < -SWIPE_VELOCITY && offset.x < 0)) {
      onSwipe(-1);
    } else {
      void animate(x, 0, SPRING.snappy);
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      drag={isPresent ? 'x' : false}
      dragMomentum={false}
      onDragEnd={handleDragEnd}
      whileDrag={{ scale: 1.04 }}
      style={{
        x,
        rotate,
        borderColor,
        boxShadow,
        zIndex: isPresent ? 1 : 2,
        background:
          'linear-gradient(145deg, rgba(255,255,255,0.075) 0%, rgba(255,255,255,0.02) 100%), #0e0b1c',
      }}
      className="rounded-premium-2xl relative flex min-h-56 w-full cursor-grab touch-pan-y flex-col items-center justify-center gap-2 overflow-hidden border-2 px-6 py-10 text-center select-none [grid-area:1/1] active:cursor-grabbing"
    >
      <motion.span
        style={{ opacity: correctOpacity }}
        className="rounded-premium-xs border-premium-green text-premium-green absolute top-5 right-5 rotate-12 border-2 px-3 py-1 text-xs font-black tracking-[0.2em] uppercase"
      >
        {correctLabel}
      </motion.span>
      <motion.span
        style={{ opacity: skipOpacity }}
        className="rounded-premium-xs border-premium-red text-premium-red absolute top-5 left-5 -rotate-12 border-2 px-3 py-1 text-xs font-black tracking-[0.2em] uppercase"
      >
        {skipLabel}
      </motion.span>

      <p className="text-micro text-premium-sky/35 font-black tracking-[0.5em] uppercase">
        {label}
      </p>
      <FitText
        as="h2"
        className="text-6xl leading-none font-black tracking-tighter text-white uppercase italic"
      >
        {word}
      </FitText>
    </motion.div>
  );
};
