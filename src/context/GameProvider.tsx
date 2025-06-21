// src/context/GameProvider.tsx
import React, { useState, ReactNode, useRef, useCallback } from 'react';
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
  });
  const [showBottomPanel, setShowBottomPanel] = useState<boolean>(true);
  const [commandsUsed, setCommandsUsed] = useState<CommandWithArgType[]>([{ command: 'INPUT' }]);
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
  const [errorCnt, setErrorCnt] = useState<number>(0);
  const [showOpenningInstruction, setShowOpenningInstruction] = useState<boolean>(false);
  const [openningInstruction, setOpenningInstruction] = useState<string[]>([]);
  const [showInstructionPanel, setShowInstructionPanel] = useState<boolean>(false);
  const [showPromptModal, setShowPromptModal] = useState<boolean>(false);
  const [showInfo, setShowInfo] = useState<boolean>(false);
  const resetFnRef = useRef(() => { });
  const [showModal, setShowModal] = useState<boolean>(false);
  const [muted, setMuted] = useState<boolean>(false);
  const [playBGM, setPlayBGM] = useState<boolean>(false);
  const [tutorial, setTutorial] = useState<boolean>(false);
  const [character, setCharacter] = useState<string>('');
  const [isAiHelperON, setIsAiHelperON] = useState<boolean>(false);

  const registerReset = useCallback((fn: () => void) => {
    resetFnRef.current = fn;
  }, []);

  const reset = useCallback(() => {
    resetFnRef.current();
  }, []);

  const navTo = (scene: CurrentSceneType) => {
    setShowModal(true);
    setTimeout(() => {
      setCurrentScene(scene);
    }, 500);

    setTimeout(() => {
      setShowModal(false);
    }, 1000);
  }

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
      setShowFirstTimePickPrompt,
      registerResetFn: registerReset,
      resetFn: reset,
      errorCnt,
      setErrorCnt,
      showOpenningInstruction,
      setShowOpenningInstruction,
      openningInstruction,
      setOpenningInstruction,
      showInstructionPanel,
      setShowInstructionPanel,
      showPromptModal,
      setShowPromptModal,
      showInfo,
      setShowInfo,
      navTo,
      showModal,
      muted,
      setMuted,
      playBGM,
      setPlayBGM,
      tutorial,
      setTutorial,
      character,
      setCharacter,
      isAiHelperON,
      setIsAiHelperON
    }}>
      {children}
    </GameContext.Provider>
  );
};

export default GameProvider;
