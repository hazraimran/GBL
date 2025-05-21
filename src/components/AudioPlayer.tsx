import React, { useContext, useEffect, useRef, useState } from "react";
import GameContext from "../context/GameContext";

// Define scene types to avoid string literals
type SceneType = 'LANDING' | 'GAME' | 'LEVELS';

// Define interface for the context
interface GameContextType {
    currentScene: SceneType;
    muted: boolean;
    playBGM: boolean;
}

function AudioPlayer() {
    const { currentScene, muted, playBGM } = useContext(GameContext) as GameContextType;
    const audioRef = useRef<HTMLAudioElement | null>(null);
    // Track the currently playing BGM URL
    const [currentBgm, setCurrentBgm] = useState<string | null>(null);

    // Handle mute state changes
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.muted = muted;
        }
    }, [muted]);

    // Handle BGM switching when scene changes
    useEffect(() => {
        // Determine the audio URL based on current scene
        let audioUrl: string;
        switch (currentScene) {
            case 'LANDING':
                audioUrl = './home.mp3';
                break;
            case 'GAME':
                audioUrl = './game.mp3';
                break;
            case 'LEVELS':
                audioUrl = './home.mp3';
                break;
            default:
                return; // If no matching scene, return early
        }

        // Only change the music if the new BGM is different from the current one
        if (audioRef.current && audioUrl !== currentBgm && playBGM) {
            audioRef.current.src = audioUrl;
            setCurrentBgm(audioUrl);

            // Play the new BGM
            audioRef.current.play().catch(error => {
                console.error("Failed to play audio:", error);
            });
        }
    }, [currentScene, currentBgm, playBGM]);

    return (
        <audio ref={audioRef} loop></audio>
    );
}

export default AudioPlayer;