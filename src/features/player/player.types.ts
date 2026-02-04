import type { PaginatedData } from "../../services/api.types";

export interface Player {
    id: string;
    fullName: string;
    email: string;
    status: number;
    createdAt: string;
    lockedUntil: string;
}

export type PlayerPageResponse = PaginatedData<Player>;
