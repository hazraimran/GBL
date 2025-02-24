import { useState, useEffect, useContext } from 'react';
import GameContext from '../context/GameContext';

const TypingDialog = () => {
    const { showOpenningInstruction, setShowOpenningInstruction, openningInstruction, setShowInstructionPanel } = useContext(GameContext);
    const [currentTextIndex, setCurrentTextIndex] = useState(0);
    const [displayedText, setDisplayedText] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (currentIndex < openningInstruction[currentTextIndex].length) {
            const timer = setTimeout(() => {
                setDisplayedText(prev => prev + openningInstruction[currentTextIndex][currentIndex]);
                setCurrentIndex(prev => prev + 1);
            }, 40);

            return () => clearTimeout(timer);
        }
    }, [currentIndex, openningInstruction, currentTextIndex]);

    const handleClick = () => {
        if (currentIndex === openningInstruction[currentTextIndex].length) {
            if (currentTextIndex === openningInstruction.length - 1) {
                // reset all states
                setCurrentIndex(0);
                setDisplayedText('');
                setCurrentTextIndex(0);
                setShowOpenningInstruction(false);
                setShowInstructionPanel(true);
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

    return showOpenningInstruction && <>
        <div
            className={`cursor-pointer hover:shadow-lg transition-shadow select-none z-[102]`}
            onClick={handleClick}
        >
            <div className={`border-solid relative flex flex-col p-4 bg-gray-300 rounded-lg min-h-[2rem] ${currentTextIndex % 2 === 1 ? ' rotate-[-5deg]' : ' rotate-[5deg]'}
            ${openningInstruction[currentTextIndex].length < 60 ? 'w-[16rem]' : openningInstruction[currentTextIndex].length < 100 ? 'w-[20rem]' : 'w-[22rem]'}`}>
                <div className='text-2xl'>
                    {displayedText}
                </div>
                {currentIndex !== openningInstruction[currentTextIndex].length && <div className='relative w-full h-2 animate-float '>
                    <div className='absolute -bottom-1 right-2 border-t-[12px] border-l-8 border-l-transparent border-r-8 border-r-transparent w-0 h-0 border-t-green-400'></div>
                </div>}

                <div className='border-solid absolute -right-[0.9rem] border-t-[0.75rem] border-l-[1rem] border-l-gray-300 border-b-[0.75rem] border-b-transparent border-t-transparent w-0 h-0 '></div>
            </div>
        </div>
        {
            currentTextIndex % 2 === 0 ? <img className='w-[20rem] z-[102]' src='/guide_speak1.webp' /> : <img className='w-[20rem] z-[102]' src='/guide_speak2.webp' />
        }
        
    </>
};

export default TypingDialog;