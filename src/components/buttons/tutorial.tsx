import React,{useContext} from "react"
import { ShieldQuestion } from "lucide-react"
import GameContext from "../../context/GameContext"

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../components/ui/tooltip"


const TutorialButton = () => {
  const {tutorial, setTutorial, setCommandsUsed} = useContext(GameContext)
  const handleClickTutorial = () => {
      setCommandsUsed([]);
      setTutorial(!tutorial);
  }
  return (

    <TooltipProvider>
    <Tooltip>
        <TooltipTrigger asChild>
        <button
        className="fixed bottom-0 left-[16rem] bg-custom-bg rounded-lg flex items-center justify-center"
        onClick={handleClickTutorial}
    > 
          {tutorial ? <ShieldQuestion className="w-[7rem] h-[4rem] text-yellow-600" /> : <ShieldQuestion className="w-[7rem] h-[4rem] text-white" />}
        </button>
        </TooltipTrigger>
        <TooltipContent className="text-lg" side="top">
            <p>Turn on tutorial mode: Status {tutorial ? 'ON' : 'OFF'}</p>
            </TooltipContent>
        </Tooltip>
    </TooltipProvider>
    
    )
}

export default TutorialButton