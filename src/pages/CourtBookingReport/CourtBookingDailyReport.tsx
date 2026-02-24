
import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
    Search,
    Filter,
    Download,
    ChevronLeft,
    ChevronRight,
    Loader2,
    AlertCircle,
    Clock,
    Calendar
} from 'lucide-react';
import { useBookingsStore } from '../../features/bookings/bookings.store';
import '../Refunds/Refunds.css'; // Reuse CSS from Refunds page

const CourtBookingDailyReport = () => {
    const { month: monthStr } = useParams<{ month: string }>();
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [page, setPage] = useState(0);
    const { bookingListData, isLoadingList, getBookingList } = useBookingsStore();

    const decodedMonthStr = monthStr ? decodeURIComponent(monthStr) : '';

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
        if (decodedMonthStr) {
            const parts = decodedMonthStr.split(' ');
            if (parts.length === 2) {
                const monthName = parts[0];
                const year = parseInt(parts[1]);
                const monthNames = [
                    'January', 'February', 'March', 'April', 'May', 'June',
                    'July', 'August', 'September', 'October', 'November', 'December'
                ];
                // Handle Indonesian names if they might be used
                const idMonthNames = [
                    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
                    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
                ];

                let monthIndex = monthNames.findIndex(m => m.toLowerCase() === monthName.toLowerCase());
                if (monthIndex === -1) {
                    monthIndex = idMonthNames.findIndex(m => m.toLowerCase() === monthName.toLowerCase());
                }

                if (monthIndex !== -1 && !isNaN(year)) {
                    getBookingList(year, monthIndex + 1, debouncedSearch, page);
                }
            }
        }
    }, [decodedMonthStr, page, debouncedSearch, getBookingList]);

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
        if (desc === 'CONFIRMED' || desc === 'COMPLETED') return 'success';
        if (desc === 'CANCELLED' || desc === 'FAILED') return 'failed';
        return 'pending';
    };

    const bookings = bookingListData?.bookings.content || [];
    const totalElements = bookingListData?.bookings.totalElements || 0;
    const totalPages = bookingListData?.bookings.totalPages || 0;

    if (isLoadingList && !bookingListData) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', height: '60vh', justifyContent: 'center' }}>
                <Loader2 className="animate-spin text-primary" size={48} />
                <p className="text-mutex">Memuat data pemesanan...</p>
            </div>
        );
    }

    return (
        <div className="refunds-page">
            {/* Breadcrumbs */}
            <nav className="breadcrumbs">
                <Link to="/reports/bookings">Laporan Booking</Link>
                <span className="separator">/</span>
                <span className="current">{decodedMonthStr}</span>
            </nav>

            <div className="table-card" style={{ marginTop: 0 }}>
                <div className="page-header" style={{ padding: '1.5rem', marginBottom: 0, borderBottom: '1px solid var(--color-border)' }}>
                    <div className="header-text">
                        <h1 style={{ fontSize: '1.1rem' }}>Data Pemesanan - {decodedMonthStr}</h1>
                        {bookingListData && (
                            <p style={{ fontSize: '0.8rem', color: 'var(--color-text-mutex)', marginTop: '4px' }}>
                                Rata-rata: {bookingListData.averageBookingHours.toFixed(1)} Jam | Okupansi: {bookingListData.occupancyRate.toFixed(1)}%
                            </p>
                        )}
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <div className="search-bar" style={{ width: '250px' }}>
                            <Search size={16} className="search-icon" />
                            <input
                                type="text"
                                placeholder="Cari booking..."
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
                                <th style={{ width: '15%' }}>KODE BOOKING</th>
                                <th style={{ width: '12%' }}>TANGGAL</th>
                                <th style={{ width: '18%' }}>WAKTU & DURASI</th>
                                <th style={{ width: '15%', textAlign: 'right' }}>TOTAL HARGA</th>
                                <th style={{ width: '12%' }}>STATUS</th>
                                <th style={{ width: '15%' }}>DIBUAT PADA</th>
                                <th style={{ width: '13%', textAlign: 'center' }}>AKSI</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.length > 0 ? (
                                bookings.map((trx) => (
                                    <tr key={trx.bookingCode}>
                                        <td>
                                            <Link to={`/reports/bookings/detail/${trx.bookingCode}`} className="refund-id" style={{ cursor: 'pointer', color: 'var(--color-primary)', fontWeight: 600 }}>
                                                #{trx.bookingCode}
                                            </Link>
                                        </td>
                                        <td style={{ fontSize: '0.85rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                                <Calendar size={14} className="text-mutex" />
                                                <span>{trx.bookingDate}</span>
                                            </div>
                                        </td>
                                        <td style={{ fontSize: '0.85rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                                <Clock size={14} className="text-mutex" />
                                                <span>{trx.startTime} - {trx.endTime} ({trx.durationHour} Jam)</span>
                                            </div>
                                        </td>
                                        <td style={{ fontWeight: 600, textAlign: 'right', color: 'var(--color-primary)' }}>{formatIDR(trx.totalPrice)}</td>
                                        <td>
                                            <div className={`status-badge-detail ${getStatusClass(trx.statusDesc)}`} style={{ padding: '0.2rem 0.5rem' }}>
                                                <span className="status-dot-large" style={{ width: '6px', height: '6px' }}></span>
                                                <span style={{ fontSize: '0.75rem' }}>{trx.statusDesc}</span>
                                            </div>
                                        </td>
                                        <td style={{ fontSize: '0.85rem', color: 'var(--color-text-mutex)' }}>
                                            {trx.createdAt}
                                        </td>
                                        <td style={{ textAlign: 'center' }}>
                                            <Link
                                                to={`/reports/bookings/detail/${trx.bookingCode}`}
                                                className="btn-action-outline"
                                                style={{ padding: '0.3rem 0.8rem', fontSize: '0.75rem', textDecoration: 'none', display: 'inline-block' }}
                                            >
                                                Lihat Detil
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7} className="text-center py-8 text-mutex">
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', opacity: 0.5 }}>
                                            <AlertCircle size={40} />
                                            <span>Tidak ada data pemesanan ditemukan untuk bulan ini.</span>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="pagination-bar" style={{ borderTop: '1px solid var(--color-border)' }}>
                        <div className="pagination-info">
                            Menampilkan {bookings.length} dari {totalElements} booking
                        </div>
                        <div className="pagination-controls">
                            <button
                                className="pagination-btn"
                                disabled={page === 0}
                                onClick={() => setPage(page - 1)}
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
                                disabled={page === totalPages - 1}
                                onClick={() => setPage(page + 1)}
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

export default CourtBookingDailyReport;
