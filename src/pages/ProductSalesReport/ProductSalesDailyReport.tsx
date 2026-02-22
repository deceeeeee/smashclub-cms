
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
    Search,
    Filter,
    Download,
    ChevronLeft,
    ChevronRight,
    CheckCircle2,
    Play
} from 'lucide-react';
import { useAlertStore } from '../../app/alert.store';
import '../Refunds/Refunds.css'; // Reuse CSS from Refunds page

// Initial Mock Data
const INITIAL_MOCK_SALES = [
    {
        id: 'PRD-1023',
        customer: {
            name: 'Budi Santoso',
            avatar: 'BS',
        },
        date: '02 Des 2023',
        items: '1x Shuttlecock (Slop), 2x Pocari Sweat',
        category: 'Perlengkapan',
        amount: 'Rp 145.000',
        payment: 'QRIS',
        status: 'Selesai'
    },
    {
        id: 'PRD-1024',
        customer: {
            name: 'Ani Lestari',
            avatar: 'AL',
        },
        date: '02 Des 2023',
        items: '2x Sewa Raket',
        category: 'Sewa',
        amount: 'Rp 50.000',
        payment: 'Tunai',
        status: 'Selesai'
    },
    {
        id: 'PRD-1025',
        customer: {
            name: 'Denny Sumargo',
            avatar: 'DS',
        },
        date: '03 Des 2023',
        items: '1x Jersey SmashClub (L)',
        category: 'Merchandise',
        amount: 'Rp 120.000',
        payment: 'Transfer',
        status: 'Menunggu'
    },
    {
        id: 'PRD-1026',
        customer: {
            name: 'Susi Susanti',
            avatar: 'SS',
        },
        date: '03 Des 2023',
        items: '3x Air Mineral 600ml',
        category: 'Minuman',
        amount: 'Rp 15.000',
        payment: 'Tunai',
        status: 'Menunggu'
    }
];

const ProductSalesDailyReport = () => {
    const { month } = useParams<{ month: string }>();
    const [search, setSearch] = useState('');
    const [sales, setSales] = useState(INITIAL_MOCK_SALES);
    const { showAlert } = useAlertStore();

    const decodedMonth = month ? decodeURIComponent(month) : '';

    const handleProcess = (id: string) => {
        setSales(prev => prev.map(item =>
            item.id === id ? { ...item, status: 'Selesai' } : item
        ));
        showAlert('success', 'Berhasil', `Pesanan #${id} telah diproses dan selesai.`);
    };

    return (
        <div className="refunds-page">
            {/* Breadcrumbs */}
            <nav className="breadcrumbs">
                <Link to="/reports/products">Laporan Produk</Link>
                <span className="separator">/</span>
                <span className="current">{decodedMonth}</span>
            </nav>

            <div className="table-card" style={{ marginTop: 0 }}>
                <div className="page-header" style={{ padding: '1.5rem', marginBottom: 0, borderBottom: '1px solid var(--color-border)' }}>
                    <div className="header-text">
                        <h1 style={{ fontSize: '1.1rem' }}>Penjualan Produk - {decodedMonth}</h1>
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
                                <th style={{ width: '12%' }}>ID</th>
                                <th style={{ width: '15%' }}>PELANGGAN</th>
                                <th style={{ width: '12%' }}>TANGGAL</th>
                                <th style={{ width: '22%' }}>ITEM</th>
                                <th style={{ width: '12%' }}>TOTAL</th>
                                <th style={{ width: '12%' }}>STATUS</th>
                                <th style={{ width: '13%', textAlign: 'center' }}>AKSI</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sales.map((trx) => (
                                <tr key={trx.id}>
                                    <td>
                                        <span className="refund-id">#{trx.id}</span>
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
                                    <td>{trx.date}</td>
                                    <td style={{ fontSize: '0.85rem' }}>{trx.items}</td>
                                    <td style={{ fontWeight: 600 }}>{trx.amount}</td>
                                    <td>
                                        <div className={`status-badge-detail ${trx.status === 'Selesai' ? 'success' : 'pending'}`} style={{ padding: '0.2rem 0.5rem' }}>
                                            <span className="status-dot-large" style={{ width: '6px', height: '6px' }}></span>
                                            <span style={{ fontSize: '0.75rem' }}>{trx.status.toUpperCase()}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                                            {trx.status === 'Menunggu' ? (
                                                <button
                                                    className="btn-primary"
                                                    style={{ padding: '0.3rem 0.8rem', fontSize: '0.75rem', gap: '0.3rem' }}
                                                    onClick={() => handleProcess(trx.id)}
                                                >
                                                    <Play size={12} fill="currentColor" />
                                                    Proses
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

export default ProductSalesDailyReport;
