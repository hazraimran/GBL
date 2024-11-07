import React, { useRef, useEffect, useState } from 'react';

interface SlotProps {
    onDrop: (id: string) => void;
}

const Slot: React.FC<SlotProps> = ({  }) => {
    const [isDraggedOver, setIsDraggedOver] = useState(false);


    return (
        <div
            className={`p-2 bg-gray-200 rounded-lg border-2 border-dashed ${isDraggedOver ? 'bg-gray-300' : 'border-gray-400'}`}
        >
            Drop Zone
        </div>
    );
};

export default Slot;
