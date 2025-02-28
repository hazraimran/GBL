// types/game.ts
export interface Stone {
    sprite: Phaser.GameObjects.Sprite;
    shadow: Phaser.GameObjects.Sprite | null;
    value: number;
    text: Phaser.GameObjects.Text;
}

export interface Worker {
    sprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    stoneCarried?: Stone;
    shadow: Phaser.GameObjects.Sprite;
}

export interface ConstructionSlot {
    rect: Phaser.GameObjects.Rectangle;
    stone: Stone | null;
}

export type generatorFn = (nextInt: (min: number, max: number) => number) => number[];

export type outputFn = (nextInt: (min: number, max: number) => number) => number[];

export type CommandType =
    'INPUT' | 'OUTPUT' | 'COPYFROM' | 'COPYTO' |
    'ADD' | 'SUB' | 'BUMPUP' | 'BUMPDOWN' |
    'JUMP' | 'JUMP = 0' | 'JUMP < 0' | 'LABEL' | "";

export type CommandWithArgType = {
    command: CommandType;
    arg?: number | CommandWithArgType;
}

export type GameStatus = {
    commandCnt: number;
    executeCnt: number;
};