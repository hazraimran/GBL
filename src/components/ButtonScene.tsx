import React, { useContext, useEffect, useState } from "react";
import GameContext from "../context/GameContext";

const ButtonScene: React.FC = () => {
    const { levelInfo, currentScene, readyToPickSlot, setReadyToPickSlot, setSlotPicked } = useContext(GameContext);

    // Calculate relative positions based on the original reference screen (1633x923)
    const referenceScreen = { width: 1633, height: 923 };

    // Original positions in pixels
    const originalInitPos = { x: 385, y: 340 };
    const originalSpacing = 100;

    // Convert to percentages of the screen
    const relativePos = {
        x: (originalInitPos.x / referenceScreen.width) * 100,
        y: (originalInitPos.y / referenceScreen.height) * 100
    };

    const relativeSpacing = {
        x: (originalSpacing / referenceScreen.width) * 100,
        y: (originalSpacing / referenceScreen.height) * 100
    };

    if (currentScene !== 'GAME') {
        return null;
    }
    return (
        <div className="w-full h-full">
            {
                readyToPickSlot && currentScene === 'GAME' && Array(levelInfo.constructionSlots.length).fill(0).map((_, idx) => {
                    return (
                        <div key={idx}
                            className="absolute"
                            style={{
                                left: `${relativePos.x + (idx % 3) * relativeSpacing.x}%`,
                                top: `${relativePos.y + Math.floor(idx / 3) * relativeSpacing.y}%`
                            }}>

                            <div
                                className="absolute text-3xl font-bold animate-breath z-10"
                            >
                                {idx + 1}
                            </div>


                            <button
                                className="border-8 border-lime-600 w-20 h-20 animate-breath scale-110
                                bg-transparent rounded-md text-black"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setSlotPicked(idx);
                                    setReadyToPickSlot(false);
                                }}
                            >
                            </button>
                        </div>
                    )
                })
            }
        </div>
    );
}

export default ButtonScene;