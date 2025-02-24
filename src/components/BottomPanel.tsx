import React, { useState, useRef, useContext, useEffect } from 'react';
import { RxReset } from "react-icons/rx";
import { Play, Square, Gauge, Lock } from 'lucide-react';
import GameContext from '../context/GameContext';
import { useGameStorage } from '../hooks/useStorage/useGameStorage';
import { Volume2, VolumeOff } from "lucide-react";

interface BottomPanelProps {
    onExecute: () => void;
    onReset: () => void;
    onDrag: (progress: number) => void;
}

const BottomPanel: React.FC<BottomPanelProps> = ({
    onExecute,
    onReset,
    onDrag
}) => {
    const [progress, setProgress] = useState(50);
    const progressRef = useRef<HTMLDivElement>(null);
    const { showFailurePrompt, showBottomPanel, navTo, setShowInfo, showInfo, muted, setMuted,
        showOpenningInstruction, levelInfo, commandsUsed, exectuting } = useContext(GameContext);
    const { saveCommandsUsed } = useGameStorage();
    const [isShaking, setIsShaking] = useState(false);

    useEffect(() => {
        if (showFailurePrompt) {
            console.log('failure')
            setIsShaking(true);
            setTimeout(() => {
                setIsShaking(false);
            }, 1000);
        }
    }, [showFailurePrompt])

    const handleDrag = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (exectuting) return;

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
        if (exectuting) return;

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

    const getSpeedText = (progress: number) => {
        const speed = (progress / 100 + 0.5).toFixed(1);
        return `${speed}x`;
    };

    return (
        <footer className={`flex items-end absolute bottom-0 w-full `}>
            <button
                className="fixed bottom-0 left-0 bg-custom-bg rounded-lg flex items-center justify-center"
                onClick={() => {
                    navTo('LEVELS');
                    saveCommandsUsed(levelInfo!.id, commandsUsed);
                    onReset();
                }}
            >
                <RxReset className="w-[7rem] h-[4rem] text-yellow-600" />
            </button>
            
            <button
                className="fixed bottom-0 left-[8rem] bg-custom-bg rounded-lg flex items-center justify-center"
                onClick={() => {
                }}
            >
                {muted ?
                    <VolumeOff onClick={() => setMuted(false)} className="w-[7rem] h-[4rem] text-yellow-600" /> :
                    <Volume2 onClick={() => setMuted(true)} className="w-[7rem] h-[4rem] text-yellow-600" />
                }
            </button>

            {
                !showInfo && !showOpenningInstruction && !showFailurePrompt && <div className='h-[6rem] fixed top-0 left-0 cursor-pointer bg-custom-bg rounded-lg'>
                    <img src="./guide_read.webp" alt=""
                        className=' h-[6rem]'
                        onClick={() => {
                            setShowInfo(true);
                        }} />
                </div>
            }


            {showBottomPanel && (
                <div className={`flex items-center space-x-4 p-4 bg-custom-bg rounded-lg m-auto ${isShaking && 'animate-shake'}`}>

                    <button
                        className={`w-[4rem] h-[4rem] ${exectuting ? 'bg-custom-red hover:scale-105' : 'bg-custom-gray'} rounded-lg flex items-center justify-center transition-transform duration-200`}
                        onClick={onReset}
                    >
                        <Square
                            className="w-[2rem] h-[2rem] opacity-50"
                            strokeWidth={2}
                            fill="black"
                            color="black"
                        />
                    </button>

                    <button
                        className={`w-[4rem] h-[4rem] ${exectuting ? 'bg-custom-gray' : 'bg-custom-green hover:scale-105'} rounded-lg flex items-center justify-center transition-transform duration-200`}
                        onClick={!exectuting ? onExecute : () => { }}
                        disabled={exectuting}
                    >
                        <Play
                            className={`w-10 h-10 ${exectuting ? 'opacity-30' : 'opacity-50'}`}
                            strokeWidth={2}
                            color="black"
                        />
                    </button>

                    <div className={`relative flex flex-col items-center w-[10rem] ${exectuting ? 'opacity-50' : ''}`}>
                        {/* Speed indicator */}
                        <div className="w-full flex flex-row justify-between mb-2 text-custom-bg-text">
                            {exectuting ? (
                                <Lock className="ml-[2.5rem] w-8 h-8 text-gray-500" />
                            ) : (
                                <Gauge className="ml-[2.5rem] w-8 h-8" />
                            )}
                            <span className="text-xl mt-[0.25rem] mr-[2.5rem]">{getSpeedText(progress)}</span>
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
                                className={`absolute top-0 left-0 h-2 rounded-full transition-all duration-75 ${exectuting ? 'bg-gray-500' : 'bg-custom-green'}`}
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