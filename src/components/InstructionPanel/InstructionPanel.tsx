import React, { useContext, useEffect, useRef, useState } from 'react';
import GameContext from '../../context/GameContext';
import InfoArea from './InfoArea';
import CommandList from './CommandList';
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

        // console.log(event.deltaY)
        if (instructionPanelRef.current && instructionPanelRef.current.clientHeight > window.innerHeight * 3 / 5) {
            settranslateY(prevtranslateY => prevtranslateY + event.deltaY / 10);
        }
    };

    return levelInfo && (
        <aside
            className="flex flex-col bg-gray-900 text-white w-96 p-4 space-y-2 absolute right-0 top-1/2 z-10"
            ref={instructionPanelRef}
            style={{
                transform: `translateY(-${translateY}%)`,
            }}
            onWheel={handleWheel}>

            <InfoArea title={levelInfo.title} description={levelInfo.description} />

            <CommandList />

            <CodingArea />

        </aside>
    );
}

export default InstructionPanel;