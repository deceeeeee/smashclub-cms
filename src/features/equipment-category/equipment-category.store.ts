import { create } from 'zustand';
import type { EquipmentCategory, EquipmentCategoryPayload } from './equipment-category.types';
import { fetchEquipmentCategories, fetchEquipmentCategoryDetail, saveEquipmentCategory, removeEquipmentCategory } from './equipment-category.api';
import type { BaseResponse } from '../../services/api.types';

interface EquipmentCategoryState {
    categories: EquipmentCategory[];
    totalElements: number;
    totalPages: number;
    isLoading: boolean;
    error: string | null;
    getCategories: (keyword?: string, page?: number, size?: number) => Promise<void>;
    getCategoryDetail: (id: number) => Promise<BaseResponse<EquipmentCategory> | null>;
    submitCategory: (payload: EquipmentCategoryPayload, id?: number) => Promise<{ success: boolean; message: string }>;
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
                set({ error: response.message, isLoading: false });
            }
        } catch (err: any) {
            set({
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
            const message = err.response?.data?.message || 'Gagal menyimpan data kategori';
            set({ error: message, isLoading: false });
            return { success: false, message };
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
