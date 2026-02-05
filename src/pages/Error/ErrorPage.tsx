import React from 'react';
import { useNavigate, useRouteError, isRouteErrorResponse, Link } from 'react-router-dom';
import { Home, RefreshCcw, AlertTriangle, ShieldAlert, FileSearch } from 'lucide-react';
import './ErrorPage.css';

const ErrorPage: React.FC = () => {
    const error = useRouteError();
    const navigate = useNavigate();

    let title = "Terjadi Kesalahan";
    let message = "Maaf, sistem sedang mengalami kendala teknis. Silakan coba lagi nanti.";
    let statusCode = "Error";
    let Icon = AlertTriangle;

    if (isRouteErrorResponse(error)) {
        statusCode = error.status.toString();
        if (error.status === 404) {
            title = "Halaman Tidak Ditemukan";
            message = "Ups! Halaman yang Anda cari tidak dapat ditemukan atau telah dipindahkan.";
            Icon = FileSearch;
        } else if (error.status === 401) {
            title = "Sesi Berakhir";
            message = "Sesi Anda telah berakhir. Silakan login kembali untuk melanjutkan.";
            Icon = ShieldAlert;
        } else if (error.status === 403) {
            title = "Akses Ditolak";
            message = "Anda tidak memiliki izin untuk mengakses halaman ini.";
            Icon = ShieldAlert;
        } else if (error.status === 500) {
            title = "Kesalahan Server";
            message = "Terjadi kesalahan internal pada server kami.";
            Icon = AlertTriangle;
        }
    } else if (error instanceof Error) {
        message = error.message;
    }

    return (
        <div className="error-page-container">
            <div className="error-content">
                <div className="error-illustration">
                    <div className="status-badge">{statusCode}</div>
                    <Icon size={120} className="error-icon-main" />
                    <div className="glow-effect"></div>
                </div>

                <h1 className="error-title">{title}</h1>
                <p className="error-description">{message}</p>

                <div className="error-actions">
                    <button
                        className="btn-primary-error"
                        onClick={() => navigate('/dashboard')}
                    >
                        <Home size={20} />
                        <span>Kembali ke Beranda</span>
                    </button>
                    <button
                        className="btn-secondary-error"
                        onClick={() => window.location.reload()}
                    >
                        <RefreshCcw size={20} />
                        <span>Muat Ulang Halaman</span>
                    </button>
                </div>

                <div className="error-footer">
                    <p>Jika masalah berlanjut, silakan hubungi <Link to="#">Tim Support</Link></p>
                </div>
            </div>
        </div>
    );
};

export default ErrorPage;
