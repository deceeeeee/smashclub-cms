import axiosInstance from '../../services/axios';
import type { BaseResponse } from '../../services/api.types';

export interface LoginPayload {
    username: string;
    password: string;
}

export interface LoginData {
    accessToken: string;
    fullname: string;
    username: string;
}

export const loginAdmin = async (payload: LoginPayload): Promise<BaseResponse<LoginData>> => {
    try {
        const response = await axiosInstance.post('/admin/auth/login', payload);
        return response.data;
    } catch (error: any) {
        return {
            success: false,
            message: error.response?.data?.message || 'Gagal melakukan login',
            status: error.response?.status || 500,
            timestamp: new Date().toISOString(),
            data: {} as LoginData
        };
    }
};
