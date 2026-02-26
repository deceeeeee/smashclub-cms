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

export interface OrderVariant {
    name: string;
    sku: string;
    variantImgLink: string;
}

export interface OrderItem {
    priceAtPurchase: number;
    productName: string;
    quantity: number;
    totalPrice: number;
    variant: OrderVariant;
}

export interface OrderDetail {
    orderCode: string;
    orderDate: string;
    orderItem: OrderItem[];
    status: number;
    statusDesc: string;
    subTotal: number;
    totalPrice: number;
    updatedAt: string;
    user: UserSummary;
}

export type OrderListResponse = BaseResponse<PaginatedData<OrderSummary>>;
export type OrderDetailResponse = BaseResponse<OrderDetail>;
