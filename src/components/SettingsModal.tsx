import React, { useRef } from 'react';
import Modal from 'react-modal';
import { Settings, Timer } from '../types';
import { settingsPositionGroups } from '../data/positions'; // Импортируем settingsPositionGroups вместо positionGroups

interface SettingsModalProps {
    isOpen: boolean;
    onRequestClose: () => void;
    settings: Settings;
    setSettings: React.Dispatch<React.SetStateAction<Settings>>;
    timer: Timer;
    setTimer: React.Dispatch<React.SetStateAction<Timer>>;
    startTimeInput: string;
    setStartTimeInput: React.Dispatch<React.SetStateAction<string>>;
    baseStartSeconds: number;
    setBaseStartSeconds: React.Dispatch<React.SetStateAction<number>>;
    showSeconds: boolean;
    setShowSeconds: React.Dispatch<React.SetStateAction<boolean>>;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
                                                         isOpen,
                                                         onRequestClose,
                                                         settings,
                                                         setSettings,
                                                         timer,
                                                         setTimer,
                                                         startTimeInput,
                                                         setStartTimeInput,
                                                         baseStartSeconds,
                                                         setBaseStartSeconds,
                                                         showSeconds,
                                                         setShowSeconds,
                                                     }) => {
    const inputRef = useRef<HTMLInputElement>(null);

    const parseTimeToSeconds = (time: string): number => {
        const [hours, minutes, seconds] = time.split(':').map(Number);
        return (hours * 3600) + (minutes * 60) + seconds;
    };

    const formatTime = (seconds: number): string => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        if (showSeconds) {
            return `${hours.toString().padStart(2, '0')}:${minutes
                .toString()
                .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    };

    const handleStartTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value;
        const cursorPosition = e.target.selectionStart || 0;

        let value = rawValue.replace(/\D/g, '');
        if (value.length > 6) {
            value = value.slice(0, 6);
        }

        let formatted = '';
        if (value.length > 0) {
            formatted += value.substring(0, 2);
        }
        if (value.length > 2) {
            formatted += ':' + value.substring(2, 4);
        }
        if (value.length > 4) {
            formatted += ':' + value.substring(4, 6);
        }

        setStartTimeInput(formatted);

        setTimeout(() => {
            if (inputRef.current) {
                let newCursorPos = cursorPosition;
                if (cursorPosition === 2 || cursorPosition === 5) {
                    newCursorPos += 1;
                } else if (cursorPosition > 2 && cursorPosition <= 4) {
                    newCursorPos += 1;
                } else if (cursorPosition > 4) {
                    newCursorPos += 2;
                }
                inputRef.current.selectionStart = newCursorPos;
                inputRef.current.selectionEnd = newCursorPos;
            }
        }, 0);
    };

    const startTimer = () => {
        let newStartSeconds = parseTimeToSeconds(startTimeInput);
        if (isNaN(newStartSeconds)) {
            newStartSeconds = 0;
        }
        setBaseStartSeconds(newStartSeconds);
        setTimer({ elapsedSeconds: 0, running: true });
    };

    const totalSeconds = baseStartSeconds + timer.elapsedSeconds;
    const currentTime = formatTime(totalSeconds);

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            className="bg-gray-800 p-6 rounded-lg max-w-md mx-auto mt-20 text-white"
            overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
        >
            <h2 className="text-xl font-bold mb-2">Настройки</h2>
            <div className="grid grid-cols-1 gap-4">
                <div>
                    <label className="block mb-1">ФИО составителя:</label>
                    <input
                        type="text"
                        value={settings.fullName}
                        onChange={(e) => setSettings({ ...settings, fullName: e.target.value })}
                        className="w-full p-2 bg-gray-700 rounded"
                        placeholder="Иванов Иван"
                    />
                </div>
                <div>
                    <label className="block mb-1">Должность составителя:</label>
                    <select
                        value={settings.position}
                        onChange={(e) => setSettings({ ...settings, position: e.target.value })}
                        className="w-full p-2 bg-gray-700 rounded text-white"
                    >
                        <option value="" disabled>
                            Выберите должность
                        </option>
                        {settingsPositionGroups.map((group) => (
                            <optgroup key={group.label} label={group.label}>
                                {group.positions.map((position) => (
                                    <option key={position.value} value={position.label}>
                                        {position.label}
                                    </option>
                                ))}
                            </optgroup>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block mb-1">Название станции:</label>
                    <input
                        type="text"
                        value={settings.station}
                        onChange={(e) => setSettings({ ...settings, station: e.target.value })}
                        className="w-full p-2 bg-gray-700 rounded"
                        placeholder="Station XX-000"
                    />
                </div>
            </div>
            <div className="mt-4 flex flex-col items-start">
                <h3 className="mb-2 text-lg font-semibold">Время от начала смены</h3>
                <div className="flex items-start space-x-4">
                    <div className="flex flex-col items-center">
                        <input
                            ref={inputRef}
                            type="text"
                            value={startTimeInput}
                            onChange={handleStartTimeChange}
                            className="p-2 h-10 bg-gray-700 rounded w-24 text-center"
                            placeholder="00:00:00"
                        />
                    </div>
                    <div className="flex flex-col items-center">
                        <button
                            onClick={startTimer}
                            className="px-4 h-10 bg-blue-600 rounded hover:bg-blue-700"
                        >
                            Старт
                        </button>
                        <label className="block text-sm invisible">Кнопка</label>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="p-2 h-10 flex items-center justify-center bg-gray-700 rounded w-24 text-center">
                            {currentTime}
                        </div>
                    </div>
                </div>
                <div className="mt-2">
                    <label className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            checked={showSeconds}
                            onChange={(e) => setShowSeconds(e.target.checked)}
                            className="h-4 w-4 text-blue-600 bg-gray-700 rounded"
                        />
                        <span>Показывать секунды</span>
                    </label>
                </div>
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

export default SettingsModal;