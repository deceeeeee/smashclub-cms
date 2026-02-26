import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Download,
    ChevronDown,
    Calendar,
    Users,
    Clock,
    Loader2,
    AlertCircle
} from 'lucide-react';
import {
    XAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area
} from 'recharts';
import { useBookingsStore } from '../../features/bookings/bookings.store';
import './CourtBookingReport.css';

const CourtBookingReport = () => {
    const [year, setYear] = useState(new Date().getFullYear());
    const { statistics, isLoading, getStatistics } = useBookingsStore();

    useEffect(() => {
        getStatistics(year);
    }, [getStatistics, year]);

    // Format month for chart (e.g., "February 2026" -> "Feb")
    const formatMonthShort = (monthStr: string) => {
        if (!monthStr) return '';
        const [month] = monthStr.split(' ');
        return month.substring(0, 3);
    };

    // Map statistics to chart data
    const chartData = statistics?.monthlyBookingStatistic.map((item) => ({
        month: formatMonthShort(item.month),
        value: item.totalCount
    })) || [];

    // Format IDR helper
    const formatIDR = (val: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(val).replace('IDR', 'Rp');
    };

    if (isLoading && !statistics) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', height: '60vh' }}>
                <Loader2 className="animate-spin mb-4 mx-auto text-primary" size={48} />
                <p className="text-mutex">Memuat data laporan pemesanan...</p>
            </div>
        );
    }

    return (
        <div className="report-page court-booking-report">
            {/* Breadcrumbs */}
            <nav className="breadcrumbs">
                <Link to="/dashboard">Beranda</Link>
                <span className="separator">›</span>
                <span>Laporan</span>
                <span className="separator">›</span>
                <span className="current">Pemesanan Lapangan</span>
            </nav>

            {/* Header */}
            <div className="report-header">
                <div className="header-text">
                    <h1>Laporan Pemesanan Lapangan (Courts)</h1>
                    <p>Analisis tingkat hunian dan statistik penggunaan lapangan olahraga.</p>
                </div>
                <button className="btn-export">
                    <Download size={18} />
                    <span>Ekspor Laporan</span>
                </button>
            </div>

            {/* Controls */}
            <div className="report-controls">
                <select
                    className="control-dropdown"
                    value={year}
                    onChange={(e) => setYear(parseInt(e.target.value))}
                    style={{ background: 'transparent', border: '1px solid var(--color-border)', color: 'white', padding: '0.4rem 0.8rem', borderRadius: '6px' }}
                >
                    <option value={2026}>Tahun 2026</option>
                    <option value={2025}>Tahun 2025</option>
                    <option value={2024}>Tahun 2024</option>
                </select>
                <button className="control-dropdown">
                    Semua Jenis Lapangan <ChevronDown size={16} />
                </button>
            </div>

            {/* KPI Cards */}
            <div className="kpi-grid">
                <div className="kpi-card">
                    <div className="kpi-content">
                        <span className="kpi-label">Total Pemesanan (YTD)</span>
                        <div className="kpi-main">
                            <Calendar className="kpi-icon" size={24} />
                            <h2 className="kpi-value">{statistics?.totalBookingCount.toLocaleString('id-ID') || 0}</h2>
                        </div>
                        {/* <span className="kpi-trend positive">
                            <TrendingUp size={14} style={{ marginRight: 4 }} /> +15.2% vs thn lalu
                        </span> */}
                    </div>
                </div>
                <div className="kpi-card">
                    <div className="kpi-content">
                        <span className="kpi-label">Rata-rata Durasi (Jam)</span>
                        <div className="kpi-main">
                            <Clock className="kpi-icon" size={24} />
                            <h2 className="kpi-value">{(statistics?.averageBookingHours || 0).toFixed(1)} Jam</h2>
                        </div>
                        {/* <span className="kpi-trend positive">
                            <TrendingUp size={14} style={{ marginRight: 4 }} /> +0.4 jam bln ini
                        </span> */}
                    </div>
                </div>
                <div className="kpi-card">
                    <div className="kpi-content">
                        <div className="flex justify-between items-center mb-1">
                            <span className="kpi-label">Tingkat Okupansi</span>
                        </div>
                        <div className="kpi-main">
                            <Users className="kpi-icon" size={24} />
                            <h2 className="kpi-value">{(statistics?.occupancyRate || 0).toFixed(2)}%</h2>
                        </div>
                        <div className="progress-bar-container">
                            <div className="progress-bar" style={{ width: `${statistics?.occupancyRate || 0}%` }}></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Chart Section */}
            <div className="chart-section">
                <div className="chart-header">
                    <div>
                        <h3>Tren Pemesanan Bulanan</h3>
                        <p className="chart-subtitle">Volume Pemesanan Januari - Desember {year}</p>
                    </div>
                    <div className="chart-legend">
                        <div className="legend-dot" style={{ backgroundColor: '#00d2be' }}></div>
                        <span>Jumlah Booking</span>
                    </div>
                </div>
                <div className="chart-wrapper">
                    {chartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#00d2be" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#00d2be" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1f2937" />
                                <XAxis
                                    dataKey="month"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                                    dy={10}
                                />
                                <Tooltip
                                    cursor={{ stroke: '#00d2be', strokeWidth: 2 }}
                                    contentStyle={{ backgroundColor: '#0d2528', borderColor: '#1e3a3d', color: '#fff' }}
                                    formatter={(value: any) => [`${value} Booking`, 'Jumlah']}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="value"
                                    stroke="#00d2be"
                                    fillOpacity={1}
                                    fill="url(#colorValue)"
                                    strokeWidth={3}
                                    activeDot={{ r: 6, fill: '#00d2be', stroke: '#fff', strokeWidth: 2 }}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', opacity: 0.5, padding: '2rem' }}>
                            <AlertCircle size={40} />
                            <span>Tidak ada data tersedia untuk tahun {year}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Detailed Table */}
            <div className="detail-section">
                <div className="detail-header">
                    <h3>Rincian Penggunaan Lapangan</h3>
                </div>
                <div className="detail-table-container">
                    <table className="report-table">
                        <thead>
                            <tr>
                                <th style={{ width: '25%' }}>BULAN</th>
                                <th style={{ width: '20%' }}>TOTAL BOOKING</th>
                                <th style={{ width: '20%' }}>RATA-RATA DURASI</th>
                                <th style={{ width: '15%' }}>OKUPANSI</th>
                                <th style={{ width: '20%', textAlign: 'right' }}>PENDAPATAN</th>
                            </tr>
                        </thead>
                        <tbody>
                            {statistics?.monthlyBookingStatistic.map((row, index) => (
                                <tr key={index}>
                                    <td>
                                        <Link
                                            to={`/reports/bookings/${encodeURIComponent(row.month)}`}
                                            className="text-teal hover:underline cursor-pointer font-medium"
                                        >
                                            {row.month}
                                        </Link>
                                    </td>
                                    <td className="text-teal font-bold">{row.totalCount}</td>
                                    <td>{row.averageHour.toFixed(1)} Jam</td>
                                    <td className="text-teal">{row.occupancyRate.toFixed(2)}%</td>
                                    <td className="text-teal text-right font-bold">{formatIDR(row.totalPrice)}</td>
                                </tr>
                            ))}
                            {(!statistics || statistics.monthlyBookingStatistic.length === 0) && (
                                <tr>
                                    <td colSpan={5} className="text-center py-8 text-mutex">
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', opacity: 0.5 }}>
                                            <AlertCircle size={40} />
                                            <span>Tidak ada data tersedia untuk tahun {year}</span>
                                        </div>
                                    </td>
                                </tr>
                            )}
                            {statistics && statistics.monthlyBookingStatistic.length > 0 && (
                                <tr className="total-row">
                                    <td className="font-bold">TOTAL AVERAGE (YTD)</td>
                                    <td className="font-bold">{statistics.totalBookingCount.toLocaleString('id-ID')}</td>
                                    <td className="font-bold">{statistics.averageBookingHours.toFixed(1)} Jam</td>
                                    <td className="font-bold">{statistics.occupancyRate.toFixed(2)}%</td>
                                    <td className="text-right text-large-total">
                                        {formatIDR(statistics.monthlyBookingStatistic.reduce((acc, curr) => acc + curr.totalPrice, 0))}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default CourtBookingReport;
