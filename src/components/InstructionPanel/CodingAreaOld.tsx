import React, { useState } from 'react';
import classNames from 'classnames';
import { CiEraser } from "react-icons/ci";
import { CommandType } from '../../types/game';

interface CodingAreaProps {
    commands: CommandType[];
}

const INITSTATE = [null, null, null, null, null];

const CodingArea: React.FC<CodingAreaProps> = ({
    commands,
}) => {
    const [codeLines, setCodeLines] = useState<Array<CommandType | null>>(INITSTATE); // Start with 1 empty line
    const [hoverIndex, setHoverIndex] = useState<number | null>(); // For tracking hover effect during drag

    const onDragStart = (event: React.DragEvent, instruction: Instruction) => {
        event.dataTransfer.setData('instruction', instruction as string);
        // event.currentTarget.classList.add('opacity-50', 'scale-105'); // Floating effect
    };

    const onDrag = (event: React.DragEvent) => {

    }

    const onDragEnd = (event: React.DragEvent) => {

    };

    const onDrop = (event: React.DragEvent, lineIndex: number) => {
        const instruction = event.dataTransfer.getData('instruction') as Instruction;
        const newCodeLines = [...codeLines];
        newCodeLines[lineIndex] = instruction;

        // If the dropped line is the last one, add a new line for further instructions
        if (lineIndex === newCodeLines.length - 1) {
            newCodeLines.push(null);
        }

        setCodeLines(newCodeLines);
        setHoverIndex(null); // Remove hover effect after drop
        event.preventDefault();
    };

    const onDragOver = (event: React.DragEvent, lineIndex: number) => {
        event.preventDefault(); // Required to allow dropping
        setHoverIndex(lineIndex); // Set the hover index for visual feedback
    };

    const clearLine = (lineIndex: number) => {
        const newCodeLines = [...codeLines];
        newCodeLines[lineIndex] = null;

        // Remove trailing empty lines (keep at least one empty line)
        while (newCodeLines.length > 1 && newCodeLines[newCodeLines.length - 1] === null) {
            newCodeLines.pop();
        }

        setCodeLines(newCodeLines);
    };

    const undo = () => {
        const newCodeLines = [...codeLines];
        newCodeLines.pop();
        setCodeLines(newCodeLines);
    }

    const clear = () => {
        setCodeLines(INITSTATE);
    }

    return (
        <div>
            <div className="flex flex-col items-start space-y-2 p-4 bg-gray-200 rounded-md w-full">
                {/* Code lines */}
                {codeLines.map((instruction, index) => (
                    <div
                        key={index}
                        className={classNames(
                            'flex items-center space-x-2 p-2 bg-white rounded-md shadow-md border border-gray-300 h-10 w-full transition-all duration-200',
                            { 'border-blue-500 bg-blue-100': hoverIndex === index } // Highlight effect
                        )}
                        onDrop={(e) => onDrop(e, index)}
                        onDragOver={(e) => onDragOver(e, index)}
                        onDragLeave={() => setHoverIndex(null)} // Remove hover effect when drag leaves
                    >
                        {/* Line number */}
                        {instruction && <span className="text-gray-700">{index + 1 < 10 ? `0${index + 1}` : index + 1}</span>}
                        {/* Instruction */}
                        <div className="flex-grow text-gray-800">{instruction || 'Drop Instruction Here'}</div>
                        {/* Clear button for each line */}
                        {instruction && (
                            <button
                                onClick={() => clearLine(index)}
                                className="ml-2 text-red-500 hover:text-red-700 focus:outline-none"
                            >
                                <CiEraser />
                            </button>
                        )}
                    </div>
                ))}

                {/* Draggable instruction buttons */}
                <div className="flex flex-wrap gap-2 mt-4">
                    {commands.map((command, index) => (
                        <div
                            key={index}
                            draggable
                            onDragStart={(e) => onDragStart(e, command)}
                            onDragEnd={onDragEnd}
                            className="cursor-pointer p-2 bg-green-500 text-white rounded shadow-md hover:bg-green-400 transition-transform transform hover:scale-105"
                        >
                            {command}
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex justify-between space-x-2 mt-4">
                <button className="bg-gray-700 p-2 rounded" onClick={undo}>undo</button>
                <button className="bg-gray-700 p-2 rounded" onClick={clear}>clear</button>
            </div>
        </div>
    );
};

export default CodingArea;
