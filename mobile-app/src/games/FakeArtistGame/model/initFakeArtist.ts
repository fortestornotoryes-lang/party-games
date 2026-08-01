import { FAKE_ARTIST_ROLE_IDS } from '../content';

import type { Player } from '@/entities/player/types';
import { generateId } from '@/shared/helpers/random';

export const initFakeArtist = (playerNames: string[]) => {
  const spyIndex = Math.floor(Math.random() * playerNames.length);

  const players: Player[] = playerNames.map((name, index) => ({
    id: generateId(),
    name,
    role: index === spyIndex ? FAKE_ARTIST_ROLE_IDS.IMPOSTER : FAKE_ARTIST_ROLE_IDS.ARTIST,
    isSpy: index === spyIndex,
  }));

  return { players };
};
