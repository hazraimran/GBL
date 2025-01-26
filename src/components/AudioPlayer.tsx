import { useContext, useEffect, useRef } from "react";
import GameContext from "../context/GameContext";
import usePrevious from "../hooks/usePrevious";

function AudioPlayer() {

    const { currentScene } = useContext(GameContext);
    const preScene = usePrevious(currentScene);
    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        let audioUrl;

        if (preScene === 'GAME') {
            audioUrl = './home.mp3';
        }
        if (currentScene === 'GAME') {
            audioUrl = './game.mp3';
        }
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
                break;
        }

        if ((preScene === 'GAME' || currentScene === 'GAME') && audioRef.current && audioUrl) {
            audioRef.current.src = audioUrl;
            audioRef.current.play().catch(error => {
                console.error("Failed to play audio:", error);
            });
        }
    }, [currentScene])
    return (
        <audio ref={audioRef} loop></audio>
    );
}

export default AudioPlayer;