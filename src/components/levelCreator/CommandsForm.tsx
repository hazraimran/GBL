import React from 'react';
import { LevelInfo, CommandType } from '../../types/level';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Checkbox } from '../ui/checkbox';
import { Plus, Trash2 } from 'lucide-react';

interface CommandsFormProps {
  levelData: Partial<LevelInfo>;
  onChange: (data: Partial<LevelInfo>) => void;
}

const AVAILABLE_COMMANDS: CommandType[] = [
  'INPUT',
  'OUTPUT',
  'COPYFROM',
  'COPYTO',
  'ADD',
  'SUB',
  'JUMP',
  'JUMP = 0',
  'JUMP < 0'
];

const CommandsForm: React.FC<CommandsFormProps> = ({ levelData, onChange }) => {
  const handleCommandToggle = (command: CommandType, checked: boolean) => {
    const currentCommands = levelData.commands || [];
    let newCommands: CommandType[];
    
    if (checked) {
      newCommands = [...currentCommands, command];
    } else {
      newCommands = currentCommands.filter(cmd => cmd !== command);
    }
    
    onChange({ ...levelData, commands: newCommands });
  };

  const handleAddConstructionSlot = () => {
    const currentSlots = levelData.constructionSlots || [];
    const newSlot = {
      x: 300,
      y: 300 + (currentSlots.length * 60)
    };
    
    onChange({
      ...levelData,
      constructionSlots: [...currentSlots, newSlot]
    });
  };

  const handleUpdateSlot = (index: number, field: 'x' | 'y', value: number) => {
    const currentSlots = levelData.constructionSlots || [];
    const updatedSlots = currentSlots.map((slot, i) => 
      i === index ? { ...slot, [field]: value } : slot
    );
    
    onChange({
      ...levelData,
      constructionSlots: updatedSlots
    });
  };

  const handleRemoveSlot = (index: number) => {
    const currentSlots = levelData.constructionSlots || [];
    const updatedSlots = currentSlots.filter((_, i) => i !== index);
    
    onChange({
      ...levelData,
      constructionSlots: updatedSlots
    });
  };

  return (
    <div className="space-y-6">
      {/* Available Commands */}
      <Card>
        <CardHeader>
          <CardTitle>Available Commands</CardTitle>
          <CardDescription>
            Select which commands players can use in this level
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            {AVAILABLE_COMMANDS.map((command) => (
              <div key={command} className="flex items-center space-x-2">
                <Checkbox
                  id={command}
                  checked={levelData.commands?.includes(command) || false}
                  onCheckedChange={(checked) => handleCommandToggle(command, checked as boolean)}
                />
                <Label htmlFor={command} className="text-sm font-medium">
                  {command}
                </Label>
              </div>
            ))}
          </div>
          {levelData.commands && levelData.commands.length === 0 && (
            <p className="text-sm text-yellow-500 mt-2">
              ⚠️ At least one command must be selected
            </p>
          )}
        </CardContent>
      </Card>

      {/* Construction Slots */}
      <Card>
        <CardHeader>
          <CardTitle>Construction Slots</CardTitle>
          <CardDescription>
            Define positions where players can place commands on the construction floor
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {(levelData.constructionSlots || []).map((slot, index) => (
              <div key={index} className="flex items-center space-x-4 p-4 border border-gray-600 rounded-lg">
                <div className="flex-1">
                  <Label className="text-sm font-medium">Slot {index + 1}</Label>
                  <div className="flex space-x-2 mt-1">
                    <div>
                      <Label htmlFor={`slot-${index}-x`} className="text-xs">X</Label>
                      <Input
                        id={`slot-${index}-x`}
                        type="number"
                        value={slot.x}
                        onChange={(e) => handleUpdateSlot(index, 'x', parseInt(e.target.value) || 0)}
                        className="w-20"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`slot-${index}-y`} className="text-xs">Y</Label>
                      <Input
                        id={`slot-${index}-y`}
                        type="number"
                        value={slot.y}
                        onChange={(e) => handleUpdateSlot(index, 'y', parseInt(e.target.value) || 0)}
                        className="w-20"
                      />
                    </div>
                  </div>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleRemoveSlot(index)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
            
            <Button
              onClick={handleAddConstructionSlot}
              variant="outline"
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Construction Slot
            </Button>
          </div>
          
          <div className="mt-4 p-3 bg-blue-900/20 border border-blue-500 rounded-lg">
            <h4 className="text-sm font-medium text-blue-300 mb-2">Coordinate Guidelines:</h4>
            <ul className="text-xs text-blue-200 space-y-1">
              <li>• X: 200-800 (left to right)</li>
              <li>• Y: 200-500 (top to bottom)</li>
              <li>• Recommended spacing: 60px between slots</li>
              <li>• Avoid overlapping slots</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CommandsForm;
