import React, { useState, useRef, useContext, useEffect, useCallback, memo } from 'react';
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

const BottomPanel: React.FC<BottomPanelProps> = memo(({
    onExecute,
    onReset,
    onDrag
}) => {
    const [progress, setProgress] = useState(33);
    const progressRef = useRef<HTMLDivElement>(null);
    const {
        showFailurePrompt,
        showBottomPanel,
        navTo,
        setShowInfo,
        showInfo,
        muted,
        setMuted,
        showOpenningInstruction,
        levelInfo,
        commandsUsed,
        exectuting
    } = useContext(GameContext);
    const { saveCommandsUsed } = useGameStorage();
    const [isShaking, setIsShaking] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

    // Optimize event handlers with useCallback to prevent unnecessary recreations
    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (exectuting || !isDragging) return;

        const bar = progressRef.current;
        if (bar) {
            const barRect = bar.getBoundingClientRect();
            const barWidth = barRect.width;
            const movePosition = Math.min(Math.max(0, e.clientX - barRect.left), barWidth);
            const newProgress = (movePosition / barWidth) * 100;
            setProgress(newProgress);
            onDrag(newProgress * 4.5 / 100);
        }
    }, [exectuting, isDragging, onDrag]);

    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
    }, []);

    const handleBackToLevels = useCallback(() => {
        if (levelInfo) {
            navTo('LEVELS');
            saveCommandsUsed(levelInfo.id, commandsUsed);
            onReset();
        }
    }, [navTo, saveCommandsUsed, levelInfo, commandsUsed, onReset]);

    const handleToggleMute = useCallback(() => {
        setMuted(!muted);
    }, [muted, setMuted]);

    const handleShowInfo = useCallback(() => {
        setShowInfo(true);
    }, [setShowInfo]);

    // Shake effect, only executes when showFailurePrompt changes
    useEffect(() => {
        if (showFailurePrompt) {
            setIsShaking(true);
            const timer = setTimeout(() => {
                setIsShaking(false);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [showFailurePrompt]);

    // Drag event handling, only updates event listeners when isDragging or exectuting changes
    useEffect(() => {
        if (isDragging && !exectuting) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);

            return () => {
                window.removeEventListener('mousemove', handleMouseMove);
                window.removeEventListener('mouseup', handleMouseUp);
            };
        }
    }, [isDragging, exectuting, handleMouseMove, handleMouseUp]);

    // Pre-calculate speed text to avoid recalculation during rendering
    const speedText = `${(progress * 4.5 / 100 + 0.5).toFixed(1)}x`;

    return (
        <footer className="flex items-end absolute bottom-0 w-full">
            <button
                className="fixed bottom-0 left-0 bg-custom-bg rounded-lg flex items-center justify-center"
                onClick={handleBackToLevels}
            >
                <RxReset className="w-[7rem] h-[4rem] text-yellow-600" />
            </button>

            <button
                className="fixed bottom-0 left-[8rem] bg-custom-bg rounded-lg flex items-center justify-center"
                onClick={handleToggleMute}
            >
                {muted ?
                    <VolumeOff className="w-[7rem] h-[4rem] text-yellow-600" /> :
                    <Volume2 className="w-[7rem] h-[4rem] text-yellow-600" />
                }
            </button>

            {!showInfo && !showOpenningInstruction && !showFailurePrompt && (
                <div className='h-[6rem] fixed top-0 left-0 cursor-pointer bg-custom-bg rounded-lg'>
                    <img
                        src="./guide_read.webp"
                        alt="Guide"
                        className='h-[6rem]'
                        onClick={handleShowInfo}
                    />
                </div>
            )}

            {showBottomPanel && (
                <div className={`flex items-center space-x-4 p-4 bg-custom-bg rounded-lg m-auto ${isShaking ? 'animate-shake' : ''}`}>
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
                        onClick={exectuting ? undefined : onExecute}
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
                            <span className="text-xl mt-[0.25rem] mr-[2.5rem]">{speedText}</span>
                        </div>

                        {/* Progress bar container */}
                        <div
                            className={`relative w-full h-2 bg-gray-700/30 rounded-full ${exectuting ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                            ref={progressRef}
                            onMouseDown={(e) => {
                                if (!exectuting) {
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
});

// Explicitly setting displayName helps with debugging in React Dev Tools
BottomPanel.displayName = 'BottomPanel';

export default BottomPanel;