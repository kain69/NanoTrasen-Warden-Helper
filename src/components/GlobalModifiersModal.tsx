import React from 'react';
import Modal from 'react-modal';
import { GlobalModifiers } from '../types';

interface GlobalModifiersModalProps {
    isOpen: boolean;
    onRequestClose: () => void;
    globalModifiers: GlobalModifiers;
    setGlobalModifiers: React.Dispatch<React.SetStateAction<GlobalModifiers>>;
    handleGlobalModifiersSelection: () => void;
}

const GlobalModifiersModal: React.FC<GlobalModifiersModalProps> = ({
                                                                       isOpen,
                                                                       onRequestClose,
                                                                       globalModifiers,
                                                                       setGlobalModifiers,
                                                                       handleGlobalModifiersSelection,
                                                                   }) => {
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            className="bg-gray-800 p-6 rounded-lg max-w-md mx-auto mt-20 text-white"
            overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
        >
            <h2 className="text-xl font-bold mb-4">Глобальные модификаторы приговора</h2>
            <div className="space-y-2">
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        checked={globalModifiers.deal}
                        onChange={() => setGlobalModifiers((prev) => ({ ...prev, deal: !prev.deal }))}
                        className="mr-2"
                    />
                    <label>Сделка со следствием (уменьшение срока)</label>
                </div>
                {globalModifiers.deal && (
                    <div className="flex items-center mt-2">
                        <label className="mr-2">Уменьшение срока (минуты):</label>
                        <input
                            type="number"
                            min="0"
                            value={globalModifiers.dealReduction}
                            onChange={(e) => {
                                const value = parseInt(e.target.value) || 0;
                                setGlobalModifiers((prev) => ({ ...prev, dealReduction: value }));
                            }}
                            className="p-1 bg-gray-700 rounded w-16"
                        />
                    </div>
                )}
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        checked={globalModifiers.recidivism}
                        onChange={() => setGlobalModifiers((prev) => ({ ...prev, recidivism: !prev.recidivism }))}
                        className="mr-2"
                    />
                    <label>Рецидив (+5 минут за каждый случай)</label>
                </div>
                {globalModifiers.recidivism && (
                    <div className="flex items-center mt-2">
                        <label className="mr-2">Количество случаев рецидива:</label>
                        <input
                            type="number"
                            min="0"
                            value={globalModifiers.recidivismCount}
                            onChange={(e) => {
                                const value = parseInt(e.target.value) || 0;
                                setGlobalModifiers((prev) => ({ ...prev, recidivismCount: value }));
                            }}
                            className="p-1 bg-gray-700 rounded w-16"
                        />
                    </div>
                )}
            </div>
            <button
                onClick={handleGlobalModifiersSelection}
                className="mt-4 mr-2 px-4 py-2 bg-green-600 rounded hover:bg-green-700"
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

export default GlobalModifiersModal;