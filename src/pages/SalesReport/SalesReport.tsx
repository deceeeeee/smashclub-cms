import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Download,
    ChevronDown,
    TrendingUp,
    Loader2,
    AlertCircle
} from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import { useSalesStore } from '../../features/sales/sales.store';
import './SalesReport.css';

const SalesReport = () => {
    const [year, setYear] = useState(new Date().getFullYear());
    const { statistics, isLoading, error, getStatistics } = useSalesStore();

    useEffect(() => {
        getStatistics(year);
    }, [getStatistics, year]);

    // Format month for chart (e.g., "February 2026" -> "Feb")
    const formatMonthShort = (monthStr: string) => {
        const [month] = monthStr.split(' ');
        return month.substring(0, 3);
    };

    // Prepare data for Chart
    const chartData = statistics?.monthlyTransactionValue.map(item => ({
        month: formatMonthShort(item.month),
        value: item.totalTransactionValue
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
                <p className="text-mutex">Memuat data statistik...</p>
            </div>
        );
    }

    // if (error && !statistics) {
    //     return (
    //         <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', height: '60vh' }}>
    //             <AlertCircle size={40} className='text-error' />
    //             <span className='text-error'>{error}</span>
    //             <button
    //                 onClick={() => getStatistics(year)}
    //                 className="mt-4 px-4 py-2 bg-primary text-black rounded-md font-medium"
    //             >
    //                 Coba Lagi
    //             </button>
    //         </div>
    //     );
    // }

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
                <select
                    className="control-dropdown"
                    value={year}
                    onChange={(e) => setYear(parseInt(e.target.value))}
                    style={{ background: 'transparent', border: '1px solid var(--color-border)', color: 'white', padding: '0.5rem 1rem', borderRadius: '6px' }}
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
                        <span className="kpi-label">Total Pendapatan (YTD)</span>
                        <h2 className="kpi-value">{formatIDR(statistics?.totalTransactionValue || 0)}</h2>
                        {/* <span className="kpi-trend positive">
                            <TrendingUp size={14} style={{ marginRight: 4 }} /> +12.5% vs thn lalu
                        </span> */}
                    </div>
                </div>
                <div className="kpi-card">
                    <div className="kpi-content">
                        <span className="kpi-label">Rata-rata Transaksi</span>
                        <h2 className="kpi-value">{formatIDR(statistics?.averageTransactionValue || 0)}</h2>
                        {/* <span className="kpi-trend positive">
                            <TrendingUp size={14} style={{ marginRight: 4 }} /> +2.1% bln ini
                        </span> */}
                    </div>
                </div>
                {/* <div className="kpi-card">
                    <div className="kpi-content">
                        <div className="flex justify-between items-center mb-1">
                            <span className="kpi-label">Target Pencapaian</span>
                        </div>
                        <h2 className="kpi-value">94.2%</h2>
                        <div className="progress-bar-container">
                            <div className="progress-bar" style={{ width: '94.2%' }}></div>
                        </div>
                    </div>
                </div> */}
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
                    {
                        chartData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={chartData} barSize={40}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1f2937" />
                                    <XAxis
                                        dataKey="month"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#94a3b8', fontSize: 12 }}
                                        dy={10}
                                    />
                                    <Tooltip
                                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                        contentStyle={{ backgroundColor: '#0d2528', borderColor: '#1e3a3d', color: '#fff' }}
                                        formatter={(value: any) => [formatIDR(Number(value) || 0), 'Pendapatan']}
                                    />
                                    <Bar
                                        dataKey="value"
                                        fill="#0f766e"
                                        radius={[4, 4, 0, 0]}
                                        activeBar={{ fill: '#00d2be' }}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', opacity: 0.5 }}>
                                <AlertCircle size={40} />
                                <span>Tidak ada data tersedia untuk tahun {year}</span>
                            </div>
                        )}
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
                                <th style={{ width: '25%' }}>BULAN</th>
                                <th style={{ width: '15%' }}>JUMLAH TRANSAKSI</th>
                                <th style={{ width: '20%' }}>RATA-RATA / TRX</th>
                                <th style={{ width: '20%', textAlign: 'right' }}>TOTAL PENDAPATAN</th>
                            </tr>
                        </thead>
                        <tbody>
                            {statistics?.monthlyTransactionValue.map((row, index) => (
                                <tr key={index}>
                                    <td>
                                        <Link
                                            to={`/reports/sales/${encodeURIComponent(row.month)}`}
                                            className="text-teal hover:underline cursor-pointer font-medium"
                                        >
                                            {row.month}
                                        </Link>
                                    </td>
                                    <td className="text-teal">{row.totalTransactionCount}</td>
                                    <td className="text-teal">{formatIDR(row.avgTransactionValue)}</td>
                                    <td className="text-teal text-right font-bold">{formatIDR(row.totalTransactionValue)}</td>
                                </tr>
                            ))}
                            {(!statistics || statistics.monthlyTransactionValue.length === 0) && (
                                <tr>
                                    <td colSpan={4} className="text-center py-8 text-mutex">
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', opacity: 0.5 }}>
                                            <AlertCircle size={40} />
                                            <span>Tidak ada data tersedia untuk tahun {year}</span>
                                        </div>
                                    </td>
                                </tr>
                            )}
                            {statistics && statistics.monthlyTransactionValue.length > 0 && (
                                <tr className="total-row">
                                    <td className="font-bold">TOTAL (YTD)</td>
                                    <td className="font-bold">
                                        {statistics.monthlyTransactionValue.reduce((acc, curr) => acc + curr.totalTransactionCount, 0)}
                                    </td>
                                    <td className="font-bold">
                                        {formatIDR(statistics.averageTransactionValue)}
                                    </td>
                                    <td className="text-right text-large-total">
                                        {formatIDR(statistics.totalTransactionValue)}
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

export default SalesReport;
