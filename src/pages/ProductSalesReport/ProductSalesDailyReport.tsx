
import { useState, useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
    Search,
    Filter,
    Download,
    ChevronLeft,
    ChevronRight,
    Loader2,
    Calendar,
    ShoppingBag,
    ChevronDown
} from 'lucide-react';
import { useOrdersStore } from '../../features/orders/orders.store';
import { useAlertStore } from '../../app/alert.store';
import { ORDER_STATUS_OPTIONS } from '../../constant/orderStatus';
import '../Refunds/Refunds.css'; // Reuse CSS from Refunds page

const ProductSalesDailyReport = () => {
    const { month: monthStr } = useParams<{ month: string }>();
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [page, setPage] = useState(0);
    const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const { orderListData, isLoadingList, getOrderList, updateOrderStatus } = useOrdersStore();
    const { showAlert, showError } = useAlertStore();

    const decodedMonthStr = monthStr ? decodeURIComponent(monthStr) : '';

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setOpenDropdownId(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const fetchList = () => {
        if (decodedMonthStr) {
            const parts = decodedMonthStr.split(' ');
            if (parts.length === 2) {
                const monthName = parts[0];
                const year = parseInt(parts[1]);
                const monthNames = [
                    'January', 'February', 'March', 'April', 'May', 'June',
                    'July', 'August', 'September', 'October', 'November', 'December'
                ];
                const idMonthNames = [
                    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
                    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
                ];

                let monthIndex = monthNames.findIndex(m => m.toLowerCase() === monthName.toLowerCase());
                if (monthIndex === -1) {
                    monthIndex = idMonthNames.findIndex(m => m.toLowerCase() === monthName.toLowerCase());
                }

                if (monthIndex !== -1 && !isNaN(year)) {
                    getOrderList(year, monthIndex + 1, debouncedSearch, page);
                }
            }
        }
    };

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
            setPage(0); // Reset to first page on search
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    // Parse "Month Year" to month (1-12) and year
    useEffect(() => {
        fetchList();
    }, [decodedMonthStr, page, debouncedSearch, getOrderList]);

    const handleStatusUpdate = async (orderCode: string, status: number) => {
        setIsProcessing(true);
        const result = await updateOrderStatus(orderCode, status);
        if (result.success) {
            showAlert('success', 'Berhasil', result.message);
            fetchList();
        } else {
            showError('Gagal Memproses', result.message);
        }
        setOpenDropdownId(null);
        setIsProcessing(false);
    };

    const formatIDR = (val: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(val).replace('IDR', 'Rp');
    };

    const getStatusClass = (statusDesc: string) => {
        const desc = statusDesc.toUpperCase();
        if (desc === 'COMPLETED' || desc === 'SELESAI' || desc === 'SUCCESS') return 'success';
        if (desc === 'CANCELLED' || desc === 'FAILED' || desc === 'DIBATALKAN') return 'failed';
        return 'pending';
    };

    const orders = orderListData?.content || [];
    const totalElements = orderListData?.totalElements || 0;
    const totalPages = orderListData?.totalPages || 0;

    if (isLoadingList && !orderListData) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', height: '60vh', justifyContent: 'center' }}>
                <Loader2 className="animate-spin text-primary" size={48} />
                <p className="text-mutex">Memuat data penjualan...</p>
            </div>
        );
    }

    return (
        <div className="refunds-page">
            {/* Breadcrumbs */}
            <nav className="breadcrumbs">
                <Link to="/reports/products">Laporan Produk</Link>
                <span className="separator">/</span>
                <span className="current">{decodedMonthStr}</span>
            </nav>

            <div className="table-card" style={{ marginTop: 0 }}>
                <div className="page-header" style={{ padding: '1.5rem', marginBottom: 0, borderBottom: '1px solid var(--color-border)' }}>
                    <div className="header-text">
                        <h1 style={{ fontSize: '1.1rem' }}>Penjualan Produk - {decodedMonthStr}</h1>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <div className="search-bar" style={{ width: '250px' }}>
                            <Search size={16} className="search-icon" />
                            <input
                                type="text"
                                placeholder="Cari penjualan..."
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
                                <th style={{ width: '15%' }}>KODE ORDER</th>
                                <th style={{ width: '18%' }}>PELANGGAN</th>
                                <th style={{ width: '18%' }}>TANGGAL</th>
                                <th style={{ width: '15%', textAlign: 'right' }}>TOTAL HARGA</th>
                                <th style={{ width: '15%' }}>STATUS</th>
                                <th style={{ width: '19%', textAlign: 'center' }}>AKSI</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.length > 0 ? (
                                orders.map((trx) => (
                                    <tr key={trx.id}>
                                        <td>
                                            <span className="refund-id">#{trx.orderCode}</span>
                                        </td>
                                        <td>
                                            <div className="refunds-table-customer">
                                                <div className="customer-avatar-circle" style={{ width: '28px', height: '28px', fontSize: '0.75rem' }}>
                                                    {trx.user.fullName.substring(0, 2).toUpperCase()}
                                                </div>
                                                <div className="customer-info">
                                                    <span className="customer-name" style={{ fontSize: '0.85rem' }}>{trx.user.fullName}</span>
                                                    <span className="text-mutex" style={{ fontSize: '0.7rem' }}>{trx.user.email}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}>
                                                <Calendar size={14} className="text-mutex" />
                                                <span>{trx.createdAt}</span>
                                            </div>
                                        </td>
                                        <td style={{ fontWeight: 600, textAlign: 'right', color: 'var(--color-primary)' }}>
                                            {formatIDR(trx.totalPrice)}
                                        </td>
                                        <td>
                                            <div className={`status-badge-detail ${getStatusClass(trx.statusDesc)}`} style={{ padding: '0.2rem 0.5rem' }}>
                                                <span className="status-dot-large" style={{ width: '6px', height: '6px' }}></span>
                                                <span style={{ fontSize: '0.75rem' }}>{trx.statusDesc}</span>
                                            </div>
                                        </td>
                                        <td style={{ textAlign: 'center' }}>
                                            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', alignItems: 'center' }}>
                                                <Link
                                                    to={`/reports/products/detail/${trx.orderCode}`}
                                                    className="btn-action-outline"
                                                    style={{ padding: '0.3rem 0.8rem', fontSize: '0.75rem', textDecoration: 'none' }}
                                                >
                                                    Detail
                                                </Link>

                                                <div className="process-dropdown-wrapper" style={{ position: 'relative' }}>
                                                    <button
                                                        className="btn-primary"
                                                        style={{
                                                            padding: '0.3rem 0.6rem',
                                                            fontSize: '0.75rem',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '0.3rem',
                                                            minWidth: '85px',
                                                            justifyContent: 'center'
                                                        }}
                                                        onClick={() => setOpenDropdownId(openDropdownId === trx.orderCode ? null : trx.orderCode)}
                                                    >
                                                        {isProcessing && openDropdownId === trx.orderCode ? <Loader2 size={12} className="animate-spin" /> : <span>Proses</span>}
                                                        <ChevronDown size={12} />
                                                    </button>

                                                    {openDropdownId === trx.orderCode && (
                                                        <div
                                                            ref={dropdownRef}
                                                            className="process-dropdown-menu"
                                                            style={{
                                                                position: 'absolute',
                                                                bottom: '-50%',
                                                                right: '100%',
                                                                zIndex: 100,
                                                                backgroundColor: '#1E1E1E',
                                                                border: '1px solid var(--color-border)',
                                                                borderRadius: '4px',
                                                                marginTop: '4px',
                                                                boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
                                                                minWidth: '150px',
                                                                overflow: 'hidden'
                                                            }}
                                                        >
                                                            {ORDER_STATUS_OPTIONS.map((opt) => (
                                                                <button
                                                                    key={opt.value}
                                                                    className="dropdown-item"
                                                                    style={{
                                                                        width: '100%',
                                                                        padding: '0.6rem 1rem',
                                                                        textAlign: 'left',
                                                                        background: 'none',
                                                                        border: 'none',
                                                                        color: 'white',
                                                                        fontSize: '0.8rem',
                                                                        cursor: 'pointer',
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        gap: '0.5rem'
                                                                    }}
                                                                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)')}
                                                                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                                                                    onClick={() => handleStatusUpdate(trx.orderCode, opt.value)}
                                                                >
                                                                    <div className={`status-dot-small ${getStatusClass(opt.label)}`} style={{ width: '8px', height: '8px', borderRadius: '50%' }}></div>
                                                                    {opt.label}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-mutex)' }}>
                                        <ShoppingBag size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                                        <p>Tidak ada data penjualan untuk periode ini.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 0 && (
                    <div className="pagination-bar" style={{ borderTop: '1px solid var(--color-border)' }}>
                        <div className="pagination-info">
                            Menampilkan {page * 25 + 1}-{Math.min((page + 1) * 25, totalElements)} dari {totalElements} transaksi
                        </div>
                        <div className="pagination-controls">
                            <button
                                className="pagination-btn"
                                onClick={() => setPage(Math.max(0, page - 1))}
                                disabled={page === 0}
                            >
                                <ChevronLeft size={16} />
                            </button>
                            {[...Array(totalPages)].map((_, i) => (
                                <button
                                    key={i}
                                    className={`pagination-btn ${page === i ? 'active-page' : ''}`}
                                    onClick={() => setPage(i)}
                                >
                                    {i + 1}
                                </button>
                            ))}
                            <button
                                className="pagination-btn"
                                onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                                disabled={page === totalPages - 1}
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductSalesDailyReport;
