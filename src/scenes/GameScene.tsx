import React, { useContext } from 'react';
import BottomPanel from '../components/BottomPanel';
import InputPanel from '../components/InputPanel';
import OutputPanel from '../components/OutputPanel';
import InstructionPanel from '../components/InstructionPanel/InstructionPanel';
import CommandPanel from '../components/InstructionPanel/CommandPanel';
import GameContext from '../context/GameContext';

const GameScene: React.FC = () => {
    const { currentScene } = useContext(GameContext);
    return currentScene === 'gameScene' && (
        <div >
            <CommandPanel />

            <InstructionPanel />
            <BottomPanel />
            <InputPanel />
            <OutputPanel />
        </div>
    )
}

export default GameScene;