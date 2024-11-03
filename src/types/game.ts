// types/game.ts
export interface Worker {
    sprite: Phaser.GameObjects.Sprite;
    isCarrying: boolean;
    currentStone?: StoneType;
    carryingValue?: number;  // 新增属性
}

export interface Stone {
    sprite: Phaser.GameObjects.Sprite;
    type: StoneType;
    value?: number;  // 新增属性
}

export interface Stone {
    sprite: Phaser.GameObjects.Sprite;
    type: StoneType;
}

export interface ConstructionSlot {
    rect: Phaser.GameObjects.Rectangle;
    isOccupied: boolean;
    requiredStoneType?: StoneType;
}

export type StoneType = 'small' | 'medium' | 'large';
export type CommandType =
    'INPUT' | 'OUTPUT' | 'COPYFROM' | 'COPYTO' |
    'ADD' | 'SUB' | 'BUMPUP' | 'BUMPDOWN' |
    'JUMP' | 'JUMPZ' | 'JUMPN' | 'LABEL';

export interface Command {
    id: CommandType;
    label: string;
}