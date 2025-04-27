import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#root');

interface Offense {
    code: string;
    title: string;
    description: string;
    chapter: string;
    severity: string;
}

const offenses: Offense[] = [
    { code: '111', title: 'Оскорбление символов власти', description: 'Неуважение к корпорации NanoTrasen, ее символике...', chapter: '11X', severity: 'XX1' },
    { code: '112', title: 'Сопротивление органам власти', description: 'Несоблюдение законных требований представителей власти...', chapter: '11X', severity: 'XX2' },
    { code: '113', title: 'Забастовка', description: 'Несанкционированный отказ от работы сотрудников...', chapter: '11X', severity: 'XX3' },
    { code: '115', title: 'Неподчинение в ЧС', description: 'Неисполнение законных требований квалифицированного персонала...', chapter: '11X', severity: 'XX5' },
    { code: '116', title: 'Мятеж', description: 'Вооруженное выступление, возникшее стихийно...', chapter: '11X', severity: 'XX6' },
    { code: '121', title: 'Неуважение к суду', description: 'Неуважения к суду, участникам судебного заседания...', chapter: '12X', severity: 'XX1' },
    { code: '122', title: 'Сокрытие преступления', description: 'Заранее не обещанное укрывательство легкого, среднего или тяжкого...', chapter: '12X', severity: 'XX2' },
    { code: '123', title: 'Побег из места заключения', description: 'Незаконный выход с территории временного заключения...', chapter: '12X', severity: 'XX3' },
    { code: '124', title: 'Неисполнение приговора суда', description: 'Невыполнение или ненадлежащее исполнение решения, постановления суда...', chapter: '12X', severity: 'XX4' },
    { code: '125', title: 'Сокрытие крупного преступления', description: 'Заранее не обещанное укрывательство особо тяжкого...', chapter: '12X', severity: 'XX5' },
    { code: '126', title: 'Побег из места пожизненного заключения', description: 'Незаконный выход с территории пожизненного заключения...', chapter: '12X', severity: 'XX6' },
    { code: '131', title: 'Пропаганда запрещённых организаций', description: 'Массовая демонстрация предметов с символикой запрещённых организаций...', chapter: '13X', severity: 'XX1' },
    { code: '133', title: 'Саботаж', description: 'Помеха работе отдела или создание частичной неработоспособности...', chapter: '13X', severity: 'XX3' },
    { code: '135', title: 'Членство в преступных группировках', description: 'Членство в группировках, запрещенных корпорацией NanoTrasen...', chapter: '13X', severity: 'XX5' },
    { code: '136', title: 'Крупный саботаж', description: 'Нанесение значительного ущерба станции...', chapter: '13X', severity: 'XX6' },
    { code: '141', title: 'Неисполнение особых распоряжений', description: 'Неисполнение особых распоряжений', chapter: '14X', severity: 'XX1' },
    { code: '142', title: 'Халатность', description: 'Неисполнение или ненадлежащее исполнение профессиональных обязанностей...', chapter: '14X', severity: 'XX2' },
    { code: '144', title: 'Грубая халатность', description: 'Неисполнение или ненадлежащее исполнение профессиональных обязанностей...', chapter: '14X', severity: 'XX4' },
    { code: '145', title: 'Самоуправство', description: 'Незаконное присвоение полномочий должностного лица...', chapter: '14X', severity: 'XX5' },
    { code: '212', title: 'Нанесение легких телесных повреждений', description: 'Причинение вреда здоровью, не опасного для жизни...', chapter: '21X', severity: 'XX2' },
    { code: '213', title: 'Причинение среднего вреда здоровью', description: 'Причинение вреда здоровью, не опасного для жизни и требующего...', chapter: '21X', severity: 'XX3' },
    { code: '214', title: 'Причинение тяжкого вреда здоровью', description: 'Причинение вреда здоровью, опасного для жизни...', chapter: '21X', severity: 'XX4' },
    { code: '215', title: 'Причинение смерти', description: 'Противозаконное лишение жизни разумного существа...', chapter: '21X', severity: 'XX5' },
    { code: '216', title: 'Уничтожение тела', description: 'Причинение смерти с отсутствием возможности клонирования...', chapter: '21X', severity: 'XX6' },
    { code: '221', title: 'Оскорбление, клевета', description: 'Нарушение личных границ, приставания...', chapter: '22X', severity: 'XX1' },
    { code: '223', title: 'Дача ложных показаний', description: 'Дача ложных показаний, которые могли привести или привели...', chapter: '22X', severity: 'XX3' },
    { code: '224', title: 'Незаконное ограничение свободы', description: 'Незаконные захват, перемещение и последующее удержание...', chapter: '22X', severity: 'XX4' },
    { code: '311', title: 'Мелкая кража', description: 'Тайное хищение имущества общего пользования...', chapter: '31X', severity: 'XX1' },
    { code: '312', title: 'Кража', description: 'Тайное хищение личных вещей, имущества отделов станции...', chapter: '31X', severity: 'XX2' },
    { code: '313', title: 'Грабеж', description: 'Открытое хищение чужого имущества...', chapter: '31X', severity: 'XX3' },
    { code: '314', title: 'Крупное хищение', description: 'Хищение редкого или важного для работы отделов имущества...', chapter: '31X', severity: 'XX4' },
    { code: '315', title: 'Разбой', description: 'Нападение в целях хищения чужого имущества...', chapter: '31X', severity: 'XX5' },
    { code: '316', title: 'Хищение особо ценного имущества', description: 'Незаконное присвоение особо ценного или же критически важного...', chapter: '31X', severity: 'XX6' },
    { code: '321', title: 'Порча имущества', description: 'Повреждение или порча имущества общего пользования...', chapter: '32X', severity: 'XX1' },
    { code: '322', title: 'Порча ценного имущества', description: 'Повреждение корпуса киборгов и иных синтетиков...', chapter: '32X', severity: 'XX2' },
    { code: '323', title: 'Уничтожение имущества', description: 'Уничтожение имущества общего пользования...', chapter: '32X', severity: 'XX3' },
    { code: '324', title: 'Уничтожение ценного имущества', description: 'Уничтожение корпуса или изменение законов киборгов...', chapter: '32X', severity: 'XX4' },
    { code: '326', title: 'Уничтожение особо ценного имущества', description: 'Уничтожение особо ценного или же критически важного оборудования...', chapter: '32X', severity: 'XX6' },
    { code: '411', title: 'Хулиганство', description: 'Нарушение общественного порядка, выражающее явное неуважение...', chapter: '41X', severity: 'XX1' },
    { code: '413', title: 'Мошенничество', description: 'Хищение или приобретение права на имущества общего пользования...', chapter: '41X', severity: 'XX3' },
    { code: '415', title: 'Крупное мошенничество', description: 'Хищение или приобретение права редкое или важного имущество...', chapter: '41X', severity: 'XX5' },
    { code: '416', title: 'Террористический акт', description: 'Действия, направленные на дестабилизацию деятельности органов власти...', chapter: '41X', severity: 'XX6' },
    { code: '421', title: 'Необоснованное посещение технических помещений, космоса', description: 'Нахождение на территории технических помещений...', chapter: '42X', severity: 'XX1' },
    { code: '422', title: 'Проникновение на территорию отдела', description: 'Нахождение на территории закрытого отдела...', chapter: '42X', severity: 'XX2' },
    { code: '423', title: 'Проникновение в стратегическую точку', description: 'Нахождение на территории стратегической точки...', chapter: '42X', severity: 'XX3' },
    { code: '424', title: 'Проникновение в защищенную стратегическую точку', description: 'Нахождение на территории защищённой стратегической точки...', chapter: '42X', severity: 'XX4' },
    { code: '425', title: 'Незаконная эвакуация с территории комплекса', description: 'Несанкционированный вылет с территории действия блюспейс маяка...', chapter: '42X', severity: 'XX5' },
    { code: '426', title: 'Проникновение на территорию объекта NanoTrasen', description: 'Нахождение на территории NanoTrasen, не имея соответствующего разрешения...', chapter: '42X', severity: 'XX6' },
    { code: '431', title: 'Незаконное ношение форменной одежды', description: 'Незаконное ношение комбинезона, скафандра или КПК...', chapter: '43X', severity: 'XX1' },
    { code: '432', title: 'Незаконное владение опасными предметами', description: 'Незаконное владение опасными инструментами...', chapter: '43X', severity: 'XX2' },
    { code: '433', title: 'Нарушение порядка владения регулируемыми предметами', description: 'Незаконное владение предметами, предназначенными для летального боя...', chapter: '43X', severity: 'XX3' },
    { code: '434', title: 'Незаконное владение предметами ограниченного оборота', description: 'Незаконное владение огнестрельным оружием...', chapter: '43X', severity: 'XX4' },
    { code: '435', title: 'Незаконное владение контрабандными предметами', description: 'Незаконное владение оборудованием и экипировкой вражеских организаций...', chapter: '43X', severity: 'XX5' },
    { code: '436', title: 'Незаконное владение террористическими средствами', description: 'Незаконное владение предметами со свойствами массового поражения...', chapter: '43X', severity: 'XX6' },
];

const severityPenalties: Record<string, string> = {
    XX1: '5 минут тюремного заключения',
    XX2: '10 минут тюремного заключения',
    XX3: '15 минут тюремного заключения',
    XX4: '25 минут тюремного заключения',
    XX5: 'Пожизненное заключение',
    XX6: 'Высшая мера наказания',
};

const severityMinutes: Record<string, number> = {
    XX1: 5,
    XX2: 10,
    XX3: 15,
    XX4: 25,
    XX5: Infinity,
    XX6: Infinity,
};

const App: React.FC = () => {
    const [selectedOffenses, setSelectedOffenses] = useState<string[]>([]);
    const [isGuiltModalOpen, setIsGuiltModalOpen] = useState(false);
    const [isModifiersModalOpen, setIsModifiersModalOpen] = useState(false);
    const [isResultModalOpen, setIsResultModalOpen] = useState(false);
    const [guilt, setGuilt] = useState<string | null>(null);
    const [modifiers, setModifiers] = useState<string[]>([]);
    const [settings, setSettings] = useState({
        fullName: '',
        position: 'Смотритель',
        station: '',
    });
    const [timer, setTimer] = useState({ elapsedSeconds: 0, running: false });
    const [objectDetails, setObjectDetails] = useState({ fullName: '', position: '' });

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

    const startTimer = () => {
        setTimer({ elapsedSeconds: 0, running: true });
    };

    const formatTime = (seconds: number) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes
            .toString()
            .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const toggleOffense = (code: string) => {
        setSelectedOffenses((prev) =>
            prev.includes(code)
                ? prev.filter((c) => c !== code)
                : [...prev, code]
        );
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
        setIsModifiersModalOpen(true);
    };

    const handleModifiersSelection = () => {
        setIsModifiersModalOpen(false);
        calculateVerdict();
    };

    const calculateVerdict = () => {
        if (!guilt) return;

        // Group offenses by chapter and select the most severe per chapter
        const chapters: Record<string, Offense[]> = {};
        selectedOffenses.forEach((code) => {
            const offense = offenses.find((o) => o.code === code);
            if (offense) {
                if (!chapters[offense.chapter]) chapters[offense.chapter] = [];
                chapters[offense.chapter].push(offense);
            }
        });

        const finalOffenses: Offense[] = [];
        Object.values(chapters).forEach((chapterOffenses) => {
            const mostSevere = chapterOffenses.reduce((prev, curr) => {
                const prevSeverity = Object.keys(severityMinutes).indexOf(prev.severity);
                const currSeverity = Object.keys(severityMinutes).indexOf(curr.severity);
                return currSeverity > prevSeverity ? curr : prev;
            });
            finalOffenses.push(mostSevere);
        });

        // Calculate total penalty
        let totalMinutes = 0;
        let isLifeSentence = false;
        let isDeathPenalty = false;
        const offenseDetails: string[] = [];

        finalOffenses.forEach((offense) => {
            let minutes = severityMinutes[offense.severity];
            let appliedModifiers: string[] = [];

            // Apply guilt modifier
            if (guilt === 'по неосторожности') {
                minutes = Math.max(0, minutes - 5);
                appliedModifiers.push('Преступление, совершенное по неосторожности (-5 минут)');
            }

            // Apply other modifiers
            if (modifiers.includes('Допустимая самооборона')) {
                minutes = 0;
                appliedModifiers.push('Допустимая самооборона (снятие наказания)');
            }
            if (modifiers.includes('Должностное преступление')) {
                minutes += 10;
                appliedModifiers.push('Должностное преступление (+10 минут)');
            }
            if (modifiers.includes('Преступление против должностного лица')) {
                minutes += 10;
                appliedModifiers.push('Преступление против должностного лица (+10 минут)');
            }
            if (modifiers.includes('Явка с повинной')) {
                minutes = Math.max(0, minutes - 5);
                appliedModifiers.push('Явка с повинной (-5 минут)');
            }

            if (offense.severity === 'XX5') isLifeSentence = true;
            if (offense.severity === 'XX6') isDeathPenalty = true;

            totalMinutes += minutes;
            offenseDetails.push(`[${offense.code} - ${offense.title}], модификаторы: ${appliedModifiers.length > 0 ? appliedModifiers.join(', ') : 'отсутствуют'}`);
        });

        // Apply recidivism modifier to total
        const recidivismCount = modifiers.filter((m) => m.startsWith('Рецидив')).length;
        const recidivismMinutes = recidivismCount * 5;
        totalMinutes += recidivismMinutes;
        if (recidivismCount > 0) {
            offenseDetails.push(`Рецидив (+${recidivismMinutes} минут за ${recidivismCount} случаев)`);
        }

        // Determine final penalty
        let finalPenalty = '';
        if (guilt === 'отсутствие вины' || modifiers.includes('Допустимая самооборона')) {
            finalPenalty = 'Снятие наказания';
        } else if (isDeathPenalty) {
            finalPenalty = 'Высшая мера наказания';
        } else if (isLifeSentence) {
            finalPenalty = 'Пожизненное заключение';
        } else {
            finalPenalty = `${totalMinutes} минут тюремного заключения`;
        }

        // Generate document text
        const currentTime = formatTime(timer.elapsedSeconds);
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
[bullet/][bold]${finalPenalty}[/bold]

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

    const [result, setResult] = useState<{ penalty: string; documentText: string } | null>(null);

    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            alert('Текст скопирован в буфер обмена!');
        } catch (err) {
            console.error('Ошибка при копировании текста:', err);
            alert('Не удалось скопировать текст. Пожалуйста, скопируйте вручную.');
        }
    };

    const chapters = [
        { section: '1XX', chapters: ['11X', '12X', '13X', '14X'] },
        { section: '2XX', chapters: ['21X', '22X'] },
        { section: '3XX', chapters: ['31X', '32X'] },
        { section: '4XX', chapters: ['41X', '42X', '43X'] },
    ];

    return (
        <div className="min-h-screen bg-gray-900 text-white p-4">
            {/* Settings Section */}
            <div className="mb-4 p-4 bg-gray-800 rounded-lg">
                <h2 className="text-xl font-bold mb-2">Настройки</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                        <input
                            type="text"
                            value={settings.position}
                            onChange={(e) => setSettings({ ...settings, position: e.target.value })}
                            className="w-full p-2 bg-gray-700 rounded"
                            placeholder="Смотритель"
                        />
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
                <button
                    onClick={startTimer}
                    className="mt-4 px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
                    disabled={timer.running}
                >
                    Старт таймера
                </button>
                {timer.running && (
                    <p className="mt-2">Текущее время: {formatTime(timer.elapsedSeconds)}</p>
                )}
            </div>

            {/* Object Details */}
            <div className="mb-4 p-4 bg-gray-800 rounded-lg">
                <h2 className="text-xl font-bold mb-2">Данные объекта</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block mb-1">ФИО объекта:</label>
                        <input
                            type="text"
                            value={objectDetails.fullName}
                            onChange={(e) => setObjectDetails({ ...objectDetails, fullName: e.target.value })}
                            className="w-full p-2 bg-gray-700 rounded"
                            placeholder="Петров Петр"
                        />
                    </div>
                    <div>
                        <label className="block mb-1">Должность объекта:</label>
                        <input
                            type="text"
                            value={objectDetails.position}
                            onChange={(e) => setObjectDetails({ ...objectDetails, position: e.target.value })}
                            className="w-full p-2 bg-gray-700 rounded"
                            placeholder="Инженер"
                        />
                    </div>
                </div>
            </div>

            {/* Offenses Table */}
            <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead>
                    <tr>
                        <th className="bg-gray-800 p-2" rowSpan={2}>Раздел</th>
                        <th className="bg-gray-800 p-2" rowSpan={2}>Глава</th>
                        <th className="bg-gray-800 p-2" colSpan={6}>Статьи</th>
                    </tr>
                    <tr>
                        <th className="bg-green-800 p-2">XX1<br />Незначительные правонарушения</th>
                        <th className="bg-yellow-800 p-2">XX2<br />Легкие правонарушения</th>
                        <th className="bg-orange-800 p-2">XX3<br />Средние правонарушения</th>
                        <th className="bg-red-800 p-2">XX4<br />Тяжкие правонарушения</th>
                        <th className="bg-red-900 p-2">XX5<br />Особо тяжкие правонарушения</th>
                        <th className="bg-black p-2">XX6<br />Критические правонарушения</th>
                    </tr>
                    </thead>
                    <tbody>
                    {chapters.map((section) => (
                        section.chapters.map((chapter, idx) => {
                            const chapterOffenses = offenses.filter((o) => o.chapter === chapter);
                            return (
                                <tr key={chapter}>
                                    {idx === 0 && (
                                        <th className="bg-gray-800 p-2" rowSpan={section.chapters.length}>{section.section}</th>
                                    )}
                                    <th className="bg-gray-800 p-2">{chapter}</th>
                                    {['XX1', 'XX2', 'XX3', 'XX4', 'XX5', 'XX6'].map((severity) => {
                                        const offense = chapterOffenses.find((o) => o.severity === severity);
                                        const isSelected = offense && selectedOffenses.includes(offense.code);
                                        return (
                                            <td
                                                key={severity}
                                                className={`p-2 cursor-pointer border border-gray-700 ${
                                                    isSelected
                                                        ? 'bg-indigo-500' // Изменили цвет выделения на более мягкий индиго
                                                        : severity === 'XX1'
                                                            ? 'bg-green-800'
                                                            : severity === 'XX2'
                                                                ? 'bg-yellow-800'
                                                                : severity === 'XX3'
                                                                    ? 'bg-orange-800'
                                                                    : severity === 'XX4'
                                                                        ? 'bg-red-800'
                                                                        : severity === 'XX5'
                                                                            ? 'bg-red-900'
                                                                            : 'bg-black'
                                                }`}
                                                onClick={() => {
                                                    if (offense) {
                                                        toggleOffense(offense.code);
                                                    }
                                                }}
                                            >
                                                {offense ? (
                                                    <span className="tooltip relative">
                              <i>{offense.title}</i>
                              <span className="tooltiptext">
                                <b>{offense.code}</b><br />
                                  {offense.description}
                              </span>
                            </span>
                                                ) : ''}
                                            </td>
                                        );
                                    })}
                                </tr>
                            );
                        })
                    ))}
                    </tbody>
                </table>
            </div>

            {/* Selected Offenses List */}
            <div className="mt-4 p-4 bg-gray-800 rounded-lg">
                <h2 className="text-xl font-bold mb-2">Выбранные статьи</h2>
                {selectedOffenses.length > 0 ? (
                    <ul className="list-disc pl-5">
                        {selectedOffenses.map((code) => {
                            const offense = offenses.find((o) => o.code === code);
                            return (
                                <li key={code}>
                                    {offense?.code} - {offense?.title}
                                    <button
                                        onClick={() => toggleOffense(code)}
                                        className="ml-2 px-2 py-1 bg-red-600 rounded hover:bg-red-700"
                                    >
                                        Удалить
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                ) : (
                    <p>Статьи не выбраны.</p>
                )}
            </div>

            <button
                onClick={openGuiltModal}
                className="mt-4 px-4 py-2 bg-green-600 rounded hover:bg-green-700"
            >
                Вынести вердикт
            </button>

            {/* Guilt Modal */}
            <Modal
                isOpen={isGuiltModalOpen}
                onRequestClose={() => setIsGuiltModalOpen(false)}
                className="bg-gray-800 p-6 rounded-lg max-w-md mx-auto mt-20 text-white"
                overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
            >
                <h2 className="text-xl font-bold mb-4">Форма вины</h2>
                <div className="space-y-2">
                    <button
                        onClick={() => handleGuiltSelection('умышленно')}
                        className="w-full p-2 bg-blue-600 rounded hover:bg-blue-700"
                    >
                        Преступление, совершенное умышленно (полное наказание)
                    </button>
                    <button
                        onClick={() => handleGuiltSelection('по неосторожности')}
                        className="w-full p-2 bg-blue-600 rounded hover:bg-blue-700"
                    >
                        Преступление, совершенное по неосторожности (-5 минут к наказанию)
                    </button>
                    <button
                        onClick={() => handleGuiltSelection('отсутствие вины')}
                        className="w-full p-2 bg-blue-600 rounded hover:bg-blue-700"
                    >
                        Отсутствие вины (снятие наказания)
                    </button>
                </div>
                <button
                    onClick={() => setIsGuiltModalOpen(false)}
                    className="mt-4 px-4 py-2 bg-red-600 rounded hover:bg-red-700"
                >
                    Закрыть
                </button>
            </Modal>

            {/* Modifiers Modal */}
            <Modal
                isOpen={isModifiersModalOpen}
                onRequestClose={() => setIsModifiersModalOpen(false)}
                className="bg-gray-800 p-6 rounded-lg max-w-md mx-auto mt-20 text-white"
                overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
            >
                <h2 className="text-xl font-bold mb-4">Необязательные модификаторы</h2>
                <div className="space-y-2">
                    {[
                        'Допустимая самооборона (снятие наказания)',
                        'Должностное преступление (+10 минут к наказанию)',
                        'Преступление против должностного лица (+10 минут к наказанию)',
                        'Явка с повинной (-5 минут к наказанию)',
                        'Рецидив (+5 минут к наказанию за каждый случай рецидива)',
                    ].map((modifier) => (
                        <div key={modifier} className="flex items-center">
                            <input
                                type="checkbox"
                                checked={modifiers.includes(modifier)}
                                onChange={() => {
                                    if (modifier.startsWith('Рецидив')) {
                                        if (modifiers.includes(modifier)) {
                                            setModifiers(modifiers.filter((m) => !m.startsWith('Рецидив')));
                                        } else {
                                            setModifiers([...modifiers, modifier]);
                                        }
                                    } else {
                                        setModifiers(
                                            modifiers.includes(modifier)
                                                ? modifiers.filter((m) => m !== modifier)
                                                : [...modifiers, modifier]
                                        );
                                    }
                                }}
                                className="mr-2"
                            />
                            <label>{modifier}</label>
                        </div>
                    ))}
                    {modifiers.some((m) => m.startsWith('Рецидив')) && (
                        <div className="flex items-center mt-2">
                            <label className="mr-2">Количество случаев рецидива:</label>
                            <input
                                type="number"
                                min="1"
                                value={modifiers.filter((m) => m.startsWith('Рецидив')).length}
                                onChange={(e) => {
                                    const count = parseInt(e.target.value) || 1;
                                    const newModifiers = modifiers.filter((m) => !m.startsWith('Рецидив'));
                                    for (let i = 0; i < count; i++) {
                                        newModifiers.push('Рецидив (+5 минут к наказанию за каждый случай рецидива)');
                                    }
                                    setModifiers(newModifiers);
                                }}
                                className="p-1 bg-gray-700 rounded w-16"
                            />
                        </div>
                    )}
                </div>
                <button
                    onClick={handleModifiersSelection}
                    className="mt-4 px-4 py-2 bg-green-600 rounded hover:bg-green-700"
                >
                    Подтвердить
                </button>
                <button
                    onClick={() => setIsModifiersModalOpen(false)}
                    className="mt-2 px-4 py-2 bg-red-600 rounded hover:bg-red-700"
                >
                    Закрыть
                </button>
            </Modal>

            {/* Result Modal */}
            <Modal
                isOpen={isResultModalOpen}
                onRequestClose={() => setIsResultModalOpen(false)}
                className="bg-gray-800 p-6 rounded-lg max-w-2xl mx-auto mt-20 text-white"
                overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
            >
                <h2 className="text-xl font-bold mb-4">Приговор</h2>
                <p className="mb-4">Итоговое наказание: <b>{result?.penalty}</b></p>
                <textarea
                    className="w-full h-64 p-2 bg-gray-700 rounded mb-4"
                    value={result?.documentText}
                    readOnly
                />
                <button
                    onClick={() => copyToClipboard(result?.documentText || '')}
                    className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
                >
                    Скопировать в буфер
                </button>
                <button
                    onClick={() => setIsResultModalOpen(false)}
                    className="mt-2 ml-2 px-4 py-2 bg-red-600 rounded hover:bg-red-700"
                >
                    Закрыть
                </button>
            </Modal>
        </div>
    );
};

export default App;