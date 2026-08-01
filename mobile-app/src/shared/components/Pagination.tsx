import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import React from 'react';
import { Pressable, View } from 'react-native';

interface PaginationProps {
  page: number;
  total: number;
  perPage: number;
  onChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({ page, total, perPage, onChange }) => {
  const pageCount = Math.ceil(total / perPage);
  if (pageCount <= 1) return null;

  return (
    <View className="flex-row items-center justify-between border-t border-white/5 pt-3">
      <Pressable
        onPress={() => {
          onChange(page - 1);
        }}
        disabled={page === 1}
        className={`rounded-premium-sm h-8 w-8 items-center justify-center border border-white/10 ${
          page === 1 ? 'opacity-25' : ''
        }`}
        style={({ pressed }) => (pressed ? { transform: [{ scale: 0.9 }] } : undefined)}
      >
        <ChevronLeft size={16} color="rgba(255,255,255,0.4)" />
      </Pressable>

      <View className="flex-row items-center gap-1.5">
        {Array.from({ length: pageCount }, (_, i) => i + 1).map((p) => (
          <Pressable
            key={p}
            onPress={() => {
              onChange(p);
            }}
            hitSlop={6}
            className={`h-1.5 w-1.5 rounded-full ${p === page ? 'bg-white/60' : 'bg-white/20'}`}
            style={p === page ? { transform: [{ scale: 1.25 }] } : undefined}
          />
        ))}
      </View>

      <Pressable
        onPress={() => {
          onChange(page + 1);
        }}
        disabled={page === pageCount}
        className={`rounded-premium-sm h-8 w-8 items-center justify-center border border-white/10 ${
          page === pageCount ? 'opacity-25' : ''
        }`}
        style={({ pressed }) => (pressed ? { transform: [{ scale: 0.9 }] } : undefined)}
      >
        <ChevronRight size={16} color="rgba(255,255,255,0.4)" />
      </Pressable>
    </View>
  );
};
