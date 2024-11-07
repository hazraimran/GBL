import React from 'react';

type InfoAreaProps = {
    title: string;
    description: string;
}

const InfoArea: React.FC<InfoAreaProps> = ({ title, description }) => {
    return (
        <div className="bg-gray-800 p-4 rounded-lg w-full">
            <h1 className="text-2xl font-bold mb-2">{title}</h1>
            <p className="text-sm leading-6">{description}</p>
        </div>
    );
};

export default InfoArea;
