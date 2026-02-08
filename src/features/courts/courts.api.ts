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
    const formData = new FormData();
    formData.append('courtCode', data.courtCode);
    formData.append('courtName', data.courtName);
    formData.append('openTime', data.openTime);
    formData.append('closeTime', data.closeTime);
    formData.append('status', data.status.toString());

    if (data.courtImgLink instanceof File) {
        formData.append('courtImgLink', data.courtImgLink);
    }

    if (id) {
        const response = await axiosInstance.put(`/admin/court/update/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    } else {
        const response = await axiosInstance.post('/admin/court/save', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    }
};

export const removeCourt = async (id: number | string): Promise<BaseResponse<any>> => {
    const response = await axiosInstance.delete(`/admin/court/delete/${id}`);
    return response.data;
};
