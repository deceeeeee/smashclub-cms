import type { PaginatedData } from "../../services/api.types";

export interface EquipmentCategory {
    id: number;
    categoryName: string;
    status: number;
}

export type EquipmentCategoryPageResponse = PaginatedData<EquipmentCategory>;

export interface EquipmentCategoryPayload {
    categoryName: string;
    status: number;
}
