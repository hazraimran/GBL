import React, { useState, useRef, useContext } from 'react';
import { GoMute, GoUnmute } from "react-icons/go";
import { RxReset } from "react-icons/rx";
import { Play, MoveRight, Square, Gauge, Lock } from 'lucide-react';
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
    const [progress, setProgress] = useState(50);
    const progressRef = useRef<HTMLDivElement>(null);
    const { showBottomPanel, setCurrentScene, levelInfo, commandsUsed, exectuting } = useContext(GameContext);

    const handleDrag = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (exectuting) return; // 执行时禁止拖动

        const bar = progressRef.current;
        if (bar) {
            const barRect = bar.getBoundingClientRect();
            const barWidth = barRect.width;
            const clickPosition = Math.min(Math.max(0, e.clientX - barRect.left), barWidth);
            const newProgress = (clickPosition / barWidth) * 100;
            setProgress(newProgress);
            onDrag(newProgress / 100);
        }
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (exectuting) return; // 执行时禁止拖动

        const bar = progressRef.current;
        if (bar && isDragging) {
            const barRect = bar.getBoundingClientRect();
            const barWidth = barRect.width;
            const movePosition = Math.min(Math.max(0, e.clientX - barRect.left), barWidth);
            const newProgress = (movePosition / barWidth) * 100;
            setProgress(newProgress);
            onDrag(newProgress / 100);
        }
    };

    const [isDragging, setIsDragging] = useState(false);

    React.useEffect(() => {
        const handleMouseUp = () => {
            setIsDragging(false);
        };

        if (isDragging && !exectuting) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, exectuting]);

    // 将进度值转换为速度显示
    const getSpeedText = (progress: number) => {
        const speed = (progress / 100 + 0.5).toFixed(1);
        return `${speed}x`;
    };

    return (
        <footer className="flex items-end absolute bottom-0 w-full">
            <button
                className="w-[10vw] h-[6vw] bg-custom-bg rounded-lg flex items-center justify-center"
                onClick={() => {
                    setCurrentScene('LEVELS');
                    saveCommandsUsed(levelInfo!.id, commandsUsed);
                }}
            >
                <RxReset className="w-[5vw] h-[5vw] text-custom-bg-text" />
            </button>

            {showBottomPanel && (
                <div className="flex items-center space-x-4 p-4 bg-custom-bg rounded-lg translate-x-1/2">
                    <button
                        className={`w-[6vw] h-[6vw] ${exectuting ? 'bg-custom-red hover:scale-105' : 'bg-custom-gray'} rounded-lg flex items-center justify-center transition-transform duration-200`}
                        onClick={onReset}
                    >
                        <Square
                            className="w-[3vw] h-[3vw] opacity-50"
                            strokeWidth={2}
                            fill="black"
                            color="black"
                        />
                    </button>

                    <button
                        className={`w-[6vw] h-[6vw] ${exectuting ? 'bg-custom-gray' : 'bg-custom-green hover:scale-105'} rounded-lg flex items-center justify-center transition-transform duration-200`}
                        onClick={!exectuting ? onExecute : () => { }}
                        disabled={exectuting}
                    >
                        <Play
                            className={`w-10 h-10 ${exectuting ? 'opacity-30' : 'opacity-50'}`}
                            strokeWidth={2}
                            color="black"
                        />
                    </button>

                    <button
                        className="w-[6vw] h-[6vw] bg-custom-green hover:scale-105 rounded-lg flex items-center justify-center transition-transform duration-200"
                        onClick={onExecuteOneStep}
                    >
                        <MoveRight
                            className="w-10 h-10"
                            strokeWidth={2}
                            color="#064e3b"
                        />
                    </button>

                    <div className={`relative flex flex-col items-center w-[12vw] ${exectuting ? 'opacity-50' : ''}`}>
                        {/* Speed indicator */}
                        <div className="flex items-center mb-2 text-custom-bg-text">
                            {exectuting ? (
                                <Lock className="w-4 h-4 mr-1 text-gray-500" />
                            ) : (
                                <Gauge className="w-4 h-4 mr-1" />
                            )}
                            <span className="text-sm font-medium">{getSpeedText(progress)}</span>
                        </div>

                        {/* Progress bar container */}
                        <div
                            className={`relative w-full h-2 bg-gray-700/30 rounded-full ${exectuting ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                            ref={progressRef}
                            onMouseDown={(e) => {
                                if (!exectuting) {
                                    handleDrag(e);
                                    setIsDragging(true);
                                }
                            }}
                        >
                            {/* Progress bar fill */}
                            <div
                                className={`absolute top-0 left-0 h-2 rounded-full transition-all duration-100 ${exectuting ? 'bg-gray-500' : 'bg-custom-green'}`}
                                style={{ width: `${progress}%` }}
                            />

                            {/* Draggable handle */}
                            <div
                                className={`absolute top-1/2 w-4 h-4 rounded-full shadow-lg transform -translate-y-1/2 transition-transform duration-200
                                    ${exectuting ?
                                        'bg-gray-400 cursor-not-allowed' :
                                        'bg-white cursor-grab active:cursor-grabbing hover:scale-110'
                                    }`}
                                style={{
                                    left: `calc(${progress}% - 8px)`,
                                    border: `2px solid ${exectuting ? '#9CA3AF' : '#10b981'}`
                                }}
                            />
                        </div>
                    </div>
                </div>
            )}
        </footer>
    );
};

export default BottomPanel;