import React, { useRef } from "react"
import { ZoomIn } from "lucide-react"
import HelpArea from "../hint/HelpArea"
import { useAnalytics } from '../../context/AnalyticsContext';

const ConceptButton = ( {children, title, className} : {children: React.ReactNode, title: string, className?:   string} ) => {
  const displayButton = useRef(false);
  
  // Try to get analytics, but don't fail if not available
  let analytics;
  try {
    analytics = useAnalytics();
  } catch {
    // Analytics not available (e.g., outside of AnalyticsProvider)
    analytics = null;
  }
  
  const handleClickConcept = () => {
    displayButton.current = !displayButton.current;
    
    // Track concept button click in analytics if available
    if (analytics) {
      analytics.trackConceptButtonClick();
    }
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