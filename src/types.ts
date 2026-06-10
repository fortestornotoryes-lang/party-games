export interface Player {
    id: string;
    name: string;
    role: string;
    isSpy: boolean;
}

export const DIFFICULTY = {
    EASY: 'easy',
    MEDIUM: 'medium',
    HARD: 'hard',
} as const;

export type Difficulty = (typeof DIFFICULTY)[keyof typeof DIFFICULTY];

export type GameTheme =
    | 'red'
    | 'green'
    | 'sky'
    | 'yellow'
    | 'orange'
    | 'purple'
    | 'blue'
    | 'pink'
    | 'cyan'
    | 'lime'
    | 'teal'
    | 'indigo';

export interface GameModeOption {
    id: string;
    name: string;
    description: string;
    icon: any; // Using any for icon component as they are from lucide-react
}
