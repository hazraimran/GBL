import React from 'react';
import { ClipboardList } from 'lucide-react';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '../ui/tooltip';

const SurveyButton: React.FC = () => {
    const handleSurveyClick = () => {
        // Open the Microsoft Forms survey in a new tab
        window.open('https://forms.office.com/Pages/DesignPageV2.aspx?subpage=design&FormId=gcLuqKOqrk2sm5o5i5IV5y-5xUaRQ71IlpneXq5LnZxUQTdUTzRSVjI5WUpCN1NCSFVOU1VEN0ZMNC4u', '_blank');
    };

    return (
        <div className="fixed top-20 right-4">
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <button
                            onClick={handleSurveyClick}
                            className="p-3 rounded-full transition-all duration-200 bg-green-500 text-white shadow-lg hover:scale-105 hover:bg-green-600"
                        >
                            <ClipboardList size={24} />
                        </button>
                    </TooltipTrigger>
                    <TooltipContent className="text-lg" side="bottom">
                        <p>Take our feedback survey</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
    );
};

export default SurveyButton; 