import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { authService } from '../../services/firestore/authentication';

interface FirstTimeSurveyModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const FirstTimeSurveyModal: React.FC<FirstTimeSurveyModalProps> = ({ isOpen, onClose }) => {
    const [userId, setUserId] = useState<string>('');

    useEffect(() => {
        if (isOpen) {
            const currentUserId = authService.getCurrentUserId();
            setUserId(currentUserId || 'Not authenticated');
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
                onClick={onClose}
            />
            
            {/* Modal */}
            <div className="relative bg-white rounded-lg shadow-xl w-[90vw] h-[100vh] max-w-4xl">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-xl font-semibold text-gray-800">
                        Welcome Survey
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>
                
                {/* Content */}
                <div className="p-4 h-[calc(100vh-80px)]">
                    <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-sm font-medium text-blue-700 mb-1">Your Application Code:</p>
                        <div className="flex items-center gap-2">
                            <p className="text-lg font-mono text-blue-900 break-all">{userId}</p>
                            <button
                                onClick={() => navigator.clipboard.writeText(userId)}
                                className="p-2 hover:bg-blue-100 rounded transition-colors"
                                title="Copy to clipboard"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                                </svg>
                                Copy
                            </button>
                        </div>
                    </div>
                    <iframe
                        src="https://forms.office.com/Pages/ResponsePage.aspx?id=gcLuqKOqrk2sm5o5i5IV5y-5xUaRQ71IlpneXq5LnZxUMjJYVkVTU0tOTTBIU0NRWkkxUTlVTTdSNS4u"
                        className="w-full h-[calc(100%-80px)] border-0 rounded"
                        title="Welcome Survey"
                        allowFullScreen
                    />
                </div>
            </div>
        </div>
    );
};

export default FirstTimeSurveyModal; 