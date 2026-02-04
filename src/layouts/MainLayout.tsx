import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
    LogOut,
    HelpCircle,
    Settings,
    Menu
} from 'lucide-react';
import { getMenuIcon } from '../components/icons/MenuIcons';
import AlertModal from '../components/ui/AlertModal/AlertModal';
import ConfirmModal from '../components/ui/ConfirmModal/ConfirmModal';
import './MainLayout.css';

const navigation = [
    {
        items: [
            { name: 'Dashboard', to: '/dashboard', menuCode: 'home' }
        ]
    },
    {
        section: 'Master Data',
        items: [
            { name: 'Lapangan', to: '/courts', menuCode: 'court' },
            { name: 'Pelatih', to: '/trainers', menuCode: 'coach' },
            { name: 'Peralatan', to: '/equipment', menuCode: 'equipment' },
            { name: 'Produk', to: '/products', menuCode: 'product' },
        ]
    },
    {
        section: 'Laporan',
        items: [
            { name: 'Data Pemain', to: '/players', menuCode: 'player' },
            { name: 'Penjualan', to: '/reports/sales', menuCode: 'sales' },
            { name: 'Pemesanan Lapangan', to: '/reports/bookings', menuCode: 'court-booking' },
            { name: 'Pemesanan Produk', to: '/reports/products', menuCode: 'product-sales' },
        ]
    },
    {
        section: 'Manajemen Pengguna',
        items: [
            { name: 'Peran', to: '/roles', menuCode: 'role' },
            { name: 'Pengguna', to: '/users', menuCode: 'user' },
        ]
    }
];


const MainLayout = () => {
    const navigate = useNavigate();
    const [isMinimized, setIsMinimized] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        navigate('/login');
    };

    const toggleSidebar = () => {
        if (window.innerWidth <= 1024) {
            setIsMobileMenuOpen(!isMobileMenuOpen);
        } else {
            setIsMinimized(!isMinimized);
        }
    };

    return (
        <div className={`main-layout ${isMinimized ? 'sidebar-minimized' : ''} ${isMobileMenuOpen ? 'mobile-menu-open' : ''}`}>
            {/* Mobile Overlay */}
            <div className="mobile-overlay" onClick={() => setIsMobileMenuOpen(false)}></div>

            {/* Sidebar */}
            <aside className="sidebar">
                <div className="sidebar-header">
                    <div className="sidebar-logo">
                        <div className="logo-icon-sm">
                            <img src="/logo.png" alt="logo" width="40" />
                        </div>
                        {(!isMinimized || isMobileMenuOpen) && (
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
                                    {(isMinimized && !isMobileMenuOpen) ? '•••' : group.section}
                                </div>
                            )}
                            {group.items.map((item) => (
                                <NavLink
                                    key={item.to}
                                    to={item.to}
                                    className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                                    title={item.name}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {(() => {
                                        const MenuIcon = getMenuIcon(item.menuCode);
                                        return <MenuIcon size={20} />;
                                    })()}
                                    {(!isMinimized || isMobileMenuOpen) && <span>{item.name}</span>}
                                </NavLink>
                            ))}
                        </div>
                    ))}
                </nav>
                <div className="sidebar-footer">
                    <button className="btn-sidebar-help" title="Bantuan">
                        <HelpCircle size={20} />
                        {(!isMinimized || isMobileMenuOpen) && 'Bantuan'}
                    </button>
                    <button className="btn-logout" onClick={handleLogout} title="Keluar">
                        <LogOut size={20} />
                        {(!isMinimized || isMobileMenuOpen) && <span>Keluar</span>}
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
                        <h1 className="header-title">Beranda</h1>
                        {/* <div className="search-bar desktop-search">
                            <Search size={18} className="search-icon" />
                            <input type="text" placeholder="Cari jadwal atau member..." />
                        </div> */}
                    </div>
                    <div className="header-right">
                        {/* <button className="btn-add-order hide-mobile">
                            <Plus size={18} />
                            <span>Tambah Pesanan</span>
                        </button>
                        <button className="icon-btn">
                            <Bell size={20} />
                            <div className="notification-dot"></div>
                        </button> */}
                        <button className="icon-btn hide-tablet">
                            <Settings size={20} />
                        </button>
                        <div className="user-profile">
                            <div className="user-info hide-mobile">
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
            <AlertModal />
            <ConfirmModal />
        </div>
    );
};


export default MainLayout;

