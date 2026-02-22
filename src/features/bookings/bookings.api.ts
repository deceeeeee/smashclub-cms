import axiosInstance from '../../services/axios';
import type { BookingStatisticsResponse } from './bookings.types';

export const fetchBookingStatistics = async (year: number): Promise<BookingStatisticsResponse> => {
    const response = await axiosInstance.get<BookingStatisticsResponse>(`/admin/booking/statistic`, {
        params: { year }
    });
    return response.data;
};
