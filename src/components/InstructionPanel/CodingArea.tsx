import React, { useContext, useRef, useEffect, useState } from 'react';
import { CommandType, CommandWithArgType } from '../../types/game';
import GameContext from '../../context/GameContext';
import { cn } from "@/lib/utils";
import CommandRow from './CommandRow';
import EmptyRow from './EmptyRow';
import FlowConnect from './FlowConnect';

const CodingArea: React.FC = () => {
    const { commandsUsed, setCommandsUsed, setShowBottomPanel } = useContext(GameContext);
    const [isOver, setIsOver] = useState(false);

    useEffect(() => {
        // window.addEventListener('beforeunload', (e) => {
        //     e.preventDefault();
        // })
    }, [])

    useEffect(() => {
        if (commandsUsed && commandsUsed.length === 0) {
            setShowBottomPanel(false);
        } else {
            setShowBottomPanel(true);
        }
    }, [commandsUsed])

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        setIsOver(true);
    };

    const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const command = e.dataTransfer.getData('command');

        if (e.dataTransfer.getData('idx') !== '') {
            insert({
                command: e.dataTransfer.getData('command') as CommandType,
                args: JSON.parse(e.dataTransfer.getData('args'))
            }, parseInt(e.dataTransfer.getData('idx')), commandsUsed?.length ?? 0);
        } else {
            if (command === 'COPYFROM' || command === 'COPYTO') {
                const newCommands = [...(commandsUsed ?? []), {
                    command: e.dataTransfer.getData('command') as CommandType,
                    args: [0]
                }];
                setCommandsUsed(newCommands);
            } else if (command === 'JUMP' || command === 'JUMPZ' || command === 'JUMPN') {
                const newCommands = [...(commandsUsed ?? []), {
                    command: e.dataTransfer.getData('command') as CommandType,
                    args: [0]
                }];
                setCommandsUsed(newCommands);
            } else {
                const newCommands = [...(commandsUsed ?? []), {
                    command: e.dataTransfer.getData('command') as CommandType,
                    args: []
                }];
                setCommandsUsed(newCommands);
            }
            insert({
                command: e.dataTransfer.getData('command') as CommandType,
                args: JSON.parse(e.dataTransfer.getData('args'))
            }, null, commandsUsed?.length ?? 0);

        }
        setIsOver(false);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsOver(false);
    }

    const insert = (command: CommandWithArgType, from: number | null = null, to: number) => {
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

    const deleteCommand = (idx: number) => {
        const newCommands = [...(commandsUsed ?? [])];
        newCommands.splice(idx, 1);
        setCommandsUsed(newCommands);
    }

    return (
        <div className="p-4 w-full">
            <div
                className={cn(
                    "min-h-40 rounded-lg transition-colors duration-200 p-2 mx-8 border-2 border-transparent",
                    isOver ? "bg-secondary/10 border-2 border-dashed border-primary/50" : "bg-secondary/40",
                    "hover:bg-secondary/20"
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
                            insert={insert}
                            onDelete={deleteCommand}
                        />
                    ))}
                    <EmptyRow commandsUsed={commandsUsed} />
                </div>
            </div>
        </div>
    );
}

export default CodingArea;