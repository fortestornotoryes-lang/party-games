// Значения совпадают с веб-версией (там enum) — важно для восстановления персистентных сессий
export const FakeArtistPhase = {
  Distributing: 'distributing',
  Playing: 'playing',
  Voting: 'voting',
} as const;
export type FakeArtistPhase = (typeof FakeArtistPhase)[keyof typeof FakeArtistPhase];
