import React,{useRef} from "react"
import { Feather } from "lucide-react"
import HelpArea from "../hint/HelpArea"
import { commandDescriptions } from "../../data"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../components/ui/tooltip"


const TutorialButton = () => {
  const displayButton = useRef(false);
  const handleClickTutorial = () => {
    displayButton.current = !displayButton.current;
  } 

  const Element = () => (
    <button
      className="fixed bottom-0 left-[24rem] bg-custom-bg rounded-lg flex items-center justify-center"
      onClick={handleClickTutorial}
    > 
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            {displayButton.current ? <Feather className="w-[7rem] h-[4rem] text-yellow-600" /> : <Feather className="w-[7rem] h-[4rem] text-white" />}
          </TooltipTrigger>
          <TooltipContent className="text-lg" side="top">
            <p>Check your skills (Soon)</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </button>
  );

  return (
    <HelpArea Trigger={Element}> 
      <div className='flex flex-col gap-2 overflow-y-auto h-[20rem] w-[20rem] '>            
        {Object.keys(commandDescriptions).map((command) => (
            <div key={command} className='pt-[0.2rem] m-2'>
              <p 
              className='mb-10 z-[102] my-2 w-full text-center rounded px-4 py-2 bg-white hover:scale-90 transition-all rotate-3'
              >{command}</p>
              <small 
                className=' text-white '
                >{commandDescriptions[command as keyof typeof commandDescriptions]}</small>

              {/* Display video here */}
              {/* <video src={`/data/videos/${command}.mov`} autoPlay loop muted playsInline className="w-full h-full object-cover" /> */}
            </div>
        ))}
      </div> 
    </HelpArea>
  )
}

export default TutorialButton