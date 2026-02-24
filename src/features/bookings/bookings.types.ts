import type { BaseResponse, PaginatedData } from "../../services/api.types";

export interface MonthlyBookingStatistic {
    month: string; // e.g., "February 2026"
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

export interface BookingListItem {
    basePrice: number;
    bookingCode: string;
    bookingDate: string;
    createdAt: string;
    durationHour: number;
    endTime: string;
    startTime: string;
    status: number;
    statusDesc: string;
    totalPrice: number;
    updatedAt: string | null;
}

export interface BookingList {
    averageBookingHours: number;
    bookings: PaginatedData<BookingListItem>;
    occupancyRate: number;
    totalBookingCount: number;
}

export interface BookingCoach {
    coach: {
        coachCode: string;
        coachImgLink: string | null;
        coachName: string;
    };
    coachPrice: number;
}

export interface BookingEquipment {
    equipment: {
        brand: string;
        equipmentImgLink: string | null;
        equipmentName: string;
        type: string;
    };
    equipmentPrice: number;
    quantity: number;
}

export interface BookingDetail {
    basePrice: number;
    bookingCode: string;
    bookingDate: string;
    coaches: BookingCoach[];
    court: {
        courtCode: string;
        courtImgLink: string;
        courtName: string;
    };
    createdAt: string;
    durationHour: number;
    endTime: string;
    equipments: BookingEquipment[];
    startTime: string;
    status: number;
    statusDesc: string;
    totalPrice: number;
    updatedAt: string | null;
    user: {
        email: string;
        fullName: string;
        id: string;
    };
}

export type BookingListResponse = BaseResponse<BookingList>;

export type BookingDetailResponse = BaseResponse<BookingDetail>;
