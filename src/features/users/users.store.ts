import { create } from 'zustand';
import type { AdminUser, UserPayload } from './users.types';
import { fetchUsers, fetchUserDetail, saveUser, removeUser } from './users.api';
import { API_ERROR_CODES } from '../../constant/apiErrorCode';
import type { ErrorResponse } from '../../services/api.types';

interface UsersState {
    users: AdminUser[];
    totalElements: number;
    totalPages: number;
    isLoading: boolean;
    error: string | null;
    getUsers: (keyword?: string, page?: number, size?: number) => Promise<void>;
    getUser: (id: number | string) => Promise<AdminUser | null>;
    submitUser: (data: UserPayload, id?: number | string) => Promise<{
        success: boolean;
        message: string;
        errors?: Record<string, string>
    }>;
    deleteUser: (id: number | string) => Promise<{ success: boolean; message: string }>;
}

export const useUsersStore = create<UsersState>((set) => ({
    users: [],
    totalElements: 0,
    totalPages: 0,
    isLoading: false,
    error: null,

    getUsers: async (keyword: string = '', page = 0, size = 25) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetchUsers(keyword, page, size);
            if (response.success) {
                set({
                    users: response.data.content,
                    totalElements: response.data.totalElements,
                    totalPages: response.data.totalPages,
                    isLoading: false,
                });
            } else {
                set({ error: response.message, isLoading: false });
            }
        } catch (err: any) {
            set({
                error: err.response?.data?.message || 'Failed to fetch users',
                isLoading: false,
            });
        }
    },

    getUser: async (id: number | string) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetchUserDetail(id);
            set({ isLoading: false });
            if (response.success) return response.data;
            return null;
        } catch (err: any) {
            set({
                error: err.response?.data?.message || 'Failed to fetch user',
                isLoading: false,
            });
            return null;
        }
    },

    submitUser: async (data: UserPayload, id?: number | string) => {
        set({ isLoading: true, error: null });
        try {
            const response = await saveUser(data, id);
            set({ isLoading: false });
            return {
                success: response.success,
                message: response.message
            };
        } catch (err: any) {
            const errorData = err.response?.data as ErrorResponse;
            const errorMessage = errorData?.message || 'Failed to save user';

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

    deleteUser: async (id: number | string) => {
        set({ isLoading: true, error: null });
        try {
            const response = await removeUser(id);
            set({ isLoading: false });
            return {
                success: response.success,
                message: response.message
            };
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Failed to delete user';
            set({ error: errorMessage, isLoading: false });
            return {
                success: false,
                message: errorMessage
            };
        }
    },
}));
