import React, { useContext, useRef, useEffect, useState, forwardRef } from 'react';
import { CommandType, CommandWithArgType } from '../../types/game';
import GameContext from '../../context/GameContext';
import { cn } from "@/lib/utils";
import CommandRow from './CommandRow';
import EmptyRow from './EmptyRow';
import CircularJSON from 'circular-json';
import JumpConnector from './JumpConnector';

interface CodingAreaProps {
    setClearCommandsRef: (fn: () => void) => void;
}

const CodingArea = forwardRef<HTMLDivElement, CodingAreaProps>((props, ref) => {
    const { setClearCommandsRef } = props;
    const { levelInfo, setReadyToPickSlot, slotPicked, commandsUsed, setShowFirstTimePickPrompt,
        setCommandsUsed, setShowBottomPanel, connection, setConnection } = useContext(GameContext);
    const [waitingForResult, setWaitingForResult] = useState(false);
    const [isOver, setIsOver] = useState(false);
    const commandRefs = useRef<(HTMLElement | null)[]>([]);

    const commandRef = useRef<CommandWithArgType | null>(null);

    useEffect(() => {
        const jumpConnections: Array<{ start: HTMLElement; end: HTMLElement }> = [];

        commandsUsed?.forEach((command, idx) => {
            if (command.command === 'JUMP' || command.command === 'JUMP = 0' || command.command === 'JUMP < 0') {
                const jumpElement = commandRefs.current[idx];
                const extElement = commandRefs.current[commandsUsed.indexOf(command.arg as CommandWithArgType)];
                if (jumpElement && extElement) {
                    jumpConnections.push({
                        start: jumpElement,
                        end: extElement
                    });
                }
            }
        });
        
        setConnection(jumpConnections);
        if (commandsUsed.length !== 0 && levelInfo.id === 1) {
            setShowFirstTimePickPrompt(false);
        }
        if (commandsUsed.length === 0 && levelInfo.id === 1) {
            setShowFirstTimePickPrompt(true);
        }
    }, [commandsUsed]);

    useEffect(() => {
        if (!slotPicked || !commandRef.current) return;
        let idx = commandsUsed.indexOf(commandRef.current);

        commandRef.current.arg = slotPicked;
        const copy = JSON.parse(JSON.stringify(commandsUsed));
        setCommandsUsed(copy);
        // commandRef.current = null;
    }, [slotPicked])

    useEffect(() => {
        setClearCommandsRef(clearCommands);
    }, [])

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
        let obj: CommandWithArgType = {
            command: e.dataTransfer.getData('command') as CommandType,
        }

        if (e.dataTransfer.getData('arg') !== '') {
            obj.arg = CircularJSON.parse(e.dataTransfer.getData('arg'));
        };

        let from = null;
        if (e.dataTransfer.getData('idx') !== '') {
            from = parseInt(e.dataTransfer.getData('idx'));
        }
        await insert(obj, from, commandsUsed?.length ?? 0);

        setIsOver(false);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsOver(false);
    }

    const clearCommands = () => {
        setCommandsUsed([]);
    }

    const insert = async (commandWithArg: CommandWithArgType, from: number | null = null, to: number) => {
        if (from === null) {
            if (commandWithArg.command === 'COPYFROM' || commandWithArg.command === 'COPYTO'
                || commandWithArg.command === 'ADD' || commandWithArg.command === 'SUB') {

                setReadyToPickSlot(true);
                setWaitingForResult(true);

                const newCommands = [...(commandsUsed ?? [])];
                const newCommand: CommandWithArgType = {
                    command: commandWithArg.command,
                    arg: 0,
                }
                commandRef.current = newCommand;
                newCommands.splice(to, 0, newCommand);
                setCommandsUsed(newCommands);
            } else if (commandWithArg.command === 'JUMP' || commandWithArg.command === 'JUMP = 0' || commandWithArg.command === 'JUMP < 0') {
                const newCommands = [...(commandsUsed ?? [])];

                const jump: CommandWithArgType = {
                    command: commandWithArg.command,
                }
                const ext: CommandWithArgType = {
                    command: "" as CommandType,
                }

                jump.arg = ext;
                ext.arg = jump;

                newCommands.splice(to, 0, jump);
                newCommands.splice(to, 0, ext);
                setCommandsUsed(newCommands);
            } else {
                const newCommands = [...(commandsUsed ?? [])];

                newCommands.splice(to, 0, commandWithArg);
                setCommandsUsed(newCommands);
            }
        } else {
            let newCommands = [...(commandsUsed ?? [])];

            let command = newCommands.splice(from, 1);
            if (from < to) {
                to--;
            }

            newCommands.splice(to, 0, command[0]);
            setCommandsUsed(newCommands);
        }
    }

    const deleteCommand = (idx: number) => {
        const newCommands = [...(commandsUsed ?? [])];
        if (newCommands[idx].command === 'JUMP' || newCommands[idx].command === 'JUMP = 0' || newCommands[idx].command === 'JUMP < 0') {
            let ext = newCommands[idx].arg as CommandWithArgType;
            let pos = commandsUsed.indexOf(ext);
            if (pos > idx) {
                newCommands.splice(idx, 1);
                newCommands.splice(pos - 1, 1);
            } else {
                newCommands.splice(pos, 1);
                newCommands.splice(idx - 1, 1);
            }
            setCommandsUsed(newCommands);
        } else {
            commandRefs.current.splice(idx, 1);
            newCommands.splice(idx, 1);
            setCommandsUsed(newCommands);
        }
    }

    return (
        <div className="px-4 w-full select-none">
            <JumpConnector connection={connection} />

            <div
                className={cn(
                    "mt-2 rounded-lg transition-colors duration-200 p-2 mx-8 border-2 border-transparent",
                    isOver ? "bg-secondary/10 border-2 border-dashed border-primary/50" : "bg-secondary/40",
                    "hover:bg-secondary/20"
                )}
                onDragOver={handleDragOver}
                onDragEnter={(e) => e.preventDefault()}
                onDragLeave={handleDragLeave}
            >
                <div className="space-y-2" ref={ref}>
                    {commandsUsed?.map((command, idx) => (
                        <CommandRow
                            key={idx}
                            command={command}
                            ref={element => {
                                if (commandRefs.current) {
                                    commandRefs.current[idx] = element;
                                }
                            }}
                            idx={idx}
                            insert={insert}
                            onDelete={deleteCommand}
                        />
                    )
                    )}
                    <EmptyRow commandsUsed={commandsUsed} onDrop={handleDrop} ref={ref} />
                </div>
            </div>
        </div>
    );
})

export default CodingArea;