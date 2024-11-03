import React from 'react';
import { LevelInfo } from '../../types';

type InfoAreaProps = {
    levelInfo: LevelInfo;
}

const InfoArea: React.FC<InfoAreaProps> = ({ levelInfo }) => {
    return (
        <div className="bg-gray-800 p-4 rounded-lg w-full">
            <h1 className="text-2xl font-bold mb-2">{levelInfo?.LevelName}</h1>
            <p className="text-sm leading-6">{levelInfo?.Description}</p>
        </div>
    );
};

export default InfoArea;
