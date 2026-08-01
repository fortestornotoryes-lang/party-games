export const RESISTANCE_ROLE_IDS = {
  SPY: 'Шпион',
  RESISTANCE: 'Сопротивление',
} as const;

export const MISSION_SIZES: Partial<Record<number, number[]>> = {
  5: [2, 3, 2, 3, 3],
  6: [2, 3, 4, 3, 4],
  7: [2, 3, 3, 4, 4],
  8: [3, 4, 4, 5, 5],
  9: [3, 4, 4, 5, 5],
  10: [3, 4, 4, 5, 5],
};
