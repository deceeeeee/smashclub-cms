import React from 'react';
import { useAlertStore } from '../../../app/alert.store';
import { CheckCircle2, XCircle, Info, X } from 'lucide-react';
import './AlertModal.css';

const AlertModal: React.FC = () => {
    const { isOpen, type, title, message, hideAlert } = useAlertStore();

    if (!isOpen) return null;

    const getIcon = () => {
        switch (type) {
            case 'success':
                return <CheckCircle2 className="alert-icon success" size={64} />;
            case 'error':
                return <XCircle className="alert-icon error" size={64} />;
            case 'info':
            default:
                return <Info className="alert-icon info" size={64} />;
        }
    };

    return (
        <div className="alert-overlay">
            <div className={`alert-modal ${type}`}>
                <button className="alert-close" onClick={hideAlert} aria-label="Close">
                    <X size={20} />
                </button>
                <div className="alert-content">
                    <div className="alert-icon-wrapper">
                        {getIcon()}
                    </div>
                    <h2 className="alert-title">{title}</h2>
                    <p className="alert-message">{message}</p>
                    <button className="alert-button" onClick={hideAlert}>
                        Tutup
                    </button>
                </div>
                <div className="alert-footer-accent"></div>
            </div>
        </div>
    );
};

export default AlertModal;
