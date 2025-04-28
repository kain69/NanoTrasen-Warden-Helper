import React from 'react';
import Modal from 'react-modal';
import { Result } from '../types';

interface ResultModalProps {
    isOpen: boolean;
    onRequestClose: () => void;
    result: Result | null;
    copyToClipboard: (text: string) => void;
}

const ResultModal: React.FC<ResultModalProps> = ({ isOpen, onRequestClose, result, copyToClipboard }) => {
    if (!result) return null;

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            className="bg-gray-800 p-6 rounded-lg max-w-2xl mx-auto mt-20 text-white"
            overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
        >
            <h2 className="text-xl font-bold mb-4">Приговор</h2>
            <div className="mb-4">
                <p className="font-semibold">Правовое наказание: <span className="font-normal">{result.penalty}</span></p>
                <p className="font-semibold">Дисциплинарное наказание: <span className="font-normal">{result.disciplinaryPenalty}</span></p>
            </div>
            <textarea
                className="w-full h-64 p-2 bg-gray-700 text-white rounded mb-4"
                value={result.documentText}
                readOnly
            />
            <div className="flex justify-between">
                <button
                    onClick={() => copyToClipboard(result.documentText)}
                    className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
                >
                    Скопировать в буфер
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

export default ResultModal;