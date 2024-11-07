import React from 'react';
import { CommandType } from '../../types/game';

interface DraggableItemProps {
    idx?: number
    value: CommandType;
}

const Command: React.FC<DraggableItemProps> = ({ 
    idx,
    value,
}) => {
    const [dragging, setDragging] = React.useState(false);

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
        if (idx !== undefined) {
            e.dataTransfer.setData('idx', idx.toString());
        }
        e.dataTransfer.setData('command', value);
        setDragging(true);
    }

    const handleDragEnd = () => {
        setDragging(false);
    }

    return (
        <div
            draggable
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            className={` p-2 bg-lime-400 rounded-md text-white cursor-pointer ${dragging ? 'opacity-50' : ''}`}
        >
            {value}
        </div>
    );
};

export default Command;
