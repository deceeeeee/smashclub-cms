import axiosInstance from '../../services/axios';
import type { ActionResponse, UserPageResponse, AdminUser, UserPayload } from './users.types';

export const fetchUsers = async (keyword: string = '', page: number = 0, size: number = 25): Promise<ActionResponse<UserPageResponse>> => {
    const response = await axiosInstance.get(`/admin/users`, {
        params: { keyword, page, size }
    });
    return response.data;
};

export const fetchUserDetail = async (id: number | string): Promise<ActionResponse<AdminUser>> => {
    const response = await axiosInstance.get(`/admin/users/${id}`);
    return response.data;
};

export const saveUser = async (data: UserPayload, id?: number | string): Promise<ActionResponse<AdminUser>> => {
    if (id) {
        const response = await axiosInstance.put(`/admin/users/update/${id}`, data);
        return response.data;
    } else {
        const response = await axiosInstance.post(`/admin/users/save`, data);
        return response.data;
    }
};

export const removeUser = async (id: number | string): Promise<ActionResponse<any>> => {
    const response = await axiosInstance.delete(`/admin/users/delete/${id}`);
    return response.data;
};
