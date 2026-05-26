export enum BunkerPhase {
  Briefing        = 'briefing',
  DictatorReveal  = 'dictator_reveal',
  RevealPass      = 'reveal_pass',
  Discussion      = 'discussion',
  Voting          = 'voting',
  Tribunal        = 'tribunal',
  SurvivalSim     = 'survival_sim',
  Results         = 'results',
}

export type ResourceKey = 'food' | 'water' | 'medicine' | 'energy' | 'morale';

export type ResourceBonus = Partial<Record<ResourceKey, number>>;

export interface AttributeEntry {
  name: string;
  emoji: string;
  bonus: ResourceBonus;
  tier?: 'S' | 'A' | 'B' | 'C';
  isPositive?: boolean;
}

export type TraitKey = 'health' | 'hobby' | 'phobia' | 'trait' | 'item' | 'specialFact';

export interface BunkerCharacter {
  playerName: string;
  age: number;
  gender: 'М' | 'Ж';
  profession:  AttributeEntry;
  health:      AttributeEntry;
  hobby:       AttributeEntry;
  phobia:      AttributeEntry;
  trait:       AttributeEntry;
  item:        AttributeEntry;
  specialFact: AttributeEntry;
  /**
   * Shuffled order of trait keys to reveal in rounds 2, 3, 4, 5…
   * revealOrder[0] → round 2, revealOrder[1] → round 3, etc.
   * Length = TOTAL_REVEAL_ROUNDS - 1
   */
  revealOrder: readonly TraitKey[];
}

export interface CatastropheScenario {
  title:           string;
  emoji:           string;
  description:     string;
  resourcePenalty: ResourceBonus;
}

export interface SurvivalEvent {
  title:       string;
  description: string;
  emoji:       string;
  effect:      ResourceBonus;
  positive:    boolean;
}

export interface BunkerResources {
  food:     number;
  water:    number;
  medicine: number;
  energy:   number;
  morale:   number;
}

export type SurvivalOutcome = 'full_victory' | 'partial' | 'pyrrhic' | 'defeat';

export const TRAIT_LABELS: Record<string, string> = {
  profession:  'Профессия',
  health:      'Здоровье',
  hobby:       'Хобби',
  phobia:      'Фобия',
  trait:       'Черта характера',
  item:        'Предмет',
  specialFact: 'Особый факт',
};

export const ALL_TRAIT_KEYS: readonly TraitKey[] = [
  'health', 'hobby', 'phobia', 'trait', 'item', 'specialFact',
];

/** Returns the traits that were NOT revealed during any round (still hidden). */
export function getHiddenTraits(
  char: BunkerCharacter,
): Array<{ key: TraitKey; label: string; entry: AttributeEntry }> {
  return ALL_TRAIT_KEYS
    .filter(k => !char.revealOrder.includes(k))
    .map(k => ({ key: k, label: TRAIT_LABELS[k], entry: char[k] }));
}

// Helper: get the trait revealed in a given round for a character
export function getRevealedTrait(
  char: BunkerCharacter,
  round: number,
): { traitKey: string; label: string; entry: AttributeEntry } | null {
  if (round === 1) return { traitKey: 'profession', label: TRAIT_LABELS.profession, entry: char.profession };
  const key = char.revealOrder[round - 2];
  if (!key) return null;
  return { traitKey: key, label: TRAIT_LABELS[key], entry: char[key] };
}
