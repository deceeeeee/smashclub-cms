import type { BaseResponse, PaginatedData } from "../../services/api.types";

export interface MonthlyOrder {
    month: string;
    totalOrderValue: number;
    totalSoldQuantity: number;
}

export interface CategoryRanking {
    category: string;
    soldQuantity: number;
}

export interface OrderStatistics {
    averageOrderValue: number;
    monthlyOrders: MonthlyOrder[];
    soldCategoryRanking: CategoryRanking[];
    totalQtySold: number;
}

export type OrderStatisticsResponse = BaseResponse<OrderStatistics>;

export interface UserSummary {
    email: string;
    fullName: string;
    userId: string;
}

export interface OrderSummary {
    createdAt: string;
    id: number;
    orderCode: string;
    status: number;
    statusDesc: string;
    totalPrice: number;
    user: UserSummary;
}

export type OrderListResponse = BaseResponse<PaginatedData<OrderSummary>>;
