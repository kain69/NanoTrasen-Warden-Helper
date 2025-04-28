import React from 'react';
import Modal from 'react-modal';
import { OffenseWithModifiers } from '../types';

interface ComplicityModalProps {
    isOpen: boolean;
    onRequestClose: () => void;
    handleComplicitySelection: (complicityType: string) => void;
    selectedOffenses: OffenseWithModifiers[];
}

const ComplicityModal: React.FC<ComplicityModalProps> = ({
                                                             isOpen,
                                                             onRequestClose,
                                                             handleComplicitySelection,
                                                         }) => {
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            shouldCloseOnOverlayClick={false}
            className="bg-gray-800 p-6 rounded-lg max-w-md mx-auto mt-20 text-white"
            overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
        >
            <h2 className="text-xl font-bold mb-4">Соучастие в преступлении</h2>
            <div className="space-y-2">
                <button
                    onClick={() => handleComplicitySelection('Исполнитель')}
                    className="w-full p-2 bg-blue-600 rounded hover:bg-blue-700"
                >
                    Исполнитель (полное наказание)
                </button>
                <button
                    onClick={() => handleComplicitySelection('Подстрекатель')}
                    className="w-full p-2 bg-blue-600 rounded hover:bg-blue-700"
                >
                    Подстрекатель (полное наказание)
                </button>
                <button
                    onClick={() => handleComplicitySelection('Пособник')}
                    className="w-full p-2 bg-blue-600 rounded hover:bg-blue-700"
                >
                    Пособник (полное наказание)
                </button>
                <button
                    onClick={() => handleComplicitySelection('Организатор')}
                    className="w-full p-2 bg-blue-600 rounded hover:bg-blue-700"
                >
                    Организатор (+10 минут)
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

export default ComplicityModal;