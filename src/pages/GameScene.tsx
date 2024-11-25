import React, { useContext, useEffect } from 'react';
import InstructionPanel from '../components/InstructionPanel/InstructionPanel';
import GameContext from '../context/GameContext';
import PhaserGame from '../game/PhaserGame';
import Popup from '../components/Popup';
import PromptScene from './PromptScene';

const GameScene: React.FC = () => {
    const { currentScene, setSlotPicked, setReadyToPickSlot, readyToPickSlot } = useContext(GameContext);

    return currentScene === 'GAME' && (
        <div className={`fixed bg-cover bg-center bg-no-repeat h-[100vh] w-[100vw]`}
            onClick={(e) => {
                if (!readyToPickSlot) return;
                e.stopPropagation();
                console.log('clicked');
                setSlotPicked(undefined);
                setReadyToPickSlot(false);
            }}
            style={{ backgroundImage: `url('/game_bg.png')` }}>
            <PromptScene />
            <PhaserGame />
            <InstructionPanel />
            <Popup />
        </div>
    )
}

export default GameScene;