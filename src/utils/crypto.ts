import CryptoJS from 'crypto-js';

const SECRET_KEY = import.meta.env.VITE_STORAGE_KEY || 'smashclub-secure-storage-key-2026';

export const encrypt = (data: string): string => {
    return CryptoJS.AES.encrypt(data, SECRET_KEY).toString();
};

export const decrypt = (ciphertext: string): string => {
    try {
        const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
        return bytes.toString(CryptoJS.enc.Utf8);
    } catch (error) {
        console.error('Failed to decrypt data', error);
        return '';
    }
};
