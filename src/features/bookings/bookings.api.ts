import axiosInstance from '../../services/axios';
import type { BaseResponse } from '../../services/api.types';
import type { BookingStatisticsResponse, BookingListResponse, BookingDetailResponse } from './bookings.types';

export const fetchBookingStatistics = async (year: number): Promise<BookingStatisticsResponse> => {
    const response = await axiosInstance.get<BookingStatisticsResponse>(`/admin/booking`, {
        params: { year }
    });
    return response.data;
};

export const fetchBookingList = async (
    year: number,
    month: number,
    keyword: string = '',
    page: number = 0,
    size: number = 25
): Promise<BookingListResponse> => {
    const response = await axiosInstance.get<BookingListResponse>(`/admin/booking/list`, {
        params: { year, month, keyword, page, size }
    });
    return response.data;
};

export const fetchBookingDetail = async (bookingCode: string): Promise<BookingDetailResponse> => {
    const response = await axiosInstance.get<BookingDetailResponse>(`/admin/booking/detail/${bookingCode}`);
    return response.data;
};

export const processBooking = async (bookingCode: string, status: number): Promise<BaseResponse<any>> => {
    const response = await axiosInstance.post<BaseResponse<any>>(`/admin/booking/process/${bookingCode}`, { status });
    return response.data;
};
