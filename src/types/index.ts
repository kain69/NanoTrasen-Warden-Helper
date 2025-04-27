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
    documentText: string;
}