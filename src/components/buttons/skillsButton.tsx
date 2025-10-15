import React, { useState, useCallback, memo, useEffect, useRef } from "react"
import { Feather } from "lucide-react"
import HelpArea from "../hint/HelpArea"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../components/ui/tooltip"
import VideoGallery from "../VideoGallery"

// Global state to track if button is already rendered
let isButtonRendered = false;

const TutorialButton = memo(() => {
  const [isActive, setIsActive] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const renderRef = useRef(false);
  
  useEffect(() => {
    if (!isButtonRendered && !renderRef.current) {
      isButtonRendered = true;
      renderRef.current = true;
      setShouldRender(true);
    } else if (isButtonRendered && !renderRef.current) {
      // Another instance is trying to render, don't render this one
      setShouldRender(false);
    }
    
    return () => {
      if (renderRef.current) {
        isButtonRendered = false;
      }
    };
  }, []);
  
  const handleClickTutorial = useCallback(() => {
    setIsActive(prev => !prev);
  }, []);

  const Element = useCallback(() => (
    <div className="fixed bottom-0 left-[16rem] bg-custom-bg rounded-lg flex items-center justify-center"> 
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={handleClickTutorial}
            > 
              {isActive ? <Feather className="w-[7rem] h-[4rem] text-yellow-600" /> : <Feather className="w-[7rem] h-[4rem] text-white" />}
            </button>
          </TooltipTrigger>
          <TooltipContent className="text-lg" side="bottom">
            <p>Check your skills</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  ), [isActive, handleClickTutorial]);

  if (!shouldRender) {
    return null;
  }

  return (
    <HelpArea Trigger={Element}> 
      <VideoGallery />
    </HelpArea>
  )
})

TutorialButton.displayName = 'TutorialButton';

export default TutorialButton