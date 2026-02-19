import axiosInstance from '../../services/axios';
import type { DashboardResponse } from './dashboard.types';

export const fetchDashboardStats = async (): Promise<DashboardResponse> => {
    const response = await axiosInstance.get('/admin/dashboard');
    return response.data;
};
