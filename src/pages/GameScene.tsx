import React, { useContext } from 'react';
import InstructionPanel from '../components/InstructionPanel/InstructionPanel';
import GameContext from '../context/GameContext';
import PhaserGame from '../game/PhaserGame';
import CommandList from '../components/InstructionPanel/CommandList';
import Popup from '../components/Popup';

const GameScene: React.FC = () => {
    const { currentScene } = useContext(GameContext);

    return currentScene === 'GAME' && (
        <div className={`fixed bg-cover bg-center bg-no-repeat h-screen`}
            style={{ backgroundImage: `url('/game_bg.png')` }}>
            <InstructionPanel />
            <CommandList />
            <PhaserGame />
            <Popup />
        </div>
    )
}

export default GameScene;