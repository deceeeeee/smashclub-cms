/**
 * Format number to thousand separator (e.g. 1000 to 1.000)
 */
export const formatNumber = (value: number | string): string => {
    if (value === undefined || value === null || value === '') return '';
    const number = typeof value === 'string' ? parseInt(value.replace(/\D/g, ''), 10) : value;
    if (isNaN(number)) return '';
    return number.toLocaleString('id-ID');
};

/**
 * Parse formatted string back to number
 */
export const parseFormattedNumber = (value: string): number => {
    if (!value) return 0;
    const cleanValue = value.replace(/\D/g, '');
    return cleanValue ? parseInt(cleanValue, 10) : 0;
};
