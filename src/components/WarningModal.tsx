import React from 'react';
import Modal from 'react-modal';

interface WarningModalProps {
    isOpen: boolean;
    onRequestClose: () => void;
    onForceVerdict: () => void; // Новый пропс для принудительного создания приговора
    message: string;
}

const WarningModal: React.FC<WarningModalProps> = ({ isOpen, onRequestClose, onForceVerdict, message }) => {
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            shouldCloseOnOverlayClick={false}
            className="bg-gray-800 p-6 rounded-lg max-w-md mx-auto mt-20 text-white"
            overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
        >
            <h2 className="text-xl font-bold mb-4">Предупреждение</h2>
            <p className="mb-4">{message}</p>
            <div className="flex justify-between">
                <button
                    onClick={onForceVerdict}
                    className="px-4 py-2 bg-yellow-600 rounded hover:bg-yellow-700"
                >
                    Все равно создать приговор
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

export default WarningModal;