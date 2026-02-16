
import axiosInstance from '../../services/axios';
import type {
    SalesStatisticsResponse,
    MonthlySalesListResponse,
    TransactionDetailResponse
} from './sales.types';

export const fetchSalesStatistics = async (year: number): Promise<SalesStatisticsResponse> => {
    const response = await axiosInstance.get<SalesStatisticsResponse>(`/admin/sales`, {
        params: { year }
    });
    return response.data;
};

export const fetchMonthlySalesList = async (
    year: number,
    month: number,
    keyword?: string,
    page = 0,
    size = 25
): Promise<MonthlySalesListResponse> => {
    const response = await axiosInstance.get<MonthlySalesListResponse>(`/admin/sales/list`, {
        params: { year, month, keyword, page, size }
    });
    return response.data;
};

export const fetchTransactionDetail = async (transactionCode: string): Promise<TransactionDetailResponse> => {
    const response = await axiosInstance.get<TransactionDetailResponse>(`/admin/sales/detail/${transactionCode}`);
    return response.data;
};
