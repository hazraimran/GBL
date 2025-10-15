import React, { useState } from 'react';
import { LevelInfo } from '../../types/level';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { Alert, AlertDescription } from '../ui/alert';
import { Play, CheckCircle, XCircle, Copy } from 'lucide-react';

interface GeneratorFormProps {
  levelData: Partial<LevelInfo>;
  onChange: (data: Partial<LevelInfo>) => void;
}

const GeneratorForm: React.FC<GeneratorFormProps> = ({ levelData, onChange }) => {
  const [testResults, setTestResults] = useState<{
    input: { success: boolean; result?: number[]; error?: string };
    output: { success: boolean; result?: number[]; error?: string };
  } | null>(null);

  const handleInputFunctionChange = (value: string) => {
    onChange({ ...levelData, generatorFunction: value });
  };

  const handleOutputFunctionChange = (value: string) => {
    onChange({ ...levelData, outputFunction: value });
  };

  const testFunction = (code: string, type: 'input' | 'output') => {
    try {
      const fn = new Function('generatorFn', code);
      const mockGenerator = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
      const result = fn(mockGenerator);
      
      if (!Array.isArray(result)) {
        throw new Error('Function must return an array');
      }
      
      return { success: true, result };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  };

  const handleTestFunctions = () => {
    const inputResult = testFunction(levelData.generatorFunction || '', 'input');
    const outputResult = testFunction(levelData.outputFunction || '', 'output');
    
    setTestResults({
      input: inputResult,
      output: outputResult
    });
  };

  const copyTemplate = (type: 'input' | 'output') => {
    const templates = {
      input: `const inputFn = (generatorFn) => {
  const len = 6;
  const arr = [];
  for (let i = 0; i < len; i++) {
    arr.push(generatorFn(1, 20));
  }
  return arr;
};`,
      output: `const outputFn = (generatorFn) => {
  const len = 6;
  const arr = [];
  for (let i = 0; i < len; i++) {
    arr.push(generatorFn(1, 20));
  }
  return arr;
};`
    };
    
    if (type === 'input') {
      handleInputFunctionChange(templates.input);
    } else {
      handleOutputFunctionChange(templates.output);
    }
  };

  return (
    <div className="space-y-6">
      {/* Input Generator Function */}
      <Card>
        <CardHeader>
          <CardTitle>Input Generator Function</CardTitle>
          <CardDescription>
            This function generates the input values that will appear in the INBOX
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <Label htmlFor="input-function">JavaScript Function</Label>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyTemplate('input')}
              >
                <Copy className="w-4 h-4 mr-1" />
                Use Template
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleTestFunctions}
              >
                <Play className="w-4 h-4 mr-1" />
                Test
              </Button>
            </div>
          </div>
          
          <Textarea
            id="input-function"
            value={levelData.generatorFunction || ''}
            onChange={(e) => handleInputFunctionChange(e.target.value)}
            placeholder="Enter your input generator function here..."
            rows={8}
            className="font-mono text-sm"
          />
          
          <div className="text-xs text-gray-400">
            <p><strong>Function signature:</strong> (generatorFn: (min: number, max: number) =&gt; number) =&gt; number[]</p>
            <p><strong>Parameters:</strong> generatorFn - a function that returns random integers between min and max (inclusive)</p>
            <p><strong>Returns:</strong> An array of numbers that will be placed in the INBOX</p>
          </div>
        </CardContent>
      </Card>

      {/* Output Function */}
      <Card>
        <CardHeader>
          <CardTitle>Output Function</CardTitle>
          <CardDescription>
            This function calculates the expected output values for validation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <Label htmlFor="output-function">JavaScript Function</Label>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyTemplate('output')}
              >
                <Copy className="w-4 h-4 mr-1" />
                Use Template
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleTestFunctions}
              >
                <Play className="w-4 h-4 mr-1" />
                Test
              </Button>
            </div>
          </div>
          
          <Textarea
            id="output-function"
            value={levelData.outputFunction || ''}
            onChange={(e) => handleOutputFunctionChange(e.target.value)}
            placeholder="Enter your output function here..."
            rows={8}
            className="font-mono text-sm"
          />
          
          <div className="text-xs text-gray-400">
            <p><strong>Function signature:</strong> (generatorFn: (min: number, max: number) =&gt; number) =&gt; number[]</p>
            <p><strong>Parameters:</strong> generatorFn - a function that returns random integers between min and max (inclusive)</p>
            <p><strong>Returns:</strong> An array of numbers that represents the expected output</p>
          </div>
        </CardContent>
      </Card>

      {/* Test Results */}
      {testResults && (
        <Card>
          <CardHeader>
            <CardTitle>Test Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Input Function Test */}
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <h4 className="font-medium">Input Function</h4>
                {testResults.input.success ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-500" />
                )}
              </div>
              {testResults.input.success ? (
                <div className="p-3 bg-green-900/20 border border-green-500 rounded">
                  <p className="text-sm text-green-300 mb-2">✅ Function executed successfully</p>
                  <p className="text-xs text-green-200">
                    <strong>Result:</strong> [{testResults.input.result?.join(', ')}]
                  </p>
                </div>
              ) : (
                <Alert className="border-red-500 bg-red-900/20">
                  <XCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Error:</strong> {testResults.input.error}
                  </AlertDescription>
                </Alert>
              )}
            </div>

            {/* Output Function Test */}
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <h4 className="font-medium">Output Function</h4>
                {testResults.output.success ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-500" />
                )}
              </div>
              {testResults.output.success ? (
                <div className="p-3 bg-green-900/20 border border-green-500 rounded">
                  <p className="text-sm text-green-300 mb-2">✅ Function executed successfully</p>
                  <p className="text-xs text-green-200">
                    <strong>Result:</strong> [{testResults.output.result?.join(', ')}]
                  </p>
                </div>
              ) : (
                <Alert className="border-red-500 bg-red-900/20">
                  <XCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Error:</strong> {testResults.output.error}
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GeneratorForm;
