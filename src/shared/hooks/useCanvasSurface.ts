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
    // MouseEvent — нативные события из getCoalescedEvents() (PointerEvent наследует MouseEvent)
    (e: React.MouseEvent | React.TouchEvent | MouseEvent) => {
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
    (e: React.MouseEvent | React.TouchEvent | MouseEvent) => {
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

/**
 * Промежуточные точки движения пальца, которые браузер склеил в одно событие
 * (на 120 Гц экранах их несколько за кадр) — без них быстрый штрих выходит ломаным.
 */
export function coalescedPoints(e: React.PointerEvent): MouseEvent[] {
  const events = e.nativeEvent.getCoalescedEvents?.() ?? [];
  return events.length > 0 ? events : [e.nativeEvent];
}

/** Длинная сторона экспортируемого рисунка, px: хватает для показа во всю ширину телефона */
const MAX_EXPORT_SIDE = 1080;
const EXPORT_QUALITY = 0.85;

/**
 * Снимок канваса для сохранения в состояние игры. Рисунки живут в сессии партии
 * (localStorage), поэтому важен вес: PNG битмапа с DPR 3 — сотни КБ на рисунок,
 * WebP (Safari без WebP-энкодера — JPEG) с ограничением размера — в разы меньше.
 * Только для непрозрачного фона: JPEG не хранит прозрачность.
 */
export function exportCanvasImage(canvas: HTMLCanvasElement): string {
  const scale = Math.min(1, MAX_EXPORT_SIDE / Math.max(canvas.width, canvas.height, 1));
  let source = canvas;
  if (scale < 1) {
    source = document.createElement('canvas');
    source.width = Math.round(canvas.width * scale);
    source.height = Math.round(canvas.height * scale);
    const ctx = source.getContext('2d');
    if (!ctx) return canvas.toDataURL();
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(canvas, 0, 0, source.width, source.height);
  }
  const webp = source.toDataURL('image/webp', EXPORT_QUALITY);
  // Браузер без WebP-энкодера молча отдаёт PNG
  return webp.startsWith('data:image/webp') ? webp : source.toDataURL('image/jpeg', EXPORT_QUALITY);
}
