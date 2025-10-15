import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, Home } from 'lucide-react';
import { useAuth } from '../../context/AuthProvider';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';

interface AdminNavProps {
  currentPage?: 'level-creator' | 'game';
}

const AdminNav: React.FC<AdminNavProps> = ({ currentPage = 'game' }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Check if user is admin
  const isAdmin = user?.email?.includes('admin') || user?.email?.includes('creator');

  // Don't render anything if user is not admin
  if (!isAdmin) {
    return null;
  }

  return (
    <>
      {currentPage === 'level-creator' && (
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
      )}
      
      {currentPage === 'game' && (
        <div className="fixed top-36 right-4 z-[1000]">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => navigate('/admin/level-creator')}
                  className="p-3 rounded-full transition-all duration-200 bg-purple-500 text-white shadow-lg hover:scale-105 hover:bg-purple-600"
                >
                  <Settings size={24} />
                </button>
              </TooltipTrigger>
              <TooltipContent className="text-lg" side="bottom">
                <p>Level Creator</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )}
    </>
  );
};

export default AdminNav;
