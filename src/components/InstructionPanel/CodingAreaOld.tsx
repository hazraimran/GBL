import React, { useContext, useEffect, useState } from 'react';
import { CommandType } from '../../types/game';
import Command from './Command';
import GameContext from '../../context/GameContext';
interface CodingAreaProps { }

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
        <div
            className={cn(
                "flex items-center space-x-3 p-2 rounded-lg transition-all duration-200",
                isOver ? "bg-secondary/80 border-t-2 border-primary" : "bg-secondary/40",
                "hover:bg-secondary/60"
            )}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
        >
            <span className="min-w-8 h-8 flex items-center justify-center rounded-full bg-primary/10 text-primary font-medium">
                {idx + 1}
            </span>
            <Command idx={idx} value={command} />
        </div>
    )
}

const CodingArea: React.FC<CodingAreaProps> = () => {
    const { commandsUsed, setCommandsUsed } = useContext(GameContext);
    const [isOver, setIsOver] = useState(false);

    useEffect(() => {
        // window.addEventListener('beforeunload', (e) => {
        //     e.preventDefault();
        // })
    }, [])

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        setIsOver(true);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setCommandsUsed([...(commandsUsed || []), e.dataTransfer.getData('command') as CommandType]);
        setIsOver(false);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsOver(false);
    }

    const handleDrag = (command: CommandType, from: number | null = null, to: number) => {
        const newCommands = [...(commandsUsed ?? [])];
        if (from === null) {
            newCommands.splice(to, 0, command);
        } else {
            newCommands.splice(from, 1);
            if (from < to) {
                to--;
            }
            newCommands.splice(to, 0, command);
        }
        setCommandsUsed(newCommands);
    }

    return (
        <div className="p-4 w-full">
            <div
                className={cn(
                    "min-h-40 rounded-lg transition-colors duration-200 p-2",
                    isOver ? "bg-secondary/80 border-2 border-dashed border-primary/50" : "bg-secondary/40",
                    "hover:bg-secondary/60"
                )}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onDragEnter={(e) => e.preventDefault()}
                onDragLeave={handleDragLeave}
            >
                <div className="space-y-2">
                    {commandsUsed?.map((command, idx) => (
                        <CommandRow
                            key={idx}
                            command={command}
                            idx={idx}
                            handleDrag={handleDrag}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default CodingArea;