export enum TelestrationsPhase {
    Setup = 'setup',
    Start = 'start',
    Action = 'action',
    Transition = 'transition',
    Gallery = 'gallery',
}

export type Step = {
    type: 'draw' | 'guess';
    content: string;
    author: string;
};
