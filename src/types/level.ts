import { CommandType, CommandWithArgType } from './game';

/** A solution step can include optional display keys; only show in popup when set. */
export type SolutionStep = CommandWithArgType & {
    message?: string;
    /** Slot index (e.g. for COPYFROM); 1-based in JSON. Only displayed when set. */
    from?: number;
    /** JUMP target step number (1-based). Only displayed when set. */
    step?: number;
};

export interface ConstructtionSlotConfig {
    x: number;
    y: number;
    value?: number;
}

export type CurrentSceneType = 'LANDING' | 'GAME' | 'LEVELS' | 'TUTORIAL';

export interface LevelInfo {
    id: number;
    visible: boolean;
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
    timeLimitInSeconds?: number;
    solution?: SolutionStep[] | CommandWithArgType[] | string; // Can be array or CircularJSON string; steps may include optional message
};