import axiosInstance from '../../services/axios';
import type { OrderStatisticsResponse, OrderListResponse } from './orders.types';

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
