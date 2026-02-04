import { create } from 'zustand';
import type { Player } from './player.types';
import { fetchPlayers } from './player.api';

interface PlayerState {
    players: Player[];
    totalElements: number;
    totalPages: number;
    isLoading: boolean;
    error: string | null;
    getPlayers: (keyword?: string, page?: number, limit?: number) => Promise<void>;
}

export const usePlayerStore = create<PlayerState>((set) => ({
    players: [],
    totalElements: 0,
    totalPages: 0,
    isLoading: false,
    error: null,

    getPlayers: async (keyword?: string, page?: number, limit?: number) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetchPlayers(keyword, page, limit);
            if (response.success) {
                set({
                    players: response.data.content,
                    totalElements: response.data.totalElements,
                    totalPages: response.data.totalPages, isLoading: false
                });
            } else {
                set({ error: response.message, isLoading: false });
            }
        } catch (err: any) {
            set({
                error: err.response?.data?.message || 'Failed to fetch players',
                isLoading: false,
            });
        }
    },
}));
