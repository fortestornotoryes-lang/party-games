import { useCallback, useEffect, useLayoutEffect, useRef, type RefObject } from 'react';

interface CanvasSurfaceOptions {
  /** Слой активен: битмап создаётся и ресайз отслеживается только при true */
  active?: boolean;
  /** Наблюдать за родителем канваса, а не за самим канвасом */
  observeParent?: boolean;
  /** Сохранить содержимое перед пересозданием битмапа (для raster-подхода) */
  onBeforeResize?: (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => void;
  /** Настроить контекст и восстановить содержимое после пересоздания битмапа */
  onResize: (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => void;
}

/**
 * Общий слой canvas-рисования: масштабирование битмапа под devicePixelRatio,
 * пересоздание при ресайзе (ResizeObserver) и маппинг координат событий.
 * Компоненты рисования (DrawingCanvas, FakeArtist) строить на этом хуке,
 * а не дублировать DPR/resize-логику (см. .claude/memory/gotchas.md).
 */
export function useCanvasSurface(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  { active = true, observeParent = false, onBeforeResize, onResize }: CanvasSurfaceOptions
) {
  // Колбэки держим в ref, чтобы не переподписывать ResizeObserver на каждый рендер
  const onBeforeResizeRef = useRef(onBeforeResize);
  const onResizeRef = useRef(onResize);
  useLayoutEffect(() => {
    onBeforeResizeRef.current = onBeforeResize;
    onResizeRef.current = onResize;
  });

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const updateSize = () => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      const dpr = window.devicePixelRatio || 1;
      const newW = Math.round(rect.width * dpr);
      const newH = Math.round(rect.height * dpr);
      if (canvas.width === newW && canvas.height === newH) return;
      onBeforeResizeRef.current?.(ctx, canvas);
      // Смена размеров стирает битмап — содержимое восстанавливает onResize
      canvas.width = newW;
      canvas.height = newH;
      onResizeRef.current(ctx, canvas);
    };

    const ro = new ResizeObserver(updateSize);
    ro.observe(observeParent && canvas.parentElement ? canvas.parentElement : canvas);
    updateSize();
    return () => {
      ro.disconnect();
    };
  }, [active, canvasRef, observeParent]);

  /** Координаты события в CSS-пикселях относительно канваса */
  const getCssPos = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      const canvas = canvasRef.current;
      const point = 'touches' in e ? (e.touches[0] as Touch | undefined) : e;
      if (!canvas || !point) return { x: 0, y: 0 };
      const rect = canvas.getBoundingClientRect();
      return { x: point.clientX - rect.left, y: point.clientY - rect.top };
    },
    [canvasRef]
  );

  /** Координаты события в пикселях битмапа (CSS-координаты × масштаб DPR) */
  const getBitmapPos = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return { x: 0, y: 0 };
      const rect = canvas.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return { x: 0, y: 0 };
      const { x, y } = getCssPos(e);
      return { x: x * (canvas.width / rect.width), y: y * (canvas.height / rect.height) };
    },
    [canvasRef, getCssPos]
  );

  return { getCssPos, getBitmapPos };
}
