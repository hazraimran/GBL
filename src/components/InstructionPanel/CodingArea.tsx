import React, { useState } from 'react';
import { CommandType } from '../../types/game';
import Command from './Command';

interface CodingAreaProps {
    // commandsUsed: CommandType[];
}

interface CommandRowProps {
    command: CommandType;
    idx: number;
    handleDrag: (command: CommandType, from: number | null, to: number) => void;
}

const CommandRow: React.FC<CommandRowProps> = ({
    command,
    idx,
    handleDrag
}) => {
    const [isOver, setIsOver] = useState(false);

    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsOver(true);
    }

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsOver(false);
    }

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    }

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer.getData('idx') !== '') {
            handleDrag(e.dataTransfer.getData('command') as CommandType, parseInt(e.dataTransfer.getData('idx')), idx);
        } else {
            handleDrag(e.dataTransfer.getData('command') as CommandType, null, idx);
        }
        setIsOver(false);
    }

    return (
        <div className={`flex space-x-2 ${isOver ? 'bg-gray-300' : 'bg-gray-200'}`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
        >
            {idx}
            <Command idx={idx} value={command} />
        </div>
    )
}

const CodingArea: React.FC<CodingAreaProps> = ({
}) => {
    const [commandsUsed, setCommandsused] = useState<Array<CommandType>>();
    const [isOver, setIsOver] = useState(false);

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        setIsOver(true);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        console.log("outer drop")
        setCommandsused([...(commandsUsed || []), e.dataTransfer.getData('command') as CommandType]);
        setIsOver(false);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsOver(false);
    }

    const handleDrag = (command: CommandType, from: number | null = null, to: number) => {
        const newCommands = [...(commandsUsed ?? [])];
        console.log(newCommands, from === null);
        if (from === null) {
            newCommands.splice(to, 0, command);
        } else {
            newCommands.splice(from, 1);
            if (from < to) {
                to--;
            }
            newCommands.splice(to, 0, command);
        }
        console.log(newCommands);

        setCommandsused(newCommands);
    }

    return (
        <>
            <div className={`min-h-40 ${isOver ? 'bg-gray-300' : 'bg-gray-200'}`}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onDragEnter={(e) => e.preventDefault()}
                onDragLeave={handleDragLeave}
            >
                {
                    commandsUsed &&
                    commandsUsed.map((command, idx) => {
                        return <CommandRow command={command} idx={idx} handleDrag={handleDrag} />
                    })
                }
            </div>

        </>
    )
}

export default CodingArea;