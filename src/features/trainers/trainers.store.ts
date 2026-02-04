import { create } from 'zustand';
import type { Trainer, TrainerPayload } from './trainers.types';
import { fetchTrainers, fetchTrainerDetail, saveTrainer, removeTrainer } from './trainers.api';
import type { BaseResponse } from '../../services/api.types';

interface TrainersState {
    trainers: Trainer[];
    totalElements: number;
    totalPages: number;
    isLoading: boolean;
    error: string | null;
    getTrainers: (keyword?: string, page?: number, size?: number) => Promise<void>;
    getTrainer: (id: number) => Promise<BaseResponse<Trainer> | null>;
    submitTrainer: (payload: TrainerPayload, id?: number) => Promise<{ success: boolean; message: string }>;
    deleteTrainer: (id: number) => Promise<{ success: boolean; message: string }>;
}

export const useTrainersStore = create<TrainersState>((set) => ({
    trainers: [],
    totalElements: 0,
    totalPages: 0,
    isLoading: false,
    error: null,

    getTrainers: async (keyword = '', page = 0, size = 25) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetchTrainers(keyword, page, size);
            if (response.success) {
                set({
                    trainers: response.data.content,
                    totalElements: response.data.totalElements,
                    totalPages: response.data.totalPages,
                    isLoading: false,
                });
            } else {
                set({ error: response.message, isLoading: false });
            }
        } catch (err: any) {
            set({
                error: err.response?.data?.message || 'Failed to fetch trainers',
                isLoading: false,
            });
        }
    },

    getTrainer: async (id: number) => {
        try {
            const response = await fetchTrainerDetail(id);
            return response;
        } catch (err) {
            return null;
        }
    },

    submitTrainer: async (payload: TrainerPayload, id?: number) => {
        set({ isLoading: true, error: null });
        try {
            const response = await saveTrainer(payload, id);
            set({ isLoading: false });
            return { success: response.success, message: response.message };
        } catch (err: any) {
            const message = err.response?.data?.message || 'Gagal menyimpan data pelatih';
            set({ error: message, isLoading: false });
            return { success: false, message };
        }
    },

    deleteTrainer: async (id: number) => {
        set({ isLoading: true, error: null });
        try {
            const response = await removeTrainer(id);
            set({ isLoading: false });
            return { success: response.success, message: response.message };
        } catch (err: any) {
            const message = err.response?.data?.message || 'Gagal menghapus pelatih';
            set({ error: message, isLoading: false });
            return { success: false, message };
        }
    },
}));
