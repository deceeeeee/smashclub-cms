import type { PaginatedData } from "../../services/api.types";

export interface Trainer {
    id: number;
    coachCode: string;
    coachName: string;
    pricePerHour: number;
    status: number;
    createdAt: string;
    updatedAt: string | null;
}

export type TrainerPageResponse = PaginatedData<Trainer>;

export interface TrainerPayload {
    coachCode: string;
    coachName: string;
    pricePerHour: number;
    status: number;
}
