
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
    Search,
    Filter,
    Download,
    ChevronLeft,
    ChevronRight,
    UserCheck,
    CheckCircle2
} from 'lucide-react';
import { useAlertStore } from '../../app/alert.store';
import '../Refunds/Refunds.css'; // Reuse CSS from Refunds page

// Initial Mock Data
const INITIAL_MOCK_BOOKINGS = [
    {
        id: 'BKG-2024',
        customer: {
            name: 'Persatuan Bulutangkis Jaya',
            avatar: 'PB',
        },
        date: '02 Des 2023',
        time: '14:00 - 16:00',
        court: 'Lapangan A (Vinyl)',
        duration: '2 Jam',
        amount: 'Rp 150.000',
        status: 'Selesai'
    },
    {
        id: 'BKG-2025',
        customer: {
            name: 'Budi Santoso',
            avatar: 'BS',
        },
        date: '02 Des 2023',
        time: '16:00 - 17:00',
        court: 'Lapangan B (Karpet)',
        duration: '1 Jam',
        amount: 'Rp 80.000',
        status: 'Selesai'
    },
    {
        id: 'BKG-2026',
        customer: {
            name: 'Susi Susanti',
            avatar: 'SS',
        },
        date: '03 Des 2023',
        time: '09:00 - 11:00',
        court: 'Lapangan A (Vinyl)',
        duration: '2 Jam',
        amount: 'Rp 150.000',
        status: 'Booked'
    },
    {
        id: 'BKG-2027',
        customer: {
            name: 'Rahmat Hidayat',
            avatar: 'RH',
        },
        date: '03 Des 2023',
        time: '20:00 - 22:00',
        court: 'Lapangan C (Semen)',
        duration: '2 Jam',
        amount: 'Rp 90.000',
        status: 'Booked'
    }
];

const CourtBookingDailyReport = () => {
    const { month } = useParams<{ month: string }>();
    const [search, setSearch] = useState('');
    const [bookings, setBookings] = useState(INITIAL_MOCK_BOOKINGS);
    const { showAlert } = useAlertStore();

    const decodedMonth = month ? decodeURIComponent(month) : '';

    const handleCheckIn = (id: string) => {
        setBookings(prev => prev.map(item =>
            item.id === id ? { ...item, status: 'Completed' } : item
        ));
        showAlert('success', 'Check-in Berhasil', `Booking #${id} telah dikonfirmasi kehadirannya.`);
    };

    return (
        <div className="refunds-page">
            {/* Breadcrumbs */}
            <nav className="breadcrumbs">
                <Link to="/reports/bookings">Laporan Booking</Link>
                <span className="separator">/</span>
                <span className="current">{decodedMonth}</span>
            </nav>

            <div className="table-card" style={{ marginTop: 0 }}>
                <div className="page-header" style={{ padding: '1.5rem', marginBottom: 0, borderBottom: '1px solid var(--color-border)' }}>
                    <div className="header-text">
                        <h1 style={{ fontSize: '1.1rem' }}>Data Pemesanan - {decodedMonth}</h1>
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
                                <th style={{ width: '12%' }}>ID</th>
                                <th style={{ width: '18%' }}>PELANGGAN</th>
                                <th style={{ width: '15%' }}>JAM & TANGGAL</th>
                                <th style={{ width: '18%' }}>LAPANGAN</th>
                                <th style={{ width: '10%' }}>TOTAL</th>
                                <th style={{ width: '12%' }}>STATUS</th>
                                <th style={{ width: '15%', textAlign: 'center' }}>AKSI</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.map((trx) => (
                                <tr key={trx.id}>
                                    <td>
                                        <Link to={`/reports/bookings/detail/${trx.id}`} className="refund-id" style={{ cursor: 'pointer', color: 'var(--color-primary)' }}>
                                            #{trx.id}
                                        </Link>
                                    </td>
                                    <td>
                                        <div className="refunds-table-customer">
                                            <div className="customer-avatar-circle" style={{ width: '28px', height: '28px', fontSize: '0.75rem' }}>
                                                {trx.customer.avatar}
                                            </div>
                                            <div className="customer-info">
                                                <span className="customer-name" style={{ fontSize: '0.85rem' }}>{trx.customer.name}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ fontSize: '0.85rem' }}>
                                        <div>{trx.date}</div>
                                        <div style={{ opacity: 0.6 }}>{trx.time}</div>
                                    </td>
                                    <td style={{ fontSize: '0.85rem' }}>{trx.court}</td>
                                    <td style={{ fontWeight: 600 }}>{trx.amount}</td>
                                    <td>
                                        <div className={`status-badge-detail ${trx.status === 'Selesai' || trx.status === 'Completed' ? 'success' : 'pending'}`} style={{ padding: '0.2rem 0.5rem' }}>
                                            <span className="status-dot-large" style={{ width: '6px', height: '6px' }}></span>
                                            <span style={{ fontSize: '0.75rem' }}>{trx.status.toUpperCase()}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                                            {trx.status === 'Booked' ? (
                                                <button
                                                    className="btn-primary"
                                                    style={{ padding: '0.3rem 0.8rem', fontSize: '0.75rem', gap: '0.3rem', backgroundColor: '#3b82f6' }}
                                                    onClick={() => handleCheckIn(trx.id)}
                                                >
                                                    <UserCheck size={12} />
                                                    Check-in
                                                </button>
                                            ) : (
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#10b981', fontSize: '0.75rem', fontWeight: 600 }}>
                                                    <CheckCircle2 size={14} />
                                                    Selesai
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="pagination-bar" style={{ borderTop: '1px solid var(--color-border)' }}>
                    <div className="pagination-info">
                        Menampilkan 1-4 dari 4 booking
                    </div>
                    <div className="pagination-controls">
                        <button className="pagination-btn"><ChevronLeft size={16} /></button>
                        <button className="pagination-btn active-page">1</button>
                        <button className="pagination-btn"><ChevronRight size={16} /></button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourtBookingDailyReport;
