export interface EquipmentCategory {
    id: number;
    categoryName: string;
}

export interface Equipment {
    id: number;
    equipmentName: string;
    brand: string;
    type: string;
    stock: number;
    price: number;
    status: number;
    createdAt: string;
    equipmentCategory: EquipmentCategory;
}

export interface EquipmentPageResponse {
    content: Equipment[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
}

export interface EquipmentPayload {
    equipmentName: string;
    brand: string;
    type: string;
    stock: number;
    price: number;
    status: number;
    categoryId: number;
}

export interface ActionResponse<T> {
    success: boolean;
    message: string;
    data: T;
    status: number;
    timestamp: string;
}
