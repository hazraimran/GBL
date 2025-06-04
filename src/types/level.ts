import { CommandType, CommandWithArgType } from './game';

export interface ConstructtionSlotConfig {
    x: number;
    y: number;
    value?: number;
}

export type CurrentSceneType = 'LANDING' | 'GAME' | 'LEVELS' | 'TUTORIAL';

export interface LevelInfo {
    id: number;
    title: string;
    description: string;
    learningOutcome: {
        concept: string;
        descr: string;
        why: string;
        how: string;
    };
    generatorFunction: string;
    outputFunction: string;
    commands: CommandType[];
    commandsToUse: CommandType[];
    commandsUsed: CommandWithArgType[];
    constructionSlots: ConstructtionSlotConfig[];
    expectedCommandCnt: number,
    expectedExecuteCnt: number,
    executeCnt: number,
    commandCountAchievement: null,
    executeCountAchievement: null,
    isLocked: boolean;
    timeSpent: number;
    timeAccessed: number;
    openningInstruction: string[];
    hints: string[];
};