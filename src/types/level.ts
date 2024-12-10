import { CommandType, CommandWithArgType } from './game';

export interface ConstructtionSlotConfig {
    x: number;
    y: number;
    value?: number;
}

export type CurrentSceneType = 'LANDING' | 'GAME' | 'LEVELS';

export interface LevelInfo {
    id: number;
    title: string;
    description: string;
    generatorFunction: string;
    outputFunction: string;
    commands: CommandType[];
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
};