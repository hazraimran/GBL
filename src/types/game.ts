// types/game.ts
export interface Stone {
    sprite: Phaser.GameObjects.Rectangle;
    value?: number;
}

export interface Worker {
    sprite: Phaser.GameObjects.Rectangle;
    stoneCarried?: Stone;
}

export interface ConstructionSlot {
    rect: Phaser.GameObjects.Rectangle;
    isOccupied: boolean;
}

export type generatorFn = (seed: number) => number[];

export type validationFn = (output: number[]) => boolean;

export type CommandType =
    'INPUT' | 'OUTPUT' | 'COPYFROM' | 'COPYTO' |
    'ADD' | 'SUB' | 'BUMPUP' | 'BUMPDOWN' |
    'JUMP' | 'JUMPZ' | 'JUMPN' | 'LABEL' | "";

export type CommandWithArgType = {
    command: CommandType;
    arg?: number | CommandWithArgType;
}

export type GameStatus = {
    commandCnt: number;
    executeCnt: number;
};