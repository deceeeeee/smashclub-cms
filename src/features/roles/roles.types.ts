import type { BaseResponse, PaginatedData } from '../../services/api.types';
import type { Permission } from '../permissions/permissions.types';

export interface Role {
    id: number;
    menuSet: { id: number }[];
    permissionSet: Permission[];
    roleCode: string;
    roleName: string;
    status: number;
}

export interface RolePayload {
    roleCode: string;
    roleName: string;
    status: number;
    menuSet: { id: number }[];
    permissionSet: { id: number }[];
}

export type RolesResponse = BaseResponse<PaginatedData<Role>>;
export type RoleDetailResponse = BaseResponse<Role>;
export type ActionResponse = BaseResponse<string | any>;
