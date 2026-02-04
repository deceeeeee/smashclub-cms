import { create } from 'zustand';
import type { Permission } from './permissions.types';
import { fetchPermissions } from './permissions.api';

interface PermissionsState {
    permissions: Permission[];
    isLoading: boolean;
    error: string | null;
    getPermissions: () => Promise<void>;
}

export const usePermissionsStore = create<PermissionsState>((set) => ({
    permissions: [],
    isLoading: false,
    error: null,

    getPermissions: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetchPermissions();
            if (response.success) {
                set({ permissions: response.data, isLoading: false });
            } else {
                set({ error: response.message, isLoading: false });
            }
        } catch (err: any) {
            set({
                error: err.response?.data?.message || 'Failed to fetch permissions',
                isLoading: false,
            });
        }
    },
}));
