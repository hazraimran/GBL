import React, { useContext } from 'react';
import Command from './Command';
import GameContext from '../../context/GameContext';

const CommandList: React.FC = () => {
    const { levelInfo } = useContext(GameContext);

    return (
        <>
            <h4 className='text-black'>Available Commands</h4>
            <div className="w-2/3 flex flex-row items-center justify-center gap-2 overflow-visible">
                {levelInfo?.commands.map((command, index) => (
                    <Command key={index} value={{ command: command, args: [] }} shaking={levelInfo.id === 1} />
                ))}
            </div>
            {
                levelInfo?.id === 1 && (
                    <div></div>
                )
            }
        </>
    );
};

export default CommandList;
