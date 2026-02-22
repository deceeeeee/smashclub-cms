import type { PaginatedData } from "../../services/api.types";

export interface Court {
    id: number;
    courtCode: string;
    courtName: string;
    openTime: string;
    closeTime: string;
    status: number;
    statusDesc: string | null;
    createdAt: string;
    updatedAt: string | null;
    courtImgLink?: string;
    pricePerHour: number;
}

export type CourtPageResponse = PaginatedData<Court>;

export interface CourtPayload {
    courtCode: string;
    courtName: string;
    openTime: string;
    closeTime: string;
    status: number;
    courtImgLink?: File | null;
    pricePerHour: number;
}
