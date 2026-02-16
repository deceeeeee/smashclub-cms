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
    X,
    Loader2,
    AlertCircle
} from 'lucide-react';
import './Refunds.css';
import InputModal from '../../components/ui/InputModal/InputModal';
import { useAlertStore } from '../../app/alert.store';
import { useRefundsStore } from '../../features/refunds/refunds.store';

const Refunds = () => {
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');

    // Default to last 7 days
    const startDate = new Date();
    const endDate = new Date();
    startDate.setDate(startDate.getDate() - 7);
    endDate.setDate(endDate.getDate() + 1);

    const formatDate = (date: Date) => {
        const d = new Date(date);
        const month = '' + (d.getMonth() + 1);
        const day = '' + d.getDate();
        const year = d.getFullYear();
        return [year, month.padStart(2, '0'), day.padStart(2, '0')].join('-');
    };

    const [filters, setFilters] = useState({
        startDate: formatDate(startDate),
        endDate: formatDate(endDate),
        status: null as number | null
    });
    const [showFilterModal, setShowFilterModal] = useState(false);

    const { showSuccess } = useAlertStore();
    const { refunds, isLoading, getRefunds, totalElements, processRefund } = useRefundsStore();

    // Pagination state
    const [page, setPage] = useState(0);
    const [size] = useState(25);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
            setPage(0);
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    useEffect(() => {
        getRefunds(
            filters.startDate || undefined,
            filters.endDate || undefined,
            filters.status,
            debouncedSearch,
            page,
            size
        );
    }, [getRefunds, page, size, debouncedSearch, filters]);

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
        transactionCode: string;
    }>({
        isOpen: false,
        title: '',
        description: '',
        confirmText: '',
        cancelText: '',
        variant: 'primary',
        required: false,
        action: 'approve',
        refundId: '',
        transactionCode: ''
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

    const openModal = (id: string, transactionCode: string, type: 'approve' | 'reject') => {
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
                refundId: id,
                transactionCode: transactionCode
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
                refundId: id,
                transactionCode: transactionCode
            });
        }
    };

    const handleConfirmModal = async (inputValue: string) => {
        const status = modalConfig.action === 'approve' ? 1 : 2;
        const success = await processRefund(modalConfig.refundId, status, inputValue);

        if (success) {
            setModalConfig({ ...modalConfig, isOpen: false });
            const message = `Transaksi #${modalConfig.transactionCode} telah ${modalConfig.action === 'approve' ? 'disetujui' : 'ditolak'}.`;
            showSuccess('Status Diperbarui', message);

            // Refresh current list
            getRefunds(
                filters.startDate || undefined,
                filters.endDate || undefined,
                filters.status,
                debouncedSearch,
                page,
                size
            );
        }
    };

    const parseReason = (reasonStr: string) => {
        try {
            const parsed = JSON.parse(reasonStr);
            return parsed.refundReason || reasonStr;
        } catch (e) {
            return reasonStr;
        }
    };

    const formatIDR = (val: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(val).replace('IDR', 'Rp');
    };

    const handleApplyFilter = (startDate: string, endDate: string, status: number | null) => {
        setFilters({ startDate, endDate, status });
        setPage(0);
        setShowFilterModal(false);
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
                        <span className="refunds-stat-value">
                            {refunds.filter(r => r.refundStatus === 0).length}
                        </span>
                        {/* <div className="refunds-stat-trend trend-up">
                            <span>↗ +5% dari bulan lalu</span>
                        </div> */}
                    </div>
                    <div className="refunds-stat-icon icon-yellow">
                        <ClipboardList size={28} />
                    </div>
                </div>

                <div className="refunds-stat-card">
                    <div className="refunds-stat-info">
                        <span className="refunds-stat-label">Total Disetujui</span>
                        <span className="refunds-stat-value">
                            {refunds.filter(r => r.refundStatus === 1).length}
                        </span>
                        {/* <div className="refunds-stat-trend trend-down">
                            <span>↘ -2% dari bulan lalu</span>
                        </div> */}
                    </div>
                    <div className="refunds-stat-icon icon-green">
                        <CheckCircle size={28} />
                    </div>
                </div>

                <div className="refunds-stat-card">
                    <div className="refunds-stat-info">
                        <span className="refunds-stat-label">Total Ditolak</span>
                        <span className="refunds-stat-value">
                            {refunds.filter(r => r.refundStatus === 2).length}
                        </span>
                        {/* <div className="refunds-stat-trend trend-neutral">
                            <span>Tetap dari bulan lalu</span>
                        </div> */}
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
                        <h1 style={{ fontSize: '1.1rem' }}>Daftar Pengajuan Refund</h1>
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
                        <button
                            className={`btn-action-outline ${(filters.startDate || filters.status !== null) ? 'active' : ''}`}
                            onClick={() => setShowFilterModal(true)}
                        >
                            <Filter size={16} />
                            {(filters.startDate || filters.status !== null) ? 'Filter Aktif' : 'Filter'}
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
                            {isLoading ? (
                                <tr>
                                    <td colSpan={7} style={{ textAlign: 'center', padding: '3rem' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                                            <Loader2 className="animate-spin" size={32} />
                                            <span>Memuat data pengajuan...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : refunds.length === 0 ? (
                                <tr>
                                    <td colSpan={7} style={{ textAlign: 'center', padding: '3rem' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', opacity: 0.5 }}>
                                            <AlertCircle size={40} />
                                            <span>Tidak ada pengajuan refund ditemukan.</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                refunds.map((refund) => (
                                    <tr key={refund.transaction.transactionCode}>
                                        <td>
                                            <span className="refund-id">#{refund.transaction.transactionCode}</span>
                                        </td>
                                        <td>
                                            <div className="refunds-table-customer">
                                                <div className="customer-avatar-circle" style={{ backgroundColor: 'var(--color-primary)', color: 'black' }}>
                                                    {refund.transaction.user.fullName.substring(0, 2).toUpperCase()}
                                                </div>
                                                <div className="customer-info">
                                                    <span className="customer-name">{refund.transaction.user.fullName}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td>{refund.createdAt}</td>
                                        <td style={{ color: 'var(--color-text-mutex)' }}>{parseReason(refund.refundReason)}</td>
                                        <td style={{ fontWeight: 600 }}>{formatIDR(refund.transaction.totalPrice)}</td>
                                        <td>
                                            {refund.refundStatus === 0 && (
                                                <span className="status-badge status-waiting">
                                                    <span className="status-dot dot-waiting"></span>
                                                    Menunggu
                                                </span>
                                            )}
                                            {refund.refundStatus === 1 && (
                                                <span className="status-badge status-approved">
                                                    <span className="status-dot dot-approved"></span>
                                                    Disetujui
                                                </span>
                                            )}
                                            {refund.refundStatus === 2 && (
                                                <span className="status-badge status-rejected">
                                                    <span className="status-dot dot-rejected"></span>
                                                    Ditolak
                                                </span>
                                            )}
                                        </td>
                                        <td>
                                            {refund.refundStatus === 0 ? (
                                                <div className="action-dropdown-container">
                                                    <button
                                                        className="btn-action-trigger"
                                                        onClick={(e) => toggleDropdown(refund.transaction.transactionCode, e)}
                                                    >
                                                        Proses
                                                        <ChevronRight size={14} style={{ rotate: '90deg' }} />
                                                    </button>

                                                    {activeDropdown === refund.transaction.transactionCode && (
                                                        <div className="action-dropdown-menu">
                                                            <button
                                                                className="dropdown-item success"
                                                                onClick={() => openModal(refund.id.toString(), refund.transaction.transactionCode, 'approve')}
                                                            >
                                                                <Check size={14} />
                                                                Setujui
                                                            </button>
                                                            <button
                                                                className="dropdown-item danger"
                                                                onClick={() => openModal(refund.id.toString(), refund.transaction.transactionCode, 'reject')}
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
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {!isLoading && refunds.length > 0 && (
                    <div className="pagination-bar" style={{ borderTop: '1px solid var(--color-border)' }}>
                        <div className="pagination-info">
                            Menampilkan <strong>{Math.min((page * size) + 1, totalElements)}</strong> - <strong>{Math.min((page + 1) * size, totalElements)}</strong> dari <strong>{totalElements}</strong> pengajuan
                        </div>
                        <div className="pagination-controls">
                            <button
                                className="pagination-btn"
                                onClick={() => setPage(Math.max(0, page - 1))}
                                disabled={page === 0}
                            >
                                <ChevronLeft size={16} />
                            </button>
                            <button className="pagination-btn active-page">{page + 1}</button>
                            <button
                                className="pagination-btn"
                                onClick={() => setPage(page + 1)}
                                disabled={(page + 1) * size >= totalElements}
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                )}
            </div>

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
            {/* Date & Status Filter Modal */}
            {showFilterModal && (
                <div className="input-modal-overlay">
                    <div className="input-modal-container" style={{ maxWidth: '400px' }}>
                        <div className="input-modal-header">
                            <h2 className="input-modal-title">Filter Data</h2>
                            <button className="btn-close-modal" onClick={() => setShowFilterModal(false)}><X size={20} /></button>
                        </div>
                        <div className="input-modal-body">
                            <div className="form-group" style={{ marginBottom: '1rem' }}>
                                <label className="input-modal-label">Tanggal Mulai</label>
                                <input
                                    type="date"
                                    defaultValue={filters.startDate}
                                    id="filter-start-date"
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-dark)', color: 'white' }}
                                />
                            </div>
                            <div className="form-group" style={{ marginBottom: '1rem' }}>
                                <label className="input-modal-label">Tanggal Akhir</label>
                                <input
                                    type="date"
                                    defaultValue={filters.endDate}
                                    id="filter-end-date"
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-dark)', color: 'white' }}
                                />
                            </div>
                            <div className="form-group">
                                <label className="input-modal-label">Status</label>
                                <select
                                    id="filter-status"
                                    defaultValue={filters.status === null ? '' : filters.status.toString()}
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-dark)', color: 'white' }}
                                >
                                    <option value="">Semua Status</option>
                                    <option value="0">Dalam Pengajuan</option>
                                    <option value="1">Disetujui</option>
                                    <option value="2">Ditolak</option>
                                </select>
                            </div>
                        </div>
                        <div className="input-modal-footer" style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
                            <button
                                className="btn-modal-cancel"
                                style={{ flex: 1 }}
                                onClick={() => handleApplyFilter(formatDate(startDate), formatDate(endDate), null)}
                            >
                                Reset ke Default
                            </button>
                            <button
                                className="btn-modal-confirm"
                                style={{ flex: 1 }}
                                onClick={() => {
                                    const start = (document.getElementById('filter-start-date') as HTMLInputElement).value;
                                    const end = (document.getElementById('filter-end-date') as HTMLInputElement).value;
                                    const statusVal = (document.getElementById('filter-status') as HTMLSelectElement).value;
                                    handleApplyFilter(start, end, statusVal === '' ? null : parseInt(statusVal));
                                }}
                            >
                                Terapkan
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Refunds;
