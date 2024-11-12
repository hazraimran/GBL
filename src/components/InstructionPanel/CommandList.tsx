import React, { useContext } from 'react';
import Command from './Command';
import GameContext from '../../context/GameContext';

const CommandList: React.FC = () => {
    const { levelInfo } = useContext(GameContext);

    return (
        <div className="fixed z-[9] right-0 top-20 -translate-x-[20rem] w-36 flex flex-col items-start justify-center gap-4 ">
            {levelInfo?.commands.map((command, index) => (
                <Command key={index} value={{ command: command, args: [] }} />
            ))}
        </div>
    );
};

export default CommandList;
