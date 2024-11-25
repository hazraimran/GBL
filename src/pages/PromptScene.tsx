import { useState, useEffect, useContext } from 'react';
import GameContext from '../context/GameContext';
import FloatingMessage from '../components/FloatingMessage';

const Arrow = ({
    className = '',
    color = '#a1d85f',
    strokeWidth = 10,
    arrowheadSize = 4, // Default size for arrowhead
}) => {
    return (
        <svg
            className={`relative ${className}`}
            width="200"
            height="300"
            viewBox="0 0 200 300"
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* Path for the left parenthesis-like curve */}
            <path
                d="M150,20 C50,150 50,150 150,280"
                stroke={color}
                strokeWidth={strokeWidth}
                fill="none"
                markerEnd="url(#arrowhead)"
            />
            <defs>
                {/* Define the arrowhead */}
                <marker
                    id="arrowhead"
                    markerWidth={arrowheadSize} // Adjust arrowhead size dynamically
                    markerHeight={(arrowheadSize * 7) / 10} // Maintain proportion (7:10 ratio)
                    refX="8"
                    refY="3.5"
                    orient="auto"
                >
                    <polygon points="0 0, 10 3.5, 0 7" fill={color} />
                </marker>
            </defs>
        </svg>
    );
};

const PromptScene = () => {
    const { showFirstTimePickPrompt, showBottomPanel, showReadyPrompt,
        showFailurePrompt, failurePromptMessage, showPickSlotPrompt } = useContext(GameContext);

    return (
        <div >
            {showFirstTimePickPrompt && <Arrow />}
            {showPickSlotPrompt && <div className='fixed bottom-24 left-48'>pick a slot to place the command</div>}
            {showFailurePrompt && <FloatingMessage className='fixed top-24 left-60' text={failurePromptMessage} arrowDirection='right' />}
            {showBottomPanel && showReadyPrompt && <FloatingMessage
                backgroundColor='#7FA147'
                text='run your program whenever you are ready'
                className='fixed bottom-28 left-1/2 -translate-x-[9rem] z-[100] rotate-[-5deg]' />}
            {showBottomPanel && showFailurePrompt && <FloatingMessage text='stop and reset' className='fixed bottom-28 left-1/2 -translate-x-[13rem] ' />}
        </div>
    )
}

export default PromptScene;