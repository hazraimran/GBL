import React, { useContext, useEffect, useRef, useState } from 'react';
import GameContext from '../../context/GameContext';
import InfoArea from './InfoArea';
import CodingArea from './CodingArea';

const InstructionPanel: React.FC = () => {
    const { levelInfo } = useContext(GameContext);

    useEffect(() => {
        // setLevelInfo(getLevelInfo(level));
    }, []);

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
            className="bg-cover bg-center bg-no-repeat flex flex-col text-white w-[25rem] 
            h-[35rem] p-4 space-y-2 absolute right-0 top-1/2 z-10"
            ref={instructionPanelRef}
            style={{
                backgroundImage: `url('/command_bg.png')`,
                transform: `translateY(-${translateY}%)`,
            }}
            onWheel={handleWheel}>

            <InfoArea title={levelInfo.title} description={levelInfo.description} />

            <hr className='m-auto w-2/3 bg-black border-none h-[0.125rem] rounded-lg' />

            <CodingArea />

        </aside>
    );
}

export default InstructionPanel;