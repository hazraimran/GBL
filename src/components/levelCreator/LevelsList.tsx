import React, { useState, useEffect } from 'react';
import { LevelInfo } from '../../types/level';
import { LevelCreatorService } from '../../services/firestore/levelCreatorService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { 
  Edit, 
  Trash2, 
  Copy, 
  Search, 
  Eye, 
  EyeOff, 
  Lock, 
  Unlock,
  Loader2,
  AlertCircle
} from 'lucide-react';

interface LevelsListProps {
  onEdit: (level: LevelInfo) => void;
}

const LevelsList: React.FC<LevelsListProps> = ({ onEdit }) => {
  const [levels, setLevels] = useState<LevelInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'id' | 'title'>('id');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    loadLevels();
  }, []);

  const loadLevels = async () => {
    try {
      setLoading(true);
      setError(null);
      const allLevels = await LevelCreatorService.getAllLevels();
      setLevels(allLevels);
    } catch (err) {
      setError('Failed to load levels');
      console.error('Error loading levels:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (levelId: number) => {
    if (!confirm(`Are you sure you want to delete level ${levelId}? This action cannot be undone.`)) {
      return;
    }

    try {
      await LevelCreatorService.deleteLevel(levelId);
      await loadLevels(); // Reload the list
    } catch (err) {
      alert('Failed to delete level');
      console.error('Error deleting level:', err);
    }
  };

  const handleDuplicate = async (level: LevelInfo) => {
    try {
      const nextId = await LevelCreatorService.getNextLevelId();
      const duplicatedLevel: LevelInfo = {
        ...level,
        id: nextId,
        title: `${level.title} (Copy)`,
        isLocked: true, // Lock duplicated levels by default
        timeSpent: 0,
        timeAccessed: 0,
        executeCnt: -1
      };
      
      await LevelCreatorService.createLevel(duplicatedLevel);
      await loadLevels(); // Reload the list
    } catch (err) {
      alert('Failed to duplicate level');
      console.error('Error duplicating level:', err);
    }
  };

  const filteredAndSortedLevels = levels
    .filter(level => 
      level.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      level.id.toString().includes(searchTerm)
    )
    .sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'id') {
        comparison = a.id - b.id;
      } else {
        comparison = a.title.localeCompare(b.title);
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin mr-2" />
          Loading levels...
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent>
          <Alert className="border-red-500 bg-red-900/20">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error}
              <Button 
                variant="outline" 
                size="sm" 
                onClick={loadLevels}
                className="ml-2"
              >
                Retry
              </Button>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Levels</CardTitle>
        <CardDescription>
          View, edit, duplicate, or delete existing levels
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search and Sort Controls */}
        <div className="flex space-x-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search levels by title or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex space-x-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'id' | 'title')}
              className="px-3 py-2 bg-gray-800 border border-gray-600 rounded text-sm"
            >
              <option value="id">Sort by ID</option>
              <option value="title">Sort by Title</option>
            </select>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </Button>
          </div>
        </div>

        {/* Levels List */}
        <div className="space-y-2">
          {filteredAndSortedLevels.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              {searchTerm ? 'No levels match your search' : 'No levels found'}
            </div>
          ) : (
            filteredAndSortedLevels.map((level) => (
              <div
                key={level.id}
                className="flex items-center justify-between p-4 border border-gray-600 rounded-lg hover:bg-gray-800/50"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <Badge variant="outline">#{level.id}</Badge>
                    <h3 className="font-medium">{level.title}</h3>
                    <div className="flex items-center space-x-2">
                      {level.visible ? (
                        <Eye className="w-4 h-4 text-green-500" />
                      ) : (
                        <EyeOff className="w-4 h-4 text-gray-500" />
                      )}
                      {level.isLocked ? (
                        <Lock className="w-4 h-4 text-yellow-500" />
                      ) : (
                        <Unlock className="w-4 h-4 text-green-500" />
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                    {level.description}
                  </p>
                  <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                    <span>Commands: {level.commands?.length || 0}</span>
                    <span>Slots: {level.constructionSlots?.length || 0}</span>
                    <span>Expected: {level.expectedCommandCnt || 0} commands</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(level)}
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDuplicate(level)}
                  >
                    <Copy className="w-4 h-4 mr-1" />
                    Duplicate
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(level.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Summary */}
        <div className="text-sm text-gray-400 pt-4 border-t border-gray-700">
          Showing {filteredAndSortedLevels.length} of {levels.length} levels
        </div>
      </CardContent>
    </Card>
  );
};

export default LevelsList;
