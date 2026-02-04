import { create } from 'zustand';

type AlertType = 'success' | 'error' | 'info';

interface AlertState {
    isOpen: boolean;
    type: AlertType;
    title: string;
    message: string;
    showAlert: (type: AlertType, title: string, message: string) => void;
    showSuccess: (title: string, message: string) => void;
    showError: (title: string, message: string) => void;
    hideAlert: () => void;
}

export const useAlertStore = create<AlertState>((set) => ({
    isOpen: false,
    type: 'info',
    title: '',
    message: '',
    showAlert: (type, title, message) => set({ isOpen: true, type, title, message }),
    showSuccess: (title, message) => set({ isOpen: true, type: 'success', title, message }),
    showError: (title, message) => set({ isOpen: true, type: 'error', title, message }),
    hideAlert: () => set({ isOpen: false }),
}));

