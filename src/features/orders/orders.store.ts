import { create } from 'zustand';
import type { OrderStatistics, OrderSummary } from './orders.types';
import { fetchOrderStatistics, fetchOrderList } from './orders.api';
import type { PaginatedData } from '../../services/api.types';

interface OrdersState {
    statistics: OrderStatistics | null;
    orderListData: PaginatedData<OrderSummary> | null;
    isLoading: boolean;
    isLoadingList: boolean;
    error: string | null;
    getStatistics: (year: number) => Promise<void>;
    getOrderList: (year: number, month: number, keyword?: string, page?: number, size?: number) => Promise<void>;
}

export const useOrdersStore = create<OrdersState>((set) => ({
    statistics: null,
    orderListData: null,
    isLoading: false,
    isLoadingList: false,
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
}));
