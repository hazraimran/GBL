import React,{ useContext } from 'react';
import GameContext from '../context/GameContext';
import FloatingMessage from '../components/FloatingMessage';
import SmartHintSystem from '../components/hint/Hint';

const PromptScene = () => {
    const { showBottomPanel, showReadyPrompt, showFailurePrompt, failurePromptMessage, showPickSlotPrompt, setShowInfo, setShowFailurePrompt, levelInfo, isAiHelperON } = useContext(GameContext);
    return (
        <>
            {showPickSlotPrompt && <div className='fixed bottom-24 left-48'>pick a slot to place the command</div>}
            
            {showFailurePrompt && isAiHelperON && <>
                <FloatingMessage className='fixed top-24 left-60 max-w-[14rem]' text={failurePromptMessage} arrowDirection='right' hint={true} setShowHint={() => {
                    setShowInfo(true)
                    setShowFailurePrompt(false)
                }} />
                <img className='fixed w-[20rem] z-[102] left-[28rem]' src='/guide_angry.webp' />
            </>}

            {showBottomPanel && showReadyPrompt && <FloatingMessage
                backgroundColor='#7FA147'
                text='run your program whenever you are ready'
                className='fixed bottom-28 left-1/2 -translate-x-[9rem] z-[100] rotate-[-5deg]'
            />}

            {showBottomPanel && showFailurePrompt && <FloatingMessage text='stop and reset' className='fixed bottom-28 left-1/2 -translate-x-[13rem] -rotate-[5deg]' />}

            <SmartHintSystem level={levelInfo}
                currentCode={["INPUT", "OUTPUT"]}
                apiKeys={{ anthropic: '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' }} />
        </>
    )
}

export default PromptScene;