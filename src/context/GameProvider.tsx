// src/context/GameProvider.tsx
import React, { useState, ReactNode } from 'react';
import GameContext from './GameContext';
import { CurrentSceneType, LevelInfo } from '../types/level';
import { CommandWithArgType } from '../types/game';

// Define props type for the GameProvider, which includes `children`
interface GameProviderProps {
  children: ReactNode;
}

const GameProvider: React.FC<GameProviderProps> = ({ children }): ReactNode => {
  const [level, setLevel] = useState<number>(1);
  const [currentScene, setCurrentScene] = useState<CurrentSceneType>('LANDING');
  const [instructions, setInstructions] = useState<string[]>([]);
  const [levelInfo, setLevelInfo] = useState<LevelInfo>({
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
  });
  const [showBottomPanel, setShowBottomPanel] = useState<boolean>(true);
  const [commandsUsed, setCommandsUsed] = useState<CommandWithArgType[]>([]);
  const [gameStatus, setGameStatus] = useState({
    commandCnt: 0,
    executeCnt: 0
  });
  const [showPopup, setShowPopup] = useState<boolean>(false);

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
      gameStatus,
      setGameStatus,
      showPopup,
      setShowPopup
    }}>
      {children}
    </GameContext.Provider>
  );
};

export default GameProvider;
