import axiosInstance from '../../services/axios';
import type { Trainer, TrainerPageResponse, TrainerPayload, ActionResponse } from './trainers.types';

export const fetchTrainers = async (
    keyword: string = '',
    page: number = 0,
    size: number = 25
): Promise<ActionResponse<TrainerPageResponse>> => {
    const response = await axiosInstance.get('/admin/coach', {
        params: { keyword, page, size }
    });
    return response.data;
};

export const fetchTrainerDetail = async (id: number): Promise<ActionResponse<Trainer>> => {
    const response = await axiosInstance.get(`/admin/coach/${id}`);
    return response.data;
};

export const saveTrainer = async (payload: TrainerPayload, id?: number): Promise<ActionResponse<Trainer>> => {
    if (id) {
        const response = await axiosInstance.post(`/admin/coach/${id}`, payload);
        return response.data;
    } else {
        const response = await axiosInstance.post('/admin/coach', payload);
        return response.data;
    }
};

export const removeTrainer = async (id: number): Promise<ActionResponse<null>> => {
    const response = await axiosInstance.delete(`/admin/coach/${id}`);
    return response.data;
};
