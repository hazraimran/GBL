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
    connection: Array<{ start: HTMLElement; end: HTMLElement }>;
    setConnection: (connection: Array<{ start: HTMLElement; end: HTMLElement }>) => void;
    readyToPickSlot: boolean;
    setReadyToPickSlot: (ready: boolean) => void;
    slotPicked: number | undefined;
    setSlotPicked: (slot: number | undefined) => void;
    showReadyPrompt: boolean;
    setShowReadyPrompt: (show: boolean) => void;
    showFailurePrompt: boolean;
    setShowFailurePrompt: (show: boolean) => void;
    failurePromptMessage: string;
    setFailurePromptMessage: (message: string) => void;
    showPickSlotPrompt: boolean;
    setShowPickSlotPrompt: (show: boolean) => void;
    showFirstTimePickPrompt: boolean;
    setShowFirstTimePickPrompt: (show: boolean) => void;
    registerResetFn: (fn: () => void) => void,
    resetFn: () => void
    errorCnt: number;
    setErrorCnt: (errorCnt: number) => void;
    showOpenningInstruction: boolean;
    setShowOpenningInstruction: (show: boolean) => void;
    openningInstruction: string[];
    setOpenningInstruction: (instructions: string[]) => void;
    showInstructionPanel: boolean;
    setShowInstructionPanel: (show: boolean) => void;
    showPromptModal: boolean;
    setShowPromptModal: (show: boolean) => void;
    showInfo: boolean;
    setShowInfo: (show: boolean) => void;
    navTo: (scene: CurrentSceneType) => void,
    showModal: boolean,
    muted: boolean,
    setMuted: (muted: boolean) => void,
    playBGM: boolean,
    setPlayBGM: (play: boolean) => void,
    character: string,
    setCharacter: (character: string) => void,
    tutorial: boolean,
    setTutorial: (tutorial: boolean) => void,
    isAiHelperON: boolean,
    setIsAiHelperON: (isOn: boolean) => void,
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
        outputFunction: '',
        commands: [],
        commandsToUse: [],
        commandsUsed: [],
        constructionSlots: [],
        expectedCommandCnt: 0,
        expectedExecuteCnt: 0,
        executeCnt: 0,
        commandCountAchievement: null,
        executeCountAchievement: null,
        isLocked: false,
        timeSpent: 0,
        timeAccessed: 0,
        openningInstruction: [],
        learningOutcome: {
            concept: '',
            descr: '',
            why: '',
            how: ''
        },
        hints: []
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
    connection: [],
    setConnection: () => { },
    readyToPickSlot: false,
    setReadyToPickSlot: () => { },
    slotPicked: undefined,
    setSlotPicked: () => { },
    showReadyPrompt: false,
    setShowReadyPrompt: () => { },
    showFailurePrompt: false,
    setShowFailurePrompt: () => { },
    failurePromptMessage: '',
    setFailurePromptMessage: () => { },
    showPickSlotPrompt: false,
    setShowPickSlotPrompt: () => { },
    showFirstTimePickPrompt: false,
    setShowFirstTimePickPrompt: () => { },
    registerResetFn: function (fn: () => void): {} {
        throw new Error('Function not implemented.');
    },
    resetFn: function (): {} {
        throw new Error('Function not implemented.');
    },
    errorCnt: 0,
    setErrorCnt: () => { },
    showOpenningInstruction: false,
    setShowOpenningInstruction: () => { },
    openningInstruction: [],
    setOpenningInstruction: () => { },
    showInstructionPanel: false,
    setShowInstructionPanel: () => { },
    showPromptModal: false,
    setShowPromptModal: () => { },
    showInfo: false,
    setShowInfo: () => { },
    navTo: () => { },
    showModal: false,
    muted: false,
    setMuted: () => { },
    playBGM: false,
    setPlayBGM: () => { },
    tutorial: false,
    setTutorial: () => { },
    character: '',
    setCharacter: () => { },
    isAiHelperON: false,
    setIsAiHelperON: () => { },
});

export default GameContext;
