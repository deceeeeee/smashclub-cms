import axiosInstance from '../../services/axios';
import type { UserPageResponse, AdminUser, UserPayload } from './users.types';
import type { BaseResponse } from '../../services/api.types';

export const fetchUsers = async (keyword: string = '', page: number = 0, size: number = 25): Promise<BaseResponse<UserPageResponse>> => {
    const response = await axiosInstance.get(`/admin/users`, {
        params: { keyword, page, size }
    });
    return response.data;
};

export const fetchUserDetail = async (id: number | string): Promise<BaseResponse<AdminUser>> => {
    const response = await axiosInstance.get(`/admin/users/${id}`);
    return response.data;
};

export const saveUser = async (data: UserPayload, id?: number | string): Promise<BaseResponse<AdminUser>> => {
    const formData = new FormData();
    formData.append('fullName', data.fullName);
    formData.append('username', data.username);
    formData.append('status', data.status.toString());
    formData.append('adminRole.id', data.adminRole.id.toString());

    if (data.password) {
        formData.append('password', data.password);
    }

    if (data.profilePicture instanceof File) {
        formData.append('profilePicture', data.profilePicture);
    }

    if (id) {
        const response = await axiosInstance.put(`/admin/users/update/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    } else {
        const response = await axiosInstance.post(`/admin/users/save`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    }
};

export const removeUser = async (id: number | string): Promise<BaseResponse<any>> => {
    const response = await axiosInstance.delete(`/admin/users/delete/${id}`);
    return response.data;
};
