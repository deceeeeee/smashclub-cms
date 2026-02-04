export interface Product {
    id: number;
    productName: string;
    category: string;
    defaultImgLink: string;
    status: number;
    productDesc?: string;
}

export interface ProductPageResponse {
    content: Product[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
}

export interface ProductPayload {
    productName: string;
    category: string;
    defaultImgLink: string;
    status: number;
    productDesc?: string;
}

export interface ActionResponse<T> {
    success: boolean;
    message: string;
    data: T;
    status: number;
    timestamp: string;
}
