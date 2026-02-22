import { create } from 'zustand';
import type { BookingStatistics } from './bookings.types';
import { fetchBookingStatistics } from './bookings.api';

interface BookingsState {
    statistics: BookingStatistics | null;
    isLoading: boolean;
    error: string | null;

    getStatistics: (year: number) => Promise<void>;
}

export const useBookingsStore = create<BookingsState>((set) => ({
    statistics: null,
    isLoading: false,
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
    }
}));
