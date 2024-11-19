import React, { useContext } from 'react';
import InstructionPanel from '../components/InstructionPanel/InstructionPanel';
import GameContext from '../context/GameContext';
import PhaserGame from '../game/PhaserGame';
import Popup from '../components/Popup';

const GameScene: React.FC = () => {
    const { currentScene } = useContext(GameContext);

    return currentScene === 'GAME' && (
        <div className={`fixed bg-cover bg-center bg-no-repeat h-[100vh] w-[100vw]`}
            style={{ backgroundImage: `url('/game_bg.png')` }}>
            <InstructionPanel />
            <PhaserGame />
            <Popup />
        </div>
    )
}

export default GameScene;