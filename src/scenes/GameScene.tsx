import React, { useContext } from 'react';
import BottomPanel from '../components/BottomPanel';
import InstructionPanel from '../components/InstructionPanel/InstructionPanel';
import GameContext from '../context/GameContext';
import PhaserGame from '../game/PhaserGame';

const GameScene: React.FC = () => {
    const { currentScene } = useContext(GameContext);
    return currentScene === 'gameScene' && (
        <div className={`bg-cover bg-center bg-no-repeat h-screen`}
            style={{ backgroundImage: `url('/game_bg.png')` }}>

            <InstructionPanel />
            <BottomPanel />
            <PhaserGame />

        </div>
    )
}

export default GameScene;