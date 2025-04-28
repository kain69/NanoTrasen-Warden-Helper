import React from 'react';
import Modal from 'react-modal';
import { VerdictHistoryEntry } from '../types';

interface VerdictDetailsModalProps {
    isOpen: boolean;
    onRequestClose: () => void;
    verdict: VerdictHistoryEntry | null;
    copyToClipboard: (text: string) => void;
}

const VerdictDetailsModal: React.FC<VerdictDetailsModalProps> = ({
                                                                     isOpen,
                                                                     onRequestClose,
                                                                     verdict,
                                                                     copyToClipboard,
                                                                 }) => {
    if (!verdict) return null;

    // Парсим offenseDetails для разделения модификаторов
    const renderOffenseDetails = (detail: string) => {
        const [offensePart, modifiersPart] = detail.split('], модификаторы: ');
        const offenseText = offensePart + ']';
        const modifiers = modifiersPart
            ? modifiersPart === 'отсутствуют'
                ? []
                : modifiersPart.split(', ')
            : [];
        return (
            <div>
                <p>{offenseText}</p>
                {modifiers.length > 0 && (
                    <ul className="list-disc pl-5 mt-1">
                        {modifiers.map((modifier, idx) => (
                            <li key={idx} className="text-sm text-gray-300">{modifier}</li>
                        ))}
                    </ul>
                )}
            </div>
        );
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            shouldCloseOnOverlayClick={false}
            className="bg-gray-800 rounded-lg max-w-2xl w-full mx-auto mt-10 text-white px-6 flex flex-col"
            overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
        >
            <h2 className="text-xl font-bold mb-4 pt-6">Детали приговора</h2>
            <div className="flex-1 overflow-y-auto max-h-[70vh] space-y-3 px-2">
                <p><strong>ФИО нарушителя:</strong> {verdict.fullName}</p>
                <p><strong>Должность нарушителя:</strong> {verdict.position}</p>
                <p><strong>Дата и время:</strong> {verdict.timestamp}</p>
                <p><strong>Статьи и модификаторы:</strong></p>
                <div className="space-y-2">
                    {verdict.offenseDetails.map((detail, index) => (
                        <div key={index}>{renderOffenseDetails(detail)}</div>
                    ))}
                </div>
                <p><strong>Правовое наказание:</strong> {verdict.penalty}</p>
                <p><strong>Административное наказание:</strong> {verdict.disciplinaryPenalty}</p>
            </div>
            <div className="sticky bottom-0 bg-gray-800 py-4 flex justify-between">
                <button
                    onClick={() => copyToClipboard(verdict.documentText)}
                    className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
                >
                    Скопировать приговор
                </button>
                <button
                    onClick={onRequestClose}
                    className="px-4 py-2 bg-red-600 rounded hover:bg-red-700"
                >
                    Закрыть
                </button>
            </div>
        </Modal>
    );
};

export default VerdictDetailsModal;