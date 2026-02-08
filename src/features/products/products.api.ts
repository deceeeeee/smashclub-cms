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
    const formData = new FormData();
    formData.append('productName', payload.productName);
    formData.append('category', payload.category);
    formData.append('status', payload.status.toString());
    formData.append('productDesc', payload.productDesc!);

    if (payload.defaultImgLink instanceof File) {
        formData.append('defaultImgLink', payload.defaultImgLink);
    }

    // Create form data field for each variant
    for (let index in payload.productVariants) {
        const variantItem = {
            id: payload.productVariants[index].id,
            sku: payload.productVariants[index].sku,
            name: payload.productVariants[index].name,
            price: payload.productVariants[index].price,
            stock: payload.productVariants[index].stock
        };
        formData.append(`productVariants`, JSON.stringify(variantItem));

        if (payload.productVariants[index].variantImgLink instanceof File) {
            formData.append(`variantImages[${index}]`, payload.productVariants[index].variantImgLink);
        }
    }

    if (id) {
        const response = await axiosInstance.put(`/admin/product/update/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    } else {
        const response = await axiosInstance.post('/admin/product/save', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    }
};

export const removeProduct = async (id: number): Promise<BaseResponse<null>> => {
    const response = await axiosInstance.delete(`/admin/product/delete/${id}`);
    return response.data;
};
