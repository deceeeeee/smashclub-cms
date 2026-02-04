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
}

export interface CourtPageResponse {
    content: Court[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    numberOfElements: number;
    first: boolean;
    last: boolean;
    empty: boolean;
}

export interface ActionResponse<T = any> {
    success: boolean;
    message: string;
    status: number;
    timestamp: string;
    data: T;
}

export interface CourtPayload {
    courtCode: string;
    courtName: string;
    openTime: string;
    closeTime: string;
    status: number;
}
