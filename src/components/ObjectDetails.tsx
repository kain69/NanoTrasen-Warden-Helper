import React from 'react';
import { ObjectDetails as ObjectDetailsType } from '../types';
import { positionGroups } from '../data/positions';

interface ObjectDetailsProps {
    objectDetails: ObjectDetailsType;
    setObjectDetails: React.Dispatch<React.SetStateAction<ObjectDetailsType>>;
}

const ObjectDetails: React.FC<ObjectDetailsProps> = ({ objectDetails, setObjectDetails }) => {
    return (
        <div className="mb-4 p-4 bg-gray-800 rounded-lg">
            <h2 className="text-xl font-bold mb-2">Данные объекта</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block mb-1">ФИО объекта:</label>
                    <input
                        type="text"
                        value={objectDetails.fullName}
                        onChange={(e) => setObjectDetails({ ...objectDetails, fullName: e.target.value })}
                        className="w-full p-2 bg-gray-700 rounded"
                        placeholder="Петров Петр"
                    />
                </div>
                <div>
                    <label className="block mb-1">Должность объекта:</label>
                    <select
                        value={objectDetails.position}
                        onChange={(e) => setObjectDetails({ ...objectDetails, position: e.target.value })}
                        className="w-full p-2 bg-gray-700 rounded text-white"
                    >
                        <option value="" disabled>
                            Выберите должность
                        </option>
                        {positionGroups.map((group) => (
                            <optgroup key={group.label} label={group.label}>
                                {group.positions.map((position) => (
                                    <option key={position.value} value={position.label}>
                                        {position.label}
                                    </option>
                                ))}
                            </optgroup>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
};

export default ObjectDetails;