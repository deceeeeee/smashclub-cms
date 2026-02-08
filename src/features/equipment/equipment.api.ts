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
    const formData = new FormData();
    formData.append('equipmentName', payload.equipmentName);
    formData.append('brand', payload.brand);
    formData.append('type', payload.type);
    formData.append('stock', payload.stock.toString());
    formData.append('price', payload.price.toString());
    formData.append('status', payload.status.toString());
    // formData.append('equipmentCategory.id', payload.equipmentCategory.id.toString());
    formData.append('equipmentCategory', JSON.stringify(payload.equipmentCategory));

    if (payload.equipmentImgLink instanceof File) {
        formData.append('equipmentImgLink', payload.equipmentImgLink);
    }

    if (id) {
        const response = await axiosInstance.put(`/admin/equipment/update/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    } else {
        const response = await axiosInstance.post('/admin/equipment/save', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    }
};

export const removeEquipment = async (id: number): Promise<BaseResponse<null>> => {
    const response = await axiosInstance.delete(`/admin/equipment/delete/${id}`);
    return response.data;
};
