// src/context/GameProvider.tsx
import React, { useState, ReactNode } from 'react';
import GameContext from './GameContext';
import { currentSceneType } from '../types';

// Define props type for the GameProvider, which includes `children`
interface GameProviderProps {
  children: ReactNode;
}

const GameProvider: React.FC<GameProviderProps> = ({ children }): ReactNode => {
  const [level, setLevel] = useState<number>(1);
  const [currentScene, setCurrentScene] = useState<currentSceneType>('menu');
  const [instructions, setInstructions] = useState<string[]>([]);

  return (
    <GameContext.Provider value={{
      level,
      setLevel,
      currentScene,
      setCurrentScene,
      instructions,
      setInstructions
    }}>
    { children }
    </GameContext.Provider>
  );
};

export default GameProvider;
