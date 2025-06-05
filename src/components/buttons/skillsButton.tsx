import React,{useRef} from "react"
import { Feather } from "lucide-react"
import HelpArea from "../hint/HelpArea"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../components/ui/tooltip"
import VideoGallery from "../VideoGallery"


const TutorialButton = () => {
  const displayButton = useRef(false);
  const handleClickTutorial = () => {
    displayButton.current = !displayButton.current;
  } 

  const Element = () => (

    <div className="fixed bottom-0 left-[16rem] bg-custom-bg rounded-lg flex items-center justify-center"> 
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
          <button
              // className="fixed bottom-0 left-[16rem] bg-custom-bg rounded-lg flex items-center justify-center"
              onClick={handleClickTutorial}
            > 
            {displayButton.current ? <Feather className="w-[7rem] h-[4rem] text-yellow-600" /> : <Feather className="w-[7rem] h-[4rem] text-white" />}
            </button>
          </TooltipTrigger>
          <TooltipContent className="text-lg" side="bottom">
            <p>Check your skills</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
    
  );

  return (
    <HelpArea Trigger={Element}> 
      <VideoGallery />
    </HelpArea>
  )
}

export default TutorialButton