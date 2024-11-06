// types/game.ts
export interface Worker {
    sprite: Phaser.GameObjects.Sprite;
    isCarrying: boolean;
    currentStone?: StoneType;
    carryingValue?: number;
}

export interface Stone {
    sprite: Phaser.GameObjects.Sprite;
    type: StoneType;
    value?: number;
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
export type Command =
    'INPUT' | 'OUTPUT' | 'COPYFROM' | 'COPYTO' |
    'ADD' | 'SUB' | 'BUMPUP' | 'BUMPDOWN' |
    'JUMP' | 'JUMPZ' | 'JUMPN' | 'LABEL';
