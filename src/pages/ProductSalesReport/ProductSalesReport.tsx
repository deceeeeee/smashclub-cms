import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Download,
    ShoppingBag,
    Package,
    ArrowUpRight,
    Loader2,
    AlertCircle
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
import { useOrdersStore } from '../../features/orders/orders.store';
import './ProductSalesReport.css';

const ProductSalesReport = () => {
    const [year, setYear] = useState(new Date().getFullYear());
    const { statistics, isLoading, getStatistics } = useOrdersStore();

    useEffect(() => {
        getStatistics(year);
    }, [year, getStatistics]);

    // Format IDR helper
    const formatIDR = (val: number | undefined) => {
        if (val === undefined) return 'Rp 0';
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(val).replace('IDR', 'Rp');
    };

    // Prepare chart data from soldCategoryRanking
    const chartDataColors = ['#00d2be', '#0ea5e9', '#8b5cf6', '#f59e0b', '#10b981'];
    const chartData = statistics?.soldCategoryRanking.map((item, index) => ({
        name: item.category,
        value: item.soldQuantity,
        color: chartDataColors[index % chartDataColors.length]
    })) || [];

    if (isLoading && !statistics) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', height: '60vh', justifyContent: 'center' }}>
                <Loader2 className="animate-spin text-primary" size={48} />
                <p className="text-mutex">Memuat data laporan penjualan produk...</p>
            </div>
        );
    }

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
            </div>

            {/* KPI Cards */}
            <div className="kpi-grid">
                <div className="kpi-card">
                    <div className="kpi-content">
                        <span className="kpi-label">Total Item Terjual (YTD)</span>
                        <div className="kpi-main">
                            <ShoppingBag className="kpi-icon" size={24} />
                            <h2 className="kpi-value">{(statistics?.totalQtySold || 0).toLocaleString('id-ID')}</h2>
                        </div>
                    </div>
                </div>
                <div className="kpi-card">
                    <div className="kpi-content">
                        <span className="kpi-label">Kategori Terlaris</span>
                        <div className="kpi-main">
                            <Package className="kpi-icon" size={24} />
                            <h2 className="kpi-value">{statistics?.soldCategoryRanking[0]?.category || '-'}</h2>
                        </div>
                    </div>
                </div>
                <div className="kpi-card">
                    <div className="kpi-content">
                        <span className="kpi-label">Rata-rata Transaksi</span>
                        <div className="kpi-main">
                            <ArrowUpRight className="kpi-icon" size={24} />
                            <h2 className="kpi-value">{formatIDR(statistics?.averageOrderValue)}</h2>
                        </div>
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
                    {chartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={chartData} layout="vertical" margin={{ left: 40, right: 40 }}>
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
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
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
                    <h3>Statistik Penjualan per Bulan</h3>
                </div>
                <div className="detail-table-container">
                    <table className="report-table">
                        <thead>
                            <tr>
                                <th style={{ width: '30%' }}>BULAN</th>
                                <th style={{ width: '35%' }}>ITEM TERJUAL</th>
                                <th style={{ width: '35%' }}>TOTAL PENDAPATAN</th>
                            </tr>
                        </thead>
                        <tbody>
                            {statistics?.monthlyOrders.map((row, index) => (
                                <tr key={index}>
                                    <td>
                                        <Link
                                            to={`/reports/products/${encodeURIComponent(row.month)}`}
                                            className="text-teal hover:underline cursor-pointer font-medium"
                                        >
                                            {row.month}
                                        </Link>
                                    </td>
                                    <td>{row.totalSoldQuantity.toLocaleString('id-ID')} unit</td>
                                    <td className="text-teal font-bold">{formatIDR(row.totalOrderValue)}</td>

                                </tr>
                            ))}
                            {(!statistics || statistics.monthlyOrders.length === 0) && (
                                <tr>
                                    <td colSpan={4} className="text-center py-8 text-mutex">
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', opacity: 0.5 }}>
                                            <AlertCircle size={40} />
                                            <span>Tidak ada data tersedia untuk tahun {year}</span>
                                        </div>
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

export default ProductSalesReport;
