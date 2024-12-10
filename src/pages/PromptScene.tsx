import { useContext } from 'react';
import GameContext from '../context/GameContext';
import FloatingMessage from '../components/FloatingMessage';
import TypingDialog from '../components/TypingDialog';
import SmartHintSystem from '../components/Hint';

const OpeningInstruction = ({show}: {show: boolean}) => {

    return show && <>
        <div className='fixed inset-0 bg-black bg-opacity-80 z-[100]' />
        <img className='fixed w-[20rem] left-[48%] top-[20%] z-[102]' src='/guide.png' />
        <TypingDialog />
    </>

}

const PromptScene = () => {
    const { showBottomPanel, showReadyPrompt, showFailurePrompt, failurePromptMessage, showPickSlotPrompt } = useContext(GameContext);

    return (
        <div >
            {showPickSlotPrompt && <div className='fixed bottom-24 left-48'>pick a slot to place the command</div>}
            {showFailurePrompt && <FloatingMessage className='fixed top-24 left-60 max-w-[14rem]' text={failurePromptMessage} arrowDirection='right' />}
            {showBottomPanel && showReadyPrompt && <FloatingMessage
                backgroundColor='#7FA147'
                text='run your program whenever you are ready'
                className='fixed bottom-28 left-1/2 -translate-x-[9rem] z-[100] rotate-[-5deg]' />}
            {showBottomPanel && showFailurePrompt && <FloatingMessage text='stop and reset' className='fixed bottom-28 left-1/2 -translate-x-[13rem] -rotate-[5deg]' />}
            {/* <OpeningInstruction show={}/> */}

            <SmartHintSystem level={{
                "id": "1",
                "title": "Supply Chamber",
                "description": "Drag commands into this area to build a program.\n\n Your program should tell your worker to grab each thing from the INBOX, and drop it into the OUTBOX.",
                "commands": ["INPUT", "OUTPUT"],
                "goal": "Your program should tell your worker to grab each thing from the INBOX, and drop it into the OUTBOX.",
                "input": [1, 2, 3, 4],
                "expectOutput": [1, 2, 3, 4]
            }}
                currentCode={["INPUT", "OUTPUT"]}
                apiKey='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' />
            <></>
        </div >
    )
}

export default PromptScene;