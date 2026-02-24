
import { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
    Printer,
    User,
    Clock,
    Tag,
    Loader2,
    AlertCircle,
    Calendar
} from 'lucide-react';
import { useBookingsStore } from '../../features/bookings/bookings.store';
import './CourtBookingDetail.css';

const CourtBookingDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { currentBooking, isLoadingDetail, getBookingDetail } = useBookingsStore();

    useEffect(() => {
        if (id) {
            getBookingDetail(id);
        }
    }, [id, getBookingDetail]);

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
        if (desc === 'CONFIRMED' || desc === 'COMPLETED') return 'success';
        if (desc === 'CANCELLED' || desc === 'FAILED') return 'failed';
        return 'pending';
    };

    if (isLoadingDetail && !currentBooking) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', height: '60vh', justifyContent: 'center' }}>
                <Loader2 className="animate-spin text-primary" size={48} />
                <p className="text-mutex">Memuat detil pemesanan...</p>
            </div>
        );
    }

    return (
        <div className="booking-detail-page">
            {/* Breadcrumbs */}
            <nav className="breadcrumbs">
                <Link to="/reports/bookings">Laporan</Link>
                <span className="separator">›</span>
                <Link to="/reports/bookings">Pemesanan</Link>
                <span className="separator">›</span>
                <span className="current">Detil Pemesanan</span>
            </nav>

            {/* Title & Actions */}
            <div className="page-header" style={{ marginBottom: '1.5rem' }}>
                <h1 style={{ fontSize: '2rem' }}>Detil Pemesanan Lapangan</h1>
                <div className="detail-actions">
                    {currentBooking && (
                        <button className="btn-secondary" onClick={() => window.print()}>
                            <Printer size={18} />
                            <span>Cetak Bukti</span>
                        </button>
                    )}
                    <button className="btn-primary" onClick={() => navigate(-1)}>
                        Kembali
                    </button>
                </div>
            </div>

            {currentBooking ? (
                <>
                    {/* Top Info Card */}
                    <div className="section-card" style={{ padding: '1.5rem' }}>
                        <div className="detail-top-grid">
                            <div className="info-group">
                                <span className="info-label">Kode Booking</span>
                                <span className="info-value" style={{ fontWeight: 700, color: 'var(--color-primary)' }}>
                                    #{currentBooking.bookingCode}
                                </span>
                            </div>
                            <div className="info-group">
                                <span className="info-label">Status Pemesanan</span>
                                <div className={`status-badge-detail ${getStatusClass(currentBooking.statusDesc)}`}>
                                    <span className="status-dot-large"></span>
                                    {currentBooking.statusDesc}
                                </div>
                            </div>
                            <div className="info-group">
                                <span className="info-label">Waktu Dibuat</span>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Clock size={16} className="text-mutex" />
                                    <span className="info-value" style={{ fontSize: '1rem' }}>{currentBooking.createdAt}</span>
                                </div>
                            </div>
                            <div className="info-group">
                                <span className="info-label">Tanggal Main</span>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Calendar size={16} className="text-primary" />
                                    <span className="info-value" style={{ color: 'var(--color-primary)', fontSize: '1rem', fontWeight: 600 }}>
                                        {currentBooking.bookingDate}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="detail-main-grid">
                        <div className="detail-section-left">
                            {/* Court Info */}
                            <div className="section-card">
                                <div className="section-header">
                                    <h3 className="section-title">Informasi Lapangan</h3>
                                </div>
                                <div style={{ padding: '1.5rem', display: 'flex', gap: '1.5rem' }}>
                                    <div style={{ width: '120px', height: '120px', borderRadius: '12px', overflow: 'hidden', flexShrink: 0, border: '1px solid var(--color-border)' }}>
                                        <img
                                            src={currentBooking.court.courtImgLink}
                                            alt={currentBooking.court.courtName}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '0.5rem' }}>
                                        <h2 style={{ fontSize: '1.25rem', margin: 0 }}>{currentBooking.court.courtName}</h2>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-text-mutex)' }}>
                                            <Tag size={16} />
                                            <span>Kode: {currentBooking.court.courtCode}</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-text-mutex)' }}>
                                            <Clock size={16} />
                                            <span>{currentBooking.startTime} - {currentBooking.endTime} ({currentBooking.durationHour} Jam)</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Additional Services (Coaches & Equipment) */}
                            {(currentBooking.coaches.length > 0 || currentBooking.equipments.length > 0) && (
                                <div className="section-card">
                                    <div className="section-header">
                                        <h3 className="section-title">Layanan Tambahan</h3>
                                    </div>
                                    <div className="table-container" style={{ border: 'none', borderRadius: 0 }}>
                                        <table className="items-table">
                                            <thead>
                                                <tr>
                                                    <th>JENIS LAYANAN</th>
                                                    <th>DETAIL</th>
                                                    <th style={{ textAlign: 'right' }}>HARGA</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {currentBooking.coaches.map((c, idx) => (
                                                    <tr key={`coach-${idx}`}>
                                                        <td>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-primary)' }}>
                                                                <User size={16} />
                                                                <span style={{ fontWeight: 600 }}>Pelatih</span>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                                <span style={{ fontWeight: 600 }}>{c.coach.coachName}</span>
                                                                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-mutex)' }}>Kode: {c.coach.coachCode}</span>
                                                            </div>
                                                        </td>
                                                        <td style={{ textAlign: 'right' }}>{formatIDR(c.coachPrice)}</td>
                                                    </tr>
                                                ))}
                                                {currentBooking.equipments.map((e, idx) => (
                                                    <tr key={`equip-${idx}`}>
                                                        <td>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#3b82f6' }}>
                                                                <Tag size={16} />
                                                                <span style={{ fontWeight: 600 }}>Peralatan</span>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                                <span style={{ fontWeight: 600 }}>{e.equipment.equipmentName} ({e.quantity}x)</span>
                                                                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-mutex)' }}>{e.equipment.brand} - {e.equipment.type}</span>
                                                            </div>
                                                        </td>
                                                        <td style={{ textAlign: 'right' }}>{formatIDR(e.equipmentPrice)}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

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
                                        <span className="customer-name-large">{currentBooking.user.fullName}</span>
                                        <span className="customer-sub-info">{currentBooking.user.email}</span>
                                        <span className="customer-sub-info" style={{ opacity: 0.6 }}>ID: {currentBooking.user.id}</span>
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
                                        <span className="summary-label">Sewa Lapangan ({currentBooking.durationHour} Jam)</span>
                                        <span className="summary-value">{formatIDR(currentBooking.basePrice)}</span>
                                    </div>

                                    {currentBooking.coaches.length > 0 && (
                                        <div className="summary-row">
                                            <span className="summary-label">Biaya Pelatih</span>
                                            <span className="summary-value">
                                                {formatIDR(currentBooking.coaches.reduce((acc, curr) => acc + curr.coachPrice, 0))}
                                            </span>
                                        </div>
                                    )}

                                    {currentBooking.equipments.length > 0 && (
                                        <div className="summary-row">
                                            <span className="summary-label">Biaya Peralatan</span>
                                            <span className="summary-value">
                                                {formatIDR(currentBooking.equipments.reduce((acc, curr) => acc + curr.equipmentPrice, 0))}
                                            </span>
                                        </div>
                                    )}

                                    <div className="summary-total" style={{ borderTop: '1px dashed var(--color-border)', marginTop: '1rem', paddingTop: '1rem' }}>
                                        <span className="total-label">Total Pembayaran</span>
                                        <span className="total-value-large">{formatIDR(currentBooking.totalPrice)}</span>
                                    </div>

                                    <div className="payment-footer-note" style={{ marginTop: '1.5rem' }}>
                                        Pemesanan ini dikelola oleh sistem SmashClub. Terakhir diperbarui pada {currentBooking.updatedAt || 'N/A'}.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', height: '60vh', justifyContent: 'center' }}>
                    <AlertCircle className="text-mutex" size={48} />
                    <p className="text-mutex">Data pemesanan tidak ditemukan.</p>
                </div>
            )}
        </div>
    );
};

export default CourtBookingDetail;
