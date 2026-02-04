import axiosInstance from '../../services/axios';
import type { EquipmentCategory, EquipmentCategoryPageResponse, EquipmentCategoryPayload } from './equipment-category.types';
import type { BaseResponse } from '../../services/api.types';

export const fetchEquipmentCategories = async (
    keyword: string = '',
    page: number = 0,
    size: number = 25
): Promise<BaseResponse<EquipmentCategoryPageResponse>> => {
    const response = await axiosInstance.get('/admin/equipment-category', {
        params: { keyword, page, size }
    });
    return response.data;
};

export const fetchEquipmentCategoryDetail = async (id: number): Promise<BaseResponse<EquipmentCategory>> => {
    const response = await axiosInstance.get(`/admin/equipment-category/${id}`);
    return response.data;
};

export const saveEquipmentCategory = async (payload: EquipmentCategoryPayload, id?: number): Promise<BaseResponse<EquipmentCategory>> => {
    if (id) {
        const response = await axiosInstance.put(`/admin/equipment-category/update/${id}`, payload);
        return response.data;
    } else {
        const response = await axiosInstance.post('/admin/equipment-category/save', payload);
        return response.data;
    }
};

export const removeEquipmentCategory = async (id: number): Promise<BaseResponse<null>> => {
    const response = await axiosInstance.delete(`/admin/equipment-category/delete/${id}`);
    return response.data;
};
