import type { PaginatedData } from "../../services/api.types";
export interface ProductVariant {
    id?: number;
    name: string;
    price: number;
    sku: string;
    stock: number;
    variantImgLink: string;
}

export interface Product {
    id: number;
    productName: string;
    category: string;
    defaultImgLink: string;
    status: number;
    productDesc?: string;
    productVariants: ProductVariant[];
}

export type ProductPageResponse = PaginatedData<Product>;

export interface ProductPayload {
    productName: string;
    category: string;
    defaultImgLink: string;
    status: number;
    productDesc?: string;
    productVariants: ProductVariant[];
}
