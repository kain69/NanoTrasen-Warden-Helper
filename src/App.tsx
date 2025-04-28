import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { offenses, severityMinutes, disciplinaryPenalties } from './data/offenses';
import SettingsModal from './components/SettingsModal';
import ObjectDetails from './components/ObjectDetails';
import OffensesTable from './components/OffensesTable';
import SelectedOffensesList from './components/SelectedOffensesList';
import ModifiersModal from './components/ModifiersModal';
import GlobalModifiersModal from './components/GlobalModifiersModal';
import ResultModal from './components/ResultModal';
import WarningModal from './components/WarningModal';
import ConfirmModal from './components/ConfirmModal';
import VerdictHistoryModal from './components/VerdictHistoryModal';
import {
    OffenseWithModifiers,
    GlobalModifiers,
    Settings,
    Timer,
    ObjectDetails as ObjectDetailsType,
    Result,
    VerdictHistoryEntry,
} from './types';
import { v4 as uuidv4 } from 'uuid';

Modal.setAppElement('#root');

const App: React.FC = () => {
    const [selectedOffenses, setSelectedOffenses] = useState<OffenseWithModifiers[]>([]);
    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
    const [isModifiersModalOpen, setIsModifiersModalOpen] = useState(false);
    const [isGlobalModifiersModalOpen, setIsGlobalModifiersModalOpen] = useState(false);
    const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [isResultModalOpen, setIsResultModalOpen] = useState(false);
    const [isVerdictHistoryModalOpen, setIsVerdictHistoryModalOpen] = useState(false);
    const [warningMessage, setWarningMessage] = useState('');
    const [currentOffenseCode, setCurrentOffenseCode] = useState<string | null>(null);
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
    const [objectDetails, setObjectDetails] = useState<ObjectDetailsType>({
        fullName: '',
        position: '',
    });
    const [result, setResult] = useState<Result | null>(null);
    const [pendingVerdict, setPendingVerdict] = useState<{
        totalMinutes: number;
        finalOffenses: OffenseWithModifiers[];
        maxSeverity: string;
        offenseDetails: string[];
        isLifeSentence: boolean;
        isDeathPenalty: boolean;
        xx5Count: number;
    } | null>(null);
    const [pendingHistoryEntry, setPendingHistoryEntry] = useState<VerdictHistoryEntry | null>(null);
    const [showSeconds, setShowSeconds] = useState<boolean>(false);

    const [verdictHistory, setVerdictHistory] = useState<VerdictHistoryEntry[]>(() => {
        const saved = localStorage.getItem('verdictHistory');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('verdictHistory', JSON.stringify(verdictHistory));
    }, [verdictHistory]);

    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
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
            const selectedOffense = offenses.find((o) => o.code === code);
            if (!selectedOffense) return prev;

            const existing = prev.find((o) => o.code === code);
            if (existing) {
                return prev.filter((o) => o.code !== code);
            } else {
                const sameChapterOffense = prev.find((o) => {
                    const offense = offenses.find((off) => off.code === o.code);
                    return offense && offense.chapter === selectedOffense.chapter;
                });

                if (sameChapterOffense) {
                    return [
                        ...prev.filter((o) => o.code !== sameChapterOffense.code),
                        { code, modifiers: [] },
                    ];
                } else {
                    return [...prev, { code, modifiers: [] }];
                }
            }
        });
    };

    const openModifiersModal = (code: string) => {
        setCurrentOffenseCode(code);
        setIsModifiersModalOpen(true);
    };

    const openVerdictProcess = () => {
        if (selectedOffenses.length === 0) {
            alert('Пожалуйста, выберите хотя бы одну статью.');
            return;
        }
        setCurrentOffenseCode(selectedOffenses[0].code);
        setIsModifiersModalOpen(true);
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

    const resetOffenses = () => {
        setSelectedOffenses([]);
        setGlobalModifiers({
            deal: false,
            dealReduction: 0,
            recidivism: false,
            recidivismCount: 0,
        });
    };

    const getCurrentTimestamp = () => {
        const totalSeconds = baseStartSeconds + timer.elapsedSeconds;
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        const timeString = showSeconds
            ? `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
            : `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

        const currentDate = new Date();
        currentDate.setFullYear(currentDate.getFullYear() + 1000);
        const gameDate = currentDate.toLocaleDateString('ru-RU');

        return `${timeString}, ${gameDate}`;
    };

    const finalizeVerdict = (
        finalPenalty: string,
        disciplinaryPenalty: string,
        offenseDetails: string[]
    ) => {
        const totalSeconds = baseStartSeconds + timer.elapsedSeconds;
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        const currentTime = showSeconds
            ? `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
            : `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

        const currentDate = new Date();
        currentDate.setFullYear(currentDate.getFullYear() + 1000);
        const gameDate = currentDate.toLocaleDateString('ru-RU');

        const documentText = `
[color=#982a2d]███░███░░░░██░░░░[/color]
[color=#982a2d]░██░████░░██░░░░[/color]        [head=3]Бланк документа[/head]
[color=#982a2d]░░█░██░██░░██░█░░[/color]                [head=3]NanoTrasen[/head]
[color=#982a2d]░░░░██░░██░██░██░[/color]           [bold]${settings.station} СБ[/bold]
[color=#982a2d]░░░░██░░░████░███[/color]
=============================================
                                       ПРИГОВОР
=============================================
Время от начала смены и дата: [bold]${currentTime}[/bold], [bold]${gameDate}[/bold]
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

        const result = {
            penalty: finalPenalty,
            disciplinaryPenalty: disciplinaryPenalty,
            documentText,
        };

        setResult(result);

        const timestamp = getCurrentTimestamp();
        const historyEntry: VerdictHistoryEntry = {
            id: uuidv4(),
            timestamp,
            fullName: objectDetails.fullName,
            position: objectDetails.position,
            penalty: finalPenalty,
            disciplinaryPenalty: disciplinaryPenalty,
            documentText,
            offenseDetails,
        };
        setPendingHistoryEntry(historyEntry);
        setIsResultModalOpen(true);
    };

    const handleResultModalClose = () => {
        if (pendingHistoryEntry) {
            setVerdictHistory((prev) => [pendingHistoryEntry, ...prev]);
        }
        setPendingHistoryEntry(null);
        setIsResultModalOpen(false);
    };

    const handleResultModalCloseWithoutSaving = () => {
        setPendingHistoryEntry(null);
        setIsResultModalOpen(false);
    };

    const calculateVerdict = () => {
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

        const xx5Count = finalOffenses.filter((offenseWithMods) => {
            const offense = offenses.find((o) => o.code === offenseWithMods.code)!;
            return offense.severity === 'XX5';
        }).length;

        finalOffenses.forEach((offenseWithMods) => {
            const offense = offenses.find((o) => o.code === offenseWithMods.code)!;
            let minutes = severityMinutes[offense.severity];
            const appliedModifiers: string[] = [];

            const severityOrder = ['XX1', 'XX2', 'XX3', 'XX4', 'XX5', 'XX6'];
            if (severityOrder.indexOf(offense.severity) > severityOrder.indexOf(maxSeverity)) {
                maxSeverity = offense.severity;
            }

            const isNegligenceOrGrossNegligence = ['Халатность', 'Грубая халатность'].includes(offense.title);
            const isHighSeverity = ['XX4', 'XX5', 'XX6'].includes(offense.severity);
            const isDutyRelatedChapter = offense.chapter.startsWith('21X') || offense.chapter.startsWith('22X');
            const isExecutor = offenseWithMods.modifiers.includes('Исполнитель');
            const isOrganizer = offenseWithMods.modifiers.includes('Организатор');

            if (offenseWithMods.modifiers.includes('Преступление, совершенное умышленно')) {
                appliedModifiers.push('Преступление, совершенное умышленно (полное наказание)');
            }
            if (offenseWithMods.modifiers.includes('Преступление, совершенное по неосторожности')) {
                if (!isNegligenceOrGrossNegligence) {
                    minutes = Math.max(0, minutes - 5);
                    appliedModifiers.push('Преступление, совершенное по неосторожности (-5 минут)');
                }
            }
            if (offenseWithMods.modifiers.includes('Отсутствие вины')) {
                minutes = 0;
                appliedModifiers.push('Отсутствие вины (снятие обвинений)');
            }

            if (offenseWithMods.modifiers.includes('Оконченное преступление')) {
                appliedModifiers.push('Оконченное преступление (полное наказание)');
            }
            if (offenseWithMods.modifiers.includes('Покушение на преступление')) {
                appliedModifiers.push('Покушение на преступление (полное наказание)');
            }
            if (offenseWithMods.modifiers.includes('Приготовление к преступлению')) {
                if (['XX3', 'XX4', 'XX5', 'XX6'].includes(offense.severity)) {
                    appliedModifiers.push('Приготовление к преступлению (полное наказание)');
                } else {
                    minutes = 0;
                    appliedModifiers.push('Приготовление к преступлению (снятие обвинения)');
                }
            }
            if (offenseWithMods.modifiers.includes('Безуспешный добровольный отказ от преступления')) {
                minutes = Math.max(0, minutes - 5);
                appliedModifiers.push('Безуспешный добровольный отказ от преступления (-5 минут)');
            }
            if (offenseWithMods.modifiers.includes('Успешный добровольный отказ от преступления')) {
                minutes = 0;
                appliedModifiers.push('Успешный добровольный отказ от преступления (снятие обвинений)');
            }

            if (offenseWithMods.modifiers.includes('Организатор')) {
                if (!isExecutor) {
                    minutes += 10;
                    appliedModifiers.push('Организатор (+10 минут)');
                }
            }
            if (offenseWithMods.modifiers.includes('Исполнитель')) {
                if (!isOrganizer) {
                    appliedModifiers.push('Исполнитель (полное наказание)');
                }
            }
            if (offenseWithMods.modifiers.includes('Подстрекатель')) {
                appliedModifiers.push('Подстрекатель (полное наказание)');
            }
            if (offenseWithMods.modifiers.includes('Пособник')) {
                appliedModifiers.push('Пособник (полное наказание)');
            }

            if (offenseWithMods.modifiers.includes('Гипноз')) {
                if (!isHighSeverity) {
                    minutes = 0;
                    appliedModifiers.push('Гипноз (снятие обвинений)');
                }
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
                if (isDutyRelatedChapter) {
                    minutes += 10;
                    appliedModifiers.push('Преступление против должностного лица (+10 минут)');
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
        if (totalMinutes === 0) {
            finalPenalty = 'Снятие обвинений';
        } else if (isDeathPenalty) {
            finalPenalty = 'Высшая мера наказания';
        } else if (isLifeSentence || totalMinutes >= 75) {
            finalPenalty = 'Пожизненное заключение';
            if (xx5Count >= 2) {
                finalPenalty = 'Высшая мера наказания';
            }
        } else if (totalMinutes <= 5 && totalMinutes > 0) {
            setPendingVerdict({
                totalMinutes,
                finalOffenses,
                maxSeverity,
                offenseDetails,
                isLifeSentence,
                isDeathPenalty,
                xx5Count,
            });
            setIsConfirmModalOpen(true);
            return;
        } else {
            finalPenalty = `${totalMinutes} минут тюремного заключения`;
        }

        let disciplinaryPenalty = '';
        if (totalMinutes === 0) {
            disciplinaryPenalty = 'Не предусмотрено';
        } else if (finalPenalty === 'Высшая мера наказания' || finalPenalty === 'Пожизненное заключение') {
            disciplinaryPenalty = 'Увольнение';
        } else if (totalMinutes <= 5) {
            disciplinaryPenalty = 'Не предусмотрено';
        } else if (totalMinutes <= 10) {
            disciplinaryPenalty = disciplinaryPenalties['XX2'];
        } else if (totalMinutes <= 15) {
            disciplinaryPenalty = disciplinaryPenalties['XX3'];
        } else if (totalMinutes <= 25) {
            disciplinaryPenalty = disciplinaryPenalties['XX4'];
        } else {
            disciplinaryPenalty = 'Увольнение';
        }

        const position = settings.position.toLowerCase();
        let canProceed = true;
        let warningMessage = '';

        if (finalPenalty === 'Предупреждение') {
            if (position.includes('кадет')) {
                canProceed = false;
                warningMessage = 'Предупреждение: Вынести приговор о выдаче предупреждения может любой сотрудник службы безопасности, исключая кадетов, а также все вышестоящие лица.';
            }
        } else if (finalPenalty.includes('минут тюремного заключения')) {
            if (
                position.includes('кадет') ||
                (!position.includes('смотритель') &&
                    !position.includes('глава службы безопасности') &&
                    !position.includes('капитан'))
            ) {
                canProceed = false;
                warningMessage = 'Предупреждение: Вынести приговор о временном заключении могут смотритель и все вышестоящие лица.';
            }
        } else if (finalPenalty === 'Пожизненное заключение') {
            if (
                position.includes('кадет') ||
                position.includes('смотритель') ||
                (!position.includes('глава службы безопасности') && !position.includes('капитан'))
            ) {
                canProceed = false;
                warningMessage = 'Предупреждение: Вынести приговор о пожизненном лишении свободы могут глава службы безопасности и все вышестоящие лица.';
            }
        } else if (finalPenalty === 'Высшая мера наказания') {
            if (
                position.includes('кадет') ||
                position.includes('смотритель') ||
                position.includes('глава службы безопасности') ||
                !position.includes('капитан')
            ) {
                canProceed = false;
                warningMessage = 'Предупреждение: Вынести приговор о высшей мере наказания могут капитан и все вышестоящие лица.';
            }
        }

        if (!canProceed) {
            setWarningMessage(warningMessage);
            setPendingVerdict({
                totalMinutes,
                finalOffenses,
                maxSeverity,
                offenseDetails,
                isLifeSentence,
                isDeathPenalty,
                xx5Count,
            });
            setIsWarningModalOpen(true);
            return;
        }

        finalizeVerdict(finalPenalty, disciplinaryPenalty, offenseDetails);
    };

    const handleConfirmReplace = (replace: boolean) => {
        if (!pendingVerdict) return;

        const {
            totalMinutes,
            offenseDetails,
            isLifeSentence,
            isDeathPenalty,
            xx5Count,
        } = pendingVerdict;

        let finalPenalty = '';
        let disciplinaryPenalty = '';

        if (totalMinutes === 0) {
            finalPenalty = 'Снятие обвинений';
            disciplinaryPenalty = 'Не предусмотрено';
        } else if (isDeathPenalty) {
            finalPenalty = 'Высшая мера наказания';
            disciplinaryPenalty = 'Увольнение';
        } else if (isLifeSentence || totalMinutes >= 75) {
            finalPenalty = 'Пожизненное заключение';
            if (xx5Count >= 2) {
                finalPenalty = 'Высшая мера наказания';
            }
            disciplinaryPenalty = 'Увольнение';
        } else if (totalMinutes <= 5 && totalMinutes > 0) {
            finalPenalty = replace ? 'Предупреждение' : `${totalMinutes} минут тюремного заключения`;
            disciplinaryPenalty = replace ? 'Не предусмотрено' : 'Не предусмотрено';
        } else {
            finalPenalty = `${totalMinutes} минут тюремного заключения`;
            if (totalMinutes <= 10) {
                disciplinaryPenalty = disciplinaryPenalties['XX2'];
            } else if (totalMinutes <= 15) {
                disciplinaryPenalty = disciplinaryPenalties['XX3'];
            } else if (totalMinutes <= 25) {
                disciplinaryPenalty = disciplinaryPenalties['XX4'];
            } else {
                disciplinaryPenalty = 'Увольнение';
            }
        }

        setIsConfirmModalOpen(false);

        const position = settings.position.toLowerCase();
        let canProceed = true;
        let warningMessage = '';

        if (finalPenalty === 'Предупреждение') {
            if (position.includes('кадет')) {
                canProceed = false;
                warningMessage = 'Предупреждение: Вынести приговор о выдаче предупреждения может любой сотрудник службы безопасности, исключая кадетов, а также все вышестоящие лица.';
            }
        } else if (finalPenalty.includes('минут тюремного заключения')) {
            if (
                position.includes('кадет') ||
                (!position.includes('смотритель') &&
                    !position.includes('глава службы безопасности') &&
                    !position.includes('капитан'))
            ) {
                canProceed = false;
                warningMessage = 'Предупреждение: Вынести приговор о временном заключении могут смотритель и все вышестоящие лица.';
            }
        } else if (finalPenalty === 'Пожизненное заключение') {
            if (
                position.includes('кадет') ||
                position.includes('смотритель') ||
                (!position.includes('глава службы безопасности') && !position.includes('капитан'))
            ) {
                canProceed = false;
                warningMessage = 'Предупреждение: Вынести приговор о пожизненном лишении свободы могут глава службы безопасности и все вышестоящие лица.';
            }
        } else if (finalPenalty === 'Высшая мера наказания') {
            if (
                position.includes('кадет') ||
                position.includes('смотритель') ||
                position.includes('глава службы безопасности') ||
                !position.includes('капитан')
            ) {
                canProceed = false;
                warningMessage = 'Предупреждение: Вынести приговор о высшей мере наказания могут капитан и все вышестоящие лица.';
            }
        }

        if (!canProceed) {
            setWarningMessage(warningMessage);
            setIsWarningModalOpen(true);
            return;
        }

        finalizeVerdict(finalPenalty, disciplinaryPenalty, offenseDetails);
        setPendingVerdict(null);
    };

    const handleForceVerdict = () => {
        if (!pendingVerdict) return;

        const {
            totalMinutes,
            offenseDetails,
            isLifeSentence,
            isDeathPenalty,
            xx5Count,
        } = pendingVerdict;

        let finalPenalty = '';
        let disciplinaryPenalty = '';

        if (totalMinutes === 0) {
            finalPenalty = 'Снятие обвинений';
            disciplinaryPenalty = 'Не предусмотрено';
        } else if (isDeathPenalty) {
            finalPenalty = 'Высшая мера наказания';
            disciplinaryPenalty = 'Увольнение';
        } else if (isLifeSentence || totalMinutes >= 75) {
            finalPenalty = 'Пожизненное заключение';
            if (xx5Count >= 2) {
                finalPenalty = 'Высшая мера наказания';
            }
            disciplinaryPenalty = 'Увольнение';
        } else if (totalMinutes <= 5 && totalMinutes > 0) {
            finalPenalty = 'Предупреждение';
            disciplinaryPenalty = 'Не предусмотрено';
        } else {
            finalPenalty = `${totalMinutes} минут тюремного заключения`;
            if (totalMinutes <= 10) {
                disciplinaryPenalty = disciplinaryPenalties['XX2'];
            } else if (totalMinutes <= 15) {
                disciplinaryPenalty = disciplinaryPenalties['XX3'];
            } else if (totalMinutes <= 25) {
                disciplinaryPenalty = disciplinaryPenalties['XX4'];
            } else {
                disciplinaryPenalty = 'Увольнение';
            }
        }

        setIsWarningModalOpen(false);
        finalizeVerdict(finalPenalty, disciplinaryPenalty, offenseDetails);
        setPendingVerdict(null);
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
                <div className="flex space-x-2">
                    <button
                        onClick={() => setIsVerdictHistoryModalOpen(true)}
                        className="px-4 py-2 bg-purple-600 rounded hover:bg-purple-700"
                    >
                        История
                    </button>
                    <button
                        onClick={() => setIsSettingsModalOpen(true)}
                        className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
                    >
                        Настройки
                    </button>
                </div>
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
                showSeconds={showSeconds}
                setShowSeconds={setShowSeconds}
            />

            <ObjectDetails objectDetails={objectDetails} setObjectDetails={setObjectDetails} />

            <OffensesTable selectedOffenses={selectedOffenses} toggleOffense={toggleOffense} />

            <SelectedOffensesList
                selectedOffenses={selectedOffenses}
                toggleOffense={toggleOffense}
                openModifiersModal={openModifiersModal}
            />

            <div className="mt-4 flex space-x-4">
                <button
                    onClick={openVerdictProcess}
                    className="px-4 py-2 bg-green-600 rounded hover:bg-green-700"
                >
                    Вынести вердикт
                </button>
                <button
                    onClick={resetOffenses}
                    className="px-4 py-2 bg-red-600 rounded hover:bg-red-700"
                >
                    Сбросить
                </button>
            </div>

            <ModifiersModal
                isOpen={isModifiersModalOpen}
                onRequestClose={() => setIsModifiersModalOpen(false)}
                currentOffenseCode={currentOffenseCode}
                selectedOffenses={selectedOffenses}
                setSelectedOffenses={setSelectedOffenses}
                setCurrentOffenseCode={setCurrentOffenseCode}
                handleModifiersSelection={handleModifiersSelection}
            />

            <GlobalModifiersModal
                isOpen={isGlobalModifiersModalOpen}
                onRequestClose={() => setIsGlobalModifiersModalOpen(false)}
                globalModifiers={globalModifiers}
                setGlobalModifiers={setGlobalModifiers}
                handleGlobalModifiersSelection={handleGlobalModifiersSelection}
                selectedOffenses={selectedOffenses}
                setCurrentOffenseCode={setCurrentOffenseCode}
                setIsModifiersModalOpen={setIsModifiersModalOpen}
                setIsGlobalModifiersModalOpen={setIsGlobalModifiersModalOpen}
            />

            <ResultModal
                isOpen={isResultModalOpen}
                onRequestClose={handleResultModalClose}
                onCloseWithoutSaving={handleResultModalCloseWithoutSaving}
                result={result}
                copyToClipboard={copyToClipboard}
            />

            <WarningModal
                isOpen={isWarningModalOpen}
                onRequestClose={() => setIsWarningModalOpen(false)}
                onForceVerdict={handleForceVerdict}
                message={warningMessage}
            />

            <ConfirmModal
                isOpen={isConfirmModalOpen}
                onRequestClose={() => setIsConfirmModalOpen(false)}
                onConfirm={handleConfirmReplace}
                minutes={pendingVerdict?.totalMinutes || 0}
            />

            <VerdictHistoryModal
                isOpen={isVerdictHistoryModalOpen}
                onRequestClose={() => setIsVerdictHistoryModalOpen(false)}
                verdictHistory={verdictHistory}
                setVerdictHistory={setVerdictHistory}
                copyToClipboard={copyToClipboard}
            />
        </div>
    );
};

export default App;