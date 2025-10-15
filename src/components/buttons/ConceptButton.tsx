import React, { useCallback, memo } from "react"
import { ZoomIn } from "lucide-react"
import HelpArea from "../hint/HelpArea"
import { useAnalytics } from '../../context/AnalyticsContext';

const ConceptButton = memo(({children, title, className} : {children: React.ReactNode, title: string, className?: string}) => {
  // Try to get analytics, but don't fail if not available
  let analytics;
  try {
    analytics = useAnalytics();
  } catch {
    // Analytics not available (e.g., outside of AnalyticsProvider)
    analytics = null;
  }
  
  const handleClickConcept = useCallback(() => {

    console.log("alexander clicked concept button");
    // Track concept button click in analytics if available
    if (analytics) {
      analytics.trackConceptButtonClick();
    }
  }, [analytics]);

  const Element = useCallback(() => (
    <div className=""> 
      <span className="text-lg cursor-pointer flex flex-row items-center gap-2 bg-custom-bg rounded-lg px-2 py-1 text-white "><ZoomIn  />{title}</span>
    </div>
  ), [title]);

  return (
    <HelpArea Trigger={Element} className={className} onTriggerClick={handleClickConcept}> 
      {children}
    </HelpArea>
  )
})

ConceptButton.displayName = 'ConceptButton';

export default ConceptButton