import { CommandType, CommandWithArgType } from './game';

export type CurrentSceneType = 'LANDING' | 'GAME' | 'LEVELS';

export type LevelInfo = {
    id: number;
    title: string;
    description: string;
    generatorFunction: string;
    validationFunction: string;
    commands: CommandType[];
    commandsUsed: CommandWithArgType[];
    constructionSlots: number;
    expectedCommandCnt: number,
    expectedExecuteCnt: number,
    commandCountAchievement: null,
    executeCountAchievement: null,
    isLocked: boolean;
};