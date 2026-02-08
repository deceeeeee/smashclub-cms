import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, ShieldAlert, ArrowLeft } from 'lucide-react';
import './AccessDenied.css';

const AccessDenied: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="access-denied-container">
            <div className="access-denied-content">
                <div className="illustration-wrapper">
                    <div className="security-shield">
                        <ShieldAlert size={80} className="shield-icon" />
                    </div>
                    <div className="glow-pulse"></div>
                </div>

                <h1 className="denied-title">Akses Ditolak</h1>
                <p className="denied-message">
                    Maaf, Anda tidak memiliki izin yang diperlukan untuk mengakses atau melakukan tindakan di halaman ini.
                    Silakan hubungi administrator jika Anda merasa ini adalah kesalahan.
                </p>

                <div className="denied-actions">
                    <button className="btn-back" onClick={() => navigate(-1)}>
                        <ArrowLeft size={18} />
                        <span>Kembali</span>
                    </button>
                    <button className="btn-home" onClick={() => navigate('/dashboard')}>
                        <Home size={18} />
                        <span>Ke Beranda</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AccessDenied;
