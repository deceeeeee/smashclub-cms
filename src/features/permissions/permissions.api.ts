import axiosInstance from '../../services/axios';
import type { PermissionsResponse } from './permissions.types';
import type { BaseResponse } from '../../services/api.types';

export const fetchPermissions = async (): Promise<BaseResponse<PermissionsResponse>> => {
    const response = await axiosInstance.get('/admin/permissions');
    return response.data;
};
