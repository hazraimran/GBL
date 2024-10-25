import React from 'react';

type InfoAreaProps = {
    LevelName: string;
    Description: string;
}

const InfoArea: React.FC<InfoAreaProps> = ({ LevelName, Description }) => {
    return (
        <div className="bg-gray-800 p-4 rounded-lg w-full">
            <h1 className="text-2xl font-bold mb-2">{LevelName}</h1>
            <p className="text-sm leading-6">{Description}</p>
        </div>
    );
};

export default InfoArea;
