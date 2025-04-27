import React from 'react';
import Modal from 'react-modal';
import { OffenseWithModifiers } from '../types';
import { offenses, severityMinutes } from '../data/offenses';

interface CompletionModalProps {
    isOpen: boolean;
    onRequestClose: () => void;
    handleCompletionSelection: (completionType: string) => void;
    selectedOffenses: OffenseWithModifiers[];
}

const CompletionModal: React.FC<CompletionModalProps> = ({
                                                             isOpen,
                                                             onRequestClose,
                                                             handleCompletionSelection,
                                                             selectedOffenses,
                                                         }) => {
    // Проверяем, есть ли статьи с severity XX1 или XX2
    const hasLowSeverityOffense = selectedOffenses.some((offenseWithMods) => {
        const offense = offenses.find((o) => o.code === offenseWithMods.code);
        if (!offense) return false;
        const severityIndex = Object.keys(severityMinutes).indexOf(offense.severity);
        const xx3Index = Object.keys(severityMinutes).indexOf('XX3');
        return severityIndex < xx3Index;
    });

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
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
            <h2 className="text-xl font-bold mb-4">Неоконченное и оконченное преступление</h2>
            <div className="space-y-2">
                <button
                    onClick={() => handleCompletionSelection('Оконченное преступление')}
                    className="w-full p-2 bg-blue-600 rounded hover:bg-blue-700"
                >
                    Оконченное преступление (полное наказание)
                </button>
                <button
                    onClick={() => handleCompletionSelection('Покушение на преступление')}
                    className="w-full p-2 bg-blue-600 rounded hover:bg-blue-700"
                >
                    Покушение на преступление (полное наказание)
                </button>
                <div className="tooltip">
                    <button
                        onClick={() => handleCompletionSelection('Приготовление к преступлению')}
                        disabled={hasLowSeverityOffense}
                        className={`w-full p-2 rounded ${
                            hasLowSeverityOffense
                                ? 'bg-gray-600 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                    >
                        Приготовление к преступлению (зависит от статьи)
                    </button>
                    {hasLowSeverityOffense && (
                        <span className="tooltiptext">не применимо для данной статьи</span>
                    )}
                </div>
                <button
                    onClick={() => handleCompletionSelection('Безуспешный добровольный отказ от преступления')}
                    className="w-full p-2 bg-blue-600 rounded hover:bg-blue-700"
                >
                    Безуспешный добровольный отказ от преступления (-5 минут)
                </button>
                <button
                    onClick={() => handleCompletionSelection('Успешный добровольный отказ от преступления')}
                    className="w-full p-2 bg-blue-600 rounded hover:bg-blue-700"
                >
                    Успешный добровольный отказ от преступления (снятие обвинений)
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

export default CompletionModal;