import { useContext } from "react";
import GameContext from "../context/GameContext";
import { useGameStorage } from "../hooks/useStorage/useGameStorage";
import { ChevronRight } from "lucide-react";

const Landing: React.FC = () => {
    const { currentScene, navTo } = useContext(GameContext);
    useGameStorage();

    return currentScene === 'LANDING' && (
        <>
            <div
                className={`bg-cover bg-center bg-no-repeat h-screen animate-bg-zoom-loop`}
                style={{
                    backgroundImage: `url('/landing_bg.webp')`,
                    transition: 'filter 500ms ease-out'
                }}
            >
            </div>
            <div className="absolute top-1/3 -translate-y-full left-1/2 -translate-x-1/2 px-[2rem] pt-[2rem] text-7xl text-yellow-600 filter backdrop-blur-lg rounded-lg ">
                Ancient Architect
            </div>
            <div className="absolute top-2/3 -translate-y-full left-1/2 -translate-x-1/2 pl-[1.5rem] pr-[1rem] pt-[1.5rem] pb-[1rem] text-2xl filter backdrop-blur-md rounded-lg cursor-pointer"
                onClick={() => {
                    setTimeout(() => {
                        navTo('LEVELS');
                    }, 500);
                }}>
                Start <ChevronRight className="inline" />
            </div>
        </>
    );
}

export default Landing;