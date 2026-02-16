
import axiosInstance from '../../services/axios';
import type { RefundRequestListResponse } from './refunds.types';

export const fetchRefundRequests = async (
    startDate?: string,
    endDate?: string,
    status?: number | null,
    keyword?: string,
    page = 0,
    size = 25
): Promise<RefundRequestListResponse> => {
    const response = await axiosInstance.get<RefundRequestListResponse>('/admin/refund-request', {
        params: {
            startDate,
            endDate,
            status,
            keyword,
            page,
            size,
        },
    });
    return response.data;
};

export const processRefundRequest = async (
    id: string,
    status: number,
    notes: string
): Promise<any> => {
    const response = await axiosInstance.post(`/admin/refund-request/process/${id}`, {
        refundStatus: status,
        refundNotes: notes
    });
    return response.data;
};
