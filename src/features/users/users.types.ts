export interface UserRole {
    roleCode: string;
    roleName: string;
}

export interface AdminUser {
    id: number;
    username: string;
    fullName: string;
    status: number;
    createdAt?: string;
    updatedAt?: string | null;
    adminRole: {
        id: number;
        roleCode: string;
        roleName: string;
    };
}

export interface UserPayload {
    fullName: string;
    username: string;
    password?: string;
    status: number;
    adminRole: {
        id: number | string;
    };
}

export interface UserPageResponse {
    content: AdminUser[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    numberOfElements: number;
    first: boolean;
    last: boolean;
    empty: boolean;
}
