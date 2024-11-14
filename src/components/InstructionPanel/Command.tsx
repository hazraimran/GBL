import React, { useEffect } from 'react';
import { CommandWithArgType } from '../../types/game';

interface DraggableItemProps {
    idx?: number
    value: CommandWithArgType;
    shaking: boolean;
}

const Command: React.FC<DraggableItemProps> = ({
    idx,
    value,
    shaking
}) => {
    const [dragging, setDragging] = React.useState(false);
    const [isShaking, setIsShaking] = React.useState(false);

    useEffect(() => {
        console.log('shaking', shaking);
        if (shaking) {
            setIsShaking(true);
        }
    }, [shaking]);

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
        if (idx !== undefined) {
            e.dataTransfer.setData('idx', idx.toString());
        }
        e.dataTransfer.setData('command', value.command);
        e.dataTransfer.setData('args', JSON.stringify(value.args));
        setDragging(true);

        if (isShaking) {
            console.log("drag start, stop shaking")
            setIsShaking(false);
        }
    }

    const handleDragEnd = () => {
        setDragging(false);
    }

    return (
        <div
            draggable
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            className={`px-2 py-1 bg-primary/20 text-black rounded-md ${isShaking && 'animate-wiggle'}
            
            cursor-pointer ${dragging ? 'opacity-50' : ''}`}
        >
            {value.command} {value.args.join(' ')}
        </div>
    );
};

export default Command;
