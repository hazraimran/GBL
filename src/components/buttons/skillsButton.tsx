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
import VideoGallery from "../VideoGallery"


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
            <p>Check your skills</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </button>
  );

  return (
    <HelpArea Trigger={Element} disableClose={true}> 
      <VideoGallery />
    </HelpArea>
  )
}

export default TutorialButton