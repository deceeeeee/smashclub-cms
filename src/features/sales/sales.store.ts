
import { create } from 'zustand';
import type {
    SalesStatistics,
    MonthlySalesList,
    TransactionDetail
} from './sales.types';
import {
    fetchSalesStatistics,
    fetchMonthlySalesList,
    fetchTransactionDetail
} from './sales.api';

interface SalesState {
    statistics: SalesStatistics | null;
    monthlyList: MonthlySalesList | null;
    currentTransaction: TransactionDetail | null;
    isLoading: boolean;
    error: string | null;

    getStatistics: (year: number) => Promise<void>;
    getMonthlyList: (year: number, month: number, keyword?: string, page?: number, size?: number) => Promise<void>;
    getTransactionDetail: (transactionCode: string) => Promise<TransactionDetail | null>;
}

export const useSalesStore = create<SalesState>((set) => ({
    statistics: null,
    monthlyList: null,
    currentTransaction: null,
    isLoading: false,
    error: null,

    getStatistics: async (year: number) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetchSalesStatistics(year);
            if (response.success) {
                set({ statistics: response.data, isLoading: false });
            } else {
                set({ error: response.message, isLoading: false });
            }
        } catch (err: any) {
            set({
                error: err.response?.data?.message || 'Failed to fetch sales statistics',
                isLoading: false,
            });
        }
    },

    getMonthlyList: async (year: number, month: number, keyword?: string, page = 0, size = 25) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetchMonthlySalesList(year, month, keyword, page, size);
            if (response.success) {
                set({ monthlyList: response.data, isLoading: false });
            } else {
                set({ error: response.message, isLoading: false });
            }
        } catch (err: any) {
            set({
                error: err.response?.data?.message || 'Failed to fetch monthly sales list',
                isLoading: false,
            });
        }
    },

    getTransactionDetail: async (transactionCode: string) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetchTransactionDetail(transactionCode);
            if (response.success) {
                set({ currentTransaction: response.data, isLoading: false });
                return response.data;
            } else {
                set({ error: response.message, isLoading: false });
                return null;
            }
        } catch (err: any) {
            set({
                error: err.response?.data?.message || 'Failed to fetch transaction detail',
                isLoading: false,
            });
            return null;
        }
    }
}));
