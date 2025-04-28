import React from 'react';
import Modal from 'react-modal';
import { GlobalModifiers, OffenseWithModifiers } from '../types';

interface GlobalModifiersModalProps {
    isOpen: boolean;
    onRequestClose: () => void;
    globalModifiers: GlobalModifiers;
    setGlobalModifiers: React.Dispatch<React.SetStateAction<GlobalModifiers>>;
    handleGlobalModifiersSelection: () => void;
    selectedOffenses: OffenseWithModifiers[];
    setCurrentOffenseCode: React.Dispatch<React.SetStateAction<string | null>>;
    setIsModifiersModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setIsGlobalModifiersModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const GlobalModifiersModal: React.FC<GlobalModifiersModalProps> = ({
                                                                       isOpen,
                                                                       onRequestClose,
                                                                       globalModifiers,
                                                                       setGlobalModifiers,
                                                                       handleGlobalModifiersSelection,
                                                                       selectedOffenses,
                                                                       setCurrentOffenseCode,
                                                                       setIsModifiersModalOpen,
                                                                       setIsGlobalModifiersModalOpen,
                                                                   }) => {
    const handleBack = () => {
        if (selectedOffenses.length > 0) {
            const lastOffense = selectedOffenses[selectedOffenses.length - 1];
            setCurrentOffenseCode(lastOffense.code);
            setIsGlobalModifiersModalOpen(false);
            setIsModifiersModalOpen(true);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            shouldCloseOnOverlayClick={false}
            className="bg-gray-800 p-6 rounded-lg max-w-md mx-auto mt-20 text-white"
            overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
        >
            <h2 className="text-xl font-bold mb-4">Глобальные модификаторы приговора</h2>
            <div className="space-y-2">
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        checked={globalModifiers.deal}
                        onChange={() =>
                            setGlobalModifiers((prev) => ({
                                ...prev,
                                deal: !prev.deal,
                                dealReduction: !prev.deal ? prev.dealReduction : 0,
                            }))
                        }
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
                            onChange={(e) =>
                                setGlobalModifiers((prev) => ({
                                    ...prev,
                                    dealReduction: Math.max(0, parseInt(e.target.value) || 0),
                                }))
                            }
                            className="p-1 bg-gray-700 rounded w-16"
                        />
                    </div>
                )}
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        checked={globalModifiers.recidivism}
                        onChange={() =>
                            setGlobalModifiers((prev) => ({
                                ...prev,
                                recidivism: !prev.recidivism,
                                recidivismCount: !prev.recidivism ? prev.recidivismCount : 0,
                            }))
                        }
                        className="mr-2"
                    />
                    <label>Рецидив (+5 минут за каждый случай)</label>
                </div>
                {globalModifiers.recidivism && (
                    <div className="flex items-center mt-2">
                        <label className="mr-2">Количество случаев рецидива:</label>
                        <input
                            type="number"
                            value={globalModifiers.recidivismCount}
                            onChange={(e) =>
                                setGlobalModifiers((prev) => ({
                                    ...prev,
                                    recidivismCount: Math.max(0, parseInt(e.target.value) || 0),
                                }))
                            }
                            className="p-1 bg-gray-700 rounded w-16"
                        />
                    </div>
                )}
            </div>
            <div className="sticky bottom-0 bg-gray-800 py-4 flex justify-between">
                <button
                    onClick={handleBack}
                    className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-700"
                >
                    Назад
                </button>
                <div className="flex space-x-2">
                    <button
                        onClick={handleGlobalModifiersSelection}
                        className="px-4 py-2 bg-green-600 rounded hover:bg-green-700"
                    >
                        Применить
                    </button>
                    <button
                        onClick={onRequestClose}
                        className="px-4 py-2 bg-red-600 rounded hover:bg-red-700"
                    >
                        Закрыть
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default GlobalModifiersModal;