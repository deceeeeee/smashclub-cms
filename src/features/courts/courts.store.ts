import { create } from 'zustand';
import type { Court, CourtPayload } from './courts.types';
import { fetchCourts, fetchCourtDetail, saveCourt, removeCourt } from './courts.api';
import { API_ERROR_CODES } from '../../constant/apiErrorCode';
import type { ErrorResponse } from '../../services/api.types';

interface CourtsState {
    courts: Court[];
    totalElements: number;
    totalPages: number;
    isLoading: boolean;
    error: string | null;
    getCourts: (keyword?: string, page?: number, size?: number) => Promise<void>;
    getCourt: (id: number | string) => Promise<Court | null>;
    submitCourt: (data: CourtPayload, id?: number | string) => Promise<{
        success: boolean;
        message: string;
        errors?: Record<string, string>
    }>;
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
            const errorData = err.response?.data as ErrorResponse;
            const errorMessage = errorData?.message || 'Failed to save court';

            let validationErrors: Record<string, string> | undefined;
            if (errorData?.errorCode === API_ERROR_CODES.INVALID_FORMAT && Array.isArray(errorData.data)) {
                validationErrors = {};
                errorData.data.forEach(item => {
                    validationErrors![item.field] = item.message;
                });
            }

            set({ error: errorMessage, isLoading: false });
            return {
                success: false,
                message: errorMessage,
                errors: validationErrors
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
