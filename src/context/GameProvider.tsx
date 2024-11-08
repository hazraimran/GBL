// src/context/GameProvider.tsx
import React, { useState, ReactNode } from 'react';
import GameContext from './GameContext';
import { CurrentSceneType, LevelInfo } from '../types/level';
import { CommandType } from '../types/game';

// Define props type for the GameProvider, which includes `children`
interface GameProviderProps {
  children: ReactNode;
}

const GameProvider: React.FC<GameProviderProps> = ({ children }): ReactNode => {
  const [level, setLevel] = useState<number>(1);
  const [currentScene, setCurrentScene] = useState<CurrentSceneType>('LANDING');
  const [instructions, setInstructions] = useState<string[]>([]);
  const [levelInfo, setLevelInfo] = useState<LevelInfo | null>(null);
  const [showBottomPanel, setShowBottomPanel] = useState<boolean>(true);
  const [commandsUsed, setCommandsUsed] = useState<CommandType[]>([]);

  return (
    <GameContext.Provider value={{
      level,
      setLevel,
      currentScene,
      setCurrentScene,
      instructions,
      setInstructions,
      levelInfo,
      setLevelInfo,
      showBottomPanel,
      setShowBottomPanel,
      commandsUsed,
      setCommandsUsed,
    }}>
      {children}
    </GameContext.Provider>
  );
};

export default GameProvider;
