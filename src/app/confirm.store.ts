import { create } from 'zustand';

interface ConfirmState {
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: (() => void) | null;
    confirmText: string;
    cancelText: string;
    showConfirm: (options: {
        title: string;
        message: string;
        onConfirm: () => void;
        confirmText?: string;
        cancelText?: string;
    }) => void;
    hideConfirm: () => void;
}

export const useConfirmStore = create<ConfirmState>((set) => ({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: null,
    confirmText: 'Hapus Permanen',
    cancelText: 'Batal',
    showConfirm: ({ title, message, onConfirm, confirmText = 'Hapus Permanen', cancelText = 'Batal' }) =>
        set({ isOpen: true, title, message, onConfirm, confirmText, cancelText }),
    hideConfirm: () => set({ isOpen: false, onConfirm: null }),
}));
