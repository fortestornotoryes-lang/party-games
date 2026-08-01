import React from 'react';
import { Text, View } from 'react-native';

interface WordGridProps {
  words: string[];
  /** Высота ячейки в px (веб-версия принимала tailwind-класс h-*) */
  cellHeight?: number;
}

export const WordGrid: React.FC<WordGridProps> = ({ words, cellHeight = 64 }) => (
  <View className="flex-row flex-wrap" style={{ margin: -4 }}>
    {words.map((w, i) => (
      <View key={i} style={{ width: '50%', padding: 4 }}>
        <View
          className="rounded-premium-sm items-center justify-center border border-white/10 bg-white/5 p-2"
          style={{ height: cellHeight }}
        >
          <Text className="text-tag absolute left-2 top-2 font-black text-white/30">{i + 1}</Text>
          <Text className="text-sm font-bold uppercase text-white">{w}</Text>
        </View>
      </View>
    ))}
  </View>
);
