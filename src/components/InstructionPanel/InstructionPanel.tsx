import React, { useContext, useEffect, useRef, useState } from 'react';
import GameContext from '../../context/GameContext';
import InfoArea from './InfoArea';
import CodingArea from './CodingArea';
import CommandList from './CommandList';
import { Button } from '../ui/button';
import ButtonConnector from './ButtonConnector';

const InstructionPanel: React.FC = () => {
    const { levelInfo, setCommandsUsed } = useContext(GameContext);
    const CommandListRef = useRef<HTMLDivElement>(null);
    const CodingAreaRef = useRef<HTMLDivElement>(null);
    const clearCommandsRef = useRef<() => void>();

    useEffect(() => {
        setCommandsUsed(levelInfo.commandsUsed);
    }, []);

    useEffect(() => {
        // setCommandsUsed(levelInfo.commandsUsed);
        if (levelInfo.id === 1) {
            const startRef = CommandListRef;
            const endRef = CodingAreaRef;
            // const connector = new ButtonConnector(startRef, endRef);
            // connector.connect();
        }
    }, [levelInfo]);

    const setClearCommandsRef = (fn: () => void) => {
        clearCommandsRef.current = fn;
    }

    const instructionPanelRef = useRef<HTMLDivElement>(null);
    const [translateY, settranslateY] = useState(50);

    const handleWheel = (event: React.WheelEvent) => {
        // event.preventDefault();
        event.stopPropagation();

        if (instructionPanelRef.current && instructionPanelRef.current.clientHeight > window.innerHeight * 3 / 5) {
            settranslateY(prevtranslateY => prevtranslateY + event.deltaY / 10);
        }
    };

    return levelInfo && (
        <aside
            className="bg-cover bg-center bg-no-repeat flex flex-col items-center text-white w-[25rem] 
            h-[35rem] p-4 absolute right-0 top-1/2 z-10"
            ref={instructionPanelRef}
            style={{
                backgroundImage: `url('/command_bg.png')`,
                transform: `translateY(-${translateY}%)`,
            }}
            onWheel={handleWheel}>

            <InfoArea title={levelInfo.title} description={levelInfo.description} />

            <hr className='my-2 w-2/3 bg-slate-700 border-none h-[0.125rem] rounded-lg' />
            <CommandList ref={CommandListRef} />
            <CodingArea ref={CodingAreaRef} setClearCommandsRef={setClearCommandsRef} />

            <Button
                className=' bg-primary/10 hover:bg-primary/20 hover:text-red-600 '
                onClick={() => clearCommandsRef.current?.()}
            >
                X
                {/* <Trash className='w-6 h-6 hover:animate-wiggle' /> */}
            </Button>

        </aside>
    );
}

export default InstructionPanel;