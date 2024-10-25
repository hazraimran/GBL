import { useContext, useState } from "react";
import GameContext from "../context/GameContext";

const Menu: React.FC = () => {
    const { currentScene } = useContext(GameContext);
    const [showMenu, setShowMenu] = useState<boolean>(false);

    return currentScene === 'menu' && (
        <div className={`bg-cover bg-center bg-no-repeat h-screen animate-bg-zoom-loop ${showMenu && 'transition-all duration-500 blur-sm'}`}
            style={{ backgroundImage: `url('/bg.png')` }}
            onClick={() => {
                setShowMenu(true);
            }}
        >
        </div>
    );
}

export default Menu;