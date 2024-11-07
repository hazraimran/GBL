import { CommandType } from './game';

export type CurrentSceneType = 'LANDING' | 'GAME' | 'LEVELS';

export type LevelInfo = {
    id: number;
    title: string;
    description: string;
    generationFunction: string;
    validationFunction: string;
    commands: CommandType[];
    commandsUsed: CommandType[];
    instructionCountAchievement: boolean;
    commandCountAchievement: boolean;
    isLocked: boolean;
};