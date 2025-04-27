import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { offenses, severityMinutes, disciplinaryPenalties } from './data/offenses';
import SettingsModal from './components/SettingsModal';
import ObjectDetails from './components/ObjectDetails';
import OffensesTable from './components/OffensesTable';
import SelectedOffensesList from './components/SelectedOffensesList';
import GuiltModal from './components/GuiltModal';
import CompletionModal from './components/CompletionModal';
import ComplicityModal from './components/ComplicityModal';
import ModifiersModal from './components/ModifiersModal';
import GlobalModifiersModal from './components/GlobalModifiersModal';
import ResultModal from './components/ResultModal';
import {
    OffenseWithModifiers,
    GlobalModifiers,
    Settings,
    Timer,
    ObjectDetails as ObjectDetailsType,
    Result,
} from './types';

Modal.setAppElement('#root');

const App: React.FC = () => {
    const [selectedOffenses, setSelectedOffenses] = useState<OffenseWithModifiers[]>([]);
    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
    const [isGuiltModalOpen, setIsGuiltModalOpen] = useState(false);
    const [isCompletionModalOpen, setIsCompletionModalOpen] = useState(false);
    const [isComplicityModalOpen, setIsComplicityModalOpen] = useState(false);
    const [isModifiersModalOpen, setIsModifiersModalOpen] = useState(false);
    const [isGlobalModifiersModalOpen, setIsGlobalModifiersModalOpen] = useState(false);
    const [currentOffenseCode, setCurrentOffenseCode] = useState<string | null>(null);
    const [isResultModalOpen, setIsResultModalOpen] = useState(false);
    const [guilt, setGuilt] = useState<string | null>(null);
    const [completion, setCompletion] = useState<string | null>(null);
    const [complicity, setComplicity] = useState<string | null>(null);
    const [globalModifiers, setGlobalModifiers] = useState<GlobalModifiers>({
        deal: false,
        dealReduction: 0,
        recidivism: false,
        recidivismCount: 0,
    });
    const [settings, setSettings] = useState<Settings>({
        fullName: '',
        position: 'Смотритель',
        station: 'Station XX-000',
    });
    const [timer, setTimer] = useState<Timer>({ elapsedSeconds: 0, running: false });
    const [startTimeInput, setStartTimeInput] = useState('');
    const [baseStartSeconds, setBaseStartSeconds] = useState(0);
    const [objectDetails, setObjectDetails] = useState<ObjectDetailsType>({ fullName: '', position: '' });
    const [result, setResult] = useState<Result | null>(null);

    // Таймер: обновление каждую секунду
    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;
        if (timer.running) {
            interval = setInterval(() => {
                setTimer((prev) => ({
                    ...prev,
                    elapsedSeconds: prev.elapsedSeconds + 1,
                }));
            }, 1000);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [timer.running]);

    const toggleOffense = (code: string) => {
        setSelectedOffenses((prev) => {
            const existing = prev.find((o) => o.code === code);
            if (existing) {
                return prev.filter((o) => o.code !== code);
            } else {
                return [...prev, { code, modifiers: [] }];
            }
        });
    };

    const openModifiersModal = (code: string) => {
        setCurrentOffenseCode(code);
        setIsModifiersModalOpen(true);
    };

    const openGuiltModal = () => {
        if (selectedOffenses.length === 0) {
            alert('Пожалуйста, выберите хотя бы одну статью.');
            return;
        }
        setIsGuiltModalOpen(true);
    };

    const handleGuiltSelection = (guiltType: string) => {
        setGuilt(guiltType);
        setIsGuiltModalOpen(false);
        setIsCompletionModalOpen(true);
    };

    const handleCompletionSelection = (completionType: string) => {
        setCompletion(completionType);
        setIsCompletionModalOpen(false);
        setIsComplicityModalOpen(true);
    };

    const handleComplicitySelection = (complicityType: string) => {
        setComplicity(complicityType);
        setIsComplicityModalOpen(false);
        if (selectedOffenses.length > 0) {
            setCurrentOffenseCode(selectedOffenses[0].code);
            setIsModifiersModalOpen(true);
        }
    };

    const handleModifiersSelection = () => {
        setIsModifiersModalOpen(false);
        const currentIndex = selectedOffenses.findIndex((o) => o.code === currentOffenseCode);
        if (currentIndex < selectedOffenses.length - 1) {
            setCurrentOffenseCode(selectedOffenses[currentIndex + 1].code);
            setIsModifiersModalOpen(true);
        } else {
            setIsGlobalModifiersModalOpen(true);
        }
    };

    const handleGlobalModifiersSelection = () => {
        setIsGlobalModifiersModalOpen(false);
        calculateVerdict();
    };

    const calculateVerdict = () => {
        if (!guilt || !completion || !complicity) return;

        const chapters: Record<string, OffenseWithModifiers[]> = {};
        selectedOffenses.forEach((offenseWithMods) => {
            const offense = offenses.find((o) => o.code === offenseWithMods.code);
            if (offense) {
                if (!chapters[offense.chapter]) chapters[offense.chapter] = [];
                chapters[offense.chapter].push(offenseWithMods);
            }
        });

        const finalOffenses: OffenseWithModifiers[] = [];
        Object.values(chapters).forEach((chapterOffenses) => {
            const mostSevere = chapterOffenses.reduce((prev, curr) => {
                const prevOffense = offenses.find((o) => o.code === prev.code)!;
                const currOffense = offenses.find((o) => o.code === curr.code)!;
                const prevSeverity = Object.keys(severityMinutes).indexOf(prevOffense.severity);
                const currSeverity = Object.keys(severityMinutes).indexOf(currOffense.severity);
                return currSeverity > prevSeverity ? curr : prev;
            });
            finalOffenses.push(mostSevere);
        });

        let totalMinutes = 0;
        let isLifeSentence = false;
        let isDeathPenalty = false;
        let maxSeverity: string = 'XX1';
        const offenseDetails: string[] = [];

        finalOffenses.forEach((offenseWithMods) => {
            const offense = offenses.find((o) => o.code === offenseWithMods.code)!;
            let minutes = severityMinutes[offense.severity];
            const appliedModifiers: string[] = [];

            const severityOrder = ['XX1', 'XX2', 'XX3', 'XX4', 'XX5', 'XX6'];
            if (severityOrder.indexOf(offense.severity) > severityOrder.indexOf(maxSeverity)) {
                maxSeverity = offense.severity;
            }

            if (guilt === 'Преступление, совершенное по неосторожности') {
                if (!['Халатность', 'Грубая халатность'].includes(offense.title)) {
                    minutes = Math.max(0, minutes - 5);
                    appliedModifiers.push('Преступление, совершенное по неосторожности (-5 минут)');
                } else {
                    appliedModifiers.push('Преступление, совершенное по неосторожности (не применимо для данной статьи)');
                }
            }

            if (completion === 'Покушение на преступление') {
                minutes = minutes;
                appliedModifiers.push('Покушение на преступление (полное наказание)');
            } else if (completion === 'Приготовление к преступлению') {
                if (['XX3', 'XX4', 'XX5', 'XX6'].includes(offense.severity)) {
                    appliedModifiers.push('Приготовление к преступлению (полное наказание)');
                } else {
                    minutes = 0;
                    appliedModifiers.push('Приготовление к преступлению (снятие обвинения)');
                }
            } else if (completion === 'Безуспешный добровольный отказ от преступления') {
                minutes = Math.max(0, minutes - 5);
                appliedModifiers.push('Безуспешный добровольный отказ от преступления (-5 минут)');
            } else if (completion === 'Успешный добровольный отказ от преступления') {
                minutes = 0;
                appliedModifiers.push('Успешный добровольный отказ от преступления (снятие обвинений)');
            }

            if (complicity === 'Организатор') {
                if (complicity !== 'Исполнитель') {
                    minutes += 10;
                    appliedModifiers.push('Организатор (+10 минут)');
                } else {
                    appliedModifiers.push('Организатор (не применимо, так как исполнитель является организатором)');
                }
            } else {
                appliedModifiers.push(`${complicity} (полное наказание)`);
            }

            if (offenseWithMods.modifiers.includes('Гипноз')) {
                minutes = 0;
                appliedModifiers.push('Гипноз (снятие обвинений)');
            }
            if (offenseWithMods.modifiers.includes('Крайняя необходимость')) {
                minutes = 0;
                appliedModifiers.push('Крайняя необходимость (снятие обвинений)');
            }
            if (offenseWithMods.modifiers.includes('Допустимая самооборона')) {
                minutes = 0;
                appliedModifiers.push('Допустимая самооборона (снятие обвинений)');
            }
            if (offenseWithMods.modifiers.includes('Манипулирование синтетиками')) {
                appliedModifiers.push('Манипулирование синтетиками (полное наказание)');
            }
            if (offenseWithMods.modifiers.includes('Должностное преступление')) {
                minutes += 10;
                appliedModifiers.push('Должностное преступление (+10 минут)');
            }
            if (offenseWithMods.modifiers.includes('Преступление против должностного лица')) {
                if (offense.chapter.startsWith('21X') || offense.chapter.startsWith('22X')) {
                    minutes += 10;
                    appliedModifiers.push('Преступление против должностного лица (+10 минут)');
                } else {
                    appliedModifiers.push('Преступление против должностного лица (не применимо для данной статьи)');
                }
            }
            if (offenseWithMods.modifiers.includes('Расизм')) {
                minutes += 10;
                appliedModifiers.push('Расизм (+10 минут)');
            }
            if (offenseWithMods.modifiers.includes('Явка с повинной')) {
                minutes = Math.max(0, minutes - 5);
                appliedModifiers.push('Явка с повинной (-5 минут)');
            }

            if (offense.severity === 'XX5') isLifeSentence = true;
            if (offense.severity === 'XX6') isDeathPenalty = true;

            totalMinutes += minutes;
            offenseDetails.push(
                `[${offense.code} - ${offense.title}], модификаторы: ${
                    appliedModifiers.length > 0 ? appliedModifiers.join(', ') : 'отсутствуют'
                }`
            );
        });

        if (globalModifiers.deal && globalModifiers.dealReduction > 0) {
            totalMinutes = Math.max(0, totalMinutes - globalModifiers.dealReduction);
            offenseDetails.push(`Сделка со следствием (-${globalModifiers.dealReduction} минут)`);
        }
        if (globalModifiers.recidivism && globalModifiers.recidivismCount > 0) {
            const recidivismMinutes = globalModifiers.recidivismCount * 5;
            totalMinutes += recidivismMinutes;
            offenseDetails.push(`Рецидив (+${recidivismMinutes} минут за ${globalModifiers.recidivismCount} случаев)`);
        }

        let finalPenalty = '';
        if (
            guilt === 'Отсутствие вины' ||
            completion === 'Успешный добровольный отказ от преступления' ||
            selectedOffenses.some((o) => o.modifiers.includes('Гипноз')) ||
            selectedOffenses.some((o) => o.modifiers.includes('Крайняя необходимость')) ||
            selectedOffenses.some((o) => o.modifiers.includes('Допустимая самооборона'))
        ) {
            finalPenalty = 'Снятие обвинений';
        } else if (isDeathPenalty) {
            finalPenalty = 'Высшая мера наказания';
        } else if (isLifeSentence) {
            finalPenalty = 'Пожизненное заключение';
        } else {
            finalPenalty = `${totalMinutes} минут тюремного заключения`;
        }

        let disciplinaryPenalty = disciplinaryPenalties[maxSeverity];
        if (
            guilt === 'Отсутствие вины' ||
            completion === 'Успешный добровольный отказ от преступления' ||
            selectedOffenses.some((o) => o.modifiers.includes('Гипноз')) ||
            selectedOffenses.some((o) => o.modifiers.includes('Крайняя необходимость')) ||
            selectedOffenses.some((o) => o.modifiers.includes('Допустимая самооборона'))
        ) {
            disciplinaryPenalty = 'Не предусмотрено';
        }

        const totalSeconds = baseStartSeconds + timer.elapsedSeconds;
        const currentTime = totalSeconds.toString();
        const currentDate = '27.04.3025';
        const documentText = `
[color=#982a2d]███░███░░░░██░░░░[/color]
[color=#982a2d]░██░████░░░██░░░░[/color]        [head=3]Бланк документа[/head]
[color=#982a2d]░░█░██░██░░██░█░░[/color]                [head=3]NanoTrasen[/head]
[color=#982a2d]░░░░██░░██░██░██░[/color]           [bold]${settings.station} СБ[/bold]
[color=#982a2d]░░░░██░░░████░███[/color]
=============================================
                                       ПРИГОВОР
=============================================
Время от начала смены и дата: [bold]${currentTime}[/bold], [bold]${currentDate}[/bold]
Составитель документа: [bold]${settings.fullName}[/bold]
Должность составителя: [bold]${settings.position}[/bold]

Я, ${settings.fullName}, в должности ${settings.position}, выношу приговор согласно данным мне полномочиям в отношении [bold]${objectDetails.fullName}[/bold], в должности [bold]${objectDetails.position}[/bold].

Данное лицо нарушило следующие статьи Корпоративного Закона:
${offenseDetails.map((detail) => `[bullet/][bold]${detail}[/bold]`).join('\n')}

С учетом всех смягчающих и отягчающих обстоятельств, правовое наказание данного лица представлено в виде:
[bullet/][bold]${finalPenalty}[/bold]

Административное наказание:
[bullet/][bold]${disciplinaryPenalty}[/bold]

Срок заключения под стражу отсчитывается с: [bold]${currentTime}[/bold]
=============================================
                                [italic]Место для печатей[/italic]
    `;

        setResult({
            penalty: finalPenalty,
            documentText,
        });
        setIsResultModalOpen(true);
    };

    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            alert('Текст скопирован в буфер обмена!');
        } catch (err) {
            console.error('Ошибка при копировании текста:', err);
            alert('Не удалось скопировать текст. Пожалуйста, скопируйте вручную.');
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-4">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold font-anta">NanoTrasen Warden Helper</h1>
                <button
                    onClick={() => setIsSettingsModalOpen(true)}
                    className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
                >
                    Настройки
                </button>
            </div>

            <SettingsModal
                isOpen={isSettingsModalOpen}
                onRequestClose={() => setIsSettingsModalOpen(false)}
                settings={settings}
                setSettings={setSettings}
                timer={timer}
                setTimer={setTimer}
                startTimeInput={startTimeInput}
                setStartTimeInput={setStartTimeInput}
                baseStartSeconds={baseStartSeconds}
                setBaseStartSeconds={setBaseStartSeconds}
            />

            <ObjectDetails objectDetails={objectDetails} setObjectDetails={setObjectDetails} />

            <OffensesTable selectedOffenses={selectedOffenses} toggleOffense={toggleOffense} />

            <SelectedOffensesList
                selectedOffenses={selectedOffenses}
                toggleOffense={toggleOffense}
                openModifiersModal={openModifiersModal}
            />

            <button
                onClick={openGuiltModal}
                className="mt-4 px-4 py-2 bg-green-600 rounded hover:bg-green-700"
            >
                Вынести вердикт
            </button>

            <GuiltModal
                isOpen={isGuiltModalOpen}
                onRequestClose={() => setIsGuiltModalOpen(false)}
                handleGuiltSelection={handleGuiltSelection}
            />

            <CompletionModal
                isOpen={isCompletionModalOpen}
                onRequestClose={() => setIsCompletionModalOpen(false)}
                handleCompletionSelection={handleCompletionSelection}
            />

            <ComplicityModal
                isOpen={isComplicityModalOpen}
                onRequestClose={() => setIsComplicityModalOpen(false)}
                handleComplicitySelection={handleComplicitySelection}
            />

            <ModifiersModal
                isOpen={isModifiersModalOpen}
                onRequestClose={() => setIsModifiersModalOpen(false)}
                currentOffenseCode={currentOffenseCode}
                selectedOffenses={selectedOffenses}
                setSelectedOffenses={setSelectedOffenses}
                handleModifiersSelection={handleModifiersSelection}
            />

            <GlobalModifiersModal
                isOpen={isGlobalModifiersModalOpen}
                onRequestClose={() => setIsGlobalModifiersModalOpen(false)}
                globalModifiers={globalModifiers}
                setGlobalModifiers={setGlobalModifiers}
                handleGlobalModifiersSelection={handleGlobalModifiersSelection}
            />

            <ResultModal
                isOpen={isResultModalOpen}
                onRequestClose={() => setIsResultModalOpen(false)}
                result={result}
                copyToClipboard={copyToClipboard}
            />
        </div>
    );
};

export default App;