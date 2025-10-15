import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { Settings, Home } from 'lucide-react';

interface AdminNavProps {
  currentPage?: 'level-creator' | 'game';
}

const AdminNav: React.FC<AdminNavProps> = ({ currentPage = 'game' }) => {
  const navigate = useNavigate();

  return (
    <div className="fixed top-4 right-4 z-[1000] flex space-x-2">
      {currentPage === 'level-creator' && (
        <Button
          onClick={() => navigate('/')}
          variant="outline"
          size="sm"
          className="bg-white/90 hover:bg-white"
        >
          <Home className="w-4 h-4 mr-2" />
          Back to Game
        </Button>
      )}
      
      {currentPage === 'game' && (
        <Button
          onClick={() => navigate('/admin/level-creator')}
          variant="outline"
          size="sm"
          className="bg-white/90 hover:bg-white"
        >
          <Settings className="w-4 h-4 mr-2" />
          Level Creator
        </Button>
      )}
    </div>
  );
};

export default AdminNav;
