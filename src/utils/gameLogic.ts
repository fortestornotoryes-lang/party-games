import { Player } from '../types';
import { LOCATIONS_DATA } from '../constants/spyHuntContent';
import { shuffle } from './random';

export const generateId = () => Math.random().toString(36).substr(2, 9);

export const initSpyHunt = (playerNames: string[]) => {
    const locationObj = LOCATIONS_DATA[Math.floor(Math.random() * LOCATIONS_DATA.length)];
    const spyIndex = Math.floor(Math.random() * playerNames.length);

    const players: Player[] = playerNames.map((name, index) => ({
        id: generateId(),
        name,
        role: index === spyIndex ? 'Шпион' : locationObj.roles[index % locationObj.roles.length],
        isSpy: index === spyIndex,
    }));

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
        isSpy: spyIndices.includes(index)
    }));

    return { players };
};

export const initAlias = (playerNames: string[]) => {
    const shuffled = shuffle(playerNames);
    const mid = Math.ceil(shuffled.length / 2);
    return {
        teams: [
            { name: 'Красные', players: shuffled.slice(0, mid), score: 0 },
            { name: 'Синие', players: shuffled.slice(mid), score: 0 },
        ]
    };
};

export const initJustOne = (playerNames: string[]) => {
    return { guesserIndex: 0, score: 0, totalRounds: 0 };
};

export const initTelestrations = (playerNames: string[]) => {
    return { shuffledPlayers: shuffle(playerNames), currentRound: 0 };
};

export const initWavelength = (playerNames: string[]) => {
    const shuffled = shuffle(playerNames);
    const mid = Math.ceil(shuffled.length / 2);
    return {
        teams: [
            { name: 'Красные', color: 'red', players: shuffled.slice(0, mid), score: 0 },
            { name: 'Синие', color: 'blue', players: shuffled.slice(mid), score: 0 },
        ]
    };
};
