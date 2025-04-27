import React from 'react';
import Modal from 'react-modal';

interface CompletionModalProps {
    isOpen: boolean;
    onRequestClose: () => void;
    handleCompletionSelection: (completionType: string) => void;
}

const CompletionModal: React.FC<CompletionModalProps> = ({
                                                             isOpen,
                                                             onRequestClose,
                                                             handleCompletionSelection,
                                                         }) => {
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            className="bg-gray-800 p-6 rounded-lg max-w-md mx-auto mt-20 text-white"
            overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
        >
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
                <button
                    onClick={() => handleCompletionSelection('Приготовление к преступлению')}
                    className="w-full p-2 bg-blue-600 rounded hover:bg-blue-700"
                >
                    Приготовление к преступлению (зависит от статьи)
                </button>
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