import { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
    Printer,
    User,
    Clock,
    Loader2,
    AlertCircle,
    Calendar,
    ArrowLeft
} from 'lucide-react';
import { useOrdersStore } from '../../features/orders/orders.store';
import '../CourtBookingReport/CourtBookingDetail.css'; // Reuse CSS from CourtBookingDetail page

const ProductSalesDetail = () => {
    const { orderCode } = useParams<{ orderCode: string }>();
    const navigate = useNavigate();
    const { currentOrder, isLoadingDetail, getOrderDetail } = useOrdersStore();

    useEffect(() => {
        if (orderCode) {
            getOrderDetail(orderCode);
        }
    }, [orderCode, getOrderDetail]);

    const formatIDR = (val: number | undefined) => {
        if (val === undefined) return 'Rp 0';
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(val).replace('IDR', 'Rp');
    };

    const getStatusClass = (statusDesc: string | undefined) => {
        if (!statusDesc) return 'pending';
        const desc = statusDesc.toUpperCase();
        if (desc === 'COMPLETED' || desc === 'SELESAI' || desc === 'SUCCESS') return 'success';
        if (desc === 'CANCELLED' || desc === 'FAILED' || desc === 'DIBATALKAN') return 'failed';
        return 'pending';
    };

    if (isLoadingDetail && !currentOrder) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', height: '60vh', justifyContent: 'center' }}>
                <Loader2 className="animate-spin text-primary" size={48} />
                <p className="text-mutex">Memuat detil pesanan...</p>
            </div>
        );
    }

    return (
        <div className="booking-detail-page">
            {/* Breadcrumbs */}
            <nav className="breadcrumbs">
                <Link to="/reports/products">Laporan</Link>
                <span className="separator">›</span>
                <Link to="/reports/products">Produk</Link>
                <span className="separator">›</span>
                <span className="current">Detil Pesanan</span>
            </nav>

            {/* Title & Actions */}
            <div className="page-header" style={{ marginBottom: '1.5rem' }}>
                <h1 style={{ fontSize: '2rem' }}>Detil Pesanan Produk</h1>
                <div className="detail-actions">
                    {currentOrder && (
                        <button className="btn-secondary" onClick={() => window.print()}>
                            <Printer size={18} />
                            <span>Cetak Bukti</span>
                        </button>
                    )}
                    <button className="btn-primary" onClick={() => navigate(-1)}>
                        <ArrowLeft size={18} />
                        Kembali
                    </button>
                </div>
            </div>

            {currentOrder ? (
                <>
                    {/* Top Info Card */}
                    <div className="section-card" style={{ padding: '1.5rem' }}>
                        <div className="detail-top-grid">
                            <div className="info-group">
                                <span className="info-label">Kode Pesanan</span>
                                <span className="info-value" style={{ fontWeight: 700, color: 'var(--color-primary)' }}>
                                    #{currentOrder.orderCode}
                                </span>
                            </div>
                            <div className="info-group">
                                <span className="info-label">Status Pesanan</span>
                                <div className={`status-badge-detail ${getStatusClass(currentOrder.statusDesc)}`}>
                                    <span className="status-dot-large"></span>
                                    {currentOrder.statusDesc}
                                </div>
                            </div>
                            <div className="info-group">
                                <span className="info-label">Waktu Pemesanan</span>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Clock size={16} className="text-mutex" />
                                    <span className="info-value" style={{ fontSize: '1rem' }}>{currentOrder.orderDate}</span>
                                </div>
                            </div>
                            <div className="info-group">
                                <span className="info-label">Terakhir Diperbarui</span>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Calendar size={16} className="text-primary" />
                                    <span className="info-value" style={{ fontSize: '1rem' }}>{currentOrder.updatedAt || '-'}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="detail-main-grid">
                        <div className="detail-section-left">
                            {/* Order Items */}
                            <div className="section-card">
                                <div className="section-header">
                                    <h3 className="section-title">Item Pesanan</h3>
                                </div>
                                <div className="table-container" style={{ border: 'none', borderRadius: 0 }}>
                                    <table className="items-table">
                                        <thead>
                                            <tr>
                                                <th>PRODUK</th>
                                                <th style={{ textAlign: 'center' }}>JUMLAH</th>
                                                <th style={{ textAlign: 'right' }}>HARGA</th>
                                                <th style={{ textAlign: 'right' }}>TOTAL</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {currentOrder.orderItem.map((item, idx) => (
                                                <tr key={idx}>
                                                    <td>
                                                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                                            <div style={{ width: '48px', height: '48px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--color-border)', flexShrink: 0 }}>
                                                                <img
                                                                    src={item.variant.variantImgLink}
                                                                    alt={item.variant.name}
                                                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                                />
                                                            </div>
                                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                                <span style={{ fontWeight: 600 }}>{item.productName}</span>
                                                                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-mutex)' }}>{item.variant.name} ({item.variant.sku})</span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td style={{ textAlign: 'center' }}>{item.quantity}x</td>
                                                    <td style={{ textAlign: 'right' }}>{formatIDR(item.priceAtPurchase)}</td>
                                                    <td style={{ textAlign: 'right', fontWeight: 600, color: 'var(--color-primary)' }}>{formatIDR(item.totalPrice)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
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
                                        <span className="customer-name-large">{currentOrder.user.fullName}</span>
                                        <span className="customer-sub-info">{currentOrder.user.email}</span>
                                        <span className="customer-sub-info" style={{ opacity: 0.6 }}>ID: {currentOrder.user.userId}</span>
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
                                        <span className="summary-value">{formatIDR(currentOrder.subTotal)}</span>
                                    </div>

                                    <div className="summary-row">
                                        <span className="summary-label">Total Item ({currentOrder.orderItem.reduce((acc, curr) => acc + curr.quantity, 0)})</span>
                                        <span className="summary-value" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
                                            {currentOrder.orderItem.length} Jenis
                                        </span>
                                    </div>

                                    <div className="summary-total" style={{ borderTop: '1px dashed var(--color-border)', marginTop: '1rem', paddingTop: '1rem' }}>
                                        <span className="total-label">Total Pembayaran</span>
                                        <span className="total-value-large">{formatIDR(currentOrder.totalPrice)}</span>
                                    </div>

                                    <div className="payment-footer-note" style={{ marginTop: '1.5rem' }}>
                                        Pesanan ini diproses oleh sistem SmashClub. Pastikan item telah diterima oleh pelanggan sebelum menyelesaikan transaksi di kasir.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', height: '60vh', justifyContent: 'center' }}>
                    <AlertCircle className="text-mutex" size={48} />
                    <p className="text-mutex">Data pesanan tidak ditemukan.</p>
                </div>
            )}
        </div>
    );
};

export default ProductSalesDetail;
