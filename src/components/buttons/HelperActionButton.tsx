import React, { useContext } from 'react';
import GameContext from '../../context/GameContext';
import { useAnalytics } from '../../context/AnalyticsContext';
import { HelpCircle } from 'lucide-react';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '../ui/tooltip';

const HelperActionButton: React.FC = () => {
    const { isAiHelperON, setIsAiHelperON } = useContext(GameContext);
    
    // Try to get analytics, but don't fail if not available
    let analytics;
    try {
        analytics = useAnalytics();
    } catch {
        // Analytics not available (e.g., outside of AnalyticsProvider)
        analytics = null;
    }

    const toggleHelper = () => {
        setIsAiHelperON(!isAiHelperON);
        
        // Track help button click in analytics if available
        if (analytics) {
            analytics.trackHelpButtonClick();
        }
    };

    return (
        <div className="fixed top-4 right-4">
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <button
                            onClick={toggleHelper}
                            className={`p-3 rounded-full transition-all duration-200 ${
                                isAiHelperON 
                                    ? 'bg-blue-500 text-white shadow-lg hover:scale-105' 
                                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                            }`}
                        >
                            <HelpCircle size={24} />
                        </button>
                    </TooltipTrigger>
                    <TooltipContent className="text-lg" side="bottom">
                        <p>{isAiHelperON ? 'AI Assistant is ON' : 'AI Assistant is OFF'}</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
    );
};

export default HelperActionButton; 