
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
const MOCK_TRANSACTIONS = [
    {
        id: 'ORD-1023',
        customer: {
            name: 'Budi Santoso',
            avatar: 'BS',
        },
        date: '02 Des 2023 14:30',
        items: 'Lapangan A (2 Jam), Sewa Raket (2)',
        amount: 'Rp 250.000',
        paymentMethod: 'Transfer BCA'
    },
    {
        id: 'ORD-1024',
        customer: {
            name: 'Ani Lestari',
            avatar: 'AL',
        },
        date: '02 Des 2023 16:00',
        items: 'Lapangan B (1 Jam)',
        amount: 'Rp 100.000',
        paymentMethod: 'QRIS'
    },
    {
        id: 'ORD-1025',
        customer: {
            name: 'Rizky Kurniawan',
            avatar: 'RK',
        },
        date: '03 Des 2023 09:00',
        items: 'Lapangan A (2 Jam), Shuttlecock (1 Slop)',
        amount: 'Rp 320.000',
        paymentMethod: 'Tunai'
    },
    {
        id: 'ORD-1026',
        customer: {
            name: 'Dewi Nurhaliza',
            avatar: 'DN',
        },
        date: '03 Des 2023 19:00',
        items: 'Lapangan C (3 Jam)',
        amount: 'Rp 300.000',
        paymentMethod: 'Transfer Mandiri'
    }
];

const SalesDailyReport = () => {
    const { month } = useParams<{ month: string }>();
    const [search, setSearch] = useState('');

    const decodedMonth = month ? decodeURIComponent(month) : '';

    return (
        <div className="refunds-page"> {/* Reuse container class */}
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
                                <th style={{ width: '15%' }}>ID ORDER</th>
                                <th style={{ width: '20%' }}>PELANGGAN</th>
                                <th style={{ width: '15%' }}>TANGGAL</th>
                                <th style={{ width: '25%' }}>ITEM</th>
                                <th style={{ width: '15%' }}>METODE PEMBAYARAN</th>
                                <th style={{ width: '10%' }}>TOTAL</th>
                            </tr>
                        </thead>
                        <tbody>
                            {MOCK_TRANSACTIONS.map((trx) => (
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
                                    <td>{trx.items}</td>
                                    <td style={{ color: 'var(--color-text-mutex)' }}>{trx.paymentMethod}</td>
                                    <td style={{ fontWeight: 600 }}>{trx.amount}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="pagination-bar" style={{ borderTop: '1px solid var(--color-border)' }}>
                    <div className="pagination-info">
                        Menampilkan 1-4 dari 4 transaksi
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

export default SalesDailyReport;
