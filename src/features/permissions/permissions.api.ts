import axiosInstance from '../../services/axios';
import type { Permission } from './permissions.types';
import type { BaseResponse } from '../../services/api.types';

export const fetchPermissions = async (): Promise<BaseResponse<Permission[]>> => {
    const response = await axiosInstance.get('/admin/permissions');
    return response.data;
};
