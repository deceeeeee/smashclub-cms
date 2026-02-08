import { create } from 'zustand';
import type { Equipment, EquipmentPayload } from './equipment.types';
import { fetchEquipment, fetchEquipmentDetail, saveEquipment, removeEquipment } from './equipment.api';
import { API_ERROR_CODES } from '../../constant/apiErrorCode';
import type { ErrorResponse } from '../../services/api.types';

interface EquipmentState {
    equipment: Equipment[];
    totalElements: number;
    totalPages: number;
    isLoading: boolean;
    error: string | null;
    getEquipment: (keyword?: string, page?: number, size?: number) => Promise<void>;
    getEquipmentDetail: (id: number) => Promise<any>;
    submitEquipment: (payload: EquipmentPayload, id?: number) => Promise<{
        success: boolean;
        message: string;
        errors?: Record<string, string>
    }>;
    deleteEquipment: (id: number) => Promise<{ success: boolean; message: string }>;
}

export const useEquipmentStore = create<EquipmentState>((set) => ({
    equipment: [],
    totalElements: 0,
    totalPages: 0,
    isLoading: false,
    error: null,

    getEquipment: async (keyword = '', page = 0, size = 25) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetchEquipment(keyword, page, size);
            if (response.success) {
                set({
                    equipment: response.data.content,
                    totalElements: response.data.totalElements,
                    totalPages: response.data.totalPages,
                    isLoading: false,
                });
            } else {
                set({ error: response.message, isLoading: false });
            }
        } catch (err: any) {
            set({
                error: err.response?.data?.message || 'Failed to fetch equipment',
                isLoading: false,
            });
        }
    },

    getEquipmentDetail: async (id: number) => {
        try {
            const response = await fetchEquipmentDetail(id);
            return response;
        } catch (err) {
            return null;
        }
    },

    submitEquipment: async (payload: EquipmentPayload, id?: number) => {
        set({ isLoading: true, error: null });
        try {
            const response = await saveEquipment(payload, id);
            set({ isLoading: false });
            return { success: response.success, message: response.message };
        } catch (err: any) {
            const errorData = err.response?.data as ErrorResponse;
            const message = errorData?.message || 'Gagal menyimpan data peralatan';

            let validationErrors: Record<string, string> | undefined;
            if (errorData?.errorCode === API_ERROR_CODES.INVALID_FORMAT && Array.isArray(errorData.data)) {
                validationErrors = {};
                errorData.data.forEach(item => {
                    validationErrors![item.field] = item.message;
                });
            }

            set({ error: message, isLoading: false });
            return {
                success: false,
                message,
                errors: validationErrors
            };
        }
    },

    deleteEquipment: async (id: number) => {
        set({ isLoading: true, error: null });
        try {
            const response = await removeEquipment(id);
            set({ isLoading: false });
            return { success: response.success, message: response.message };
        } catch (err: any) {
            const message = err.response?.data?.message || 'Gagal menghapus peralatan';
            set({ error: message, isLoading: false });
            return { success: false, message };
        }
    },
}));
