import React from 'react';
import Modal from 'react-modal';
import { modifierOptions, offenses } from '../data/offenses';
import { OffenseWithModifiers } from '../types';

interface ModifiersModalProps {
    isOpen: boolean;
    onRequestClose: () => void;
    currentOffenseCode: string | null;
    selectedOffenses: OffenseWithModifiers[];
    setSelectedOffenses: React.Dispatch<React.SetStateAction<OffenseWithModifiers[]>>;
    handleModifiersSelection: () => void;
}

const ModifiersModal: React.FC<ModifiersModalProps> = ({
                                                           isOpen,
                                                           onRequestClose,
                                                           currentOffenseCode,
                                                           selectedOffenses,
                                                           setSelectedOffenses,
                                                           handleModifiersSelection,
                                                       }) => {
    const getOffenseTitle = (code: string | null): string => {
        const offense = offenses.find((o) => o.code === code);
        return offense ? offense.title : '';
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            className="bg-gray-800 p-6 rounded-lg max-w-md mx-auto mt-20 text-white"
            overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
        >
            <h2 className="text-xl font-bold mb-4">
                Модификаторы для статьи {currentOffenseCode} - {getOffenseTitle(currentOffenseCode)}
            </h2>
            <div className="space-y-2">
                {modifierOptions.map((modifier) => (
                    <div key={modifier.name} className="flex items-center">
                        <input
                            type="checkbox"
                            checked={
                                selectedOffenses
                                    .find((o) => o.code === currentOffenseCode)
                                    ?.modifiers.includes(modifier.name) || false
                            }
                            onChange={() => {
                                setSelectedOffenses((prev) =>
                                    prev.map((o) =>
                                        o.code === currentOffenseCode
                                            ? {
                                                ...o,
                                                modifiers: o.modifiers.includes(modifier.name)
                                                    ? o.modifiers.filter((m) => m !== modifier.name)
                                                    : [...o.modifiers, modifier.name],
                                            }
                                            : o
                                    )
                                );
                            }}
                            className="mr-2"
                        />
                        <label>{`${modifier.name} (${modifier.description})`}</label>
                    </div>
                ))}
            </div>
            <button
                onClick={handleModifiersSelection}
                className="mt-4 px-4 py-2 bg-green-600 rounded hover:bg-green-700"
            >
                Подтвердить
            </button>
            <button
                onClick={onRequestClose}
                className="mt-2 px-4 py-2 bg-red-600 rounded hover:bg-red-700"
            >
                Закрыть
            </button>
        </Modal>
    );
};

export default ModifiersModal;