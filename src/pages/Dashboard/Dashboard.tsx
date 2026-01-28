import {
    AreaChart,
    Area,
    XAxis,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import {
    Lightbulb,
    CalendarDays,
    TrendingUp,
    User,
    Zap,
    CalendarCheck
} from 'lucide-react';
import './Dashboard.css';
// Mock Data for Chart
const data = [
    { name: 'Sen', value: 40 },
    { name: 'Sel', value: 85 }, // Peak 1
    { name: 'Rab', value: 45 }, // Dip
    { name: 'Kam', value: 60 },
    { name: 'Jum', value: 95 }, // Peak 2
    { name: 'Sab', value: 30 }, // Low
    { name: 'Min', value: 100 }, // Peak 3 (End)
];
const RecentOrders = [
    { id: 1, name: 'Budi Santoso', type: 'Lapangan Basket A', time: '18:00', status: 'Sudah Bayar', iconBg: '#1e3a8a', iconColor: '#60a5fa', icon: '🏀' },
    { id: 2, name: 'Siti Aminah', type: 'Lapangan Futsal 2', time: '19:30', status: 'Pending', iconBg: '#172554', iconColor: '#3b82f6', icon: '⚽' },
    { id: 3, name: 'Kevin Sanjaya', type: 'Lapangan Badminton 1', time: '20:00', status: 'Sudah Bayar', iconBg: '#064e3b', iconColor: '#34d399', icon: '🏸' },
    { id: 4, name: 'Coach Jajang', type: 'Sesi Latihan Baru', time: '09:00', status: 'Selesai', iconBg: '#0f172a', iconColor: '#00d2be', icon: '👤' },
];
const Dashboard = () => {
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
                            <span className="stat-value">12 Unit</span>
                            <span className="stat-trend neutral">0% —</span>
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
                            <span className="stat-value">8 Personel</span>
                            <span className="stat-trend neutral">0% —</span>
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
                        <span className="stat-sublabel">Pemesanan Hari Ini</span>
                        <div className="stat-value-row">
                            <span className="stat-value">24 Pesanan</span>
                            <span className="stat-trend positive">+15% <TrendingUp size={14} /></span>
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
                            <h2 className="section-title">Tren Pemesanan Tujuh Hari Terakhir</h2>
                            <p className="section-subtitle">Jan 15 - Jan 21, 2024</p>
                        </div>
                        <div className="chart-stat-right">
                            <span className="chart-total">168 Total</span>
                            <span className="chart-trend">+12% vs minggu lalu</span>
                        </div>
                    </div>
                    <div className="chart-container">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data}>
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
                        {RecentOrders.map((order) => (
                            <div key={order.id} className="order-item">
                                <div className="order-icon" style={{ backgroundColor: order.iconBg }}>
                                    <span style={{ fontSize: '1.2rem' }}>{order.icon}</span>
                                </div>
                                <div className="order-details">
                                    <div className="order-name">{order.name}</div>
                                    <div className="order-meta">
                                        {order.type} • {order.time}
                                    </div>
                                </div>
                                <div className={`order-status ${order.status === 'Pending' ? 'status-pending' : order.status === 'Selesai' ? 'status-finished' : 'status-paid'}`}>
                                    {order.status === 'Sudah Bayar' ? 'SUDAH BAYAR' : order.status === 'Selesai' ? 'SELESAI' : 'PENDING'}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="card-footer-link">
                        <a href="#">Lihat Semua Transaksi</a>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Dashboard;