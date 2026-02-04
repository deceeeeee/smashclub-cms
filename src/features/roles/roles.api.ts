import api from '../../services/axios';
import type { RolesResponse, RoleDetailResponse, ActionResponse, RolePayload } from './roles.types';

export const fetchRoles = async (keyword: string = '', page = 0, size = 25): Promise<RolesResponse> => {
    const response = await api.get<RolesResponse>('/admin/roles', {
        params: {
            keyword,
            page,
            size,
        },
    });
    return response.data;
};

export const fetchRoleDetail = async (id: string | number): Promise<RoleDetailResponse> => {

    const response = await api.get<RoleDetailResponse>(`/admin/roles/${id}`);
    return response.data;
};

export const saveRole = async (data: RolePayload, id?: string | number): Promise<ActionResponse> => {
    const url = id ? `/admin/roles/update/${id}` : '/admin/roles/save';
    const method = id ? 'put' : 'post';
    const response = await api[method]<ActionResponse>(url, data);
    return response.data;
};
export const removeRole = async (id: string | number): Promise<ActionResponse> => {
    const response = await api.delete<ActionResponse>(`/admin/roles/delete/${id}`);
    return response.data;
};
