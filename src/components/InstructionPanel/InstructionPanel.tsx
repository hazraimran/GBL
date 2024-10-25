import React from 'react';
import CodingArea from './CodingArea';
import InfoArea from './InfoArea';
import CommandPanel from './CommandPanel';

const InstructionPanel: React.FC = () => {
    return (
        <>
            <CommandPanel />
            <aside className="flex flex-col bg-gray-900 text-white w-96 p-4 space-y-2 absolute right-0 top-0 translate-y-1/2">
                <InfoArea LevelName="Level 1" Description="You got a new command! SUBtracts the contents of a tile on the floor FROM whatever value you're currently holding." />


                <CodingArea />

                <div className="flex justify-between space-x-2">
                    <button className="bg-gray-700 p-2 rounded">undo</button>
                    <button className="bg-gray-700 p-2 rounded">clear</button>
                </div>
            </aside>
        </>
    );
}

export default InstructionPanel;