import { Command } from './game';

export type CurrentSceneType = 'LANDING' | 'GAME' | 'LEVELS';

export type LevelInfo = {
    id: number;
    title: string;
    description: string;
    generationFunction: string;
    validationFunction: string;
    commands: Command[];
    commandsUsed: Command[];
    instructionCountAchievement: boolean;
    commandCountAchievement: boolean;
    isLocked: boolean;
};