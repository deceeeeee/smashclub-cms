import { create } from 'zustand';
import type { Product, ProductPayload } from './products.types';
import { fetchProducts, fetchProductDetail, saveProduct, removeProduct } from './products.api';

interface ProductsState {
    products: Product[];
    totalElements: number;
    totalPages: number;
    isLoading: boolean;
    error: string | null;
    getProducts: (keyword?: string, page?: number, size?: number) => Promise<void>;
    getProductDetail: (id: number) => Promise<any>;
    submitProduct: (payload: ProductPayload, id?: number) => Promise<{ success: boolean; message: string }>;
    deleteProduct: (id: number) => Promise<{ success: boolean; message: string }>;
}

export const useProductsStore = create<ProductsState>((set) => ({
    products: [],
    totalElements: 0,
    totalPages: 0,
    isLoading: false,
    error: null,

    getProducts: async (keyword = '', page = 0, size = 25) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetchProducts(keyword, page, size);
            if (response.success) {
                set({
                    products: response.data.content,
                    totalElements: response.data.totalElements,
                    totalPages: response.data.totalPages,
                    isLoading: false,
                });
            } else {
                set({ error: response.message, isLoading: false });
            }
        } catch (err: any) {
            set({
                error: err.response?.data?.message || 'Failed to fetch products',
                isLoading: false,
            });
        }
    },

    getProductDetail: async (id: number) => {
        try {
            const response = await fetchProductDetail(id);
            return response;
        } catch (err) {
            return null;
        }
    },

    submitProduct: async (payload: ProductPayload, id?: number) => {
        set({ isLoading: true, error: null });
        try {
            const response = await saveProduct(payload, id);
            set({ isLoading: false });
            return { success: response.success, message: response.message };
        } catch (err: any) {
            const message = err.response?.data?.message || 'Gagal menyimpan data produk';
            set({ error: message, isLoading: false });
            return { success: false, message };
        }
    },

    deleteProduct: async (id: number) => {
        set({ isLoading: true, error: null });
        try {
            const response = await removeProduct(id);
            set({ isLoading: false });
            return { success: response.success, message: response.message };
        } catch (err: any) {
            const message = err.response?.data?.message || 'Gagal menghapus produk';
            set({ error: message, isLoading: false });
            return { success: false, message };
        }
    },
}));
