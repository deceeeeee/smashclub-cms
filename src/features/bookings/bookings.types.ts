import type { BaseResponse } from "../../services/api.types";

export interface MonthlyBookingStatistic {
    monthName?: string; // For display
    averageHour: number;
    occupancyRate: number;
    totalCount: number;
    totalPrice: number;
}

export interface BookingStatistics {
    averageBookingHours: number;
    monthlyBookingStatistic: MonthlyBookingStatistic[];
    occupancyRate: number;
    totalBookingCount: number;
}

export type BookingStatisticsResponse = BaseResponse<BookingStatistics>;
