import type { PaginatedData } from "../../services/api.types";
import type { EquipmentCategory } from "../equipment-category/equipment-category.types";

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

export type EquipmentPageResponse = PaginatedData<Equipment>;

export interface EquipmentPayload {
    equipmentName: string;
    brand: string;
    type: string;
    stock: number;
    price: number;
    status: number;
    equipmentCategory: {
        id: number;
    };
}
