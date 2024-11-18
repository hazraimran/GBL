// src/context/GameContext.ts
import { createContext } from 'react';
import { LevelInfo, CurrentSceneType } from '../types/level';
import { CommandWithArgType, GameStatus } from '../types/game';

interface GameContextType {
    level: number;
    setLevel: (level: number) => void;
    currentScene: CurrentSceneType;
    setCurrentScene: (scene: CurrentSceneType) => void;
    instructions: string[];
    setInstructions: (instructions: string[]) => void;
    showBottomPanel: boolean;
    setShowBottomPanel: (show: boolean) => void;
    levelInfo: LevelInfo;
    setLevelInfo: (levelInfo: LevelInfo) => void;
    commandsUsed: CommandWithArgType[];
    setCommandsUsed: (commands: CommandWithArgType[]) => void;
    gameStatus: GameStatus;
    setGameStatus: (gameStatus: GameStatus) => void;
    showPopup: boolean;
    setShowPopup: (show: boolean) => void;
    exectuting: boolean;
    setExecuting: (executing: boolean) => void;
    pickSlotFn?: Function;
    setPickSlotFn?: (fn: Function) => void;
    registerPickSlot: (fn: Function) => void;
    connection: Array<{ start: HTMLElement; end: HTMLElement }>;
    setConnection: (connection: Array<{ start: HTMLElement; end: HTMLElement }>) => void;
}

// Create the context with a default value (optional)
const GameContext = createContext<GameContextType>({
    level: 0,
    setLevel: () => { },
    currentScene: 'LANDING',
    setCurrentScene: () => { },
    instructions: [],
    setInstructions: () => { },
    showBottomPanel: false,
    setShowBottomPanel: () => { },
    levelInfo: {
        id: -1,
        title: '',
        description: '',
        generatorFunction: '',
        validationFunction: '',
        commands: [],
        commandsUsed: [],
        constructionSlots: 0,
        expectedCommandCnt: 0,
        expectedExecuteCnt: 0,
        commandCountAchievement: null,
        executeCountAchievement: null,
        isLocked: false
    },
    setLevelInfo: () => { },
    commandsUsed: [],
    setCommandsUsed: () => { },
    gameStatus: {
        commandCnt: 0,
        executeCnt: 0
    },
    setGameStatus: () => { },
    showPopup: false,
    setShowPopup: () => { },
    exectuting: false,
    setExecuting: () => { },
    pickSlotFn: undefined,
    setPickSlotFn: () => { },
    registerPickSlot: () => { },
    connection: [],
    setConnection: () => { }
});

export default GameContext;
