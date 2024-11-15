import React, { useContext, useRef, useEffect, useState, forwardRef } from 'react';
import { CommandType, CommandWithArgType } from '../../types/game';
import GameContext from '../../context/GameContext';
import { cn } from "@/lib/utils";
import CommandRow from './CommandRow';
import EmptyRow from './EmptyRow';
import CircularJSON from 'circular-json';

const CodingArea = forwardRef<HTMLDivElement>((props, ref) => {
    const { commandsUsed, setCommandsUsed, setShowBottomPanel } = useContext(GameContext);
    const [isOver, setIsOver] = useState(false);
    const commandRefs = useRef<(HTMLElement | null)[]>([]);

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
        insert(obj, from, commandsUsed?.length ?? 0);
        // if (e.dataTransfer.getData('idx') !== '') {
        //     insert(obj, parseInt(e.dataTransfer.getData('idx')), commandsUsed?.length ?? 0);
        // } else {
        //     insert(obj, null, commandsUsed?.length ?? 0);
        // }

        setIsOver(false);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsOver(false);
    }

    // const handleDragOverJump = (arg: number, from: number, to: number) => {
    //     if (from === to) return;
    //     const newCommands = [...(commandsUsed ?? [])];

    //     // calculate the new index of the jump command
    //     let newPos;
    //     let toPos;
    //     console.log(arg, from, to)
    //     if (from < to) {
    //         toPos = to - 1;
    //     } else {
    //         toPos = to;
    //     }

    //     if (arg === toPos) {
    //         newPos = arg - 1;
    //     } else if ((arg > from && arg > toPos) || (arg < from && arg < toPos)) {
    //         newPos = arg;
    //     } else {
    //         if (from < arg) {
    //             newPos = arg - 1;
    //         } else {
    //             newPos = arg + 1;
    //         }
    //     }

    //     console.log(from - 1, newPos)
    //     console.log(arg - 1, toPos)
    //     console.log(newCommands)
    //     console.log(newCommands[arg - 1].arg)
    //     newCommands[arg - 1].arg = [toPos];
    //     newCommands[from - 1].arg = [newPos];
    //     console.log(newCommands[arg - 1].arg)
    //     console.log(newCommands)
    //     return newCommands;
    //     // setCommandsUsed(newCommands);
    // }

    const insert = (commandWithArg: CommandWithArgType, from: number | null = null, to: number) => {
        if (from === null) {
            if (commandWithArg.command === 'COPYFROM' || commandWithArg.command === 'COPYTO') {
                // await user selction
                // const newCommands = [...(commandsUsed ?? []), {
                //     command: commandWithArg.command as CommandType,
                //     arg: [0]
                // }];

            } else if (commandWithArg.command === 'JUMP' || commandWithArg.command === 'JUMPZ' || commandWithArg.command === 'JUMPN') {
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
                //     command: e.dataTransfer.getData('command') as CommandType,
                //     arg: []
                // }];
                newCommands.splice(to, 0, commandWithArg);
                setCommandsUsed(newCommands);
            }
        } else {
            let newCommands = [...(commandsUsed ?? [])];
            // if (commandWithArg.command === 'JUMP' || commandWithArg.command === 'JUMPZ'
            //     || commandWithArg.command === 'JUMPN' || commandWithArg.command === "") {
            //     newCommands = handleDragOverJump(commandWithArg.arg[0], from + 1, to + 1) || [];
            // }

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
        if (newCommands[idx].command === 'JUMP' || newCommands[idx].command === 'JUMPZ' || newCommands[idx].command === 'JUMPN') {
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
        <div className="p-4 w-full">
            <div
                className={cn(
                    " rounded-lg transition-colors duration-200 p-2 mx-8 border-2 border-transparent",
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
                    ))}
                    <EmptyRow commandsUsed={commandsUsed} onDrop={handleDrop} ref={ref} />
                </div>
            </div>
        </div>
    );
})

export default CodingArea;