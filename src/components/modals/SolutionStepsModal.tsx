import React from 'react';
import { CommandWithArgType } from '../../types/game';
import { SolutionStep } from '../../types/level';
import CircularJSON from 'circular-json';
import { X } from 'lucide-react';

export interface SolutionStepDisplay {
    line: string;
    message?: string;
}

interface SolutionStepsModalProps {
    solution: SolutionStep[] | CommandWithArgType[] | string | null | undefined;
    onClose: () => void;
}

/**
 * Converts solution (array or CircularJSON string) into a list of display steps.
 * Resolves JUMP targets to step numbers. Preserves optional message per step.
 */
function getSolutionSteps(solution: SolutionStep[] | CommandWithArgType[] | string | null | undefined): SolutionStepDisplay[] {
    if (!solution) return [];
    let arr: (SolutionStep | CommandWithArgType)[];
    if (typeof solution === 'string') {
        try {
            arr = CircularJSON.parse(solution) as (SolutionStep | CommandWithArgType)[];
        } catch {
            return [{ line: 'Invalid solution format' }];
        }
    } else if (Array.isArray(solution)) {
        arr = solution;
    } else {
        return [];
    }

    const steps: SolutionStepDisplay[] = [];
    for (let i = 0; i < arr.length; i++) {
        const cmd = arr[i];
        if (!cmd || typeof cmd !== 'object') continue;

        const command = (cmd as CommandWithArgType).command;
        const arg = (cmd as CommandWithArgType).arg;
        const solutionStep = cmd as SolutionStep;
        const message = solutionStep.message;
        const from = solutionStep.from;
        const step = solutionStep.step;

        let line: string;
        if (command === '') {
            line = '(label)';
        } else if (command === 'JUMP' || command === 'JUMP = 0' || command === 'JUMP < 0') {
            let target: string | null = null;
            if (typeof step === 'number') {
                target = String(step);
            } else if (typeof arg === 'number') {
                target = String(arg + 1);
            } else if (arg && typeof arg === 'object' && 'command' in arg) {
                const idx = arr.indexOf(arg as CommandWithArgType);
                if (idx >= 0) target = String(idx + 1);
            }
            line = target != null ? `${command} → step ${target}` : command;
        } else if (command === 'COPYFROM' || command === 'COPYTO' || command === 'ADD' || command === 'SUB') {
            const slot = typeof from === 'number' ? from : (typeof arg === 'number' ? arg + 1 : null);
            line = slot != null ? `${command} ${slot}` : command;
        } else {
            line = command;
        }
        steps.push(message != null && message !== '' ? { line, message } : { line });
    }
    return steps;
}

const SolutionStepsModal: React.FC<SolutionStepsModalProps> = ({ solution, onClose }) => {
    const steps = getSolutionSteps(solution);

    if (steps.length === 0) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[60] p-4 backdrop-blur-sm">
            <div className="bg-[#f4d03f] rounded-xl shadow-xl max-w-lg w-full border-4 border-[#8B4513] max-h-[80vh] flex flex-col">
                <div className="bg-amber-200 p-4 border-b-2 border-amber-700 flex items-center justify-between">
                    <h2 className="text-xl text-amber-800 font-bold">Solution Steps</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-amber-300 rounded-full transition-colors"
                        aria-label="Close"
                    >
                        <X className="w-5 h-5 text-amber-800" />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto flex-1">
                    <p className="text-amber-900 mb-4 text-center text-sm">
                        Follow these steps in order. Do not insert them into the command area.
                    </p>
                    <ol className="space-y-3 list-decimal list-inside text-amber-900 font-mono text-base">
                        {steps.map((step, i) => (
                            <li key={i} className="py-1 border-b border-amber-200 last:border-0">
                                {step.line}
                                {step.message != null && step.message !== '' && (
                                    <p className="text-amber-800 text-xs font-sans font-normal mt-1 ml-0 pl-5">
                                        {step.message}
                                    </p>
                                )}
                            </li>
                        ))}
                    </ol>
                </div>

                <div className="p-4 border-t border-amber-700">
                    <button
                        onClick={onClose}
                        className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-semibold transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SolutionStepsModal;
