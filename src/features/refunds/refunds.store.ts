
import { create } from 'zustand';
import type { RefundRequest } from './refunds.types';
import { fetchRefundRequests, processRefundRequest } from './refunds.api';

interface RefundsState {
    refunds: RefundRequest[];
    totalElements: number;
    totalPages: number;
    isLoading: boolean;
    error: string | null;
    getRefunds: (
        startDate?: string,
        endDate?: string,
        status?: number | null,
        keyword?: string,
        page?: number,
        size?: number
    ) => Promise<void>;
    processRefund: (id: string, status: number, notes: string) => Promise<boolean>;
}

export const useRefundsStore = create<RefundsState>((set) => ({
    refunds: [],
    totalElements: 0,
    totalPages: 0,
    isLoading: false,
    error: null,

    getRefunds: async (startDate, endDate, status = null, keyword = '', page = 0, size = 25) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetchRefundRequests(startDate, endDate, status, keyword, page, size);
            if (response.success) {
                set({
                    refunds: response.data.content,
                    totalElements: response.data.totalElements,
                    totalPages: response.data.totalPages,
                    isLoading: false,
                });
            } else {
                set({
                    refunds: [],
                    totalElements: 0,
                    totalPages: 0,
                    error: response.message,
                    isLoading: false
                });
            }
        } catch (err: any) {
            set({
                refunds: [],
                totalElements: 0,
                totalPages: 0,
                error: err.response?.data?.message || 'Failed to fetch refund requests',
                isLoading: false,
            });
        }
    },

    processRefund: async (id, status, notes) => {
        set({ isLoading: true, error: null });
        try {
            const response = await processRefundRequest(id, status, notes);
            if (response.success) {
                // Refresh the list after successful processing
                // Note: In a real app we might want to preserve current filters
                // But for now we just return true and let the component handle it
                set({ isLoading: false });
                return true;
            } else {
                set({ error: response.message, isLoading: false });
                return false;
            }
        } catch (err: any) {
            set({
                error: err.response?.data?.message || 'Failed to process refund request',
                isLoading: false,
            });
            return false;
        }
    },
}));
