import { CommandType, CommandWithArgType } from './game';

export interface ConstructtionSlotConfig {
    x: number;
    y: number;
    value?: string;
}

export type CurrentSceneType = 'LANDING' | 'GAME' | 'LEVELS';

export interface LevelInfo {
    id: number;
    title: string;
    description: string;
    generatorFunction: string;
    validationFunction: string;
    commands: CommandType[];
    commandsUsed: CommandWithArgType[];
    constructionSlots: ConstructtionSlotConfig[];
    expectedCommandCnt: number,
    expectedExecuteCnt: number,
    commandCountAchievement: null,
    executeCountAchievement: null,
    isLocked: boolean;
};