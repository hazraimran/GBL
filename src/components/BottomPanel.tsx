import React, { useState, useRef } from 'react';
import { GoMute, GoUnmute } from "react-icons/go";
// import { GrPowerReset } from "react-icons/gr";
import { RxReset } from "react-icons/rx"; // go back icon


const App: React.FC = () => {
    const [isMuted, setIsMuted] = useState(false);
    const [progress, setProgress] = useState(0);
    const progressRef = useRef<HTMLDivElement>(null);

    const handleDrag = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const bar = progressRef.current;
        if (bar) {
            const barRect = bar.getBoundingClientRect();
            const newProgress = Math.min(
                Math.max(0, e.clientX - barRect.left),
                barRect.width
            );
            setProgress((newProgress / barRect.width) * 100);
        }
    };

    return (
        <footer className="flex items-end absolute bottom-0">
            {/* Return Button */}
            <button className="w-48 h-28 bg-custom-bg rounded-lg flex items-center justify-center">
                <RxReset className="w-20 h-20 text-custom-bg-text" />
            </button>

            {/* Mute Button */}
            <button className="w-32 h-28 bg-custom-bg rounded-lg flex items-center justify-center ml-8"
            onClick={() => setIsMuted(!isMuted)}>
                { isMuted ? <GoMute className="w-20 h-20 text-custom-bg-text" /> : <GoUnmute className="w-20 h-20 text-custom-bg-text" />}
                
            </button>

            <div className="h-40 flex items-center space-x-4 p-4 bg-custom-bg rounded-lg translate-x-1/2">
                {/* Stop Button */}
                <button className="w-24 h-24 bg-custom-red rounded-lg flex items-center justify-center">
                    <div className="w-10 h-10 opacity-50 bg-black"></div>
                </button>

                {/* Turn Left Button */}
                <button className="w-24 h-24 bg-gray-500 rounded-lg flex items-center justify-center">
                    <svg className="w-10 h-10 opacity-50 bg-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h8M7 7v8m0-8l8 8" />
                    </svg>
                </button>

                {/* Play Button */}
                <button className="w-24 h-24 bg-custom-green rounded-lg flex items-center justify-center">
                    <svg className="w-10 h-10 opacity-50 bg-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v18l14-9-14-9z" />
                    </svg>
                </button>

                {/* Turn Right Button */}
                <button className="w-24 h-24 bg-custom-green rounded-lg flex items-center justify-center">
                    <svg className="w-10 h-10 text-green-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 7H9m8 0v8m0-8l-8 8" />
                    </svg>
                </button>

                {/* Draggable Progress Bar */}
                <div className="relative w-64 h-10 bg-gray-700 rounded-lg" ref={progressRef} onMouseDown={handleDrag}>
                    <div
                        className="absolute top-0 left-0 h-10 bg-green-500 rounded-lg"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
            </div>
        </footer>
    );
};

export default App;
