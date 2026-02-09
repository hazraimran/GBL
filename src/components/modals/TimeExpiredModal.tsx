import React, { useContext } from 'react';
import GameContext from '../../context/GameContext';
import { CommandWithArgType } from '../../types/game';

interface TimeExpiredModalProps {
    onContinue: () => void;
    onKnowAnswer: () => void;
    hasSolution: boolean;
}

const TimeExpiredModal: React.FC<TimeExpiredModalProps> = ({ 
    onContinue, 
    onKnowAnswer, 
    hasSolution 
}) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4 backdrop-blur-sm">
            <div className="bg-[#f4d03f] rounded-xl shadow-xl max-w-2xl border-4 border-[#8B4513]">
                <div className="bg-amber-200 p-4 border-b-2 border-amber-700">
                    <h2 className="text-2xl text-amber-800 text-center font-bold">Time&apos;s Up!</h2>
                </div>

                <div className="p-6">
                    <p className="text-amber-900 text-xl mb-6 text-center">
                        You&apos;ve reached the time limit for this level.
                        <br />
                        Would you like to know the answer or continue playing?
                    </p>

                    <div className="flex justify-center space-x-6">
                        <button
                            onClick={onContinue}
                            className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-md text-lg transition-colors duration-300 font-semibold"
                        >
                            Continue Playing
                        </button>

                        <button
                            onClick={onKnowAnswer}
                            disabled={!hasSolution}
                            className={`py-3 px-6 rounded-md text-lg transition-colors duration-300 font-semibold ${
                                hasSolution
                                    ? 'bg-green-600 hover:bg-green-700 text-white'
                                    : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                            }`}
                        >
                            Know the Answer
                        </button>
                    </div>

                    {!hasSolution && (
                        <p className="text-amber-800 text-sm text-center mt-4">
                            Solution not available for this level.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TimeExpiredModal;

