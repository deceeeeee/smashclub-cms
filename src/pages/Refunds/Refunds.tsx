
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Search,
    Filter,
    Download,
    ChevronLeft,
    ChevronRight,
    ClipboardList,
    CheckCircle,
    XCircle,
    Check,
    X
} from 'lucide-react';
import './Refunds.css';
import InputModal from '../../components/ui/InputModal/InputModal';
import { useAlertStore } from '../../app/alert.store';

// Mock Data
const MOCK_REFUNDS = [
    {
        id: 'SC-10293',
        customer: {
            name: 'Budi Santoso',
            avatar: 'BS',
            color: '#10b981'
        },
        date: '24 Okt 2023',
        reason: 'Lapangan sedang diperbaiki',
        amount: 'Rp 150.000',
        status: 'Waiting'
    },
    {
        id: 'SC-10288',
        customer: {
            name: 'Ani Lestari',
            avatar: 'AL',
            color: '#f59e0b'
        },
        date: '23 Okt 2023',
        reason: 'Jadwal bertabrakan',
        amount: 'Rp 75.000',
        status: 'Approved'
    },
    {
        id: 'SC-10285',
        customer: {
            name: 'Rizky Kurniawan',
            avatar: 'RK',
            color: '#ef4444'
        },
        date: '22 Okt 2023',
        reason: 'Double payment',
        amount: 'Rp 200.000',
        status: 'Waiting'
    },
    {
        id: 'SC-10271',
        customer: {
            name: 'Dewi Nurhaliza',
            avatar: 'DN',
            color: '#3b82f6'
        },
        date: '20 Okt 2023',
        reason: 'Salah memilih jenis lapangan',
        amount: 'Rp 120.000',
        status: 'Rejected'
    }
];

const Refunds = () => {
    const [search, setSearch] = useState('');
    const { showSuccess } = useAlertStore();

    // Dropdown & Modal State
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [modalConfig, setModalConfig] = useState<{
        isOpen: boolean;
        title: string;
        description: string;
        inputLabel?: string;
        inputPlaceholder?: string;
        confirmText: string;
        cancelText: string;
        variant: 'primary' | 'danger' | 'success';
        required: boolean;
        action: 'approve' | 'reject';
        refundId: string;
    }>({
        isOpen: false,
        title: '',
        description: '',
        confirmText: '',
        cancelText: '',
        variant: 'primary',
        required: false,
        action: 'approve',
        refundId: ''
    });

    const toggleDropdown = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setActiveDropdown(activeDropdown === id ? null : id);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = () => setActiveDropdown(null);
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    const openModal = (id: string, type: 'approve' | 'reject') => {
        setActiveDropdown(null); // Close dropdown

        if (type === 'reject') {
            setModalConfig({
                isOpen: true,
                title: 'Tolak Pengajuan Refund',
                description: 'Berikan alasan yang jelas agar pelanggan memahami mengapa pengajuan ini tidak dapat diproses lebih lanjut.',
                inputLabel: 'Alasan Penolakan',
                inputPlaceholder: 'Contoh: Bukti transfer tidak valid atau melewati batas waktu pembatalan (24 jam)...',
                confirmText: 'Kirim Penolakan',
                cancelText: 'Batal',
                variant: 'danger',
                required: true,
                action: 'reject',
                refundId: id
            });
        } else {
            setModalConfig({
                isOpen: true,
                title: 'Setujui Pengajuan Refund',
                description: 'Pastikan data pengajuan sudah valid. Tindakan ini akan memproses pengembalian dana ke wallet pelanggan.',
                inputLabel: 'Catatan (Opsional)',
                inputPlaceholder: 'Tambahkan catatan jika diperlukan...',
                confirmText: 'Setujui Refund',
                cancelText: 'Batal',
                variant: 'success',
                required: false,
                action: 'approve',
                refundId: id
            });
        }
    };

    const handleConfirmModal = (inputValue: string) => {
        // Here you would typically call an API
        console.log(`Processing ${modalConfig.action} for ${modalConfig.refundId} with note: ${inputValue}`);

        setModalConfig({ ...modalConfig, isOpen: false });

        const message = `Transaksi #${modalConfig.refundId} telah ${modalConfig.action === 'approve' ? 'disetujui' : 'ditolak'}.`;

        if (modalConfig.action === 'approve') {
            showSuccess('Status Diperbarui', message);
        } else {
            showSuccess('Status Diperbarui', message); // Using success for both as it's a successful action completion
        }
    };

    return (
        <div className="refunds-page">
            {/* Breadcrumbs */}
            <nav className="breadcrumbs">
                <Link to="/dashboard">SmashClub</Link>
                <span className="separator">/</span>
                <span className="current">Manajemen Refund</span>
            </nav>

            {/* Stats Cards */}
            <div className="refunds-stats-row">
                <div className="refunds-stat-card">
                    <div className="refunds-stat-info">
                        <span className="refunds-stat-label">Total Menunggu</span>
                        <span className="refunds-stat-value">12</span>
                        <div className="refunds-stat-trend trend-up">
                            <span>↗ +5% dari bulan lalu</span>
                        </div>
                    </div>
                    <div className="refunds-stat-icon icon-yellow">
                        <ClipboardList size={28} />
                    </div>
                </div>

                <div className="refunds-stat-card">
                    <div className="refunds-stat-info">
                        <span className="refunds-stat-label">Total Disetujui</span>
                        <span className="refunds-stat-value">45</span>
                        <div className="refunds-stat-trend trend-down">
                            <span>↘ -2% dari bulan lalu</span>
                        </div>
                    </div>
                    <div className="refunds-stat-icon icon-green">
                        <CheckCircle size={28} />
                    </div>
                </div>

                <div className="refunds-stat-card">
                    <div className="refunds-stat-info">
                        <span className="refunds-stat-label">Total Ditolak</span>
                        <span className="refunds-stat-value">3</span>
                        <div className="refunds-stat-trend trend-neutral">
                            <span>Tetap dari bulan lalu</span>
                        </div>
                    </div>
                    <div className="refunds-stat-icon icon-red">
                        <XCircle size={28} />
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="table-card">
                <div className="page-header" style={{ padding: '1.5rem', marginBottom: 0, borderBottom: '1px solid var(--color-border)' }}>
                    <div className="header-text">
                        <h1 style={{ fontSize: '1.1rem' }}>Daftar Pengajuan Pengembalian Dana</h1>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <div className="search-bar" style={{ width: '250px' }}>
                            <Search size={16} className="search-icon" />
                            <input
                                type="text"
                                placeholder="Cari transaksi..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                style={{ padding: '0.5rem 1rem 0.5rem 2.5rem', fontSize: '0.85rem' }}
                            />
                        </div>
                        <button className="btn-action-outline">
                            <Filter size={16} />
                            Filter
                        </button>
                        <button className="btn-primary" style={{ backgroundColor: '#10b981', color: 'white' }}>
                            <Download size={16} />
                            Ekspor Data
                        </button>
                    </div>
                </div>

                <div className="table-container" style={{ border: 'none', borderRadius: 0 }}>
                    <table className="user-table">
                        <thead>
                            <tr>
                                <th style={{ width: '15%' }}>ID TRANSAKSI</th>
                                <th style={{ width: '20%' }}>PELANGGAN</th>
                                <th style={{ width: '15%' }}>TANGGAL</th>
                                <th style={{ width: '20%' }}>ALASAN REFUND</th>
                                <th style={{ width: '15%' }}>TOTAL DANA</th>
                                <th style={{ width: '15%' }}>STATUS REQUEST</th>
                                <th style={{ width: '10%' }}>AKSI</th>
                            </tr>
                        </thead>
                        <tbody>
                            {MOCK_REFUNDS.map((refund) => (
                                <tr key={refund.id}>
                                    <td>
                                        <span className="refund-id">#{refund.id}</span>
                                    </td>
                                    <td>
                                        <div className="refunds-table-customer">
                                            <div className="customer-avatar-circle">
                                                {refund.customer.avatar}
                                            </div>
                                            <div className="customer-info">
                                                <span className="customer-name">{refund.customer.name}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td>{refund.date}</td>
                                    <td style={{ color: 'var(--color-text-mutex)' }}>{refund.reason}</td>
                                    <td style={{ fontWeight: 600 }}>{refund.amount}</td>
                                    <td>
                                        {refund.status === 'Waiting' && (
                                            <span className="status-badge status-waiting">
                                                <span className="status-dot dot-waiting"></span>
                                                Menunggu
                                            </span>
                                        )}
                                        {refund.status === 'Approved' && (
                                            <span className="status-badge status-approved">
                                                <span className="status-dot dot-approved"></span>
                                                Disetujui
                                            </span>
                                        )}
                                        {refund.status === 'Rejected' && (
                                            <span className="status-badge status-rejected">
                                                <span className="status-dot dot-rejected"></span>
                                                Ditolak
                                            </span>
                                        )}
                                    </td>
                                    <td>
                                        {refund.status === 'Waiting' ? (
                                            <div className="action-dropdown-container">
                                                <button
                                                    className="btn-action-trigger"
                                                    onClick={(e) => toggleDropdown(refund.id, e)}
                                                >
                                                    Proses
                                                    <ChevronRight size={14} style={{ rotate: '90deg' }} />
                                                </button>

                                                {activeDropdown === refund.id && (
                                                    <div className="action-dropdown-menu">
                                                        <button
                                                            className="dropdown-item success"
                                                            onClick={() => openModal(refund.id, 'approve')}
                                                        >
                                                            <Check size={14} />
                                                            Setujui
                                                        </button>
                                                        <button
                                                            className="dropdown-item danger"
                                                            onClick={() => openModal(refund.id, 'reject')}
                                                        >
                                                            <X size={14} />
                                                            Tolak
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        ) : ""}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="pagination-bar" style={{ borderTop: '1px solid var(--color-border)' }}>
                    <div className="pagination-info">
                        Menampilkan 1-4 dari 12 pengajuan
                    </div>
                    <div className="pagination-controls">
                        <button className="pagination-btn"><ChevronLeft size={16} /></button>
                        <button className="pagination-btn active-page">1</button>
                        <button className="pagination-btn">2</button>
                        <button className="pagination-btn">3</button>
                        <button className="pagination-btn"><ChevronRight size={16} /></button>
                    </div>
                </div>
            </div>

            {/* Removed Toast Notification */}

            {/* Input Modal */}
            <InputModal
                isOpen={modalConfig.isOpen}
                onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
                title={modalConfig.title}
                description={modalConfig.description}
                inputLabel={modalConfig.inputLabel}
                inputPlaceholder={modalConfig.inputPlaceholder}
                onConfirm={handleConfirmModal}
                confirmText={modalConfig.confirmText}
                cancelText={modalConfig.cancelText}
                variant={modalConfig.variant}
                required={modalConfig.required}
            />
        </div>
    );
};

export default Refunds;
