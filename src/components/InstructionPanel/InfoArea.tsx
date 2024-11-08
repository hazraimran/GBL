import React from 'react';

type InfoAreaProps = {
    title: string;
    description: string;
}

const InfoArea: React.FC<InfoAreaProps> = ({ title, description }) => {
    return (
        <div className="p-4 rounded-lg w-full text-black mt-14 flex justify-center">
            <h1 className="text-2xl font-bold mb-2 ">{title}</h1>
            <p
                style={{ fontWeight: 'bold' }}
                className="text-xl leading-6">{description}</p>
        </div>
    );
};

export default InfoArea;
