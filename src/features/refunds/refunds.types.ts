
import type { BaseResponse, PaginatedData } from "../../services/api.types";

export interface RefundTransactionUser {
    id: string;
    fullName: string;
    email: string;
}

export interface RefundTransaction {
    transactionCode: string;
    totalPrice: number;
    user: RefundTransactionUser;
}

export interface RefundRequest {
    id: number;
    transaction: RefundTransaction;
    refundReason: string; // This is a JSON string in the API
    refundStatus: number;
    refundStatusDesc: string;
    createdAt: string;
}

export type RefundRequestListResponse = BaseResponse<PaginatedData<RefundRequest>>;

export interface RefundActionPayload {
    refundStatus: number; // 1 for approve, 2 for reject (guessing, will check if docs say)
    refundNotes: string;
}
