// src/context/GameProvider.tsx
import React, { useState, ReactNode, useCallback } from 'react';
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
    outputFunction: '',
    commands: [],
    commandsUsed: [],
    constructionSlots: [],
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
  const [exectuting, setExecuting] = useState<boolean>(false);
  const [connection, setConnection] = useState<Array<{ start: HTMLElement; end: HTMLElement }>>([]);
  const [readyToPickSlot, setReadyToPickSlot] = useState<boolean>(false);
  const [slotPicked, setSlotPicked] = useState<number | undefined>(undefined);
  const [showReadyPrompt, setShowReadyPrompt] = useState<boolean>(false);
  const [showFailurePrompt, setShowFailurePrompt] = useState<boolean>(false);
  const [failurePromptMessage, setFailurePromptMessage] = useState<string>('');
  const [showPickSlotPrompt, setShowPickSlotPrompt] = useState<boolean>(false);
  const [showFirstTimePickPrompt, setShowFirstTimePickPrompt] = useState<boolean>(false);

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
      setShowPopup,
      exectuting,
      setExecuting,
      connection,
      setConnection,
      readyToPickSlot,
      setReadyToPickSlot,
      slotPicked,
      setSlotPicked,
      showReadyPrompt,
      setShowReadyPrompt,
      showFailurePrompt,
      setShowFailurePrompt,
      failurePromptMessage,
      setFailurePromptMessage,
      showPickSlotPrompt,
      setShowPickSlotPrompt,
      showFirstTimePickPrompt,
      setShowFirstTimePickPrompt
    }}>
      {children}
    </GameContext.Provider>
  );
};

export default GameProvider;
