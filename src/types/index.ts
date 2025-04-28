export interface Offense {
    code: string;
    title: string;
    description: string;
    chapter: string;
    severity: string;
}

export interface OffenseWithModifiers {
    code: string;
    modifiers: string[];
}

export interface GlobalModifiers {
    deal: boolean;
    dealReduction: number;
    recidivism: boolean;
    recidivismCount: number;
}

export interface Settings {
    fullName: string;
    position: string;
    station: string;
}

export interface Timer {
    elapsedSeconds: number;
    running: boolean;
}

export interface ObjectDetails {
    fullName: string;
    position: string;
}

export interface Result {
    penalty: string;
    disciplinaryPenalty: string;
    documentText: string;
}

export interface VerdictHistoryEntry {
    id: string;
    timestamp: string;
    fullName: string;
    position: string;
    penalty: string;
    disciplinaryPenalty: string;
    documentText: string;
    offenseDetails: string[];
}