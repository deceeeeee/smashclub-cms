import { useEffect, useMemo } from 'react';
import {
    AreaChart,
    Area,
    XAxis,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import {
    Lightbulb,
    // CalendarDays,
    // TrendingUp,
    // User,
    Zap,
    CalendarCheck,
    Loader2
} from 'lucide-react';
import './Dashboard.css';
import { Link } from 'react-router-dom';
import { useDashboardStore } from '../../features/dashboard/dashboard.store';

const Dashboard = () => {
    const { stats, isLoading, getDashboardStats } = useDashboardStore();

    useEffect(() => {
        getDashboardStats();
    }, [getDashboardStats]);

    const chartData = useMemo(() => {
        if (!stats?.dailyTransactionCount) return [];

        const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

        return stats.dailyTransactionCount.map(item => {
            const date = new Date(item.createdAt);
            return {
                name: dayNames[date.getDay()],
                value: item.transactionCount,
                originalDate: item.createdAt
            };
        });
    }, [stats]);

    if (isLoading && !stats) {
        return (
            <div className="loading-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', padding: '5rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                    <Loader2 className="animate-spin" size={40} />
                    <span>Memuat dashboard...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            {/* Top Stats Cards */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-header">
                        <div className="stat-icon-wrapper icon-bg-teal">
                            <Lightbulb size={24} color="#00d2be" />
                        </div>
                        <span className="stat-label">KAPASITAS</span>
                    </div>
                    <div className="stat-content">
                        <span className="stat-sublabel">Total Lapangan</span>
                        <div className="stat-value-row">
                            <span className="stat-value">{stats?.courtCount || 0} Unit</span>
                            {/* <span className="stat-trend neutral">0% —</span> */}
                        </div>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-header">
                        <div className="stat-icon-wrapper icon-bg-blue">
                            <Zap size={24} color="#3b82f6" />
                        </div>
                        <span className="stat-label">SUMBER DAYA</span>
                    </div>
                    <div className="stat-content">
                        <span className="stat-sublabel">Total Pelatih</span>
                        <div className="stat-value-row">
                            <span className="stat-value">{stats?.coachCount || 0} Personel</span>
                            {/* <span className="stat-trend neutral">0% —</span> */}
                        </div>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-header">
                        <div className="stat-icon-wrapper icon-bg-green">
                            <CalendarCheck size={24} color="#10b981" />
                        </div>
                        <span className="stat-label">AKTIFITAS</span>
                    </div>
                    <div className="stat-content">
                        <span className="stat-sublabel">Total Transaksi</span>
                        <div className="stat-value-row">
                            <span className="stat-value">{stats?.transactionCount || 0} Pesanan</span>
                            {/* <span className="stat-trend positive">+15% <TrendingUp size={14} /></span> */}
                        </div>
                    </div>
                </div>
            </div>
            {/* Main Content Split: Chart & Recent Orders */}
            <div className="dashboard-lower-section">
                {/* Chart Section */}
                <div className="chart-card">
                    <div className="chart-header-row">
                        <div>
                            <h2 className="section-title">Tren Pemesanan Terakhir</h2>
                            <p className="section-subtitle">Aktivitas transaksi harian</p>
                        </div>
                        <div className="chart-stat-right">
                            <span className="chart-total">{stats?.transactionCount || 0} Total</span>
                            {/* <span className="chart-trend">+12% vs minggu lalu</span> */}
                        </div>
                    </div>
                    <div className="chart-container">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#00d2be" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#00d2be" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                                    dy={10}
                                />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0d2528', borderColor: '#1e3a3d', borderRadius: '8px', color: '#fff' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="value"
                                    stroke="#00d2be"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorValue)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                {/* Recent Orders Section */}
                <div className="recent-orders-card">
                    <h2 className="section-title">Pemesanan Terbaru</h2>
                    <div className="orders-list">
                        {(!stats?.dailyTransaction || stats.dailyTransaction.length === 0) ? (
                            <div className="empty-state" style={{ padding: '2rem', textAlign: 'center', opacity: 0.5 }}>
                                Belum ada pemesanan terbaru.
                            </div>
                        ) : stats?.dailyTransaction.map((order, index) => (
                            <div key={index} className="order-item">
                                <div className="order-details">
                                    <div className="order-name">{order.fullName}</div>
                                    <div className="order-meta">
                                        {order.transactionLabel} • {order.startTime}
                                    </div>
                                </div>
                                <div className={`order-status ${order.status === 0 ? 'status-pending' : order.status === 1 ? 'status-paid' : 'status-finished'}`}>
                                    {order.statusDesc.toUpperCase()}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="card-footer-link">
                        <Link to="/reports/sales">Lihat Semua Pemesanan</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Dashboard;
