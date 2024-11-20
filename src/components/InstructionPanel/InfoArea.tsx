import React from 'react';

type InfoAreaProps = {
    title: string;
    description: string;
}

const InfoArea: React.FC<InfoAreaProps> = ({ title, description }) => {
    return (
        <div className="px-10 rounded-lg w-full text-black mt-14 flex justify-center flex-col">
            <h1 className="m-auto text-xl font-bold mb-2 ">{title}</h1>
            <p
                style={{ fontWeight: 'bold' }}
                className="text-sm leading-6 text-center">{description}</p>
        </div>
    );
};

export default InfoArea;
