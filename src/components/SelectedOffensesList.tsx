import React from 'react';
import { offenses } from '../data/offenses';
import { OffenseWithModifiers } from '../types';

interface SelectedOffensesListProps {
    selectedOffenses: OffenseWithModifiers[];
    toggleOffense: (code: string) => void;
    openModifiersModal: (code: string) => void;
}

const SelectedOffensesList: React.FC<SelectedOffensesListProps> = ({
                                                                       selectedOffenses,
                                                                       toggleOffense,
                                                                   }) => {
    return (
        <div className="mt-4 p-4 bg-gray-800 rounded-lg">
            <h2 className="text-xl font-bold mb-2">Выбранные статьи</h2>
            {selectedOffenses.length > 0 ? (
                <ul className="list-disc pl-5">
                    {selectedOffenses.map((offenseWithMods) => {
                        const offense = offenses.find((o) => o.code === offenseWithMods.code);
                        return (
                            <li key={offenseWithMods.code} className="mb-1">
                                {offense?.code} - {offense?.title}
                                <button
                                    onClick={() => toggleOffense(offenseWithMods.code)}
                                    className="ml-2 px-2 py-1 bg-red-600 rounded hover:bg-red-700"
                                >
                                    Удалить
                                </button>
                            </li>
                        );
                    })}
                </ul>
            ) : (
                <p>Статьи не выбраны.</p>
            )}
        </div>
    );
};

export default SelectedOffensesList;