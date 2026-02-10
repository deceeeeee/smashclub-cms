import { create } from 'zustand';
import type { EquipmentCategory, EquipmentCategoryPayload } from './equipment-category.types';
import { fetchEquipmentCategories, fetchEquipmentCategoryDetail, saveEquipmentCategory, removeEquipmentCategory } from './equipment-category.api';
import type { BaseResponse, ErrorResponse } from '../../services/api.types';
import { API_ERROR_CODES } from '../../constant/apiErrorCode';

interface EquipmentCategoryState {
    categories: EquipmentCategory[];
    totalElements: number;
    totalPages: number;
    isLoading: boolean;
    error: string | null;
    getCategories: (keyword?: string, page?: number, size?: number) => Promise<void>;
    getCategoryDetail: (id: number) => Promise<BaseResponse<EquipmentCategory> | null>;
    submitCategory: (payload: EquipmentCategoryPayload, id?: number) => Promise<{
        success: boolean;
        message: string;
        errors?: Record<string, string>
    }>;
    deleteCategory: (id: number) => Promise<{ success: boolean; message: string }>;
}

export const useEquipmentCategoryStore = create<EquipmentCategoryState>((set) => ({
    categories: [],
    totalElements: 0,
    totalPages: 0,
    isLoading: false,
    error: null,

    getCategories: async (keyword = '', page = 0, size = 25) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetchEquipmentCategories(keyword, page, size);
            if (response.success) {
                set({
                    categories: response.data.content,
                    totalElements: response.data.totalElements,
                    totalPages: response.data.totalPages,
                    isLoading: false,
                });
            } else {
                set({
                    categories: [],
                    totalElements: 0,
                    totalPages: 0,
                    error: response.message,
                    isLoading: false
                });
            }
        } catch (err: any) {
            set({
                categories: [],
                totalElements: 0,
                totalPages: 0,
                error: err.response?.data?.message || 'Failed to fetch equipment categories',
                isLoading: false,
            });
        }
    },

    getCategoryDetail: async (id: number) => {
        try {
            const response = await fetchEquipmentCategoryDetail(id);
            return response;
        } catch (err) {
            return null;
        }
    },

    submitCategory: async (payload: EquipmentCategoryPayload, id?: number) => {
        set({ isLoading: true, error: null });
        try {
            const response = await saveEquipmentCategory(payload, id);
            set({ isLoading: false });
            return { success: response.success, message: response.message };
        } catch (err: any) {
            const errorData = err.response?.data as ErrorResponse;
            const message = errorData?.message || 'Gagal menyimpan data kategori';

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

    deleteCategory: async (id: number) => {
        set({ isLoading: true, error: null });
        try {
            const response = await removeEquipmentCategory(id);
            set({ isLoading: false });
            return { success: response.success, message: response.message };
        } catch (err: any) {
            const message = err.response?.data?.message || 'Gagal menghapus kategori';
            set({ error: message, isLoading: false });
            return { success: false, message };
        }
    },
}));
