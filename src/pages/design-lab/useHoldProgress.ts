import type { AnimationPlaybackControls } from 'motion/react';
import { animate, useMotionValue } from 'motion/react';
import type React from 'react';
import { useEffect, useRef } from 'react';

/** Откат прогресса, если палец отпустили раньше времени, с */
const RELEASE_DURATION = 0.25;

/**
 * Подтверждение удержанием: пока палец на элементе, прогресс 0 → 1 за `durationMs`,
 * отпустили раньше — откатывается. Защищает от случайного открытия чужим пальцем.
 * С клавиатуры (Enter/Space → click с detail 0) срабатывает сразу.
 */
export function useHoldProgress(durationMs: number, onComplete: () => void) {
  const progress = useMotionValue(0);
  const controls = useRef<AnimationPlaybackControls | null>(null);
  const done = useRef(false);

  const finish = () => {
    if (done.current) return;
    done.current = true;
    progress.set(1);
    onComplete();
  };

  const start = () => {
    if (done.current) return;
    controls.current?.stop();
    const remaining = ((1 - progress.get()) * durationMs) / 1000;
    controls.current = animate(progress, 1, {
      duration: remaining,
      ease: 'linear',
      onComplete: finish,
    });
  };

  const cancel = () => {
    if (done.current) return;
    controls.current?.stop();
    controls.current = animate(progress, 0, { duration: RELEASE_DURATION, ease: 'easeOut' });
  };

  useEffect(
    () => () => {
      controls.current?.stop();
    },
    []
  );

  const handlers = {
    onPointerDown: start,
    onPointerUp: cancel,
    onPointerLeave: cancel,
    onPointerCancel: cancel,
    onContextMenu: (e: React.MouseEvent) => {
      e.preventDefault();
    },
    onClick: (e: React.MouseEvent) => {
      if (e.detail === 0) finish();
    },
  };

  return { progress, handlers };
}
