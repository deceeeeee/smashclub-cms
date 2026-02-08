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
    const formData = new FormData();
    formData.append('coachCode', payload.coachCode);
    formData.append('coachName', payload.coachName);
    formData.append('pricePerHour', payload.pricePerHour.toString());
    formData.append('status', payload.status.toString());

    if (payload.coachImgLink instanceof File) {
        formData.append('coachImgLink', payload.coachImgLink);
    }

    if (id) {
        const response = await axiosInstance.put(`/admin/coach/update/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    } else {
        const response = await axiosInstance.post('/admin/coach/save', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    }
};

export const removeTrainer = async (id: number): Promise<BaseResponse<null>> => {
    const response = await axiosInstance.delete(`/admin/coach/${id}`);
    return response.data;
};
