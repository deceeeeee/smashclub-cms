import React from 'react';
import { useConfirmStore } from '../../../app/confirm.store';
import { AlertTriangle, X } from 'lucide-react';
import './ConfirmModal.css';

const ConfirmModal: React.FC = () => {
    const { isOpen, title, message, onConfirm, confirmText, cancelText, hideConfirm } = useConfirmStore();

    if (!isOpen) return null;

    const handleConfirm = () => {
        if (onConfirm) onConfirm();
        hideConfirm();
    };

    return (
        <div className="confirm-overlay">
            <div className="confirm-modal">
                <button className="confirm-close" onClick={hideConfirm}>
                    <X size={20} />
                </button>
                <div className="confirm-content">
                    <div className="confirm-icon-wrapper">
                        <AlertTriangle size={32} className="confirm-icon" />
                    </div>
                    <h2 className="confirm-title">{title}</h2>
                    <p className="confirm-message">{message}</p>
                    <div className="confirm-actions">
                        <button className="btn-cancel" onClick={hideConfirm}>
                            {cancelText}
                        </button>
                        <button className="btn-confirm" onClick={handleConfirm}>
                            {confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
