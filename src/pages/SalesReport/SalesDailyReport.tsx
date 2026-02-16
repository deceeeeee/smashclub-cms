import { useState, useEffect, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
    Search,
    Filter,
    Download,
    ChevronLeft,
    ChevronRight,
    Loader2,
    AlertCircle
} from 'lucide-react';
import { useSalesStore } from '../../features/sales/sales.store';
import '../Refunds/Refunds.css'; // Reuse CSS from Refunds page

const SalesDailyReport = () => {
    const { month: monthParam } = useParams<{ month: string }>();
    const [search, setSearch] = useState('');
    const { monthlyList, isLoading, error, getMonthlyList } = useSalesStore();

    // Pagination state
    const [page, setPage] = useState(0);
    const [size] = useState(25);

    const [debouncedSearch, setDebouncedSearch] = useState(search);

    const decodedMonth = monthParam ? decodeURIComponent(monthParam) : '';

    const getStatusInfo = (status: number) => {
        switch (status) {
            case 1:
                return 'success';
            case 2:
                return 'success';
            case 3:
            case 4:
                return 'failed';
            default:
                return 'pending';
        }
    };

    // Extract year and month number from "Month Year" string (e.g., "February 2026")
    const { year, monthNum } = useMemo(() => {
        if (!decodedMonth) return { year: new Date().getFullYear(), monthNum: new Date().getMonth() + 1 };

        const months = [
            'january', 'february', 'march', 'april', 'may', 'june',
            'july', 'august', 'september', 'october', 'november', 'december'
        ];

        const parts = decodedMonth.split(' ');
        if (parts.length < 2) return { year: new Date().getFullYear(), monthNum: new Date().getMonth() + 1 };

        const mStr = parts[0];
        const yStr = parts[1];

        const monthNum = months.indexOf(mStr.toLowerCase()) + 1;
        const year = parseInt(yStr) || new Date().getFullYear();

        return { year, monthNum };
    }, [decodedMonth]);

    // Debounce search input
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
            setPage(0); // Reset to first page on new search
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    useEffect(() => {
        if (year && monthNum) {
            getMonthlyList(year, monthNum, debouncedSearch, page, size);
        }
    }, [getMonthlyList, year, monthNum, debouncedSearch, page, size]);

    const formatIDR = (val: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(val).replace('IDR', 'Rp');
    };

    const transactions = monthlyList?.transactions.content || [];

    if (isLoading && !monthlyList) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', height: '60vh' }}>
                <Loader2 className="animate-spin mb-4 mx-auto text-primary" size={48} />
                <p className="text-mutex">Memuat data transaksi...</p>
            </div>
        );
    }

    const totalElements = monthlyList?.transactions.totalElements || 0;

    return (
        <div className="refunds-page">
            {/* Breadcrumbs */}
            <nav className="breadcrumbs">
                <Link to="/reports/sales">Laporan Penjualan</Link>
                <span className="separator">/</span>
                <span className="current">{decodedMonth}</span>
            </nav>

            <div className="table-card" style={{ marginTop: 0 }}>
                <div className="page-header" style={{ padding: '1.5rem', marginBottom: 0, borderBottom: '1px solid var(--color-border)' }}>
                    <div className="header-text">
                        <h1 style={{ fontSize: '1.1rem' }}>Data Transaksi - {decodedMonth}</h1>
                        {error && (
                            <div className="flex items-center gap-2 mt-1 text-error">
                                <AlertCircle size={14} />
                                <span style={{ fontSize: '0.85rem' }}>{error}</span>
                            </div>
                        )}
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <div className="search-bar" style={{ width: '250px' }}>
                            <Search size={16} className="search-icon" />
                            <input
                                type="text"
                                placeholder="Cari transaksi..."
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    setPage(0);
                                }}
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
                                <th style={{ width: '15%' }}>PELANGGAN</th>
                                <th style={{ width: '15%' }}>TANGGAL</th>
                                <th style={{ width: '20%' }}>KETERANGAN</th>
                                <th style={{ width: '20%' }}>STATUS</th>
                                <th style={{ width: '15%', textAlign: 'right' }}>TOTAL</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map((trx: any) => (
                                <tr key={trx.transactionCode}>
                                    <td>
                                        <Link
                                            to={`/reports/sales/detail/${trx.transactionCode}`}
                                            className="refund-id"
                                            style={{ cursor: 'pointer', fontWeight: 600, color: 'var(--color-primary)' }}
                                        >
                                            #{trx.transactionCode}
                                        </Link>
                                    </td>
                                    <td>
                                        <div className="refunds-table-customer">
                                            <div className="customer-avatar-circle" style={{ backgroundColor: 'var(--color-primary)', color: 'black' }}>
                                                {trx.user.fullName.substring(0, 2).toUpperCase()}
                                            </div>
                                            <div className="customer-info">
                                                <span className="customer-name">{trx.user.fullName}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td>{trx.createdAt}</td>
                                    <td style={{ color: 'var(--color-text-mutex)' }}>{trx.transactionLabel}</td>
                                    <td>
                                        <div className={`status-badge-detail ${getStatusInfo(trx.status)}`}>
                                            <span className="status-dot-large"></span>
                                            {trx.statusDesc}
                                        </div>
                                    </td>
                                    <td style={{ fontWeight: 600, textAlign: 'right' }} className="text-teal">
                                        {formatIDR(trx.totalPrice)}
                                    </td>
                                </tr>
                            ))}
                            {transactions.length === 0 && !isLoading && (
                                <tr>
                                    <td colSpan={5} className="text-center py-10 text-mutex">
                                        Tidak ada transaksi ditemukan.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {!isLoading && totalElements > 0 && (
                    <div className="pagination-bar" style={{ borderTop: '1px solid var(--color-border)' }}>
                        <div className="pagination-info">
                            Menampilkan <strong>{Math.min((page * size) + 1, totalElements)}</strong> - <strong>{Math.min((page + 1) * size, totalElements)}</strong> dari <strong>{totalElements}</strong> transaksi
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
        </div>
    );
};

export default SalesDailyReport;
