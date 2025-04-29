import React,{useContext, useState} from "react"
import { Feather } from "lucide-react"
import GameContext from "../../context/GameContext"
import HelpArea from "../hint/HelpArea"
import { commandDescriptions } from "../../data"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../components/ui/tooltip"


const TutorialButton = () => {
  const {tutorial} = useContext(GameContext)
  const [showInfo, setShowInfo] = useState(false);
  const handleClickTutorial = () => {
    setShowInfo(!showInfo);
  } 


  const Element = () => (
    <button
      className="fixed bottom-0 left-[24rem] bg-custom-bg rounded-lg flex items-center justify-center"
      onClick={handleClickTutorial}
    > 
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            {tutorial ? <Feather className="w-[7rem] h-[4rem] text-yellow-600" /> : <Feather className="w-[7rem] h-[4rem] text-white" />}
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
              className='z-[102] my-2 w-full text-center rounded px-4 py-2 bg-white hover:scale-90 transition-all rotate-3'
              >{command}</p>
              <small 
                className='text-sm'
                >{commandDescriptions[command as keyof typeof commandDescriptions]}</small>
            </div>
        ))}
      </div> 
    </HelpArea>
  )
}

export default TutorialButton