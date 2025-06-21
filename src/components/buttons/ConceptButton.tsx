import React,{useRef, useContext} from "react"
import { ZoomIn } from "lucide-react"
import HelpArea from "../hint/HelpArea"
import GameContext from "../../context/GameContext";
import { useLevelAnalytics } from "../../hooks/useLevelAnalytics";

const ConceptButton = ( {children, title, className} : {children: React.ReactNode, title: string, className?:   string} ) => {
  const displayButton = useRef(false);
  const { levelInfo } = useContext(GameContext);
  const analytics = useLevelAnalytics(levelInfo?.id || 1);
  
  const handleClickConcept = () => {
    displayButton.current = !displayButton.current;
    
    // Track concept button click in analytics
    analytics.trackConceptButtonClick();
  } 

  const Element = () => (
    <div
      className=""
      onClick={handleClickConcept}
    > 
      <span className="text-lg cursor-pointer flex flex-row items-center gap-2 bg-custom-bg rounded-lg px-2 py-1 text-white "><ZoomIn  />{title}</span>
            

    </div>
  );

  return (
    <HelpArea Trigger={Element} className={className}> 
      {children}
    </HelpArea>
  )
}

export default ConceptButton