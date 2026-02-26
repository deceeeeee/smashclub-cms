import { create } from 'zustand';
import type { OrderStatistics, OrderSummary, OrderDetail } from './orders.types';
import { fetchOrderStatistics, fetchOrderList, fetchOrderDetail, processOrder } from './orders.api';
import type { PaginatedData } from '../../services/api.types';

interface OrdersState {
    statistics: OrderStatistics | null;
    orderListData: PaginatedData<OrderSummary> | null;
    currentOrder: OrderDetail | null;
    isLoading: boolean;
    isLoadingList: boolean;
    isLoadingDetail: boolean;
    error: string | null;
    getStatistics: (year: number) => Promise<void>;
    getOrderList: (year: number, month: number, keyword?: string, page?: number, size?: number) => Promise<void>;
    getOrderDetail: (orderCode: string) => Promise<void>;
    updateOrderStatus: (orderCode: string, status: number) => Promise<{ success: boolean; message: string }>;
}

export const useOrdersStore = create<OrdersState>((set) => ({
    statistics: null,
    orderListData: null,
    currentOrder: null,
    isLoading: false,
    isLoadingList: false,
    isLoadingDetail: false,
    error: null,

    getStatistics: async (year: number) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetchOrderStatistics(year);
            if (response.success) {
                set({ statistics: response.data, isLoading: false });
            } else {
                set({ error: response.message, isLoading: false });
            }
        } catch (err: any) {
            set({
                error: err.response?.data?.message || 'Failed to fetch order statistics',
                isLoading: false,
            });
        }
    },

    getOrderList: async (year: number, month: number, keyword = '', page = 0, size = 25) => {
        set({ isLoadingList: true, error: null });
        try {
            const response = await fetchOrderList(year, month, keyword, page, size);
            if (response.success) {
                set({ orderListData: response.data, isLoadingList: false });
            } else {
                set({ orderListData: null, error: response.message, isLoadingList: false });
            }
        } catch (err: any) {
            set({
                orderListData: null,
                error: err.response?.data?.message || 'Failed to fetch order list',
                isLoadingList: false,
            });
        }
    },

    getOrderDetail: async (orderCode: string) => {
        set({ isLoadingDetail: true, error: null, currentOrder: null });
        try {
            const response = await fetchOrderDetail(orderCode);
            if (response.success) {
                set({ currentOrder: response.data, isLoadingDetail: false });
            } else {
                set({ error: response.message, isLoadingDetail: false });
            }
        } catch (err: any) {
            set({
                error: err.response?.data?.message || 'Failed to fetch order detail',
                isLoadingDetail: false,
            });
        }
    },

    updateOrderStatus: async (orderCode: string, status: number) => {
        try {
            const response = await processOrder(orderCode, status);
            return {
                success: response.success,
                message: response.message || 'Berhasil memperbarui status pesanan'
            };
        } catch (err: any) {
            return {
                success: false,
                message: err.response?.data?.message || 'Gagal memperbarui status pesanan'
            };
        }
    },
}));
