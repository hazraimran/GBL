import React, { useState } from 'react';
import { ClipboardList } from 'lucide-react';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '../ui/tooltip';
import SurveyModal from '../modals/SurveyModal';

const SurveyButton: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSurveyClick = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    return (
        <>
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
            
            <SurveyModal 
                isOpen={isModalOpen} 
                onClose={handleCloseModal} 
            />
        </>
    );
};

export default SurveyButton; 