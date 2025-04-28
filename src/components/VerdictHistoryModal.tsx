import React, { useState } from 'react';
import Modal from 'react-modal';
import { VerdictHistoryEntry } from '../types';
import VerdictDetailsModal from './VerdictDetailsModal';

interface VerdictHistoryModalProps {
    isOpen: boolean;
    onRequestClose: () => void;
    verdictHistory: VerdictHistoryEntry[];
    setVerdictHistory: React.Dispatch<React.SetStateAction<VerdictHistoryEntry[]>>;
    copyToClipboard: (text: string) => void;
}

const VerdictHistoryModal: React.FC<VerdictHistoryModalProps> = ({
                                                                     isOpen,
                                                                     onRequestClose,
                                                                     verdictHistory,
                                                                     setVerdictHistory,
                                                                     copyToClipboard,
                                                                 }) => {
    const [selectedVerdict, setSelectedVerdict] = useState<VerdictHistoryEntry | null>(null);

    const handleDelete = (id: string) => {
        setVerdictHistory((prev) => prev.filter((entry) => entry.id !== id));
    };

    return (
        <>
            <Modal
                isOpen={isOpen}
                onRequestClose={onRequestClose}
                className="bg-gray-800 rounded-lg w-[32rem] h-[80vh] mx-auto mt-10 text-white flex flex-col"
                overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
            >
                <h2 className="text-xl font-bold mb-4 pt-6 px-6">История приговоров</h2>
                <div className="flex-1 overflow-y-auto px-6">
                    {verdictHistory.length === 0 ? (
                        <p className="text-gray-400">История пуста.</p>
                    ) : (
                        verdictHistory.map((entry) => (
                            <div
                                key={entry.id}
                                className="border-b border-gray-600 pb-4 mb-4 cursor-pointer hover:bg-gray-700 p-2 rounded"
                                onClick={() => setSelectedVerdict(entry)}
                            >
                                <p><strong>ФИО:</strong> {entry.fullName}</p>
                                <p><strong>Должность:</strong> {entry.position}</p>
                                <p><strong>Срок:</strong> {entry.penalty}</p>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDelete(entry.id);
                                    }}
                                    className="mt-2 px-3 py-1 bg-red-600 rounded hover:bg-red-700 text-sm"
                                >
                                    Удалить
                                </button>
                            </div>
                        ))
                    )}
                </div>
                <div className="sticky bottom-0 bg-gray-800 py-4 px-6 flex justify-end">
                    <button
                        onClick={onRequestClose}
                        className="px-4 py-2 bg-red-600 rounded hover:bg-red-700"
                    >
                        Закрыть
                    </button>
                </div>
            </Modal>

            <VerdictDetailsModal
                isOpen={!!selectedVerdict}
                onRequestClose={() => setSelectedVerdict(null)}
                verdict={selectedVerdict}
                copyToClipboard={copyToClipboard}
            />
        </>
    );
};

export default VerdictHistoryModal;