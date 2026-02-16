import type { BaseResponse, PaginatedData } from "../../services/api.types";

export interface MonthlySales {
    month: string;
    totalTransactionCount: number;
    totalTransactionValue: number;
    avgTransactionValue: number;
}

export interface SalesStatistics {
    averageTransactionValue: number;
    monthlyTransactionValue: MonthlySales[];
    totalTransactionValue: number;
}

export type SalesStatisticsResponse = BaseResponse<SalesStatistics>;

export interface TransactionUser {
    id: string;
    fullName: string;
    email: string;
}

export interface TransactionSummary {
    transactionCode: string;
    transactionLabel: string;
    totalPrice: number;
    statusDesc: string;
    createdAt: string;
    updatedAt: string;
    user: TransactionUser;
}

export interface MonthlySalesList {
    averageTransactionValue: number;
    totalTransactionValue: number;
    transactions: PaginatedData<TransactionSummary>;
}

export type MonthlySalesListResponse = BaseResponse<MonthlySalesList>;

export interface TransactionItem {
    itemName: string;
    itemPrice: number;
    itemQty: number;
    itemUnit: string;
}

export interface TransactionDetail {
    id: number;
    transactionCode: string;
    transactionLabel: string;
    transactionType: number;
    status: number;
    statusDesc: string;
    totalPrice: number;
    paymentMethodID: number;
    paymentLink: string | null;
    isRefunded: number;
    notes: string | null;
    user: TransactionUser;
    referenceCode: string;
    createdAt: string;
    updatedAt: string;
    items: TransactionItem[];
}

export type TransactionDetailResponse = BaseResponse<TransactionDetail>;