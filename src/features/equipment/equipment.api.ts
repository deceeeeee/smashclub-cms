import axiosInstance from '../../services/axios';
import type { Equipment, EquipmentPageResponse, EquipmentPayload } from './equipment.types';
import type { BaseResponse } from '../../services/api.types';

export const fetchEquipment = async (
    keyword: string = '',
    page: number = 0,
    size: number = 25
): Promise<BaseResponse<EquipmentPageResponse>> => {
    const response = await axiosInstance.get('/admin/equipment', {
        params: { keyword, page, size }
    });
    return response.data;
};

export const fetchEquipmentDetail = async (id: number): Promise<BaseResponse<Equipment>> => {
    const response = await axiosInstance.get(`/admin/equipment/${id}`);
    return response.data;
};

export const saveEquipment = async (payload: EquipmentPayload, id?: number): Promise<BaseResponse<Equipment>> => {
    if (id) {
        const response = await axiosInstance.put(`/admin/equipment/update/${id}`, payload);
        return response.data;
    } else {
        const response = await axiosInstance.post('/admin/equipment/save', payload);
        return response.data;
    }
};

export const removeEquipment = async (id: number): Promise<BaseResponse<null>> => {
    const response = await axiosInstance.delete(`/admin/equipment/delete/${id}`);
    return response.data;
};
