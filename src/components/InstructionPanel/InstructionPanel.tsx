import React, { useEffect, useRef, useState } from 'react';
import CodingArea from './CodingArea';
import InfoArea from './InfoArea';

const InstructionPanel: React.FC = () => {

    useEffect(() => {
        // validate if have permission to level

        // 
        return () => {

        };
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

    return (
        <aside
            className="flex flex-col bg-gray-900 text-white w-96 p-4 space-y-2 absolute right-0 top-1/2 z-10"
            ref={instructionPanelRef}
            style={{
                transform: `translateY(-${translateY}%)`,
            }}
            onWheel={handleWheel}>

            <InfoArea LevelName="Level 1" Description="You got a new command! SUBtracts the contents of a tile on the floor FROM whatever value you're currently holding." />


            <CodingArea />

        </aside>
    );
}

export default InstructionPanel;