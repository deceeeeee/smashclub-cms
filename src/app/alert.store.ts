import { create } from 'zustand';

type AlertType = 'success' | 'error' | 'info';

interface AlertState {
    isOpen: boolean;
    type: AlertType;
    title: string;
    message: string;
    onConfirm?: () => void;
    showAlert: (type: AlertType, title: string, message: string, onConfirm?: () => void) => void;
    showSuccess: (title: string, message: string, onConfirm?: () => void) => void;
    showError: (title: string, message: string, onConfirm?: () => void) => void;
    hideAlert: () => void;
}

export const useAlertStore = create<AlertState>((set) => ({
    isOpen: false,
    type: 'info',
    title: '',
    message: '',
    onConfirm: undefined,
    showAlert: (type, title, message, onConfirm) => set({ isOpen: true, type, title, message, onConfirm }),
    showSuccess: (title, message, onConfirm) => set({ isOpen: true, type: 'success', title, message, onConfirm }),
    showError: (title, message, onConfirm) => set({ isOpen: true, type: 'error', title, message, onConfirm }),
    hideAlert: () => set({ isOpen: false, onConfirm: undefined }),
}));

