import axiosInstance from '../../services/axios';
import type { BookingStatisticsResponse } from './bookings.types';

export const fetchBookingStatistics = async (year: number): Promise<BookingStatisticsResponse> => {
    const response = await axiosInstance.get<BookingStatisticsResponse>(`/admin/booking`, {
        params: { year }
    });
    return response.data;
};
