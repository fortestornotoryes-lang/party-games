import { storageService } from '@/shared/services/storageService';
import type { Difficulty } from '@/shared/types';

interface DeckCard {
  id: number;
  word: string;
  difficulty: Difficulty;
}

/**
 * Восстанавливает множество id уже сыгранных карт текущей сложности
 * из used-слов в storage (used-слова хранятся по `word`, карты идентифицируются по `id`).
 */
export function buildUsedCardIds(
  gameId: string,
  cards: readonly DeckCard[],
  difficulty: Difficulty
): Set<number> {
  const usedWords = storageService.getUsedWords(gameId);
  if (usedWords.length === 0) return new Set<number>();
  const usedSet = new Set(usedWords);
  return new Set(
    cards.filter((c) => c.difficulty === difficulty && usedSet.has(c.word)).map((c) => c.id)
  );
}

/**
 * Помечает текущую карту использованной и возвращает новое множество used-id.
 * Когда сыграны все карты сложности — сбрасывает колоду (used-слова) и возвращает пустое множество.
 */
export function advanceUsedDeck(
  gameId: string,
  cards: readonly DeckCard[],
  difficulty: Difficulty,
  used: ReadonlySet<number>,
  currentCard: DeckCard
): ReadonlySet<number> {
  const afterUsed = new Set([...used, currentCard.id]);
  const totalForDiff = cards.filter((c) => c.difficulty === difficulty).length;
  if (afterUsed.size >= totalForDiff) {
    storageService.resetUsedWords(gameId);
    return new Set<number>();
  }
  storageService.markWordAsUsed(gameId, currentCard.word);
  return afterUsed;
}
