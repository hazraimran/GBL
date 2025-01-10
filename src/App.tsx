import GameScene from './pages/GameScene';
import Landing from './pages/Landing';
import GameProvider from './context/GameProvider';
import Levels from './pages/Levels';
import { Toaster } from "./components/ui/toaster"
import JumpConnector from './components/InstructionPanel/JumpConnector';
import ButtonScene from './components/ButtonScene';
import GameContext from './context/GameContext';
import { useContext } from 'react';

function App() {
  const Modal: React.FC = () => {
    const { showModal } = useContext(GameContext);

    return <div
      className={`fixed inset-0 z-[1000] h-[100vh] w-[100vw] transition-opacity duration-500 ease-linear ${showModal ? 'backdrop-blur-sm' : ''}`}
      style={{
        opacity: showModal ? 1 : 0,
        pointerEvents: showModal ? 'auto' : 'none',
      }}
    />
  }

  return (
    <GameProvider>
      <div className='h-[100vh] w-[100vw] relative overflow-hidden'>
        <Toaster />
        <Landing />
        <GameScene />
        <Levels />
        <JumpConnector />
        <ButtonScene />
      </div>
      <Modal />
    </GameProvider >
  )
}

export default App
