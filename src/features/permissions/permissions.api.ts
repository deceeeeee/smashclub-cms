import api from '../../services/axios';
import type { PermissionsResponse } from './permissions.types';

export const fetchPermissions = async (): Promise<PermissionsResponse> => {
    const response = await api.get<PermissionsResponse>('/admin/permissions');
    return response.data;
};
