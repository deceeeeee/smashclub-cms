import axiosInstance from '../../services/axios';
import type { Equipment, EquipmentPageResponse, EquipmentPayload, ActionResponse } from './equipment.types';

export const fetchEquipment = async (
    keyword: string = '',
    page: number = 0,
    size: number = 25
): Promise<ActionResponse<EquipmentPageResponse>> => {
    const response = await axiosInstance.get('/admin/equipment', {
        params: { keyword, page, size }
    });
    return response.data;
};

export const fetchEquipmentDetail = async (id: number): Promise<ActionResponse<Equipment>> => {
    const response = await axiosInstance.get(`/admin/equipment/${id}`);
    return response.data;
};

export const saveEquipment = async (payload: EquipmentPayload, id?: number): Promise<ActionResponse<Equipment>> => {
    if (id) {
        const response = await axiosInstance.post(`/admin/equipment/${id}`, payload);
        return response.data;
    } else {
        const response = await axiosInstance.post('/admin/equipment', payload);
        return response.data;
    }
};

export const removeEquipment = async (id: number): Promise<ActionResponse<null>> => {
    const response = await axiosInstance.delete(`/admin/equipment/${id}`);
    return response.data;
};
