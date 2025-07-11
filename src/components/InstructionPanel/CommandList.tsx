import React, { forwardRef, useContext } from 'react';
import Command from './Command';
import GameContext from '../../context/GameContext';
const CommandList = forwardRef<HTMLDivElement>((props, ref) => {
    const { levelInfo } = useContext(GameContext);

    return (
        <>
            <h4 className='text-black select-none text-xl'>Available Commands</h4>
            
            <div draggable={false}
                className="w-2/3 flex flex-row flex-wrap items-center justify-center gap-2 overflow-visible relative ">
                {levelInfo?.commands.map((command, index) => (
                    index === levelInfo.commands.length - 1 ?
                        <Command
                            key={index}
                            ref={ref}
                            value={{ command: command }}
                            shaking={levelInfo.id === 1}
                        />
                        :
                        <Command
                            key={index}
                            value={{ command: command }}
                            shaking={levelInfo.id === 1}
                        />

                ))}

            </div>
            
            {
                levelInfo?.id === 1 && (
                    <div></div>
                )
            }

        </>
    );
});

CommandList.displayName = 'CommandList';

export default CommandList;
