import React, { useState, useEffect, useRef } from 'react';
import { LevelInfo } from '../../types/level';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import { X, Play, RotateCcw, CheckCircle, XCircle } from 'lucide-react';

interface LevelPreviewProps {
  levelData: LevelInfo;
  onClose: () => void;
}

const LevelPreview: React.FC<LevelPreviewProps> = ({ levelData, onClose }) => {
  const [testResults, setTestResults] = useState<{
    input: number[];
    output: number[];
    success: boolean;
    error?: string;
  } | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const runTest = async () => {
    setIsRunning(true);
    setTestResults(null);

    try {
      // Test input generator
      const inputFn = new Function('generatorFn', levelData.generatorFunction);
      const mockGenerator = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
      const inputResult = inputFn(mockGenerator);

      // Test output generator
      const outputFn = new Function('generatorFn', levelData.outputFunction);
      const outputResult = outputFn(mockGenerator);

      if (!Array.isArray(inputResult) || !Array.isArray(outputResult)) {
        throw new Error('Functions must return arrays');
      }

      setTestResults({
        input: inputResult,
        output: outputResult,
        success: true
      });
    } catch (error) {
      setTestResults({
        input: [],
        output: [],
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[10000] p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Level Preview & Test</CardTitle>
            <CardDescription>
              Test your level configuration and see how it will behave
            </CardDescription>
          </div>
          <Button variant="ghost" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Level Info Summary */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-gray-800 rounded-lg">
            <div>
              <h4 className="font-medium text-sm text-gray-300 mb-2">Level Details</h4>
              <div className="space-y-1 text-sm">
                <p><strong>ID:</strong> {levelData.id}</p>
                <p><strong>Title:</strong> {levelData.title}</p>
                <p><strong>Commands:</strong> {levelData.commands?.join(', ') || 'None'}</p>
                <p><strong>Construction Slots:</strong> {levelData.constructionSlots?.length || 0}</p>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-sm text-gray-300 mb-2">Learning Outcomes</h4>
              <div className="space-y-1 text-sm">
                <p><strong>Concept:</strong> {levelData.learningOutcome?.concept || 'Not set'}</p>
                <p><strong>Expected Commands:</strong> {levelData.expectedCommandCnt || 0}</p>
                <p><strong>Expected Executions:</strong> {levelData.expectedExecuteCnt || 0}</p>
                <p><strong>Locked:</strong> {levelData.isLocked ? 'Yes' : 'No'}</p>
              </div>
            </div>
          </div>

          {/* Test Controls */}
          <div className="flex space-x-4">
            <Button
              onClick={runTest}
              disabled={isRunning}
              className="flex-1"
            >
              <Play className="w-4 h-4 mr-2" />
              {isRunning ? 'Testing...' : 'Test Functions'}
            </Button>
            <Button
              variant="outline"
              onClick={() => setTestResults(null)}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Clear Results
            </Button>
          </div>

          {/* Test Results */}
          {testResults && (
            <div className="space-y-4">
              {testResults.success ? (
                <Alert className="border-green-500 bg-green-900/20">
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Test Successful!</strong> Both functions executed without errors.
                  </AlertDescription>
                </Alert>
              ) : (
                <Alert className="border-red-500 bg-red-900/20">
                  <XCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Test Failed:</strong> {testResults.error}
                  </AlertDescription>
                </Alert>
              )}

              {testResults.success && (
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Generated Input</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="font-mono text-sm">
                        [{testResults.input.join(', ')}]
                      </div>
                      <p className="text-xs text-gray-400 mt-2">
                        Length: {testResults.input.length}
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Expected Output</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="font-mono text-sm">
                        [{testResults.output.join(', ')}]
                      </div>
                      <p className="text-xs text-gray-400 mt-2">
                        Length: {testResults.output.length}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          )}

          {/* Function Code Preview */}
          <div className="space-y-4">
            <h4 className="font-medium">Function Code</h4>
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Input Generator</CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="text-xs bg-gray-900 p-3 rounded overflow-x-auto">
                    {levelData.generatorFunction || 'No function defined'}
                  </pre>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Output Function</CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="text-xs bg-gray-900 p-3 rounded overflow-x-auto">
                    {levelData.outputFunction || 'No function defined'}
                  </pre>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Instructions Preview */}
          {(levelData.openningInstruction && levelData.openningInstruction.length > 0) && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Opening Instructions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {levelData.openningInstruction.map((instruction, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-xs text-white flex-shrink-0 mt-0.5">
                        {index + 1}
                      </div>
                      <p className="text-sm">{instruction}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Hints Preview */}
          {(levelData.hints && levelData.hints.length > 0) && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Hints</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {levelData.hints.map((hint, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <div className="w-6 h-6 bg-yellow-600 rounded-full flex items-center justify-center text-xs text-white flex-shrink-0 mt-0.5">
                        ?
                      </div>
                      <p className="text-sm">{hint}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LevelPreview;
