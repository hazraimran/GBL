import GameScene from './pages/GameScene';
import Landing from './pages/Landing';
import GameProvider from './context/GameProvider';
import Levels from './pages/Levels';
import { Toaster } from "./components/ui/toaster"

function App() {

  return (
    <GameProvider>
      <div className='h-[100vh] w-[100vw] relative overflow-hidden'>
        <Toaster />
        <Landing />
        <GameScene />
        <Levels />
      </div>
    </GameProvider >
  )
}

export default App
