import GameScene from './pages/GameScene';
import Landing from './pages/Landing';
import GameProvider from './context/GameProvider';
import Levels from './pages/Levels';
import { Toaster } from "./components/ui/toaster"
import JumpConnector from './components/InstructionPanel/JumpConnector';

function App() {

  return (
    <GameProvider>
      <div className='h-[100vh] w-[100vw] relative overflow-hidden'>
        <Toaster />
        <Landing />
        <GameScene />
        <Levels />
        <JumpConnector />
      </div>
    </GameProvider >
  )
}

export default App
