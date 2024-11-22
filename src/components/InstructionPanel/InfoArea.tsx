import React from 'react';

type InfoAreaProps = {
    title: string;
    description: string;
}

const InfoArea: React.FC<InfoAreaProps> = ({ title, description }) => {
    return (
        <div className="px-14 rounded-lg w-full text-black mt-14 flex justify-center flex-col select-none">
            <h1 className="m-auto text-xl font-bold mb-2 ">{title}</h1>
            <div
                style={{ fontWeight: 'bold' }}
                className="text-sm leading-6 text-start space-y-2">
                {description.split('\n').map((line, index) => (
                    <p key={index}>{line}</p>
                ))}
            </div>
        </div>
    );
};

export default InfoArea;
