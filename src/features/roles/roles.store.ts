import { create } from 'zustand';
import type { Role, ActionResponse, RolePayload } from './roles.types';
import { fetchRoles, fetchRoleDetail, saveRole, removeRole } from './roles.api';
import { API_ERROR_CODES } from '../../constant/apiErrorCode';
import type { ErrorResponse } from '../../services/api.types';

interface RolesState {
    roles: Role[];
    currentRole: Role | null;
    totalElements: number;
    totalPages: number;
    isLoading: boolean;
    error: string | null;
    getRoles: (keyword?: string, page?: number, size?: number) => Promise<void>;
    getRole: (id: string | number) => Promise<Role | null>;
    submitRole: (data: RolePayload, id?: string | number) => Promise<{
        success: boolean;
        message: string;
        errors?: Record<string, string>
    }>;
    deleteRole: (id: string | number) => Promise<ActionResponse>;
}

export const useRolesStore = create<RolesState>((set) => ({
    roles: [],
    currentRole: null,
    totalElements: 0,
    totalPages: 0,
    isLoading: false,
    error: null,

    getRoles: async (keyword: string = '', page = 0, size = 25) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetchRoles(keyword, page, size);
            if (response.success) {
                set({
                    roles: response.data.content,
                    totalElements: response.data.totalElements,
                    totalPages: response.data.totalPages,
                    isLoading: false,
                });
            } else {
                set({ error: response.message, isLoading: false });
            }
        } catch (err: any) {
            set({
                error: err.response?.data?.message || 'Failed to fetch roles',
                isLoading: false,
            });
        }
    },

    getRole: async (id: string | number) => {
        set({ isLoading: true, error: null, currentRole: null });
        try {
            const response = await fetchRoleDetail(id);
            if (response.success) {
                set({ currentRole: response.data, isLoading: false });
                return response.data;
            } else {
                set({ error: response.message, isLoading: false });
                return null;
            }
        } catch (err: any) {
            set({
                error: err.response?.data?.message || 'Failed to fetch role detail',
                isLoading: false,
            });
            return null;
        }
    },

    submitRole: async (data: RolePayload, id?: string | number) => {
        set({ isLoading: true, error: null });
        try {
            const response = await saveRole(data, id);
            set({ isLoading: false });
            return response;
        } catch (err: any) {
            const errorData = err.response?.data as ErrorResponse;
            const errorMessage = errorData?.message || 'Failed to save role';

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

    deleteRole: async (id: string | number) => {
        set({ isLoading: true, error: null });
        try {
            const response = await removeRole(id);
            set({ isLoading: false });
            return response;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Failed to delete role';
            set({ error: errorMessage, isLoading: false });
            return {
                success: false,
                message: errorMessage,
                status: err.response?.status || 500,
                timestamp: new Date().toISOString(),
                data: null
            };
        }
    },
}));


