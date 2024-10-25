import React from 'react';
import CodingArea from './CodingArea';
import InfoArea from './InfoArea';

const InstructionPanel: React.FC = () => {
    return (
        <aside className="flex flex-col bg-gray-900 text-white w-96 p-4 space-y-2 absolute right-0">
            <InfoArea LevelName="Level 1" Description="You got a new command! SUBtracts the contents of a tile on the floor FROM whatever value you're currently holding." />


            <CodingArea />

            {/* Footer buttons */}
            <div className="flex justify-between space-x-2">
                <button className="bg-gray-700 p-2 rounded">undo</button>
                <button className="bg-gray-700 p-2 rounded">clear</button>
            </div>
        </aside>
    );
}

export default InstructionPanel;