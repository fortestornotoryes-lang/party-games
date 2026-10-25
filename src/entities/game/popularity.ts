import type { GameKey, GameMetadata } from './types';

const STORAGE_KEY = 'party_app_game_starts';
type Counts = Partial<Record<GameKey, number>>;

export function getGameStartCounts(): Counts {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}');
    if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
    return Object.fromEntries(
      Object.entries(value).filter(([, count]) =>
        typeof count === 'number' && Number.isSafeInteger(count) && count >= 0,
      ),
    );
  } catch {
    return {};
  }
}

export function recordGameStart(gameKey: GameKey): void {
  try {
    const counts = getGameStartCounts();
    counts[gameKey] = (counts[gameKey] ?? 0) + 1;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(counts));
  } catch {
    // Недоступное хранилище не мешает начать партию.
  }
}

export function sortGamesByPopularity(games: GameMetadata[], counts: Counts): GameMetadata[] {
  return games
    .map((game, index) => ({ game, index }))
    .sort((a, b) => (counts[b.game.id] ?? 0) - (counts[a.game.id] ?? 0) || a.index - b.index)
    .map(({ game }) => game);
}
