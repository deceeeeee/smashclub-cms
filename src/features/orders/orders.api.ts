import axiosInstance from '../../services/axios';
import type { OrderStatisticsResponse, OrderListResponse, OrderDetailResponse } from './orders.types';
import type { BaseResponse } from '../../services/api.types';

export const fetchOrderStatistics = async (year: number): Promise<OrderStatisticsResponse> => {
    const response = await axiosInstance.get<OrderStatisticsResponse>(`/admin/order?year=${year}`);
    return response.data;
};

export const fetchOrderList = async (
    year: number,
    month: number,
    keyword: string = '',
    page: number = 0,
    size: number = 25
): Promise<OrderListResponse> => {
    const response = await axiosInstance.get<OrderListResponse>(
        `/admin/order/list?year=${year}&month=${month}&keyword=${keyword}&page=${page}&size=${size}`
    );
    return response.data;
};

export const fetchOrderDetail = async (orderCode: string): Promise<OrderDetailResponse> => {
    const response = await axiosInstance.get<OrderDetailResponse>(`/admin/order/detail/${orderCode}`);
    return response.data;
};

export const processOrder = async (orderCode: string, status: number): Promise<BaseResponse<string>> => {
    const response = await axiosInstance.post<BaseResponse<string>>(`/admin/order/process/${orderCode}`, { status });
    return response.data;
};
