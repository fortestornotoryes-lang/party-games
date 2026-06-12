import {useSpyHuntContent} from './useSpyHuntContent';

import type {Player} from '@/entities/player/types';
import {SPY_HUNT_MODES, SPY_HUNT_ROLE_IDS} from "@/games/SpyHuntGame/constants.ts";
import {shuffle} from '@/shared/helpers/random';
import {DIFFICULTY} from '@/shared/types';
import {generateId} from '@/utils/gameLogic';

export const initSpyHunt = (
    playerNames: string[],
    difficulty = DIFFICULTY.MEDIUM as string,
    mode = SPY_HUNT_MODES.CLASSIC as string
) => {
    const locationObj = useSpyHuntContent(difficulty);

    // Mode logic
    const indices = Array.from({length: playerNames.length}, (_, i) => i);
    const shuffled = shuffle(indices);

    let spyIndices: number[] = [shuffled[0]];
    let moleIndex: number | null = null;

    if (mode === SPY_HUNT_MODES.DOUBLE_AGENT && playerNames.length >= 5) {
        spyIndices = [shuffled[0], shuffled[1]];
    } else if (mode === SPY_HUNT_MODES.MOLE && playerNames.length >= 5) {
        moleIndex = shuffled[1];
    }

    const players: Player[] = playerNames.map((name, index) => {
        let role: string = SPY_HUNT_ROLE_IDS.PLAYER;
        let isSpy = false;

        if (spyIndices.includes(index)) {
            role = SPY_HUNT_ROLE_IDS.SPY;
            isSpy = true;
        } else if (index === moleIndex) {
            role = SPY_HUNT_ROLE_IDS.TRAITOR;
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

    return {players, location: locationObj.name};
};
