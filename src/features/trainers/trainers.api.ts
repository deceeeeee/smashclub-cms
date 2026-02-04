import axiosInstance from '../../services/axios';
import type { Trainer, TrainerPageResponse, TrainerPayload } from './trainers.types';
import type { BaseResponse } from '../../services/api.types';

export const fetchTrainers = async (
    keyword: string = '',
    page: number = 0,
    size: number = 25
): Promise<BaseResponse<TrainerPageResponse>> => {
    const response = await axiosInstance.get('/admin/coach', {
        params: { keyword, page, size }
    });
    return response.data;
};

export const fetchTrainerDetail = async (id: number): Promise<BaseResponse<Trainer>> => {
    const response = await axiosInstance.get(`/admin/coach/${id}`);
    return response.data;
};

export const saveTrainer = async (payload: TrainerPayload, id?: number): Promise<BaseResponse<Trainer>> => {
    if (id) {
        const response = await axiosInstance.put(`/admin/coach/update/${id}`, payload);
        return response.data;
    } else {
        const response = await axiosInstance.post('/admin/coach/save', payload);
        return response.data;
    }
};

export const removeTrainer = async (id: number): Promise<BaseResponse<null>> => {
    const response = await axiosInstance.delete(`/admin/coach/${id}`);
    return response.data;
};
