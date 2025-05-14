import React, { forwardRef, useContext } from 'react';
import Command from './Command';
import GameContext from '../../context/GameContext';
import FloatingMessage from '../FloatingMessage';
const CommandList = forwardRef<HTMLDivElement>((props, ref) => {
    const { levelInfo, tutorial } = useContext(GameContext);

    return (
        <>
            <h4 className='text-black select-none text-xl'>Available Commands</h4>
            
            <div
                className="w-2/3 flex flex-row flex-wrap items-center justify-center gap-2 overflow-visible relative">
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

                {tutorial && <FloatingMessage
                    backgroundColor='#7FA147'
                    text='Drag and drop commands to build your program'
                    className='fixed  bottom-1/3 left-1/2 -translate-x-[20rem] z-[1000] rotate-[-5deg]'
                    arrowDirection='right'
                    open={false}
                    />}
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
