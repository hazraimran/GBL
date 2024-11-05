import React, { useContext, useEffect } from 'react';
import InstructionPanel from '../components/InstructionPanel/InstructionPanel';
import GameContext from '../context/GameContext';
import PhaserGame from '../game/PhaserGame';

const GameScene: React.FC = () => {
    const { currentScene, currentLevel } = useContext(GameContext);
    
    useEffect(() => {
        
    }, []);

    return currentScene === 'GAME' && (
        <div className={`bg-cover bg-center bg-no-repeat h-screen`}
            style={{ backgroundImage: `url('/game_bg.png')` }}>
            <InstructionPanel />
            <PhaserGame />
        </div>
    )
}

export default GameScene;