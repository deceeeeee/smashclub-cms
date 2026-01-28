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
    LayoutDashboard
} from 'lucide-react';
import './MainLayout.css';
const MainLayout = () => {
    const navigate = useNavigate();
    const handleLogout = () => {
        navigate('/login');
    };
    return (
        <div className="main-layout">
            {/* Sidebar */}
            <aside className="sidebar">
                <div className="sidebar-header">
                    <div className="sidebar-logo">
                        <div className="logo-icon-sm">
                            {/* <ShieldCheck size={20} color="white" /> */}
                            <img src="/logo.png" alt="logo" width="40" />
                        </div>
                        <div className="logo-text-block">
                            <span className="brand-name">SmashClub</span>
                            <span className="brand-subtitle">MANAGEMENT SYSTEM</span>
                        </div>
                    </div>
                </div>
                <nav className="sidebar-nav">
                    <NavLink to="/dashboard" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                        <LayoutGrid size={20} />
                        <span>Dashboard</span>
                    </NavLink>
                    <div className="nav-section-label">Master Data</div>

                    <NavLink to="/users" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                        <Users size={20} />
                        <span>Pengguna</span>
                    </NavLink>
                    <NavLink to="/fields" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                        <MapPin size={20} />
                        <span>Lapangan</span>
                    </NavLink>
                    <NavLink to="/trainers" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                        <Megaphone size={20} />
                        <span>Pelatih</span>
                    </NavLink>
                    <NavLink to="/equipment" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                        <Package size={20} />
                        <span>Peralatan</span>
                    </NavLink>
                    <NavLink to="/products" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                        <ShoppingBag size={20} />
                        <span>Produk</span>
                    </NavLink>
                    <div className="nav-section-label">Laporan</div>
                    <NavLink to="/players" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                        <LayoutDashboard size={20} />
                        <span>Data Pemain</span>
                    </NavLink>
                    <NavLink to="/reports/sales" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                        <Banknote size={20} />
                        <span>Penjualan</span>
                    </NavLink>
                    <NavLink to="/reports/bookings" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                        <LayoutGrid size={20} />
                        <span>Pemesanan Lapangan</span>
                    </NavLink>
                    <NavLink to="/reports/products" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                        <ShoppingBag size={20} />
                        <span>Pemesanan Produk</span>
                    </NavLink>
                </nav>
                <div className="sidebar-footer">
                    <button className="btn-sidebar-help">
                        <HelpCircle size={20} />
                        Bantuan
                    </button>
                    <button className="btn-logout" onClick={handleLogout}>
                        <LogOut size={20} />
                        <span>Keluar</span>
                    </button>
                </div>
            </aside>
            {/* Main Content Area */}
            <div className="main-content-wrapper">
                <header className="top-header">
                    <div className="header-left">
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