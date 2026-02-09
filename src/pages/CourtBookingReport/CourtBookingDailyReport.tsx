
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
    Search,
    Filter,
    Download,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';
import '../Refunds/Refunds.css'; // Reuse CSS from Refunds page

// Mock Data
const MOCK_BOOKINGS = [
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
        status: 'Completed'
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
        status: 'Completed'
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

    const decodedMonth = month ? decodeURIComponent(month) : '';

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
                                <th style={{ width: '15%' }}>ID BOOKING</th>
                                <th style={{ width: '20%' }}>PELANGGAN</th>
                                <th style={{ width: '15%' }}>TANGGAL</th>
                                <th style={{ width: '15%' }}>JAM</th>
                                <th style={{ width: '15%' }}>LAPANGAN</th>
                                <th style={{ width: '10%' }}>DURASI</th>
                                <th style={{ width: '10%' }}>TOTAL</th>
                            </tr>
                        </thead>
                        <tbody>
                            {MOCK_BOOKINGS.map((trx) => (
                                <tr key={trx.id}>
                                    <td>
                                        <span className="refund-id">#{trx.id}</span>
                                    </td>
                                    <td>
                                        <div className="refunds-table-customer">
                                            <div className="customer-avatar-circle">
                                                {trx.customer.avatar}
                                            </div>
                                            <div className="customer-info">
                                                <span className="customer-name">{trx.customer.name}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td>{trx.date}</td>
                                    <td>{trx.time}</td>
                                    <td>{trx.court}</td>
                                    <td>{trx.duration}</td>
                                    <td style={{ fontWeight: 600 }}>{trx.amount}</td>
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
