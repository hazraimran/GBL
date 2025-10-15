import React, { useState, useEffect } from 'react';
import { LevelInfo } from '../../types/level';
import { LevelCreatorService } from '../../services/firestore/levelCreatorService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Switch } from '../ui/switch';
import { Alert, AlertDescription } from '../ui/alert';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

interface BasicInfoFormProps {
  levelData: Partial<LevelInfo>;
  onChange: (data: Partial<LevelInfo>) => void;
}

const BasicInfoForm: React.FC<BasicInfoFormProps> = ({ levelData, onChange }) => {
  const [isCheckingId, setIsCheckingId] = useState(false);
  const [idStatus, setIdStatus] = useState<'valid' | 'invalid' | 'checking' | null>(null);

  const handleIdChange = async (value: string) => {
    const id = parseInt(value);
    if (isNaN(id) || id <= 0) {
      setIdStatus('invalid');
      return;
    }

    setIsCheckingId(true);
    setIdStatus('checking');

    try {
      const isUnique = await LevelCreatorService.isLevelIdUnique(id, levelData.id);
      setIdStatus(isUnique ? 'valid' : 'invalid');
    } catch (error) {
      console.error('Error checking ID uniqueness:', error);
      setIdStatus('invalid');
    } finally {
      setIsCheckingId(false);
    }

    onChange({ ...levelData, id });
  };

  const handleTitleChange = (value: string) => {
    onChange({ ...levelData, title: value });
  };

  const handleDescriptionChange = (value: string) => {
    onChange({ ...levelData, description: value });
  };

  const handleVisibilityChange = (checked: boolean) => {
    onChange({ ...levelData, visible: checked });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Basic Information</CardTitle>
        <CardDescription>
          Set the basic properties for your level
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Level ID */}
        <div className="space-y-2">
          <Label htmlFor="level-id">Level ID</Label>
          <div className="relative">
            <Input
              id="level-id"
              type="number"
              value={levelData.id || ''}
              onChange={(e) => handleIdChange(e.target.value)}
              className="pr-10"
              placeholder="Enter level ID"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              {isCheckingId && <Loader2 className="w-4 h-4 animate-spin text-gray-400" />}
              {!isCheckingId && idStatus === 'valid' && <CheckCircle className="w-4 h-4 text-green-500" />}
              {!isCheckingId && idStatus === 'invalid' && <XCircle className="w-4 h-4 text-red-500" />}
            </div>
          </div>
          {idStatus === 'invalid' && (
            <Alert className="border-red-300 bg-red-50">
              <AlertDescription className="text-red-700">
                This level ID is already in use. Please choose a different ID.
              </AlertDescription>
            </Alert>
          )}
        </div>

        {/* Title */}
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={levelData.title || ''}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Enter level title"
            className="text-lg"
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={levelData.description || ''}
            onChange={(e) => handleDescriptionChange(e.target.value)}
            placeholder="Describe what the player needs to do in this level"
            rows={4}
            className="resize-none"
          />
          <div className="text-sm text-gray-400">
            {levelData.description?.length || 0} characters
          </div>
        </div>

        {/* Visibility */}
        <div className="flex items-center space-x-2">
          <Switch
            id="visibility"
            checked={levelData.visible || false}
            onCheckedChange={handleVisibilityChange}
          />
          <Label htmlFor="visibility">Visible to players</Label>
        </div>
        <p className="text-sm text-gray-400">
          Uncheck this to hide the level from the level selection screen
        </p>
      </CardContent>
    </Card>
  );
};

export default BasicInfoForm;
