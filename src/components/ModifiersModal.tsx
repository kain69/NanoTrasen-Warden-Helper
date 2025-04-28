import React, { useEffect } from 'react';
import Modal from 'react-modal';
import { offenses } from '../data/offenses';
import { OffenseWithModifiers } from '../types';

interface ModifiersModalProps {
    isOpen: boolean;
    onRequestClose: () => void;
    currentOffenseCode: string | null;
    selectedOffenses: OffenseWithModifiers[];
    setSelectedOffenses: React.Dispatch<React.SetStateAction<OffenseWithModifiers[]>>;
    handleModifiersSelection: () => void;
}

const ModifiersModal: React.FC<ModifiersModalProps> = ({
                                                           isOpen,
                                                           onRequestClose,
                                                           currentOffenseCode,
                                                           selectedOffenses,
                                                           setSelectedOffenses,
                                                           handleModifiersSelection,
                                                       }) => {
    if (!currentOffenseCode) return null;

    const offense = offenses.find((o) => o.code === currentOffenseCode);
    if (!offense) return null;

    const currentOffense = selectedOffenses.find((o) => o.code === currentOffenseCode);
    const modifiers = currentOffense?.modifiers || [];

    useEffect(() => {
        if (!isOpen || !currentOffenseCode) return;

        const currentOffenseMods = selectedOffenses.find((o) => o.code === currentOffenseCode);
        if (currentOffenseMods && currentOffenseMods.modifiers.length > 0) return;

        setSelectedOffenses((prev) =>
            prev.map((offenseWithMods) => {
                if (offenseWithMods.code !== currentOffenseCode) return offenseWithMods;

                return {
                    ...offenseWithMods,
                    modifiers: ['Преступление, совершенное умышленно', 'Оконченное преступление', 'Исполнитель'],
                };
            })
        );
    }, [isOpen, currentOffenseCode, selectedOffenses, setSelectedOffenses]);

    const toggleModifier = (modifier: string) => {
        setSelectedOffenses((prev) => {
            return prev.map((offenseWithMods) => {
                if (offenseWithMods.code !== currentOffenseCode) return offenseWithMods;

                let updatedModifiers = offenseWithMods.modifiers;
                if (updatedModifiers.includes(modifier)) {
                    updatedModifiers = updatedModifiers.filter((m) => m !== modifier);
                } else {
                    updatedModifiers = [...updatedModifiers, modifier];

                    const guiltModifiers = ['Преступление, совершенное умышленно', 'Преступление, совершенное по неосторожности', 'Отсутствие вины'];
                    const completionModifiers = [
                        'Оконченное преступление',
                        'Покушение на преступление',
                        'Приготовление к преступлению',
                        'Безуспешный добровольный отказ от преступления',
                        'Успешный добровольный отказ от преступления',
                    ];
                    const complicityModifiers = ['Организатор', 'Исполнитель', 'Подстрекатель', 'Пособник'];

                    if (guiltModifiers.includes(modifier)) {
                        updatedModifiers = updatedModifiers.filter((m) => !guiltModifiers.includes(m) || m === modifier);
                    }
                    if (completionModifiers.includes(modifier)) {
                        updatedModifiers = updatedModifiers.filter((m) => !completionModifiers.includes(m) || m === modifier);
                    }
                    if (complicityModifiers.includes(modifier)) {
                        updatedModifiers = updatedModifiers.filter((m) => !complicityModifiers.includes(m) || m === modifier);
                    }

                    if (modifier === 'Организатор') {
                        updatedModifiers = updatedModifiers.filter((m) => m !== 'Исполнитель');
                    }
                    if (modifier === 'Исполнитель') {
                        updatedModifiers = updatedModifiers.filter((m) => m !== 'Организатор');
                    }
                }

                return { ...offenseWithMods, modifiers: updatedModifiers };
            });
        });
    };

    const isNegligenceOrGrossNegligence = ['Халатность', 'Грубая халатность'].includes(offense.title);
    const isHighSeverity = ['XX4', 'XX5', 'XX6'].includes(offense.severity);
    const isDutyRelatedChapter = offense.chapter.startsWith('21X') || offense.chapter.startsWith('22X');
    const isPreparationApplicable = ['XX3', 'XX4', 'XX5', 'XX6'].includes(offense.severity);

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            className="bg-gray-800 rounded-lg max-w-lg w-full mx-auto mt-10 text-white px-6 flex flex-col"
            overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
        >
            <div className="pt-6">
                <h2 className="text-xl font-bold mb-1">Модификаторы для статьи:</h2>
                <div className="text-xl font-bold mb-3 border-b border-gray-700">
                    <span className="block font-semibold">{offense.code} - {offense.title}</span>
                </div>
            </div>
            <div className="flex-1 overflow-y-auto max-h-[70vh] space-y-3 px-2">
                <div>
                    <h3 className="text-lg font-semibold mb-2 text-gray-300">Обязательные модификаторы</h3>
                    <div>
                        <p className="font-semibold mb-1">Форма вины:</p>
                        <div className="space-y-1">
                            <label className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    checked={modifiers.includes('Преступление, совершенное умышленно')}
                                    onChange={() => toggleModifier('Преступление, совершенное умышленно')}
                                />
                                <span>Преступление, совершенное умышленно</span>
                            </label>
                            <div className="ml-6 text-gray-400 text-sm">Полное наказание</div>

                            <label className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    checked={modifiers.includes('Преступление, совершенное по неосторожности')}
                                    onChange={() => toggleModifier('Преступление, совершенное по неосторожности')}
                                    disabled={isNegligenceOrGrossNegligence}
                                    className={isNegligenceOrGrossNegligence ? 'opacity-50' : ''}
                                />
                                <span className={isNegligenceOrGrossNegligence ? 'line-through text-gray-500' : ''}>
                                    Преступление, совершенное по неосторожности
                                </span>
                            </label>
                            <div className="ml-6 text-gray-400 text-sm">
                                -5 минут к наказанию
                                {isNegligenceOrGrossNegligence && (
                                    <div className="text-red-400 text-sm">
                                        Недоступно для статей "Халатность" и "Грубая халатность"
                                    </div>
                                )}
                            </div>

                            <label className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    checked={modifiers.includes('Отсутствие вины')}
                                    onChange={() => toggleModifier('Отсутствие вины')}
                                />
                                <span>Отсутствие вины</span>
                            </label>
                            <div className="ml-6 text-gray-400 text-sm">Снятие обвинений</div>
                        </div>
                    </div>

                    <div className="mt-4">
                        <p className="font-semibold mb-1">Стадия преступления:</p>
                        <div className="space-y-1">
                            <label className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    checked={modifiers.includes('Оконченное преступление')}
                                    onChange={() => toggleModifier('Оконченное преступление')}
                                />
                                <span>Оконченное преступление</span>
                            </label>
                            <div className="ml-6 text-gray-400 text-sm">Полное наказание</div>

                            <label className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    checked={modifiers.includes('Покушение на преступление')}
                                    onChange={() => toggleModifier('Покушение на преступление')}
                                />
                                <span>Покушение на преступление</span>
                            </label>
                            <div className="ml-6 text-gray-400 text-sm">Полное наказание</div>

                            <label className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    checked={modifiers.includes('Приготовление к преступлению')}
                                    onChange={() => toggleModifier('Приготовление к преступлению')}
                                />
                                <span>Приготовление к преступлению</span>
                            </label>
                            <div className="ml-6 earn-words text-gray-400 text-sm">
                                {isPreparationApplicable ? 'Полное наказание' : 'Снятие обвинений'}
                            </div>

                            <label className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    checked={modifiers.includes('Безуспешный добровольный отказ от преступления')}
                                    onChange={() => toggleModifier('Безуспешный добровольный отказ от преступления')}
                                />
                                <span>Безуспешный добровольный отказ от преступления</span>
                            </label>
                            <div className="ml-6 text-gray-400 text-sm">-5 минут к наказанию</div>

                            <label className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    checked={modifiers.includes('Успешный добровольный отказ от преступления')}
                                    onChange={() => toggleModifier('Успешный добровольный отказ от преступления')}
                                />
                                <span>Успешный добровольный отказ от преступления</span>
                            </label>
                            <div className="ml-6 text-gray-400 text-sm">Снятие обвинений</div>
                        </div>
                    </div>

                    <div className="mt-4">
                        <p className="font-semibold mb-1">Форма соучастия:</p>
                        <div className="space-y-1">
                            <label className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    checked={modifiers.includes('Исполнитель')}
                                    onChange={() => toggleModifier('Исполнитель')}
                                />
                                <span>Исполнитель</span>
                            </label>
                            <div className="ml-6 text-gray-400 text-sm">Полное наказание</div>

                            <label className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    checked={modifiers.includes('Подстрекатель')}
                                    onChange={() => toggleModifier('Подстрекатель')}
                                />
                                <span>Подстрекатель</span>
                            </label>
                            <div className="ml-6 text-gray-400 text-sm">Полное наказание</div>

                            <label className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    checked={modifiers.includes('Пособник')}
                                    onChange={() => toggleModifier('Пособник')}
                                />
                                <span>Пособник</span>
                            </label>
                            <div className="ml-6 text-gray-400 text-sm">Полное наказание</div>

                            <label className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    checked={modifiers.includes('Организатор')}
                                    onChange={() => toggleModifier('Организатор')}
                                />
                                <span>Организатор</span>
                            </label>
                            <div className="ml-6 text-gray-400 text-sm">+10 минут к наказанию</div>
                        </div>
                    </div>
                </div>

                <hr className="my-6 border-t border-gray-600" />

                <div>
                    <h3 className="text-lg font-semibold mb-2 text-gray-300">Необязательные модификаторы</h3>
                    <div className="space-y-1">
                        <label className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                checked={modifiers.includes('Гипноз')}
                                onChange={() => toggleModifier('Гипноз')}
                                disabled={isHighSeverity}
                                className={isHighSeverity ? 'opacity-50' : ''}
                            />
                            <span className={isHighSeverity ? 'line-through text-gray-500' : ''}>Гипноз</span>
                        </label>
                        <div className="ml-6 text-gray-400 text-sm">
                            Снятие обвинений
                            {isHighSeverity && (
                                <div className="text-red-400 text-sm">
                                    Недоступно для статей с тяжестью XX4, XX5, XX6
                                </div>
                            )}
                        </div>

                        <label className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                checked={modifiers.includes('Крайняя необходимость')}
                                onChange={() => toggleModifier('Крайняя необходимость')}
                            />
                            <span>Крайняя необходимость</span>
                        </label>
                        <div className="ml-6 text-gray-400 text-sm">Снятие обвинений</div>

                        <label className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                checked={modifiers.includes('Допустимая самооборона')}
                                onChange={() => toggleModifier('Допустимая самооборона')}
                            />
                            <span>Допустимая самооборона</span>
                        </label>
                        <div className="ml-6 text-gray-400 text-sm">Снятие обвинений</div>

                        <label className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                checked={modifiers.includes('Манипулирование синтетиками')}
                                onChange={() => toggleModifier('Манипулирование синтетиками')}
                            />
                            <span>Манипулирование синтетиками</span>
                        </label>
                        <div className="ml-6 text-gray-400 text-sm">Полное наказание</div>

                        <label className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                checked={modifiers.includes('Должностное преступление')}
                                onChange={() => toggleModifier('Должностное преступление')}
                            />
                            <span>Должностное преступление</span>
                        </label>
                        <div className="ml-6 text-gray-400 text-sm">+10 минут к наказанию</div>

                        <label className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                checked={modifiers.includes('Преступление против должностного лица')}
                                onChange={() => toggleModifier('Преступление против должностного лица')}
                                disabled={!isDutyRelatedChapter}
                                className={!isDutyRelatedChapter ? 'opacity-50' : ''}
                            />
                            <span className={!isDutyRelatedChapter ? 'line-through text-gray-500' : ''}>
                                Преступление против должностного лица
                            </span>
                        </label>
                        <div className="ml-6 text-gray-400 text-sm">
                            +10 минут к наказанию
                            {!isDutyRelatedChapter && (
                                <div className="text-red-400 text-sm">
                                    Недоступно, применимо только к главам 21X и 22X
                                </div>
                            )}
                        </div>

                        <label className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                checked={modifiers.includes('Расизм')}
                                onChange={() => toggleModifier('Расизм')}
                            />
                            <span>Расизм</span>
                        </label>
                        <div className="ml-6 text-gray-400 text-sm">+10 минут к наказанию</div>

                        <label className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                checked={modifiers.includes('Явка с повинной')}
                                onChange={() => toggleModifier('Явка с повинной')}
                            />
                            <span>Явка с повинной</span>
                        </label>
                        <div className="ml-6 text-gray-400 text-sm">-5 минут к наказанию</div>
                    </div>
                </div>
            </div>
            <div className="sticky bottom-0 bg-gray-800 py-4 flex justify-between">
                <button
                    onClick={handleModifiersSelection}
                    className="px-4 py-2 bg-green-600 rounded hover:bg-green-700"
                >
                    Далее
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

export default ModifiersModal;