import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';

interface Instruction {
    id: string;
    content: string;
}

const InstructionList: React.FC = () => {
    const [instructions, setInstructions] = useState<Instruction[]>([
        { id: '1', content: 'inbox' },
        { id: '2', content: 'outbox' },
        { id: '3', content: 'copyfrom' },
        { id: '4', content: 'copyto' },
        { id: '5', content: 'add' },
        { id: '6', content: 'sub' },
        { id: '7', content: 'jump' },
        { id: '8', content: 'jumpifzero' }
    ]);

    const onDragEnd = (result: DropResult) => {
        const { destination, source } = result;

        // Dropped outside the list
        if (!destination) {
            return;
        }

        // Reorder the list
        const reorderedInstructions = Array.from(instructions);
        const [removed] = reorderedInstructions.splice(source.index, 1);
        reorderedInstructions.splice(destination.index, 0, removed);

        setInstructions(reorderedInstructions);
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="instructions">
                {(provided: any) => (
                    <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="p-4 bg-gray-100 rounded-lg"
                    >
                        {instructions.map((instruction, index) => (
                            <Draggable key={instruction.id} draggableId={instruction.id} index={index}>
                                {(provided: any) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        className="instruction mb-2 p-4 bg-white shadow rounded-lg flex justify-between items-center hover:bg-gray-200 transition duration-200"
                                    >
                                        {instruction.content}
                                    </div>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    );
};

export default InstructionList;
