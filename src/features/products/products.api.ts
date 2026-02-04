import axiosInstance from '../../services/axios';
import type { Product, ProductPageResponse, ProductPayload } from './products.types';
import type { BaseResponse } from '../../services/api.types';

export const fetchProducts = async (
    keyword: string = '',
    page: number = 0,
    size: number = 25
): Promise<BaseResponse<ProductPageResponse>> => {
    const response = await axiosInstance.get('/admin/product', {
        params: { keyword, page, size }
    });
    return response.data;
};

export const fetchProductDetail = async (id: number): Promise<BaseResponse<Product>> => {
    const response = await axiosInstance.get(`/admin/product/${id}`);
    return response.data;
};

export const saveProduct = async (payload: ProductPayload, id?: number): Promise<BaseResponse<Product>> => {
    if (id) {
        const response = await axiosInstance.post(`/admin/product/${id}`, payload);
        return response.data;
    } else {
        const response = await axiosInstance.post('/admin/product', payload);
        return response.data;
    }
};

export const removeProduct = async (id: number): Promise<BaseResponse<null>> => {
    const response = await axiosInstance.delete(`/admin/product/delete/${id}`);
    return response.data;
};
