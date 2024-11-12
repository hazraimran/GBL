import React from 'react';
import { CommandWithArgType } from '../../types/game';

interface DraggableItemProps {
    idx?: number
    value: CommandWithArgType;
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
        e.dataTransfer.setData('command', value.command);
        e.dataTransfer.setData('args', JSON.stringify(value.args));
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
            {value.command} {value.args.join(' ')}
        </div>
    );
};

export default Command;
