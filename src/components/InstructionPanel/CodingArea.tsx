import React, { useContext, useRef, useEffect, useState, forwardRef, memo } from 'react';
import { CommandType, CommandWithArgType } from '../../types/game';
import GameContext from '../../context/GameContext';
import { cn } from "../../lib/utils";
import CommandRow from './CommandRow';
import EmptyRow from './EmptyRow';
import CircularJSON from 'circular-json';
import JumpConnector from './JumpConnector';
import VideoScreenAlert from '../alerts/VideoScreenAlert';
import ConceptButton from '../buttons/ConceptButton';

interface CodingAreaProps {
    setClearCommandsRef: (fn: () => void) => void;
    marginTop: number;
}

// Memoized component for concept content to prevent unnecessary re-renders
const ConceptContent = memo(({ levelInfo }: { levelInfo: { learningOutcome: { why: string; how: string } } | null }) => (
    <div className="flex flex-col gap-2 text-white text-lg ">
        {levelInfo && <p> <span className="font-bold">Why It Matters: </span>{levelInfo.learningOutcome.why}</p>}
        {levelInfo && <p> <span className="font-bold">How This level teaches it: </span>{levelInfo.learningOutcome.how}</p>}
    </div>
));

ConceptContent.displayName = 'ConceptContent';

const CodingArea = forwardRef<HTMLDivElement, CodingAreaProps>((props, ref) => {
    const { setClearCommandsRef, marginTop } = props;
    const { levelInfo, setReadyToPickSlot, slotPicked, commandsUsed, setShowFirstTimePickPrompt,
        setCommandsUsed, setShowBottomPanel, setConnection } = useContext(GameContext);
    const [isOver, setIsOver] = useState(false);
    const commandRefs = useRef<(HTMLElement | null)[]>([]);

    const commandRef = useRef<CommandWithArgType | null>(null);

    useEffect(() => {
        if (levelInfo.id) {
            setCommandsUsed([]);
        }
    }, [levelInfo.id, setCommandsUsed]);

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
    }, [commandsUsed, setConnection, levelInfo.id, setShowFirstTimePickPrompt]);

    useEffect(() => {
        if (!slotPicked || !commandRef.current) return;

        commandRef.current.arg = slotPicked;
        const copy = CircularJSON.parse(CircularJSON.stringify(commandsUsed));        
        setCommandsUsed(copy);
    }, [slotPicked, commandsUsed, setCommandsUsed])

    useEffect(() => {
        setClearCommandsRef(clearCommands);
    }, [setClearCommandsRef])

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
    }, [commandsUsed, setShowBottomPanel])

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        e.dataTransfer.dropEffect = 'move';
        setIsOver(true);
    };

    const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const commandData = e.dataTransfer.getData('command');
        const argData = e.dataTransfer.getData('arg');
        const idxData = e.dataTransfer.getData('idx');
        
        const obj: CommandWithArgType = {
            command: commandData as CommandType,
        }
        
        if (argData !== '') {
            obj.arg = CircularJSON.parse(argData);
        };

        let from = null;
        if (idxData !== '') {
            from = parseInt(idxData);
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
            const newCommands = [...(commandsUsed ?? [])];

            const command = newCommands.splice(from, 1);
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
            const ext = newCommands[idx].arg as CommandWithArgType;
            const pos = commandsUsed.indexOf(ext);
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
        <div className={`absolute px-4 w-[25rem] select-none z-[10] pb-[3rem] `} ref={ref} style={{ marginTop: `${marginTop}px` }}>
            <JumpConnector />

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
                <div className="space-y-2">
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
                    <EmptyRow commandsUsed={commandsUsed} onDrop={handleDrop} />
                </div>
            </div>
            <div className="text-center flex justify-center gap-2 items-center mt-10">
                <ConceptButton title="CS Concept" className="-translate-x-3/4">
                    <ConceptContent levelInfo={levelInfo} />
                </ConceptButton>
                <VideoScreenAlert 
                    title="Drag and Drop"
                    textHtml={`<video src="/videos/INPUT.mov" autoplay loop muted playsinline></video>`} 
                    actionText={'Help'}
                    icon={'help'}
                />
            </div>
        </div>
    );
})

CodingArea.displayName = 'CodingArea';

export default CodingArea;