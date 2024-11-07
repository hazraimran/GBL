// src/context/GameContext.ts
import { createContext } from 'react';
import { LevelInfo, CurrentSceneType } from '../types/level';
import { CommandType } from '../types/game';

interface GameContextType {
    level: number;
    setLevel: (level: number) => void;
    currentScene: CurrentSceneType;
    setCurrentScene: (scene: CurrentSceneType) => void;
    instructions: string[];
    setInstructions: (instructions: string[]) => void;
    showBottomPanel: boolean;
    setShowBottomPanel: (show: boolean) => void;
    levelInfo: LevelInfo | null;
    setLevelInfo: (levelInfo: LevelInfo) => void;
    commandsUsed: CommandType[];
    setCommandsUsed: (commands: CommandType[]) => void;
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
    levelInfo: null,
    setLevelInfo: () => { },
    commandsUsed: [],
    setCommandsUsed: () => { },
});

export default GameContext;
