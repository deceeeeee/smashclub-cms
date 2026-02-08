export interface User {
    fullname: string;
    username: string;
    adminRole?: AdminRole;
}

export interface Permission {
    permissionCode: string;
}

export interface MenuPermission {
    id: number;
    permissionCode: string;
    permissionName: string;
}

export interface Category {
    id: number;
    categoryName: string;
}

export interface Menu {
    id: number;
    menuCode: string;
    menuName: string;
    parentId: number;
    category?: Category;
    permissions?: MenuPermission[];
}

export interface AdminRole {
    id: number;
    roleCode: string;
    roleName: string;
    menuSet?: Menu[];
    permissionSet?: Permission[];
}

export interface AuthenticatedData {
    accessToken: string;
    fullname: string;
    username: string;
    adminRole: AdminRole;
}

export interface LoginData {
    accessToken: string;
    fullname: string;
    username: string;
    adminRole?: AdminRole;
}

export interface LoginPayload {
    username: string;
    password: string;
}
