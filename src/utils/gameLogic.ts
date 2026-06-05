import { Player } from '../types';
import { GameKey } from '../types/games';
import { shuffle } from './random';
import { storageService } from '../services/storageService';
import { contentService } from '../services/contentService';

export const generateId = () => Math.random().toString(36).substr(2, 9);

export const initSpyHunt = (
  playerNames: string[],
  difficulty: string = 'medium',
  mode: string = 'classic'
) => {
  const locationObj = contentService.getSpyHuntLocation(difficulty);

  // Mode logic
  const indices = Array.from({ length: playerNames.length }, (_, i) => i);
  const shuffled = shuffle(indices);

  let spyIndices: number[] = [shuffled[0]];
  let moleIndex: number | null = null;

  if (mode === 'double_agent' && playerNames.length >= 5) {
    spyIndices = [shuffled[0], shuffled[1]];
  } else if (mode === 'mole' && playerNames.length >= 5) {
    moleIndex = shuffled[1];
  }

  const players: Player[] = playerNames.map((name, index) => {
    let role = 'Игрок';
    let isSpy = false;

    if (spyIndices.includes(index)) {
      role = 'Шпион';
      isSpy = true;
    } else if (index === moleIndex) {
      role = 'Предатель';
      isSpy = false; // He knows the location, but is not "the" spy
    } else {
      role = locationObj.roles[index % locationObj.roles.length];
    }

    return {
      id: generateId(),
      name,
      role,
      isSpy,
    };
  });

  return { players, location: locationObj.name };
};

export const initFakeArtist = (playerNames: string[]) => {
  const spyIndex = Math.floor(Math.random() * playerNames.length);

  const players: Player[] = playerNames.map((name, index) => ({
    id: generateId(),
    name,
    role: index === spyIndex ? 'Самозванец' : 'Художник',
    isSpy: index === spyIndex,
  }));

  return { players };
};

export const initResistance = (playerNames: string[]) => {
  const pCount = playerNames.length;
  let spyCount = 2;
  if (pCount >= 7) spyCount = 3;
  if (pCount >= 10) spyCount = 4;

  const indices = Array.from({ length: pCount }, (_, i) => i);
  const shuffledIndices = shuffle(indices);
  const spyIndices = shuffledIndices.slice(0, spyCount);

  const players: Player[] = playerNames.map((name, index) => ({
    id: generateId(),
    name,
    role: spyIndices.includes(index) ? 'Шпион' : 'Сопротивление',
    isSpy: spyIndices.includes(index),
  }));

  return { players };
};
