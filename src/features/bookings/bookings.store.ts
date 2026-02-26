import { create } from 'zustand';
import type { BookingStatistics, BookingList, BookingDetail } from './bookings.types';
import { fetchBookingStatistics, fetchBookingList, fetchBookingDetail, processBooking } from './bookings.api';

interface BookingsState {
    statistics: BookingStatistics | null;
    bookingListData: BookingList | null;
    currentBooking: BookingDetail | null;
    isLoading: boolean;
    isLoadingList: boolean;
    isLoadingDetail: boolean;
    error: string | null;

    getStatistics: (year: number) => Promise<void>;
    getBookingList: (year: number, month: number, keyword?: string, page?: number, size?: number) => Promise<void>;
    getBookingDetail: (bookingCode: string) => Promise<void>;
    updateBookingStatus: (bookingCode: string, status: number) => Promise<{ success: boolean; message: string }>;
}

export const useBookingsStore = create<BookingsState>((set) => ({
    statistics: null,
    bookingListData: null,
    currentBooking: null,
    isLoading: false,
    isLoadingList: false,
    isLoadingDetail: false,
    error: null,

    getStatistics: async (year: number) => {
        set({ isLoading: true, error: null });
        try {
            const response = await fetchBookingStatistics(year);
            if (response.success) {
                set({ statistics: response.data, isLoading: false });
            } else {
                set({ error: response.message, isLoading: false });
            }
        } catch (err: any) {
            set({
                error: err.response?.data?.message || 'Failed to fetch booking statistics',
                isLoading: false,
            });
        }
    },

    getBookingList: async (year: number, month: number, keyword = '', page = 0, size = 25) => {
        set({ isLoadingList: true, error: null });
        try {
            const response = await fetchBookingList(year, month, keyword, page, size);
            if (response.success) {
                set({ bookingListData: response.data, isLoadingList: false });
            } else {
                set({ bookingListData: null, error: response.message, isLoadingList: false });
            }
        } catch (err: any) {
            set({
                bookingListData: null,
                error: err.response?.data?.message || 'Failed to fetch booking list',
                isLoadingList: false,
            });
        }
    },

    getBookingDetail: async (bookingCode: string) => {
        set({ isLoadingDetail: true, error: null });
        try {
            const response = await fetchBookingDetail(bookingCode);
            if (response.success) {
                set({ currentBooking: response.data, isLoadingDetail: false });
            } else {
                set({ error: response.message, isLoadingDetail: false });
            }
        } catch (err: any) {
            set({
                error: err.response?.data?.message || 'Failed to fetch booking detail',
                isLoadingDetail: false,
            });
        }
    },

    updateBookingStatus: async (bookingCode: string, status: number) => {
        try {
            const response = await processBooking(bookingCode, status);
            return { success: response.success, message: response.message };
        } catch (err: any) {
            console.error('Failed to update booking status:', err);
            const message = err.response?.data?.message || 'Gagal memproses booking';
            return { success: false, message };
        }
    }
}));
