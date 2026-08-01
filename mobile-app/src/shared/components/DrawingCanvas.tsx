import { Canvas, Fill, Path, useCanvasRef } from '@shopify/react-native-skia';
import { CheckCircle2, Eraser, Undo2 } from 'lucide-react-native';
import { MotiView } from 'moti';
import React, { useEffect, useRef, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';

import { useTranslation } from '@/shared/i18n';

const BRUSH_COLORS = [
  '#ffffff',
  '#ef4444',
  '#f59e0b',
  '#10b981',
  '#3b82f6',
  '#8b5cf6',
  '#ec4899',
  '#000000',
];
const BRUSH_SIZES = [1, 2, 4, 8, 14];
const CANVAS_BG = '#120a0a';

interface Point {
  x: number;
  y: number;
}

interface Stroke {
  points: Point[];
  color: string;
  width: number;
}

interface DrawingCanvasProps {
  word: string;
  timeLeft: number;
  playerCount: number;
  currentRound: number;
  onFinish: (dataUrl: string) => void;
}

/** Точки штриха → строка SVG-пути для компонента Skia Path */
const toSvgPath = (points: Point[]): string => {
  if (points.length === 0) return '';
  const [first, ...rest] = points;
  return `M ${first.x} ${first.y} ` + rest.map((p) => `L ${p.x} ${p.y}`).join(' ');
};

/**
 * Холст рисования на react-native-skia (замена веб-canvas 2D API).
 * Вместо растрового битмапа с DPR-пересозданием (веб-useCanvasSurface) —
 * векторные штрихи как массив точек; undo — просто pop последнего штриха.
 */
export const DrawingCanvas: React.FC<DrawingCanvasProps> = ({
  word,
  timeLeft,
  playerCount,
  currentRound,
  onFinish,
}) => {
  const { t } = useTranslation();
  const canvasRef = useCanvasRef();
  const prevTimeLeftRef = useRef(timeLeft);
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [currentPoints, setCurrentPoints] = useState<Point[]>([]);
  const [brushColor, setBrushColor] = useState('#ffffff');
  const [brushSize, setBrushSize] = useState(2);
  const brushColorRef = useRef(brushColor);
  const brushSizeRef = useRef(brushSize);
  brushColorRef.current = brushColor;
  brushSizeRef.current = brushSize;

  const snapshotToDataUrl = () => {
    const image = canvasRef.current?.makeImageSnapshot();
    if (!image) return '';
    return `data:image/png;base64,${image.encodeToBase64()}`;
  };

  // Автосабмит при переходе таймера из >0 в 0
  useEffect(() => {
    if (prevTimeLeftRef.current > 0 && timeLeft === 0) {
      onFinish(snapshotToDataUrl());
    }
    prevTimeLeftRef.current = timeLeft;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft]);

  const appendPoint = (x: number, y: number) => {
    setCurrentPoints((prev) => [...prev, { x, y }]);
  };

  const endStroke = () => {
    setCurrentPoints((prev) => {
      if (prev.length > 1) {
        setStrokes((s) => [
          ...s,
          { points: prev, color: brushColorRef.current, width: brushSizeRef.current },
        ]);
      }
      return [];
    });
  };

  const pan = Gesture.Pan()
    .onBegin((e) => {
      runOnJS(appendPoint)(e.x, e.y);
    })
    .onChange((e) => {
      runOnJS(appendPoint)(e.x, e.y);
    })
    .onEnd(() => {
      runOnJS(endStroke)();
    })
    .minDistance(0);

  const undoDrawing = () => {
    setStrokes((s) => s.slice(0, -1));
  };

  const clearCanvas = () => {
    setStrokes([]);
    setCurrentPoints([]);
  };

  const handleSubmit = () => {
    onFinish(snapshotToDataUrl());
  };

  return (
    <View className="flex-1 gap-2 p-3">
      <View className="flex-row items-center justify-between px-1">
        <View>
          <Text className="text-micro font-black uppercase text-white/30" style={{ letterSpacing: 2 }}>
            ✏️ {t('common.youDraw')}
          </Text>
          <MotiView from={{ opacity: 0, translateX: -10 }} animate={{ opacity: 1, translateX: 0 }}>
            <Text className="text-premium-orange text-lg font-black">{word}</Text>
          </MotiView>
        </View>
        <View className="flex-row items-center gap-2">
          <Text
            className={`min-w-[32px] text-right text-sm font-black ${
              timeLeft <= 10 ? 'text-premium-red' : 'text-white/35'
            }`}
            style={{ fontVariant: ['tabular-nums'] }}
          >
            {t('common.secondsShort', { n: timeLeft })}
          </Text>
          <Pressable onPress={undoDrawing} className="rounded-premium-sm bg-white/5 p-2.5">
            <Undo2 size={20} color="rgba(255,255,255,0.35)" />
          </Pressable>
          <Pressable onPress={clearCanvas} className="rounded-premium-sm bg-white/5 p-2.5">
            <Eraser size={20} color="rgba(255,255,255,0.35)" />
          </Pressable>
          <Pressable onPress={handleSubmit} className="rounded-premium-sm bg-white p-2.5">
            <CheckCircle2 size={20} color="#000" />
          </Pressable>
        </View>
      </View>

      <View className="flex-row justify-center gap-1.5 py-0.5">
        {Array.from({ length: playerCount }).map((_, i) => (
          <View
            key={i}
            className={`h-1 rounded-full ${
              i < currentRound
                ? 'w-3 bg-orange-500/30'
                : i === currentRound
                  ? 'w-5 bg-orange-500'
                  : 'w-3 bg-white/10'
            }`}
          />
        ))}
      </View>

      <View className="rounded-premium-md relative flex-1 overflow-hidden border border-white/10">
        <GestureDetector gesture={pan}>
          <Canvas ref={canvasRef} style={{ flex: 1 }}>
            <Fill color={CANVAS_BG} />
            {strokes.map((s, i) => (
              <Path
                key={i}
                path={toSvgPath(s.points)}
                color={s.color}
                style="stroke"
                strokeWidth={s.width}
                strokeCap="round"
                strokeJoin="round"
              />
            ))}
            {currentPoints.length > 1 && (
              <Path
                path={toSvgPath(currentPoints)}
                color={brushColor}
                style="stroke"
                strokeWidth={brushSize}
                strokeCap="round"
                strokeJoin="round"
              />
            )}
          </Canvas>
        </GestureDetector>
      </View>

      <View className="rounded-premium-md gap-2 border border-white/10 bg-black/70 px-3 py-2.5">
        <View className="flex-row items-center justify-center gap-1.5">
          {BRUSH_COLORS.map((color) => (
            <Pressable
              key={color}
              onPress={() => {
                setBrushColor(color);
              }}
              className="h-7 w-7 rounded-full"
              style={{
                backgroundColor: color,
                borderWidth: 2,
                borderColor: brushColor === color ? '#fff' : 'transparent',
                transform: [{ scale: brushColor === color ? 1.1 : 1 }],
              }}
            />
          ))}
        </View>
        <View className="flex-row items-center justify-center gap-4">
          {BRUSH_SIZES.map((size) => (
            <Pressable
              key={size}
              onPress={() => {
                setBrushSize(size);
              }}
              className="h-8 w-8 items-center justify-center"
            >
              <View
                className={`rounded-full ${brushSize === size ? 'bg-orange-500' : 'bg-white/25'}`}
                style={{ width: Math.max(2, size * 1.2), height: Math.max(2, size * 1.2) }}
              />
            </Pressable>
          ))}
        </View>
      </View>
    </View>
  );
};
