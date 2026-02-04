import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Download,
    ChevronDown,
    TrendingUp
} from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import './SalesReport.css';
// Mock Data for Chart
const revenueData = [
    { month: 'Jan', value: 95000000 },
    { month: 'Feb', value: 85000000 },
    { month: 'Mar', value: 105000000 },
    { month: 'Apr', value: 120000000 },
    { month: 'Mei', value: 130000000 },
    { month: 'Jun', value: 98000000 },
    { month: 'Jul', value: 115000000 },
    { month: 'Agu', value: 125000000 },
    { month: 'Sep', value: 110000000 },
    { month: 'Okt', value: 135000000 },
    { month: 'Nov', value: 118000000 },
    { month: 'Des', value: 152000000 },
];
const detailData = [
    { month: 'Desember 2023', orders: 842, courtRevenue: 152450000, otherRevenue: 30200000, total: 182650000 },
    { month: 'November 2023', orders: 715, courtRevenue: 118400000, otherRevenue: 20100000, total: 138500000 },
    { month: 'Oktober 2023', orders: 790, courtRevenue: 135000000, otherRevenue: 25400000, total: 160400000 },
    { month: 'September 2023', orders: 650, courtRevenue: 112000000, otherRevenue: 16200000, total: 128200000 },
];
const SalesReport = () => {
    const [year] = useState('2023');
    return (
        <div className="sales-report-page">
            {/* Breadcrumbs */}
            <nav className="breadcrumbs">
                <Link to="/dashboard">Beranda</Link>
                <span className="separator">›</span>
                <span>Laporan</span>
                <span className="separator">›</span>
                <span className="current">Penjualan</span>
            </nav>

            {/* Header */}
            <div className="report-header">
                <div className="header-text">
                    <h1>Laporan Pendapatan Bulanan</h1>
                    <p>Ringkasan performa finansial fasilitas olahraga Anda.</p>
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
                    Semua Cabang <ChevronDown size={16} />
                </button>
            </div>
            {/* KPI Cards */}
            <div className="kpi-grid">
                <div className="kpi-card">
                    <div className="kpi-content">
                        <span className="kpi-label">Total Pendapatan (YTD)</span>
                        <h2 className="kpi-value">Rp 1.450.250.000</h2>
                        <span className="kpi-trend positive">
                            <TrendingUp size={14} style={{ marginRight: 4 }} /> +12.5% vs thn lalu
                        </span>
                    </div>
                </div>
                <div className="kpi-card">
                    <div className="kpi-content">
                        <span className="kpi-label">Rata-rata Bulanan</span>
                        <h2 className="kpi-value">Rp 120.854.000</h2>
                        <span className="kpi-trend positive">
                            <TrendingUp size={14} style={{ marginRight: 4 }} /> +2.1% bln ini
                        </span>
                    </div>
                </div>
                <div className="kpi-card">
                    <div className="kpi-content">
                        <div className="flex justify-between items-center mb-1">
                            <span className="kpi-label">Target Pencapaian</span>
                        </div>
                        <h2 className="kpi-value">94.2%</h2>
                        <div className="progress-bar-container">
                            <div className="progress-bar" style={{ width: '94.2%' }}></div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Chart Section */}
            <div className="chart-section">
                <div className="chart-header">
                    <div>
                        <h3>Tren Pendapatan Bulanan (IDR)</h3>
                        <p className="chart-subtitle">Januari - Desember {year}</p>
                    </div>
                    <div className="chart-legend">
                        <div className="legend-dot"></div>
                        <span>Pendapatan Aktual</span>
                    </div>
                </div>
                <div className="chart-wrapper">
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={revenueData} barSize={40}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1f2937" />
                            <XAxis
                                dataKey="month"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#94a3b8', fontSize: 12 }}
                                dy={10}
                            />
                            {/* Hide Y Axis Labels to look cleaner like image or keep them for data readability? 
                                Image shows no Y-axis labels. */}
                            <Tooltip
                                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                contentStyle={{ backgroundColor: '#0d2528', borderColor: '#1e3a3d', color: '#fff' }}
                            />
                            <Bar
                                dataKey="value"
                                fill="#0f766e"
                                radius={[4, 4, 0, 0]}
                                activeBar={{ fill: '#00d2be' }}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
            {/* Detailed Table */}
            <div className="detail-section">
                <div className="detail-header">
                    <h3>Rincian Data Bulanan</h3>
                </div>
                <div className="detail-table-container">
                    <table className="report-table">
                        <thead>
                            <tr>
                                <th style={{ width: '20%' }}>BULAN</th>
                                <th style={{ width: '15%' }}>JUMLAH PESANAN</th>
                                <th style={{ width: '20%' }}>PENDAPATAN LAPANGAN</th>
                                <th style={{ width: '20%' }}>PENDAPATAN LAIN-LAIN</th>
                                <th style={{ width: '25%', textAlign: 'right' }}>TOTAL PENDAPATAN</th>
                            </tr>
                        </thead>
                        <tbody>
                            {detailData.map((row, index) => (
                                <tr key={index}>
                                    <td>{row.month}</td>
                                    <td className="text-teal">{row.orders}</td>
                                    <td className="text-teal">Rp {row.courtRevenue.toLocaleString('id-ID')}</td>
                                    <td className="text-teal">Rp {row.otherRevenue.toLocaleString('id-ID')}</td>
                                    <td className="text-teal text-right font-bold">Rp {row.total.toLocaleString('id-ID')}</td>
                                </tr>
                            ))}
                            <tr className="total-row">
                                <td className="font-bold">TOTAL (4 BLN TERAKHIR)</td>
                                <td className="font-bold">2.997</td>
                                <td className="font-bold">Rp 517.850.000</td>
                                <td className="font-bold">Rp 91.900.000</td>
                                <td className="text-right text-large-total">Rp 609.750.000</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
export default SalesReport;