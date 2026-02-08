import axiosInstance from '../../services/axios';
import type { BaseResponse } from '../../services/api.types';
import type {
    LoginPayload,
    LoginData,
    AuthenticatedData
} from './auth.types';

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

export const checkAuth = async (): Promise<BaseResponse<AuthenticatedData>> => {
    try {
        const response = await axiosInstance.post('/admin/auth');
        return response.data;
    } catch (error: any) {
        return {
            success: false,
            message: error.response?.data?.message || 'Sesi tidak valid',
            status: error.response?.status || 500,
            timestamp: new Date().toISOString(),
            data: {} as AuthenticatedData
        };
    }
};
