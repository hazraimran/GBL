import React, { useEffect, useState } from 'react';
import { Stage, Layer, Arrow } from 'react-konva';

interface ConnectLinesProps {
    refA: React.RefObject<HTMLElement>;
    refB: React.RefObject<HTMLElement>;
}

const ConnectLines: React.FC<ConnectLinesProps> = ({ refA, refB }) => {
    const [linePosition, setLinePosition] = useState({ x1: 0, y1: 0, x2: 0, y2: 0 });

    useEffect(() => {
        const updateLinePosition = () => {
            if (refA.current && refB.current) {
                const rectA = refA.current.getBoundingClientRect();
                const rectB = refB.current.getBoundingClientRect();

                setLinePosition({
                    x1: rectA.left + rectA.width / 2,
                    y1: rectA.top + rectA.height / 2,
                    x2: rectB.left + rectB.width / 2,
                    y2: rectB.top + rectB.height / 2,
                });
            }
        };

        // 初始化位置
        updateLinePosition();

        // 监听窗口变化和滚动
        window.addEventListener('resize', updateLinePosition);
        window.addEventListener('scroll', updateLinePosition);

        return () => {
            window.removeEventListener('resize', updateLinePosition);
            window.removeEventListener('scroll', updateLinePosition);
        };
    }, [refA, refB]);

    return (
        <Stage id='foo' width={window.innerWidth} height={window.innerHeight} className="fixed top-0 left-0 pointer-events-none z-[100]">
            <Layer>
                <Arrow
                    points={[linePosition.x1, linePosition.y1, linePosition.x2, linePosition.y2]}
                    pointerLength={10}
                    pointerWidth={10}
                    fill="black"
                    stroke="black"
                    strokeWidth={2}
                />
            </Layer>
        </Stage>
    );
};

export default ConnectLines;
