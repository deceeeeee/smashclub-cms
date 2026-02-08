export const API_ERROR_CODES = {
    INVALID_FORMAT: 'X01001',
} as const;

export type ApiErrorCode = typeof API_ERROR_CODES[keyof typeof API_ERROR_CODES];
