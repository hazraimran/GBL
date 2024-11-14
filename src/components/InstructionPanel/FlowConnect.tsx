// FlowConnect.tsx
import React, { useEffect, useState } from 'react';
import ReactFlow, {
    Node,
    Edge,
    Position,
} from 'reactflow';
import 'reactflow/dist/style.css';

interface FlowConnectProps {
    startRef: React.RefObject<HTMLButtonElement>;
    endRef: React.RefObject<HTMLButtonElement>;
}

export const FlowConnect: React.FC<FlowConnectProps> = ({ startRef, endRef }) => {
    const [nodes, setNodes] = useState<Node[]>([]);
    const [edges, setEdges] = useState<Edge[]>([]);

    useEffect(() => {
        const updateNodesPosition = () => {
            if (!startRef.current || !endRef.current) return;

            const startRect = startRef.current.getBoundingClientRect();
            const endRect = endRef.current.getBoundingClientRect();
            const flowWrapper = document.querySelector('.react-flow') as HTMLElement;
            if (!flowWrapper) return;
            const flowRect = flowWrapper.getBoundingClientRect();

            // 将节点设置在按钮的右侧
            const startPos = {
                x: startRect.right - flowRect.left,
                y: startRect.top - flowRect.top + startRect.height / 2
            };
            const endPos = {
                x: endRect.right - flowRect.left,
                y: endRect.top - flowRect.top + endRect.height / 2
            };

            // 添加一个中间点，用于控制曲线形状
            const middleX = Math.max(startPos.x, endPos.x) + 50; // 向右突出 50px

            setNodes([
                {
                    id: 'start',
                    position: startPos,
                    type: 'input',
                    data: {},
                    style: { opacity: 0 },
                    sourcePosition: Position.Right
                },
                {
                    id: 'middle',
                    position: { x: middleX, y: (startPos.y + endPos.y) / 2 },
                    type: 'default',
                    data: {},
                    style: { opacity: 0 }
                },
                {
                    id: 'end',
                    position: endPos,
                    type: 'output',
                    data: {},
                    style: { opacity: 0 },
                    targetPosition: Position.Right
                }
            ]);

            // 使用两段线来创建括号形状
            setEdges([
                {
                    id: 'e1-middle',
                    source: 'start',
                    target: 'middle',
                    type: 'smoothstep',
                    style: {
                        stroke: '#FCD34D',
                        strokeWidth: 2,
                        strokeDasharray: 5,
                    },
                    animated: true,
                },
                {
                    id: 'middle-e2',
                    source: 'middle',
                    target: 'end',
                    type: 'smoothstep',
                    style: {
                        stroke: '#FCD34D',
                        strokeWidth: 2,
                        strokeDasharray: 5,
                    },
                    animated: true,
                    markerEnd: {
                        type: 'arrow',
                        color: '#FCD34D'
                    }
                }
            ]);
        };

        updateNodesPosition();
        window.addEventListener('resize', updateNodesPosition);
        const observer = new MutationObserver(updateNodesPosition);
        observer.observe(document.body, {
            attributes: true,
            childList: true,
            subtree: true
        });

        return () => {
            window.removeEventListener('resize', updateNodesPosition);
            observer.disconnect();
        };
    }, [startRef, endRef]);

    return (
        <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 50 }}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                fitView
                nodesDraggable={false}
                nodesConnectable={false}
                elementsSelectable={false}
                zoomOnScroll={false}
                panOnScroll={false}
                preventScrolling={false}
            />
        </div>
    );
};

export default FlowConnect;