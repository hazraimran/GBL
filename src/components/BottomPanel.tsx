import React, { useState, useRef, useContext, useEffect, useCallback, memo } from 'react';
import PropTypes from 'prop-types';
import { Play, Square, Gauge, Lock, ArrowLeft } from 'lucide-react';
import GameContext from '../context/GameContext';
import { useGameStorage } from '../hooks/useStorage/useGameStorage';
import TutorialButton from "../components/buttons/tutorial";
import SkillsButton from "../components/buttons/skillsButton";
import SilentButton from './buttons/SilentButton';
import AlertButton from './buttons/AlertButton';

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
    // Group related state
    const [uiState, setUiState] = useState({
        progress: 66,
        isShaking: false,
        isDragging: false
    });
    const { progress, isShaking, isDragging } = uiState;
    
    const progressRef = useRef<HTMLDivElement>(null);

    // Destructure context values
    const {
        showFailurePrompt,
        showBottomPanel,
        navTo,
        setShowInfo,
        showInfo,
        showOpenningInstruction,
        levelInfo,
        commandsUsed,
        exectuting
    } = useContext(GameContext);
    const { saveCommandsUsed } = useGameStorage();

    // Memoize speed text calculation
    const speedText = useCallback(() => {
        return `${(progress * 4.5 / 100 + 0.5).toFixed(1)}x`;
    }, [progress]);

    

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (exectuting || !isDragging) return;

        const bar = progressRef.current;
        if (bar) {
            const barRect = bar.getBoundingClientRect();
            const barWidth = barRect.width;
            const movePosition = Math.min(Math.max(0, e.clientX - barRect.left), barWidth);
            const newProgress = (movePosition / barWidth) * 100;
            setUiState(prev => ({...prev, progress: newProgress}));
            onDrag(newProgress * 4.5 / 100);
        }
    }, [exectuting, isDragging, onDrag]);

    const handleMouseUp = useCallback(() => {
        setUiState(prev => ({...prev, isDragging: false}));
    }, []);

    const handleBackToLevels = useCallback(() => {
        if (levelInfo) {
            navTo('LEVELS');
            saveCommandsUsed(levelInfo.id, commandsUsed);
            onReset();
        }
    }, [navTo, saveCommandsUsed, levelInfo, commandsUsed, onReset]);


    const handleShowInfo = useCallback(() => {
        setShowInfo(true);
    }, [setShowInfo]);

    // Shake effect
    useEffect(() => {
        if (!showFailurePrompt) return;
        
        setUiState(prev => ({...prev, isShaking: true}));
        const timer = setTimeout(() => {
            setUiState(prev => ({...prev, isShaking: false}));
        }, 1000);
        
        return () => clearTimeout(timer);
    }, [showFailurePrompt]);

    // Drag event handling
    useEffect(() => {
        if (!isDragging || exectuting) return;
        
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, exectuting, handleMouseMove, handleMouseUp]);

    return (
        <footer className="flex items-end absolute bottom-0 w-full z-20">

            <AlertButton 
                onClick={handleBackToLevels} 
                title="Go Back to main Level" 
                Icon={ArrowLeft} 
                colorIcon="yellow-600" 
                position="bottom-0 left-0" 
            />

            <SilentButton />
            <TutorialButton />
            <SkillsButton/>

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
                <div className={`flex z-50 items-center space-x-4 p-4 bg-custom-bg rounded-lg m-auto ${isShaking ? 'animate-shake' : ''}`}>
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
                        <div className="w-full flex flex-row justify-between mb-2 text-custom-bg-text">
                            {exectuting ? (
                                <Lock className="ml-[2.5rem] w-8 h-8 text-gray-500" />
                            ) : (
                                <Gauge className="ml-[2.5rem] w-8 h-8" />
                            )}
                            <span className="text-xl mt-[0.25rem] mr-[2.5rem]">{speedText()}</span>
                        </div>

                        <div
                            className={`relative w-full h-2 bg-gray-700/30 rounded-full ${exectuting ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                            ref={progressRef}
                            onMouseDown={() => {
                                if (!exectuting) {
                                    setUiState(prev => ({...prev, isDragging: true}));
                                }
                            }}
                        >
                            <div
                                className={`absolute top-0 left-0 h-2 rounded-full transition-all duration-75 ${exectuting ? 'bg-gray-500' : 'bg-custom-green'}`}
                                style={{ width: `${progress}%` }}
                            />

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

BottomPanel.propTypes = {
    onExecute: PropTypes.func.isRequired,
    onReset: PropTypes.func.isRequired,
    onDrag: PropTypes.func.isRequired
};

BottomPanel.displayName = 'BottomPanel';

export default BottomPanel;