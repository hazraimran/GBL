import { useContext } from "react";
import GameContext from "../context/GameContext";
import { useGameStorage } from "../hooks/useStorage/useGameStorage";

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
                onClick={() => {
                    setTimeout(() => {
                        navTo('LEVELS');
                    }, 500);
                }}
            >
            </div>
            <div className="absolute top-1/2 -translate-y-full left-1/2 -translate-x-1/2 px-[2rem] py-[1rem] bg-gray-600 rounded-lg">
                <img className="w-[14rem]" src={'./icon2.png'} />
            </div>

        </>
    );
}

export default Landing;