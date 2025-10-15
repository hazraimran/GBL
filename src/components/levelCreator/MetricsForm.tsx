import React from 'react';
import { LevelInfo } from '../../types/level';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Switch } from '../ui/switch';

interface MetricsFormProps {
  levelData: Partial<LevelInfo>;
  onChange: (data: Partial<LevelInfo>) => void;
}

const MetricsForm: React.FC<MetricsFormProps> = ({ levelData, onChange }) => {
  const handleExpectedCommandCntChange = (value: string) => {
    const num = parseInt(value);
    onChange({
      ...levelData,
      expectedCommandCnt: isNaN(num) ? 0 : num
    });
  };

  const handleExpectedExecuteCntChange = (value: string) => {
    const num = parseInt(value);
    onChange({
      ...levelData,
      expectedExecuteCnt: isNaN(num) ? 0 : num
    });
  };

  const handleIsLockedChange = (checked: boolean) => {
    onChange({
      ...levelData,
      isLocked: checked
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Metrics</CardTitle>
        <CardDescription>
          Set expectations for command count, execution count, and level accessibility
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Expected Command Count */}
        <div className="space-y-2">
          <Label htmlFor="expected-command-cnt">Expected Command Count</Label>
          <Input
            id="expected-command-cnt"
            type="number"
            value={levelData.expectedCommandCnt || ''}
            onChange={(e) => handleExpectedCommandCntChange(e.target.value)}
            placeholder="e.g., 4"
            min="1"
          />
          <p className="text-sm text-gray-400">
            The ideal number of commands a player should use to solve this level
          </p>
        </div>

        {/* Expected Execute Count */}
        <div className="space-y-2">
          <Label htmlFor="expected-execute-cnt">Expected Execute Count</Label>
          <Input
            id="expected-execute-cnt"
            type="number"
            value={levelData.expectedExecuteCnt || ''}
            onChange={(e) => handleExpectedExecuteCntChange(e.target.value)}
            placeholder="e.g., 8"
            min="1"
          />
          <p className="text-sm text-gray-400">
            The ideal number of command executions during a successful run
          </p>
        </div>

        {/* Level Lock Status */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Switch
              id="is-locked"
              checked={levelData.isLocked || false}
              onCheckedChange={handleIsLockedChange}
            />
            <Label htmlFor="is-locked">Level is locked</Label>
          </div>
          <p className="text-sm text-gray-400">
            Locked levels require completing previous levels to unlock
          </p>
        </div>

        {/* Guidelines */}
        <div className="p-4 bg-blue-900/20 border border-blue-500 rounded-lg">
          <h4 className="text-sm font-medium text-blue-300 mb-2">Setting Expectations:</h4>
          <ul className="text-xs text-blue-200 space-y-1">
            <li>• <strong>Command Count:</strong> Count each unique command in the solution</li>
            <li>• <strong>Execute Count:</strong> Count how many times commands are executed (including loops)</li>
            <li>• Consider the difficulty curve - early levels should have lower counts</li>
            <li>• These metrics help track player progress and provide feedback</li>
            <li>• Use these as guidelines, not strict requirements</li>
          </ul>
        </div>

        {/* Example Calculation */}
        <div className="p-4 bg-green-900/20 border border-green-500 rounded-lg">
          <h4 className="text-sm font-medium text-green-300 mb-2">Example:</h4>
          <div className="text-xs text-green-200 space-y-1">
            <p><strong>Solution:</strong> INPUT → JUMP → OUTPUT → JUMP</p>
            <p><strong>Command Count:</strong> 4 (INPUT, JUMP, OUTPUT, JUMP)</p>
            <p><strong>Execute Count:</strong> 8 (each command runs twice due to the loop)</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MetricsForm;
