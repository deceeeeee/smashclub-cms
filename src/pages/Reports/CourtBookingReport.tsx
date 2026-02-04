import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Download,
    ChevronDown,
    Calendar,
    Users,
    Clock,
    TrendingUp
} from 'lucide-react';
import {
    XAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area
} from 'recharts';
import './CourtBookingReport.css';

// Mock Data for Chart
const bookingData = [
    { month: 'Jan', value: 450 },
    { month: 'Feb', value: 380 },
    { month: 'Mar', value: 520 },
    { month: 'Apr', value: 610 },
    { month: 'Mei', value: 590 },
    { month: 'Jun', value: 720 },
    { month: 'Jul', value: 810 },
    { month: 'Agu', value: 750 },
    { month: 'Sep', value: 680 },
    { month: 'Okt', value: 790 },
    { month: 'Nov', value: 840 },
    { month: 'Des', value: 950 },
];

const detailData = [
    { month: 'Desember 2023', totalBookings: 950, avgHours: 2.5, utilization: '88%', revenue: 152450000 },
    { month: 'November 2023', totalBookings: 840, avgHours: 2.2, utilization: '82%', revenue: 118400000 },
    { month: 'Oktober 2023', totalBookings: 790, avgHours: 2.1, utilization: '78%', revenue: 135000000 },
    { month: 'September 2023', totalBookings: 680, avgHours: 1.8, utilization: '72%', revenue: 112000000 },
];

const CourtBookingReport = () => {
    const [year] = useState('2023');

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
                <button className="control-dropdown">
                    Tahun {year} <ChevronDown size={16} />
                </button>
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
                            <h2 className="kpi-value">8.140</h2>
                        </div>
                        <span className="kpi-trend positive">
                            <TrendingUp size={14} style={{ marginRight: 4 }} /> +15.2% vs thn lalu
                        </span>
                    </div>
                </div>
                <div className="kpi-card">
                    <div className="kpi-content">
                        <span className="kpi-label">Rata-rata Durasi (Jam)</span>
                        <div className="kpi-main">
                            <Clock className="kpi-icon" size={24} />
                            <h2 className="kpi-value">2.1 Jam</h2>
                        </div>
                        <span className="kpi-trend positive">
                            <TrendingUp size={14} style={{ marginRight: 4 }} /> +0.4 jam bln ini
                        </span>
                    </div>
                </div>
                <div className="kpi-card">
                    <div className="kpi-content">
                        <div className="flex justify-between items-center mb-1">
                            <span className="kpi-label">Tingkat Okupansi</span>
                        </div>
                        <div className="kpi-main">
                            <Users className="kpi-icon" size={24} />
                            <h2 className="kpi-value">82.4%</h2>
                        </div>
                        <div className="progress-bar-container">
                            <div className="progress-bar" style={{ width: '82.4%' }}></div>
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
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={bookingData}>
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
                            {detailData.map((row, index) => (
                                <tr key={index}>
                                    <td>{row.month}</td>
                                    <td className="text-teal font-bold">{row.totalBookings}</td>
                                    <td>{row.avgHours} Jam</td>
                                    <td className="text-teal">{row.utilization}</td>
                                    <td className="text-teal text-right font-bold">Rp {row.revenue.toLocaleString('id-ID')}</td>
                                </tr>
                            ))}
                            <tr className="total-row">
                                <td className="font-bold">TOTAL AVERAGE</td>
                                <td className="font-bold">3.260</td>
                                <td className="font-bold">2.15 Jam</td>
                                <td className="font-bold">80%</td>
                                <td className="text-right text-large-total">Rp 517.850.000</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default CourtBookingReport;
