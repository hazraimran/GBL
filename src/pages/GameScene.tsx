import React, { useContext, useEffect } from 'react';
import InstructionPanel from '../components/InstructionPanel/InstructionPanel';
import GameContext from '../context/GameContext';
import PhaserGame from '../game/PhaserGame';
import { getLevelInfo } from '../utils/storage';

const GameScene: React.FC = () => {
    const { currentScene, level, setLevelInfo } = useContext(GameContext);
    
    useEffect(() => {
        // load level info and set it to context
        setLevelInfo(getLevelInfo(level));
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