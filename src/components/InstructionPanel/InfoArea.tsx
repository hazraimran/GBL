import React from 'react';

type InfoAreaProps = {
    title: string;
    description: string;
    tutorial: boolean;
}

const InfoArea: React.FC<InfoAreaProps> = ({ title, description, tutorial }) => {
    return (
        <div className="px-10 rounded-lg w-full text-black flex justify-center flex-col select-none text-center mt-[2rem]" >
            <h1 className="m-auto text-xl font-bold mb-2 ">{title}</h1>
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
