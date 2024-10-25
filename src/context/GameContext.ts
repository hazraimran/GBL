// src/context/GameContext.ts
import { createContext } from 'react';
import { currentSceneType } from '../types';

interface GameContextType {
    level: number;
    setLevel: (level: number) => void;
    currentScene: currentSceneType;
    setCurrentScene: (scene: currentSceneType) => void;
    instructions: string[];
    setInstructions: (instructions: string[]) => void;
}

// Create the context with a default value (optional)
const GameContext = createContext<GameContextType>({
    level: 0,
    setLevel: () => {},
    currentScene: 'menu',
    setCurrentScene: () => {},
    instructions: [],
    setInstructions: () => {}
});

export default GameContext;
