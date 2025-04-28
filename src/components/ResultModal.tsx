import React from 'react';
import Modal from 'react-modal';
import { Result } from '../types';

interface ResultModalProps {
    isOpen: boolean;
    onRequestClose: () => void;
    onCloseWithoutSaving: () => void;
    result: Result | null;
    copyToClipboard: (text: string) => void;
}

const ResultModal: React.FC<ResultModalProps> = ({
                                                     isOpen,
                                                     onRequestClose,
                                                     onCloseWithoutSaving,
                                                     result,
                                                     copyToClipboard,
                                                 }) => {
    if (!result) return null;

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            shouldCloseOnOverlayClick={false}
            className="bg-gray-800 p-6 rounded-lg max-w-2xl mx-auto mt-10 text-white px-6 flex flex-col"
            overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
        >
            <h2 className="text-xl font-bold ml-2 mb-4 pt-6">Итоговый приговор</h2>
            <div className="flex-1 overflow-y-auto max-h-[70vh] space-y-3 px-2">
                <p className="mb-2">
                    <strong>Правовое наказание:</strong> {result.penalty}
                </p>
                <p className="mb-4">
                    <strong>Административное наказание:</strong> {result.disciplinaryPenalty}
                </p>
                <pre className="bg-gray-700 p-4 rounded whitespace-pre-wrap break-words">
                    {result.documentText}
                </pre>
            </div>
            <div className="sticky bottom-0 bg-gray-800 py-4 flex justify-between">
                <button
                    onClick={() => copyToClipboard(result.documentText)}
                    className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
                >
                    Копировать в буфер
                </button>
                <div className="flex space-x-2">
                    <button
                        onClick={onCloseWithoutSaving}
                        className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-700"
                    >
                        Не сохранять и закрыть
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

export default ResultModal;