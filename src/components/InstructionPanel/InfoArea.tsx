import React from 'react';
import FloatingMessage from '../FloatingMessage';

type InfoAreaProps = {
    title: string;
    description: string;
    tutorial: boolean;
}

const InfoArea: React.FC<InfoAreaProps> = ({ title, description, tutorial }) => {
    return (
        <div className="px-10 rounded-lg w-full text-black flex justify-center flex-col select-none text-center mt-[2rem]" >
            <h1 className="m-auto text-xl font-bold mb-2 ">{title}</h1>
            {tutorial && <FloatingMessage
                backgroundColor='#7FA147'
                text='Follow these instructions to build your program'
                className='fixed top-2/5 left-0 -translate-x-[2rem] z-[1000] rotate-[-5deg]'
                arrowDirection='right'
                open={false}
            />}
            <div
                style={{ fontWeight: 'bold' }}
                className=" leading-6 space-y-2">
                {description.split('\n').map((line, index) => (
                    <p key={index}>{line}</p>
                ))}
            </div>
        </div>
    );
};

export default InfoArea;
