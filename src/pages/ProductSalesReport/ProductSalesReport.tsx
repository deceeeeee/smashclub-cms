import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Download,
    ChevronDown,
    ShoppingBag,
    Package,
    ArrowUpRight,
    TrendingUp
} from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell
} from 'recharts';
import './ProductSalesReport.css';

// Mock Data for Chart
const productSalesData = [
    { name: 'Minuman', value: 450, color: '#00d2be' },
    { name: 'Shuttlecock', value: 380, color: '#0ea5e9' },
    { name: 'Sewa Raket', value: 310, color: '#8b5cf6' },
    { name: 'Jersey', value: 240, color: '#f59e0b' },
    { name: 'Aksesori', value: 180, color: '#10b981' },
];

const detailData = [
    { category: 'Minuman Dingin', sold: 1240, revenue: 12400000, trend: '+12%' },
    { category: 'Shuttlecock (Slop)', sold: 450, revenue: 67500000, trend: '+5%' },
    { category: 'Sewa Raket', sold: 890, revenue: 22250000, trend: '+18%' },
    { category: 'Grip Raket', sold: 320, revenue: 4800000, trend: '-2%' },
    { category: 'Snack/Makanan', sold: 610, revenue: 9150000, trend: '+8%' },
];

const ProductSalesReport = () => {
    const [year] = useState('2023');

    return (
        <div className="report-page product-sales-report">
            {/* Breadcrumbs */}
            <nav className="breadcrumbs">
                <Link to="/dashboard">Beranda</Link>
                <span className="separator">›</span>
                <span>Laporan</span>
                <span className="separator">›</span>
                <span className="current">Penjualan Produk</span>
            </nav>

            {/* Header */}
            <div className="report-header">
                <div className="header-text">
                    <h1>Laporan Penjualan Produk</h1>
                    <p>Ringkasan penjualan produk, penyewaan alat, dan inventaris toko.</p>
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
                    Semua Kategori <ChevronDown size={16} />
                </button>
            </div>

            {/* KPI Cards */}
            <div className="kpi-grid">
                <div className="kpi-card">
                    <div className="kpi-content">
                        <span className="kpi-label">Total Item Terjual (YTD)</span>
                        <div className="kpi-main">
                            <ShoppingBag className="kpi-icon" size={24} />
                            <h2 className="kpi-value">12.450</h2>
                        </div>
                        <span className="kpi-trend positive">
                            <TrendingUp size={14} style={{ marginRight: 4 }} /> +8.4% vs bln lalu
                        </span>
                    </div>
                </div>
                <div className="kpi-card">
                    <div className="kpi-content">
                        <span className="kpi-label">Kategori Terlaris</span>
                        <div className="kpi-main">
                            <Package className="kpi-icon" size={24} />
                            <h2 className="kpi-value">Minuman</h2>
                        </div>
                        <span className="kpi-trend positive badge-teal">
                            42% dari total
                        </span>
                    </div>
                </div>
                <div className="kpi-card">
                    <div className="kpi-content">
                        <span className="kpi-label">Rata-rata Transaksi</span>
                        <div className="kpi-main">
                            <ArrowUpRight className="kpi-icon" size={24} />
                            <h2 className="kpi-value">Rp 42.500</h2>
                        </div>
                        <span className="kpi-trend positive">
                            <TrendingUp size={14} style={{ marginRight: 4 }} /> +1.2% bln ini
                        </span>
                    </div>
                </div>
            </div>

            {/* Chart Section */}
            <div className="chart-section">
                <div className="chart-header">
                    <div>
                        <h3>Proporsi Penjualan per Kategori</h3>
                        <p className="chart-subtitle">Volume Satuan Terjual - {year}</p>
                    </div>
                </div>
                <div className="chart-wrapper">
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={productSalesData} layout="vertical" margin={{ left: 40, right: 40 }}>
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#1f2937" />
                            <XAxis type="number" hide />
                            <YAxis
                                type="category"
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#94a3b8', fontSize: 12 }}
                            />
                            <Tooltip
                                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                contentStyle={{ backgroundColor: '#0d2528', borderColor: '#1e3a3d', color: '#fff' }}
                            />
                            <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={30}>
                                {productSalesData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Detailed Table */}
            <div className="detail-section">
                <div className="detail-header">
                    <h3>Statistik Produk Detail</h3>
                </div>
                <div className="detail-table-container">
                    <table className="report-table">
                        <thead>
                            <tr>
                                <th style={{ width: '30%' }}>KATEGORI PRODUK</th>
                                <th style={{ width: '20%' }}>ITEM TERJUAL</th>
                                <th style={{ width: '25%' }}>TOTAL PENDAPATAN</th>
                                <th style={{ width: '25%', textAlign: 'right' }}>TREN PENJUALAN</th>
                            </tr>
                        </thead>
                        <tbody>
                            {detailData.map((row, index) => (
                                <tr key={index}>
                                    <td className="font-bold">{row.category}</td>
                                    <td>{row.sold.toLocaleString('id-ID')} unit</td>
                                    <td className="text-teal font-bold">Rp {row.revenue.toLocaleString('id-ID')}</td>
                                    <td className={`text-right ${row.trend.startsWith('+') ? 'text-teal' : 'text-error'}`}>
                                        {row.trend}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ProductSalesReport;
