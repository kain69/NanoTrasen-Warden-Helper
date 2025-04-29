import React from 'react';
import Modal from 'react-modal';

interface ClownWarningModalProps {
    isOpen: boolean;
    onRequestClose: () => void;
    onConfirm: (proceed: boolean) => void;
}

const ClownWarningModal: React.FC<ClownWarningModalProps> = ({
                                                                 isOpen,
                                                                 onRequestClose,
                                                                 onConfirm,
                                                             }) => {
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            shouldCloseOnOverlayClick={false}
            className="bg-gray-800 rounded-lg max-w-md w-full mx-auto mt-20 text-white p-6"
            overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
        >
            <h2 className="text-xl font-bold mb-4">Предупреждение</h2>
            <p className="mb-4">
                Вы действительно хотите обвинить клоуна в Хулиганстве? Продолжить?
            </p>
            <div className="flex justify-end space-x-2">
                <button
                    onClick={() => onConfirm(true)}
                    className="px-4 py-2 bg-yellow-600 rounded hover:bg-yellow-700"
                >
                    Да
                </button>
                <button
                    onClick={() => {
                        onConfirm(false);
                        onRequestClose();
                    }}
                    className="px-4 py-2 bg-red-600 rounded hover:bg-red-700"
                >
                    Нет
                </button>
            </div>
        </Modal>
    );
};

export default ClownWarningModal;