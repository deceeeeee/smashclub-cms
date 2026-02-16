
import { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
    Printer,
    ExternalLink,
    User,
    CreditCard,
    Clock,
    Tag,
    Loader2,
    AlertCircle
} from 'lucide-react';
import { useSalesStore } from '../../features/sales/sales.store';
import './SalesDetail.css';

const SalesDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { currentTransaction, isLoading, error, getTransactionDetail } = useSalesStore();

    useEffect(() => {
        if (id) {
            getTransactionDetail(id);
        }
    }, [id, getTransactionDetail]);

    const formatIDR = (val: number | undefined) => {
        if (val === undefined) return 'Rp 0';
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(val).replace('IDR', 'Rp');
    };

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

    const getCategoryName = (typeCode: number) => {
        switch (typeCode) {
            case 3: return 'Wallet Topup';
            case 1: return 'Produk';
            case 2: return 'Sewa Lapangan';
            default: return 'Lainnya';
        }
    };

    if (isLoading && !currentTransaction) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', height: '60vh' }}>
                <Loader2 className="animate-spin mb-4 mx-auto text-primary" size={48} />
                <p className="text-mutex">Memuat data penjualan...</p>
            </div>
        );
    }

    if (!currentTransaction) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', height: '60vh' }}>
                <AlertCircle className="mb-4 mx-auto text-mutex" size={48} />
                <p className="text-mutex">Transaksi tidak ditemukan.</p>
            </div>
        );
    }

    const txStatus = getStatusInfo(currentTransaction.status);

    return (
        <div className="sales-detail-page">
            {/* Breadcrumbs */}
            <nav className="breadcrumbs">
                <Link to="/reports/sales">Dashboard</Link>
                <span className="separator">›</span>
                <Link to="/reports/sales">Penjualan</Link>
                <span className="separator">›</span>
                <span className="current">Detil Transaksi</span>
            </nav>

            {/* Title & Actions */}
            <div className="page-header" style={{ marginBottom: '1.5rem' }}>
                <h1 style={{ fontSize: '2rem' }}>Detil Penjualan</h1>
                <div className="detail-actions">
                    <button className="btn-secondary">
                        <Printer size={18} />
                        <span>Cetak Struk</span>
                    </button>
                    <button className="btn-primary" onClick={() => navigate(-1)}>
                        Kembali ke List
                    </button>
                </div>
            </div>

            {/* Top Info Card */}
            <div className="section-card" style={{ padding: '1.5rem' }}>
                <div className="detail-top-grid">
                    <div className="info-group">
                        <span className="info-label">Kode Transaksi</span>
                        <span className="info-value">{currentTransaction.transactionCode}</span>
                    </div>
                    <div className="info-group">
                        <span className="info-label">Status Pembayaran</span>
                        <div className={`status-badge-detail ${txStatus}`}>
                            <span className="status-dot-large"></span>
                            {currentTransaction.statusDesc}
                        </div>
                    </div>
                    <div className="info-group">
                        <span className="info-label">Waktu Transaksi</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Clock size={16} className="text-mutex" />
                            <span className="info-value" style={{ fontSize: '1rem' }}>{currentTransaction.createdAt}</span>
                        </div>
                    </div>
                    <div className="info-group">
                        <span className="info-label">Kategori</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Tag size={16} className="text-primary" />
                            <span className="info-value" style={{ color: 'var(--color-primary)', fontSize: '1rem' }}>
                                {getCategoryName(currentTransaction.transactionType)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="detail-main-grid">
                <div className="detail-section-left">
                    {/* Items Table */}
                    <div className="section-card">
                        <div className="section-header">
                            <h3 className="section-title">Item Transaksi</h3>
                        </div>
                        <table className="items-table">
                            <thead>
                                <tr>
                                    <th>NAMA ITEM</th>
                                    <th>HARGA SATUAN</th>
                                    <th>QTY</th>
                                    <th style={{ textAlign: 'right' }}>TOTAL</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentTransaction.items.map((item, idx) => (
                                    <tr key={idx}>
                                        <td>
                                            <div className="item-main-info">
                                                <span className="item-name">{item.itemName}</span>
                                            </div>
                                        </td>
                                        <td>{formatIDR(item.itemPrice)}</td>
                                        <td>{item.itemQty} {item.itemUnit}</td>
                                        <td style={{ textAlign: 'right', fontWeight: 600, color: 'var(--color-primary)' }}>
                                            {formatIDR(item.itemPrice * item.itemQty)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Customer Info */}
                    <div className="section-card">
                        <div className="section-header">
                            <h3 className="section-title">Informasi Pelanggan</h3>
                        </div>
                        <div className="customer-info-box">
                            <div className="customer-avatar-icon">
                                <User size={24} />
                            </div>
                            <div className="customer-details">
                                <span className="customer-name-large">{currentTransaction.user.fullName}</span>
                                <span className="customer-sub-info">{currentTransaction.user.email}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="detail-section-right">
                    {/* Payment Summary */}
                    <div className="section-card">
                        <div className="section-header">
                            <h3 className="section-title">Ringkasan Pembayaran</h3>
                        </div>
                        <div className="summary-card">
                            <div className="summary-row">
                                <span className="summary-label">Subtotal</span>
                                <span className="summary-value">{formatIDR(currentTransaction.totalPrice)}</span>
                            </div>
                            <div className="summary-row">
                                <span className="summary-label">Biaya Admin</span>
                                <span className="summary-value">Rp 0</span>
                            </div>
                            <div className="summary-total">
                                <span className="total-label">Total Harga</span>
                                <span className="total-value-large">{formatIDR(currentTransaction.totalPrice)}</span>
                            </div>

                            <div className="payment-method-section" style={{ marginTop: '1rem' }}>
                                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-mutex)', textTransform: 'uppercase' }}>Metode Pembayaran</span>
                                <div className="payment-method-box">
                                    <CreditCard size={20} className="text-primary" />
                                    <span style={{ fontWeight: 600 }}>Xendit</span>
                                </div>
                            </div>

                            {currentTransaction.paymentLink && (
                                <div className="payment-link-section">
                                    <h4>Link Pembayaran</h4>
                                    <a href={currentTransaction.paymentLink} target="_blank" rel="noopener noreferrer" className="btn-payment-link">
                                        <ExternalLink size={20} />
                                        <span>Buka Link Pembayaran</span>
                                    </a>
                                    <span className="payment-link-url">{currentTransaction.paymentLink}</span>
                                </div>
                            )}

                            <div className="payment-footer-note">
                                Transaksi diproses otomatis melalui payment gateway Xendit.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SalesDetail;
