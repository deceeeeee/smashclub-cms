import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from './auth.types';

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    login: (user: User, token: string) => void;
    logout: () => void;
    hasPermission: (permissionCode: string) => boolean;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            token: null,
            isAuthenticated: false,

            login: (user, token) =>
                set({
                    user,
                    token,
                    isAuthenticated: true,
                }),

            logout: () =>
                set({
                    user: null,
                    token: null,
                    isAuthenticated: false,
                }),

            hasPermission: (permissionCode: string) => {
                const state = get();
                if (!state.user || !state.user.adminRole) return false;

                // Developer has all permissions
                if (state.user.adminRole.roleCode === 'DEV') return true;

                return state.user.adminRole.permissionSet?.some(
                    p => p.permissionCode === permissionCode
                ) || false;
            }
        }),
        {
            name: 'auth-storage',
        }
    )
);
