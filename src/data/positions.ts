export interface Position {
    value: string;
    label: string;
}

export interface PositionGroup {
    label: string;
    positions: Position[];
}

export const objectPositionGroups: PositionGroup[] = [
    {
        label: 'Командование',
        positions: [
            { value: '1', label: 'Капитан' },
            { value: '2', label: 'Глава персонала' },
            { value: '3', label: 'Глава службы безопасности' },
            { value: '6', label: 'Главный врач' },
            { value: '5', label: 'Научный руководитель' },
            { value: '4', label: 'Старший Инженер' },
            { value: '7', label: 'Квартирмейстер' },
        ],
    },
    {
        label: 'Отдел Службы Безопасности',
        positions: [
            { value: '8', label: 'Смотритель' },
            { value: '9', label: 'Детектив' },
            { value: '10', label: 'Офицер СБ' },
            { value: '11', label: 'Пилот СБ' },
            { value: '12', label: 'Кадет СБ' },
        ],
    },
    {
        label: 'Медицинский отдел',
        positions: [
            { value: '13', label: 'Химик' },
            { value: '14', label: 'Парамедик' },
            { value: '15', label: 'Бригмедик' },
            { value: '16', label: 'Врач' },
            { value: '17', label: 'Психолог' },
            { value: '18', label: 'Интерн' },
        ],
    },
    {
        label: 'Научный отдел',
        positions: [
            { value: '19', label: 'Учёный' },
            { value: '20', label: 'Научный ассистент' },
        ],
    },
    {
        label: 'Инженерный отдел',
        positions: [
            { value: '21', label: 'Атмосферный Техник' },
            { value: '22', label: 'Инженер' },
            { value: '23', label: 'Технический ассистент' },
        ],
    },
    {
        label: 'Отдел Снабжения',
        positions: [
            { value: '24', label: 'Утилизатор' },
            { value: '25', label: 'Грузчик' },
        ],
    },
    {
        label: 'Сервисный отдел',
        positions: [
            { value: '26', label: 'Бармен' },
            { value: '27', label: 'Библиотекарь' },
            { value: '28', label: 'Боксер' },
            { value: '29', label: 'Ботаник' },
            { value: '30', label: 'Зоотехник' },
            { value: '31', label: 'Клоун' },
            { value: '32', label: 'Мим' },
            { value: '33', label: 'Музыкант' },
            { value: '34', label: 'Пассажир' },
            { value: '35', label: 'Репортёр' },
            { value: '36', label: 'Священник' },
            { value: '37', label: 'Сервисный работник' },
            { value: '38', label: 'Уборщик' },
            { value: '39', label: 'Шеф-повар' },
        ],
    },
    {
        label: 'Юридический Департамент',
        positions: [
            { value: '40', label: 'Магистрат' },
            { value: '41', label: 'Агент Внутренних Дел' },
        ],
    },
    {
        label: 'Иное',
        positions: [
            { value: '42', label: 'ВрИО Капитана' },
            { value: '43', label: 'ВрИО Главы Персонала' },
            { value: '44', label: 'ВрИО Главы службы безопасности' },
            { value: '45', label: 'ВрИО Главного врача' },
            { value: '46', label: 'ВрИО Научного руководителя' },
            { value: '47', label: 'ВрИО Старшего Инженера' },
            { value: '48', label: 'ВрИО Квартирмейстера' },
            { value: '49', label: 'ВрИО Смотрителя' },
            { value: '50', label: 'Инструктор СБ' },
            { value: '51', label: 'Ведущий врач' },
            { value: '52', label: 'Ведущий учёный' },
            { value: '53', label: 'Ведущий инженер' },
            { value: '54', label: 'Офицер "Синий Щит"' },
            { value: '55', label: 'Бригмедик' },
            { value: '56', label: 'Исследователь экспедиции' },
            { value: '57', label: 'Представитель ЦК' },
            { value: '58', label: 'Оператор ЦК' },
            { value: '59', label: 'Офицер специальных операций' },
        ],
    },
];

export const settingsPositionGroups: PositionGroup[] = [
    {
        label: 'Командование',
        positions: [
            { value: '1', label: 'Капитан' },
            { value: '3', label: 'Глава службы безопасности' },
        ],
    },
    {
        label: 'Отдел Службы Безопасности',
        positions: [
            { value: '8', label: 'Смотритель' },
            { value: '9', label: 'Детектив' },
            { value: '10', label: 'Офицер СБ' },
            { value: '11', label: 'Пилот СБ' },
        ],
    },
    {
        label: 'Юридический Департамент',
        positions: [
            { value: '40', label: 'Магистрат' },
        ],
    },
    {
        label: 'Центральное Командование и ДСО',
        positions: [
            { value: '57', label: 'Представитель ЦК' },
            { value: '58', label: 'Оператор ЦК' },
            { value: '59', label: 'Офицер специальных операций' },
        ],
    },
];