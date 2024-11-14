import React, { useState, useRef, useContext } from 'react';
import { GoMute, GoUnmute } from "react-icons/go";
import { RxReset } from "react-icons/rx"; // go back icon
import { Play, MoveRight, Square } from 'lucide-react';
import GameContext from '../context/GameContext';
import { saveCommandsUsed } from '../utils/storage';

interface BottomPanelProps {
    onExecute: () => void;
    onExecuteOneStep: () => void;
    onReset: () => void;
    onDrag: (progress: number) => void;
}

const BottomPanel: React.FC<BottomPanelProps> = ({
    onExecute,
    onExecuteOneStep,
    onReset,
    onDrag
}) => {
    const [isMuted, setIsMuted] = useState(false);
    const [progress, setProgress] = useState(0);
    const progressRef = useRef<HTMLDivElement>(null);
    const { showBottomPanel, setCurrentScene, levelInfo, commandsUsed } = useContext(GameContext);

    const handleDrag = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const bar = progressRef.current;
        if (bar) {
            const barRect = bar.getBoundingClientRect();
            const newProgress = Math.min(
                Math.max(0, e.clientX - barRect.left),
                barRect.width
            );
            setProgress((newProgress / barRect.width) * 100);
            onDrag(newProgress / barRect.width);
        }
    };

    return showBottomPanel && <footer className="flex items-end absolute bottom-0 w-full">
        {/* Return Button */}
        <button className="w-[10vw] h-[6vw] bg-custom-bg rounded-lg flex items-center justify-center" 
        onClick={() => {
            setCurrentScene('LEVELS');
            saveCommandsUsed(levelInfo!.id, commandsUsed);
        }}>
            <RxReset className="w-[5vw] h-[5vw] text-custom-bg-text" />
        </button>

        {/* Mute Button */}
        {/* <button className="w-[6vw] h-[6vw] bg-custom-bg rounded-lg flex items-center justify-center ml-8"
            onClick={() => setIsMuted(!isMuted)}>
            {isMuted ? <GoMute className="w-[6vw] h-[6vw] text-custom-bg-text" /> : <GoUnmute className="w-[6vw] h-[6vw] text-custom-bg-text" />}
        </button> */}

        <div className=" flex items-center space-x-4 p-4 bg-custom-bg rounded-lg translate-x-1/2 ">
            {/* Stop Button */}
            <button
                className="w-[6vw] h-[6vw] bg-custom-red rounded-lg flex items-center justify-center"
                onClick={onReset}
            >
                <Square
                    className="w-[3vw] h-[3vw] opacity-50"
                    strokeWidth={2}
                    fill="black"
                    color="black"
                />
            </button>

            {/* Play Button */}
            <button
                className="w-[6vw] h-[6vw] bg-custom-green rounded-lg flex items-center justify-center"
                onClick={onExecute}
            >
                <Play
                    className="w-10 h-10 opacity-50"
                    strokeWidth={2}
                    color="black"
                />
            </button>

            {/* Next Step Button */}
            <button
                className="w-[6vw] h-[6vw] bg-custom-green rounded-lg flex items-center justify-center"
                onClick={onExecuteOneStep}
            >
                <MoveRight
                    className="w-10 h-10"
                    strokeWidth={2}
                    color="#064e3b" // text-green-900 equivalent
                />
            </button>

            {/* Draggable Progress Bar */}
            <div className="relative w-[10vw] h-10 bg-gray-700 rounded-lg" ref={progressRef} onMouseDown={handleDrag}>
                <div
                    className="absolute top-0 left-0 h-10 bg-green-500 rounded-lg"
                    style={{ width: `${progress}%` }}
                ></div>
            </div>
        </div>
    </footer>
};

export default BottomPanel;
