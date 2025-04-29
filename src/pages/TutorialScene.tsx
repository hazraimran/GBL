import React, { useContext, useEffect } from 'react';
import InstructionPanel from '../components/InstructionPanel/InstructionPanel';
import GameContext from '../context/GameContext';
import PhaserGame from '../game/PhaserGame';
import Popup from '../components/Popup';
import PromptScene from './PromptScene';
import gameTimer from '../utils/Timer';

const GameScene: React.FC = () => {
    const { currentScene, setSlotPicked, setReadyToPickSlot, readyToPickSlot, levelInfo } = useContext(GameContext);

    const handleVisibilityChange = () => {
        if (document.hidden) {
            gameTimer.pauseAndSave();
        } else {
            gameTimer.resume();
        }
    }

    const handleBeforeUnload = () => {
        gameTimer.pauseAndSave();
    }

    useEffect(() => {
        if (currentScene === 'GAME') {
            gameTimer.setLevel(levelInfo.id);
            gameTimer.start();

            document.addEventListener('visibilitychange', handleVisibilityChange);
            window.addEventListener('beforeunload', handleBeforeUnload);
        } else {
            gameTimer.pauseAndSave();
        }

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [currentScene]);

    return currentScene === 'GAME' && (
        <div className={`fixed bg-cover bg-center bg-no-repeat h-[100vh] w-[100vw]`}
            onClick={(e) => {
                if (!readyToPickSlot) return;
                e.stopPropagation();
                setSlotPicked(undefined);
                setReadyToPickSlot(false);
            }}
            style={{ backgroundImage: `url('/game_bg.webp')` }}>
            <img src="./slots.webp" alt="" className='absolute' />

            <h1 className="text-white">AlexAsdlkklsdjlkasdlkslkdkl</h1>
            <PhaserGame />
            <InstructionPanel />
            <Popup />
            <PromptScene />
        </div>
    )
}

export default GameScene;