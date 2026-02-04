import { create } from 'zustand';
import type { Court, CourtPayload } from './courts.types';
import { fetchCourts, fetchCourtDetail, saveCourt, removeCourt } from './courts.api';

interface CourtsState {
    courts: Court[];
    totalElements: number;
    totalPages: number;
    isLoading: boolean;
    error: string | null;
    getCourts: (keyword?: string, page?: number, size?: number) => Promise<void>;
    getCourt: (id: number | string) => Promise<Court | null>;
    submitCourt: (data: CourtPayload, id?: number | string) => Promise<{ success: boolean; message: string }>;
    deleteCourt: (id: number | string) => Promise<{ success: boolean; message: string }>;
}

export const useCourtsStore = create<CourtsState>((set) => ({
    courts: [],
    totalElements: 0,
    totalPages: 0,
    isLoading: false,
    error: null,

    getCourts: async (keyword: string = '', page = 0, size = 25) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetchCourts(keyword, page, size);
            if (response.success) {
                set({
                    courts: response.data.content,
                    totalElements: response.data.totalElements,
                    totalPages: response.data.totalPages,
                    isLoading: false,
                });
            } else {
                set({ error: response.message, isLoading: false });
            }
        } catch (err: any) {
            set({
                error: err.response?.data?.message || 'Failed to fetch courts',
                isLoading: false,
            });
        }
    },

    getCourt: async (id: number | string) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetchCourtDetail(id);
            set({ isLoading: false });
            return response.success ? response.data : null;
        } catch (err: any) {
            set({
                error: err.response?.data?.message || 'Failed to fetch court detail',
                isLoading: false,
            });
            return null;
        }
    },

    submitCourt: async (data: CourtPayload, id?: number | string) => {
        set({ isLoading: true, error: null });
        try {
            const response = await saveCourt(data, id);
            set({ isLoading: false });
            return {
                success: response.success,
                message: response.message
            };
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Failed to save court';
            set({ error: errorMessage, isLoading: false });
            return {
                success: false,
                message: errorMessage
            };
        }
    },

    deleteCourt: async (id: number | string) => {
        set({ isLoading: true, error: null });
        try {
            const response = await removeCourt(id);
            set({ isLoading: false });
            return {
                success: response.success,
                message: response.message
            };
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Failed to delete court';
            set({ error: errorMessage, isLoading: false });
            return {
                success: false,
                message: errorMessage
            };
        }
    },
}));
