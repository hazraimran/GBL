import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, Home, Layers } from 'lucide-react';
import { useAuth } from '../../context/AuthProvider';
import GameContext from '../../context/GameContext';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';

interface AdminNavProps {
  currentPage?: 'level-creator' | 'settings' | 'game';
}

const AdminNav: React.FC<AdminNavProps> = ({ currentPage = 'game' }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Get current scene from GameContext to check if we're inside a level
  // GameContext is always available, but on admin pages it will have default values
  const gameContext = useContext(GameContext);
  // Check if we have a real context (has navTo function) vs default empty context
  const hasRealContext = gameContext && typeof gameContext.navTo === 'function';
  const currentScene = hasRealContext ? gameContext.currentScene : null;

  // Check if user is admin
  const isAdmin = user?.email?.includes('admin') || user?.email?.includes('creator');

  // Don't render anything if user is not admin
  if (!isAdmin) {
    return null;
  }

  // On admin pages, show back button at top
  if (currentPage === 'level-creator' || currentPage === 'settings') {
    return (
      <div className="fixed top-4 right-4 z-[1000]">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => navigate('/')}
                className="p-3 rounded-full transition-all duration-200 bg-gray-500 text-white shadow-lg hover:scale-105 hover:bg-gray-600"
              >
                <Home size={24} />
              </button>
            </TooltipTrigger>
            <TooltipContent className="text-lg" side="bottom">
              <p>Back to Game</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    );
  }

  // Only show admin buttons in general area (LEVELS scene), not when inside a level (GAME scene)
  // Position them near the survey button (top-20 right-4), stacked vertically
  // Only show if we're in the LEVELS scene (general area), not in GAME scene (inside level)
  if (currentScene === 'LEVELS' && hasRealContext) {
    return (
      <div className="fixed top-20 right-4 z-[1000] flex flex-col gap-2">
        <TooltipProvider>
          {/* Level Creator button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => navigate('/admin/level-creator')}
                className="p-3 rounded-full transition-all duration-200 bg-purple-500 text-white shadow-lg hover:scale-105 hover:bg-purple-600"
              >
                <Layers size={24} />
              </button>
            </TooltipTrigger>
            <TooltipContent className="text-lg" side="left">
              <p>Level Creator</p>
            </TooltipContent>
          </Tooltip>

          {/* Settings button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => navigate('/admin/settings')}
                className="p-3 rounded-full transition-all duration-200 bg-blue-500 text-white shadow-lg hover:scale-105 hover:bg-blue-600"
              >
                <Settings size={24} />
              </button>
            </TooltipTrigger>
            <TooltipContent className="text-lg" side="left">
              <p>Settings</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    );
  }

  // Don't show buttons when inside a level (GAME scene) or other scenes
  return null;
};

export default AdminNav;
