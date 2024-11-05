// src/context/GameContext.ts
import { createContext } from 'react';
import { CurrentSceneType } from '../types/level';

interface GameContextType {
    level: number;
    setLevel: (level: number) => void;
    currentScene: CurrentSceneType;
    setCurrentScene: (scene: CurrentSceneType) => void;
    instructions: string[];
    setInstructions: (instructions: string[]) => void;
}

// Create the context with a default value (optional)
const GameContext = createContext<GameContextType>({
    level: 0,
    setLevel: () => { },
    currentScene: 'LANDING',
    setCurrentScene: () => { },
    instructions: [],
    setInstructions: () => { },
});

export default GameContext;
