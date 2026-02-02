import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
    LayoutGrid,
    MapPin,
    Megaphone,
    Package,
    Users,
    Banknote,
    ShoppingBag,
    HelpCircle,
    LogOut,
    Bell,
    Settings,
    Plus,
    Search,
    ShieldCheck,
    LayoutDashboard,
    Menu
} from 'lucide-react';
import './MainLayout.css';

const navigation = [
    {
        items: [
            { name: 'Dashboard', to: '/dashboard', icon: LayoutGrid }
        ]
    },
    {
        section: 'Master Data',
        items: [
            { name: 'Lapangan', to: '/fields', icon: MapPin },
            { name: 'Pelatih', to: '/trainers', icon: Megaphone },
            { name: 'Peralatan', to: '/equipment', icon: Package },
            { name: 'Produk', to: '/products', icon: ShoppingBag },
        ]
    },
    {
        section: 'Laporan',
        items: [
            { name: 'Data Pemain', to: '/players', icon: LayoutDashboard },
            { name: 'Penjualan', to: '/reports/sales', icon: Banknote },
            { name: 'Pemesanan Lapangan', to: '/reports/bookings', icon: LayoutGrid },
            { name: 'Pemesanan Produk', to: '/reports/products', icon: ShoppingBag },
        ]
    },
    {
        section: 'Manajemen Pengguna',
        items: [
            { name: 'Peran', to: '/roles', icon: ShieldCheck },
            { name: 'Pengguna', to: '/users', icon: Users },
        ]
    }
];

const MainLayout = () => {
    const navigate = useNavigate();
    const [isMinimized, setIsMinimized] = useState(false);

    const handleLogout = () => {
        navigate('/login');
    };

    const toggleSidebar = () => {
        setIsMinimized(!isMinimized);
    };

    return (
        <div className={`main-layout ${isMinimized ? 'sidebar-minimized' : ''}`}>
            {/* Sidebar */}
            <aside className="sidebar">
                <div className="sidebar-header">
                    <div className="sidebar-logo">
                        <div className="logo-icon-sm">
                            <img src="/logo.png" alt="logo" width="40" />
                        </div>
                        {!isMinimized && (
                            <div className="logo-text-block">
                                <span className="brand-name">SmashClub</span>
                                <span className="brand-subtitle">MANAGEMENT SYSTEM</span>
                            </div>
                        )}
                    </div>
                </div>
                <nav className="sidebar-nav">
                    {navigation.map((group, groupIdx) => (
                        <div key={groupIdx} className="nav-group">
                            {group.section && (
                                <div className="nav-section-label">
                                    {isMinimized ? '•••' : group.section}
                                </div>
                            )}
                            {group.items.map((item) => (
                                <NavLink
                                    key={item.to}
                                    to={item.to}
                                    className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                                    title={item.name}
                                >
                                    <item.icon size={20} />
                                    {!isMinimized && <span>{item.name}</span>}
                                </NavLink>
                            ))}
                        </div>
                    ))}
                </nav>
                <div className="sidebar-footer">
                    <button className="btn-sidebar-help" title="Bantuan">
                        <HelpCircle size={20} />
                        {!isMinimized && 'Bantuan'}
                    </button>
                    <button className="btn-logout" onClick={handleLogout} title="Keluar">
                        <LogOut size={20} />
                        {!isMinimized && <span>Keluar</span>}
                    </button>
                </div>
            </aside>
            {/* Main Content Area */}
            <div className="main-content-wrapper">
                <header className="top-header">
                    <div className="header-left">
                        <button className="icon-btn toggle-sidebar-btn" onClick={toggleSidebar}>
                            <Menu size={24} />
                        </button>
                        <h1>Beranda</h1>
                        <div className="search-bar">
                            <Search size={18} className="search-icon" />
                            <input type="text" placeholder="Cari jadwal atau member..." />
                        </div>
                    </div>
                    <div className="header-right">
                        <button className="btn-add-order">
                            <Plus size={18} />
                            <span>Tambah Pesanan</span>
                        </button>
                        <button className="icon-btn">
                            <Bell size={20} />
                            <div className="notification-dot"></div>
                        </button>
                        <button className="icon-btn">
                            <Settings size={20} />
                        </button>
                        <div className="user-profile">
                            <div className="user-info">
                                <span className="user-name">Andi Wijaya</span>
                                <span className="user-role">Super Admin</span>
                            </div>
                            <div className="user-avatar"></div>
                        </div>
                    </div>
                </header>
                <main className="content-container">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default MainLayout;