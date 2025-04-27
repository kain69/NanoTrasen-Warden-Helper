import React from 'react';
import Modal from 'react-modal';

interface ConfirmModalProps {
    isOpen: boolean;
    onRequestClose: () => void;
    onConfirm: (confirm: boolean) => void;
    minutes: number;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ isOpen, onRequestClose, onConfirm, minutes }) => {
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            className="bg-gray-800 p-6 rounded-lg max-w-md mx-auto mt-20 text-white"
            overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
        >
            <h2 className="text-xl font-bold mb-4">Подтверждение</h2>
            <p className="mb-4">Заменить {minutes} минут тюремного заключения на предупреждение?</p>
            <div className="flex justify-evenly">
                <button
                    onClick={() => onConfirm(true)}
                    className="px-4 py-2 bg-green-600 rounded hover:bg-green-700"
                >
                    Да
                </button>
                <button
                    onClick={() => onConfirm(false)}
                    className="px-4 py-2 bg-red-600 rounded hover:bg-red-700"
                >
                    Нет
                </button>
            </div>
        </Modal>
    );
};

export default ConfirmModal;