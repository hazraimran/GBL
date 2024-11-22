import { useState, useEffect, useContext } from 'react';
import GameContext from '../context/GameContext';
import FloatingMessage from '../components/FloatingMessage';

const PromptScene = () => {
    const { showReadyPrompt, showFailurePrompt, failurePromptMessage, showPickSlotPrompt } = useContext(GameContext);

    return (
        <div >
            {/* {showFirstTimePickPrompt && <div className='fixed bottom-24 left-48'>pick a slot to place the command</div>} */}
            {showPickSlotPrompt && <div className='fixed bottom-24 left-48'>pick a slot to place the command</div>}
            {showFailurePrompt && <FloatingMessage className='fixed top-24 left-60' text={failurePromptMessage} arrowDirection='right' />}
            {showReadyPrompt && <FloatingMessage text='run your program whenever you are ready' className='fixed bottom-24 left-1/2 -translate-x-8' />}
            {showFailurePrompt && <FloatingMessage text='stop and reset' className='fixed bottom-28 left-1/2 -translate-x-[13rem] ' />}
        </div>
    )
}

export default PromptScene;