
import React, { useState } from 'react';
import { X, Send } from 'lucide-react';
import './InputModal.css';

interface InputModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    description: string;
    inputLabel?: string;
    inputPlaceholder?: string;
    onConfirm: (value: string) => void;
    confirmText?: string;
    cancelText?: string;
    variant?: 'primary' | 'danger' | 'success';
    required?: boolean;
}

const InputModal: React.FC<InputModalProps> = ({
    isOpen,
    onClose,
    title,
    description,
    inputLabel,
    inputPlaceholder,
    onConfirm,
    confirmText = 'Konfirmasi',
    cancelText = 'Batal',
    variant = 'primary',
    required = false,
}) => {
    const [inputValue, setInputValue] = useState('');
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleConfirm = () => {
        if (required && !inputValue.trim()) {
            setError('Input ini wajib diisi');
            return;
        }
        onConfirm(inputValue);
        setInputValue(''); // Reset input
        setError('');
        onClose();
    };

    const handleClose = () => {
        setInputValue('');
        setError('');
        onClose();
    };

    return (
        <div className="input-modal-overlay">
            <div className="input-modal-container">
                <div className="input-modal-header">
                    <h3 className="input-modal-title">{title}</h3>
                    <button className="btn-close-modal" onClick={handleClose}>
                        <X size={20} />
                    </button>
                </div>

                <div className="input-modal-body">
                    <p className="input-modal-description">{description}</p>

                    <div className="input-modal-form-group">
                        {inputLabel && (
                            <label className="input-modal-label">
                                {inputLabel} {required && <span className="text-danger">*</span>}
                            </label>
                        )}
                        <textarea
                            className={`input-modal-textarea ${error ? 'input-error' : ''}`}
                            placeholder={inputPlaceholder}
                            value={inputValue}
                            onChange={(e) => {
                                setInputValue(e.target.value);
                                if (error) setError('');
                            }}
                            rows={4}
                        />
                        {error && <span className="input-modal-error">{error}</span>}
                        {required && <span className="input-modal-helper">* Pesan ini akan dikirimkan langsung ke email pelanggan.</span>}
                    </div>
                </div>

                <div className="input-modal-footer">
                    <button className="btn-modal-cancel" onClick={handleClose}>
                        {cancelText}
                    </button>
                    <button
                        className={`btn-modal-confirm btn-${variant}`}
                        onClick={handleConfirm}
                    >
                        <Send size={16} />
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InputModal;
