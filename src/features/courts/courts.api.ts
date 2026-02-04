import axiosInstance from '../../services/axios';
import type { Court, CourtPageResponse, CourtPayload } from './courts.types';
import type { BaseResponse } from '../../services/api.types';

export const fetchCourts = async (
    keyword: string = '',
    page: number = 0,
    size: number = 25
): Promise<BaseResponse<CourtPageResponse>> => {
    const response = await axiosInstance.get('/admin/court', {
        params: { keyword, page, size }
    });
    return response.data;
};

export const fetchCourtDetail = async (id: number | string): Promise<BaseResponse<Court>> => {
    const response = await axiosInstance.get(`/admin/court/${id}`);
    return response.data;
};

export const saveCourt = async (data: CourtPayload, id?: number | string): Promise<BaseResponse<Court>> => {
    if (id) {
        const response = await axiosInstance.put(`/admin/court/update/${id}`, data);
        return response.data;
    } else {
        const response = await axiosInstance.post('/admin/court/save', data);
        return response.data;
    }
};

export const removeCourt = async (id: number | string): Promise<BaseResponse<any>> => {
    const response = await axiosInstance.delete(`/admin/court/delete/${id}`);
    return response.data;
};
