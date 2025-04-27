import React from 'react';
import Modal from 'react-modal';

interface GuiltModalProps {
    isOpen: boolean;
    onRequestClose: () => void;
    handleGuiltSelection: (guiltType: string) => void;
}

const GuiltModal: React.FC<GuiltModalProps> = ({ isOpen, onRequestClose, handleGuiltSelection }) => {
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            className="bg-gray-800 p-6 rounded-lg max-w-md mx-auto mt-20 text-white"
            overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
        >
            <h2 className="text-xl font-bold mb-4">Форма вины</h2>
            <div className="space-y-2">
                <button
                    onClick={() => handleGuiltSelection('Преступление, совершенное умышленно')}
                    className="w-full p-2 bg-blue-600 rounded hover:bg-blue-700"
                >
                    Преступление, совершенное умышленно (полное наказание)
                </button>
                <button
                    onClick={() => handleGuiltSelection('Преступление, совершенное по неосторожности')}
                    className="w-full p-2 bg-blue-600 rounded hover:bg-blue-700"
                >
                    Преступление, совершенное по неосторожности (-5 минут к наказанию)
                </button>
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