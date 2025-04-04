
import React, { useContext, useEffect, useRef, useCallback, useState } from 'react';
import GameContext from '../../context/GameContext';
import InfoArea from './InfoArea';
import CodingArea from './CodingArea';
import CommandList from './CommandList';
import Divider from './Divider';

const InstructionPanel: React.FC = () => {
    const { levelInfo, setCommandsUsed, resetFn, showInstructionPanel, showFirstTimePickPrompt } = useContext(GameContext);
    const CommandListRef = useRef<HTMLDivElement>(null);
    const CodingAreaRef = useRef<(HTMLDivElement)>(null);
    const ContentRef = useRef<(HTMLDivElement)>(null);
    const clearCommandsRef = useRef<() => void>();
    const [codingAreaHeight, setCodingAreaHeight] = useState<number>(0);
    const [currentFrame, setCurrentFrame] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isReverseRotation, setIsReverseRotation] = useState(true);
    const [fps, setFps] = useState(6); // 4 frames per second

    const frames = [
        "./animation/menu_rotate_1.webp",
        "./animation/menu_rotate_2.webp",
        "./animation/menu_rotate_3.webp",
        "./animation/menu_rotate_4.webp",
        "./animation/menu_rotate_5.webp",
        "./animation/menu_rotate_6.webp",
        "./animation/menu_rotate_7.webp",
        "./animation/menu_rotate_8.webp",
        "./animation/menu_rotate_9.webp",
        "./animation/menu_rotate_10.webp",
        "./animation/menu_rotate_11.webp",
        "./animation/menu_rotate_12.webp",
    ];

    const nextFrame = useCallback(() => {
        if (isReverseRotation) {
            setCurrentFrame(prev => (prev - 1 + frames.length) % frames.length);
        } else {
            setCurrentFrame(prev => (prev + 1) % frames.length);
        }

    }, [frames.length, isReverseRotation]);

    useEffect(() => {
        let intervalId: NodeJS.Timeout;
        if (isPlaying) {
            intervalId = setInterval(nextFrame, 1000 / fps);
        }
        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [isPlaying, fps, nextFrame]);

    useEffect(() => {
        setCommandsUsed(levelInfo.commandsUsed);
    }, []);

    useEffect(() => {
        const element = CodingAreaRef.current;

        if (!element) return;

        // 初始化高度
        setCodingAreaHeight(element.offsetHeight);

        // 使用 ResizeObserver 监听高度变化
        const resizeObserver = new ResizeObserver((entries) => {
            for (let entry of entries) {
                if (entry.contentRect.height > codingAreaHeight) {
                    setIsReverseRotation(true);
                } else {
                    setIsReverseRotation(false);
                }

                setIsPlaying(true);

                setTimeout(() => {
                    setIsPlaying(false);
                }, 1000);

                setCodingAreaHeight(entry.contentRect.height); // 更新高度
            }
        });

        resizeObserver.observe(element);

        // 清理观察器
        return () => {
            resizeObserver.disconnect();
        };
    }, []);

    const setClearCommandsRef = (fn: () => void) => {
        clearCommandsRef.current = fn;
    }

    const instructionPanelRef = useRef<HTMLDivElement>(null);
    const [translateY, settranslateY] = useState(60);

    const handleWheel = (event: React.WheelEvent) => {
        // event.preventDefault();
        event.stopPropagation();

        if (instructionPanelRef.current && instructionPanelRef.current.clientHeight > window.innerHeight * 1 / 2) {
            settranslateY(prevtranslateY => prevtranslateY + event.deltaY / 10);
        }
    };

    const [asideHeight, setAsideHeight] = useState(0);

    const remToPx = useCallback((rem: number) => {
        // 获取根元素的 font-size（默认通常是 16px）
        const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
        return rem * rootFontSize;  // 将 rem 乘以 root font-size
    }, []);

    useEffect(() => {
        const element = CodingAreaRef.current;

        if (!element) return;

        const height = ContentRef.current?.offsetHeight + CodingAreaRef.current?.offsetHeight

        setAsideHeight(height + remToPx(10));

    }, [ContentRef.current?.offsetHeight, CodingAreaRef.current?.offsetHeight]);

    return levelInfo && showInstructionPanel && (
        <aside
            className="w-[35rem] flex flex-col items-center transition-height duration-1000 ease-in-out overflow-hidden
              absolute top-1/2 z-10 pt-[5rem] pb-[5rem] px-[5rem] -right-[2rem]"
            ref={instructionPanelRef}
            onWheel={handleWheel}

            style={{
                transform: `translateY(-${translateY}%)`,
                height: `calc(${asideHeight}px)`,
            }}
        >

            {/* 上面的卷轴头 */}
            <img src={frames[11 - currentFrame]} alt="" className='absolute top-0 -translate-y-[5rem] select-none' />

            <div ref={ContentRef} className='flex flex-col items-center'
                onWheel={handleWheel}
            >

                <div className='absolute flex flex-col items-center overflow-hidden w-full transition-all'
                    style={{
                        height: `calc(100% - ${remToPx(8)}px)`
                    }}>

                    {/* 卷轴背景 */}
                    <div
                        className='bg-cover bg-center bg-no-repeat overflow-hidden w-[25rem]  z-[-1] '
                        style={{
                            height: `calc(100% + 4rem)`,
                            backgroundImage: `url('/scroll_menu.webp')`,
                        }}
                    ></div>
                </div>

                <InfoArea title={levelInfo.title} description={levelInfo.description} />
                {showFirstTimePickPrompt && <img src='/arrow.webp' className='absolute w-[3rem] top-[24rem] left-[10rem] rotate-[35deg] animate-arrowWiggle z-[100]' />}

                <Divider />

                <CommandList ref={CommandListRef} />
            </div>
            <CodingArea ref={CodingAreaRef} setClearCommandsRef={setClearCommandsRef} marginTop={ContentRef.current?.offsetHeight} />

            {/* 下面的卷轴头 */}
            <img
                src={frames[currentFrame]}
                alt=""
                className="select-none absolute duration-1000 ease-in-out"
                style={{
                    top: `calc(${asideHeight - remToPx(11)}px)`,
                }}
            />
        </aside>

    );
}

export default InstructionPanel;