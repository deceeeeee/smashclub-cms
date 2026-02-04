export interface Trainer {
    id: number;
    coachCode: string;
    coachName: string;
    pricePerHour: number;
    status: number;
    createdAt: string;
    updatedAt: string | null;
}

export interface TrainerPageResponse {
    content: Trainer[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
}

export interface TrainerPayload {
    coachCode: string;
    coachName: string;
    pricePerHour: number;
    status: number;
}

export interface ActionResponse<T> {
    success: boolean;
    message: string;
    data: T;
    status: number;
    timestamp: string;
}
