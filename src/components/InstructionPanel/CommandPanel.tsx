// import React from 'react';

type CommandPanelProps = {
    // Define props for CommandPanel
    commands: string[];
}

const CommandPanel: React.FC = () => {

    return (
        <div className="flex space-x-4 right-[25rem] absolute top-1/3 -translate-y-1/2 ">
            <div className="flex flex-col space-y-2">
                <button className="bg-green-500 text-black p-2 rounded">inbox</button>
                <button className="bg-green-500 text-black p-2 rounded">outbox</button>
                <button className="bg-red-500 p-2 rounded">copyfrom</button>
                <button className="bg-red-500 p-2 rounded">copyto</button>
                <button className="bg-yellow-500 p-2 rounded">add</button>
                <button className="bg-yellow-500 p-2 rounded">sub</button>
                <button className="bg-blue-500 p-2 rounded">jump</button>
                <button className="bg-blue-500 p-2 rounded">jump if zero</button>
            </div>
        </div>
    )
}

export default CommandPanel;