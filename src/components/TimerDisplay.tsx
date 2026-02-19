import React, { useContext } from 'react';
import GameContext from '../context/GameContext';
import { useTimeCap } from '../hooks/useTimeCap';
import { Clock } from 'lucide-react';

const TimerDisplay: React.FC = () => {
    const { levelInfo } = useContext(GameContext);
    const { elapsedTime, timeExpired } = useTimeCap(levelInfo);

    // Only show timer if level has a time limit
    if (!levelInfo?.timeLimitInSeconds) {
        return null;
    }

    const remainingTime = Math.max(0, levelInfo.timeLimitInSeconds - elapsedTime);
    const minutes = Math.floor(remainingTime / 60);
    const seconds = remainingTime % 60;
    const formattedTime = `${minutes}:${seconds.toString().padStart(2, '0')}`;

    // Calculate percentage for progress bar
    const percentage = (remainingTime / (levelInfo?.timeLimitInSeconds || 1)) * 100;
    
    // Color based on remaining time
    const getColorClass = () => {
        if (timeExpired || remainingTime === 0) return 'text-red-500';
        if (percentage <= 25) return 'text-orange-500';
        if (percentage <= 50) return 'text-yellow-500';
        return 'text-white';
    };

    const getProgressBarColor = () => {
        if (timeExpired || remainingTime === 0) return 'bg-red-500';
        if (percentage <= 25) return 'bg-orange-500';
        if (percentage <= 50) return 'bg-yellow-500';
        return 'bg-green-500';
    };

    return (
        <div className="fixed bottom-[100px] left-4 z-[100] bg-black/70 backdrop-blur-sm rounded-lg p-3 border-2 border-[#8B4513] shadow-lg">
            <div className="flex items-center gap-2 mb-2">
                <Clock className={`w-5 h-5 ${getColorClass()}`} />
                <span className={`text-xl font-bold font-mono ${getColorClass()}`}>
                    {formattedTime}
                </span>
            </div>
            
            {/* Progress bar */}
            <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                <div
                    className={`h-full transition-all duration-1000 ${getProgressBarColor()}`}
                    style={{ width: `${Math.max(0, Math.min(100, percentage))}%` }}
                />
            </div>
            
            {timeExpired && (
                <p className="text-red-400 text-xs mt-1 text-center animate-pulse">
                    Time&apos;s up!
                </p>
            )}
        </div>
    );
};

export default TimerDisplay;

