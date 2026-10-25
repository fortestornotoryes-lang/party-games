import type { Transition, Variants } from 'motion/react';

/**
 * Пружины — единый «характер» движения в играх.
 * Новые анимации собирать из них, а не подбирать stiffness/damping на месте.
 */
export const SPRING = {
  /** Мягкое появление экранов и карточек */
  soft: { type: 'spring', stiffness: 260, damping: 26 },
  /** Упругий «поп» — счёт, бейджи, иконки */
  pop: { type: 'spring', stiffness: 520, damping: 17 },
  /** Быстрый отклик на касание, перелёты layout-анимаций */
  snappy: { type: 'spring', stiffness: 420, damping: 34 },
  /** Тяжёлый переворот карточки (3D-флип) */
  flip: { type: 'spring', stiffness: 150, damping: 17 },
} as const satisfies Record<string, Transition>;

/** Плавное замедление к концу — для счётчиков и полос прогресса */
export const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

/**
 * Смена фаз: экран всплывает снизу и уходит вверх.
 * Дети с вариантами STAGGER_ITEM появляются каскадом вслед за экраном.
 * Без scale: масштаб всего экрана заставляет перерастеризовывать весь текст фазы
 * на каждом кадре — на телефонах переход заметно дёргался.
 */
export const PHASE_VARIANTS: Variants = {
  initial: { opacity: 0, y: 24 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { ...SPRING.soft, staggerChildren: 0.06, delayChildren: 0.06 },
  },
  exit: { opacity: 0, y: -16, transition: { duration: 0.18, ease: 'easeIn' } },
};

/** Элемент каскада внутри PHASE_VARIANTS (или любого контейнера со staggerChildren) */
export const STAGGER_ITEM: Variants = {
  initial: { opacity: 0, y: 18, scale: 0.96 },
  animate: { opacity: 1, y: 0, scale: 1, transition: SPRING.soft },
};

/**
 * «Раздача» карточки: прилетает снизу с 3D-наклоном.
 * Родителю нужна перспектива (класс `perspective-distant`).
 */
export const CARD_DEAL_VARIANTS: Variants = {
  initial: { opacity: 0, y: 70, rotateX: 28, scale: 0.9 },
  animate: { opacity: 1, y: 0, rotateX: 0, scale: 1, transition: SPRING.soft },
  exit: {
    opacity: 0,
    y: -40,
    rotateX: -18,
    scale: 0.94,
    transition: { duration: 0.2, ease: 'easeIn' },
  },
};

/** Короткая «тряска» — ошибка, ложь, неудача */
export const SHAKE_X = [0, -10, 9, -7, 5, -3, 0];
