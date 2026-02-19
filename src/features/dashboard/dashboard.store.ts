import { create } from 'zustand';
import type { DashboardStats } from './dashboard.types';
import { fetchDashboardStats } from './dashboard.api';

interface DashboardState {
    stats: DashboardStats | null;
    isLoading: boolean;
    error: string | null;
    getDashboardStats: () => Promise<void>;
}

export const useDashboardStore = create<DashboardState>((set) => ({
    stats: null,
    isLoading: false,
    error: null,

    getDashboardStats: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetchDashboardStats();
            if (response.success) {
                set({ stats: response.data, isLoading: false });
            } else {
                set({ error: response.message, isLoading: false });
            }
        } catch (err: any) {
            set({
                error: err.response?.data?.message || 'Failed to fetch dashboard statistics',
                isLoading: false
            });
        }
    },
}));
