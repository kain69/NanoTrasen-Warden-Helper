import React from 'react';
import Modal from 'react-modal';
import { OffenseWithModifiers } from '../types';
import { offenses } from '../data/offenses';

interface GuiltModalProps {
    isOpen: boolean;
    onRequestClose: () => void;
    handleGuiltSelection: (guiltType: string) => void;
    selectedOffenses: OffenseWithModifiers[];
}

const GuiltModal: React.FC<GuiltModalProps> = ({ isOpen, onRequestClose, handleGuiltSelection, selectedOffenses }) => {
    // Проверяем, есть ли среди выбранных статей "Халатность" или "Грубая халатность"
    const hasNegligenceOffense = selectedOffenses.some((offenseWithMods) => {
        const offense = offenses.find((o) => o.code === offenseWithMods.code);
        return offense && ['Халатность', 'Грубая халатность'].includes(offense.title);
    });

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            shouldCloseOnOverlayClick={false}
            className="bg-gray-800 p-6 rounded-lg max-w-md mx-auto mt-20 text-white"
            overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
        >
            <style>
                {`
                    .tooltip {
                        position: relative;
                        display: inline-block;
                        width: 100%;
                    }
                    .tooltip .tooltiptext {
                        visibility: hidden;
                        width: 200px;
                        background-color: #555;
                        color: #fff;
                        text-align: center;
                        border-radius: 6px;
                        padding: 5px;
                        position: absolute;
                        z-index: 1;
                        bottom: 125%;
                        left: 50%;
                        margin-left: -100px;
                        opacity: 0;
                        transition: opacity 0.3s;
                    }
                    .tooltip:hover .tooltiptext {
                        visibility: visible;
                        opacity: 1;
                    }
                `}
            </style>
            <h2 className="text-xl font-bold mb-4">Форма вины</h2>
            <div className="space-y-2">
                <button
                    onClick={() => handleGuiltSelection('Преступление, совершенное умышленно')}
                    className="w-full p-2 bg-blue-600 rounded hover:bg-blue-700"
                >
                    Преступление, совершенное умышленно (полное наказание)
                </button>
                <div className="tooltip">
                    <button
                        onClick={() => handleGuiltSelection('Преступление, совершенное по неосторожности')}
                        disabled={hasNegligenceOffense}
                        className={`w-full p-2 rounded ${
                            hasNegligenceOffense
                                ? 'bg-gray-600 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                    >
                        Преступление, совершенное по неосторожности (-5 минут к наказанию)
                    </button>
                    {hasNegligenceOffense && (
                        <span className="tooltiptext">не применимо для данной статьи</span>
                    )}
                </div>
                <button
                    onClick={() => handleGuiltSelection('Отсутствие вины')}
                    className="w-full p-2 bg-blue-600 rounded hover:bg-blue-700"
                >
                    Отсутствие вины (снятие обвинений)
                </button>
            </div>
            <button
                onClick={onRequestClose}
                className="mt-4 px-4 py-2 bg-red-600 rounded hover:bg-red-700"
            >
                Закрыть
            </button>
        </Modal>
    );
};

export default GuiltModal;