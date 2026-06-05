export enum TelestrationsPhase {
    Setup = 'setup',
    Start = 'start',
    Action = 'action',
    Transition = 'transition',
    Gallery = 'gallery',
}

export interface Step {
    type: 'draw' | 'guess';
    content: string;
    author: string;
}
