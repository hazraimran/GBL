
import React,{useContext} from "react"
import { Feather } from "lucide-react"
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
    <button
        className="fixed bottom-0 left-[24rem] bg-custom-bg rounded-lg flex items-center justify-center"
        onClick={handleClickTutorial}
    > 
    <TooltipProvider>
    <Tooltip>
        <TooltipTrigger >
          {tutorial ? <Feather className="w-[7rem] h-[4rem] text-yellow-600" /> : <Feather className="w-[7rem] h-[4rem] text-white" />}
        </TooltipTrigger>
        <TooltipContent className="text-lg" side="top">
            <p>Check your skills (Soon)</p>
            </TooltipContent>
        </Tooltip>
    </TooltipProvider>
    </button>
    )
}

export default TutorialButton