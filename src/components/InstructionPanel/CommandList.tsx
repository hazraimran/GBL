import React, { useContext } from 'react';
import Command from './Command';
import GameContext from '../../context/GameContext';

const CommandList: React.FC = () => {
    const { levelInfo } = useContext(GameContext);

    return (
        <div className="absolute -translate-x-36 w-36 flex flex-col items-start justify-center gap-4 bg-sky-50">
            {levelInfo?.commands.map((command, index) => (
                <Command key={index} value={command} />
            ))}
        </div>
    );
};

export default CommandList;
