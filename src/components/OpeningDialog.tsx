import React, { useState, useEffect, useContext } from 'react';
import GameContext from '../context/GameContext';
import { useGameStorage } from '../hooks/useStorage/useGameStorage';
import { openningInstruction } from '../data';
import SelectCharacter from './character/SelectCharacter';

const OpeningDialog = () => {
    const { showOpenningInstruction, setShowOpenningInstruction, isAiHelperON } = useContext(GameContext);
    const [currentTextIndex, setCurrentTextIndex] = useState(0);
    const [displayedText, setDisplayedText] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);
    const { getAndUpdateIsFirstTime } = useGameStorage();
    const [showSelectCharacter, setShowSelectCharacter] = useState(false);

    useEffect(() => {
        const isFirstTime = getAndUpdateIsFirstTime();
        if (isFirstTime) {
            setShowOpenningInstruction(true);
        }
    }, []);

    useEffect(() => {
        if (currentIndex < openningInstruction[currentTextIndex].length) {
            const timer = setTimeout(() => {
                setDisplayedText(prev => prev + openningInstruction[currentTextIndex][currentIndex]);
                setCurrentIndex(prev => prev + 1);
            }, 20);

            return () => clearTimeout(timer);
        }
    }, [currentIndex, openningInstruction, currentTextIndex]);

    useEffect(() => {
        setShowSelectCharacter(currentIndex === 0 && !showOpenningInstruction);
    }, [showOpenningInstruction]);

    const handleClick = () => {
        if (currentIndex === openningInstruction[currentTextIndex].length) {
            if (currentTextIndex === openningInstruction.length - 1) {
                // reset all states
                setCurrentIndex(0);
                setDisplayedText('');
                setCurrentTextIndex(0);
                setShowOpenningInstruction(false);
                return;
            }
            // reset all states
            setCurrentIndex(0);
            setDisplayedText('');
            setCurrentTextIndex(currentTextIndex + 1);
            return;
        } else {
            // display all texts
            setCurrentIndex(openningInstruction[currentTextIndex].length);
            setDisplayedText(openningInstruction[currentTextIndex]);
        }
    };

    if (showSelectCharacter) {
        return <SelectCharacter/>
    }

    return showOpenningInstruction && isAiHelperON && <>
        <div
            className={`fixed z-[2] transition-opacity duration-500 ease-linear backdrop-blur-sm rounded-lg shadow-2xl`}
            style={{
                opacity: 1,
                pointerEvents: 'auto',
                top: '25vh',
                left: '20vw',
                width: '60vw',
                height: '50vh',
                boxShadow: '0 0 15px rgba(0, 0, 0, 0.2), 0 0 30px rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
            }}
        />
        <div className='h-full flex flex-row justify-center items-center'>

            <div
                className={`cursor-pointer transition-shadow select-none z-[5]`}
                onClick={handleClick}
            >
                <div className={`border-solid relative flex flex-col p-4 bg-gray-300 rounded-lg min-h-[2rem] z-[1001] ${currentTextIndex % 2 === 1 ? ' rotate-[-5deg]' : ' rotate-[5deg]'}
            ${openningInstruction[currentTextIndex].length < 60 ? 'w-[16rem]' : openningInstruction[currentTextIndex].length < 100 ? 'w-[20rem]' : 'w-[22rem]'}`}>
                    <div className='text-2xl'>
                        {displayedText}
                    </div>
                    {currentIndex !== openningInstruction[currentTextIndex].length && <div className='relative w-full h-2 animate-float '>
                        <div className='absolute -bottom-1 right-2 border-t-[12px] border-l-8 border-l-transparent border-r-8 border-r-transparent w-0 h-0 border-t-green-400'></div>
                    </div>}
                    {
                        displayedText === openningInstruction[currentTextIndex] && <div className='flex justify-end relative '>
                            <div className='text-center text-lg pr-6'>Click to continue</div>
                            <div className='absolute top-1 border-t-[12px] border-l-8 border-l-transparent border-r-8 border-r-transparent w-0 h-0 border-t-green-400 animate-float'>
                            </div>
                        </div>
                    }
                    <div className='border-solid absolute -right-[0.9rem] border-t-[0.75rem] border-l-[1rem] border-l-gray-300 border-b-[0.75rem] border-b-transparent border-t-transparent w-0 h-0 '></div>
                </div>
            </div>
            {
                currentTextIndex % 2 === 0 ? <img className='relative w-[20rem] z-[5]' src='/guide_speak1.webp' /> : <img className='relative w-[20rem] z-[1002]' src='/guide_speak2.webp' />
            }
        </div>

    </>
};

export default OpeningDialog;