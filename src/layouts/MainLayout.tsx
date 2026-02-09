import { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
    LogOut,
    HelpCircle,
    Settings,
    Menu,
    Bell
} from 'lucide-react';
import { getMenuIcon } from '../components/icons/MenuIcons';
import { useAuthStore } from '../features/auth/auth.store';
import { useConfirmStore } from '../app/confirm.store';
import AccessDenied from '../components/common/AccessDenied';
import './MainLayout.css';

// Helper to map menuCode to route path
const getPathByMenuCode = (menuCode: string): string => {
    switch (menuCode) {
        case 'home': return '/dashboard';
        case 'court': return '/courts';
        case 'coach': return '/trainers';
        case 'equipment-category': return '/equipment-categories';
        case 'equipment': return '/equipment';
        case 'product': return '/products';
        case 'player': return '/players';
        case 'sales': return '/reports/sales';
        case 'court-booking': return '/reports/bookings';
        case 'product-sales': return '/reports/products';
        case 'role': return '/roles';
        case 'user': return '/users';
        case 'refund-request': return '/refund-request';
        default: return '/dashboard';
    }
};

interface NavigationGroup {
    categoryId: number;
    section?: string;
    items: {
        name: string;
        to: string;
        menuCode: string;
        menuOrder: number;
    }[];
}

const MainLayout = () => {
    const navigate = useNavigate();
    const { user, logout, isAuthenticated } = useAuthStore();
    const { showConfirm } = useConfirmStore();
    const [isMinimized, setIsMinimized] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const location = useLocation();
    const menuSet = user?.adminRole?.menuSet || [];
    const [isAllowed, setIsAllowed] = useState(true);

    // Group by category
    const categoryMap = new Map<number, NavigationGroup>();

    menuSet.forEach(menu => {
        // Fallback for missing category (e.g. from login response)
        const catId = menu.category?.id ?? 0;
        const catName = menu.category?.categoryName ?? '';

        if (!categoryMap.has(catId)) {
            categoryMap.set(catId, {
                categoryId: catId,
                section: catName || undefined,
                items: []
            });
        }

        categoryMap.get(catId)?.items.push({
            name: menu.menuName,
            to: getPathByMenuCode(menu.menuCode),
            menuCode: menu.menuCode,
            menuOrder: menu.menuOrder || 0
        });
    });

    // Sort items inside each category by menuOrder
    categoryMap.forEach(group => {
        group.items.sort((a, b) => a.menuOrder - b.menuOrder);
    });

    // Convert map to array and sort by categoryId
    const navigation: NavigationGroup[] = Array.from(categoryMap.values())
        .sort((a, b) => a.categoryId - b.categoryId);

    // Access Management: Redirect if path not allowed
    useEffect(() => {
        const PAGE_WHITELIST = [
            '/login',
            '/dashboard',
            '/profile',
            '/'
        ];
        const currentPath = location.pathname;

        // Allowed for everyone authenticated
        if (!isAuthenticated) return;
        if (PAGE_WHITELIST.includes(currentPath)) {
            setIsAllowed(true);
            return;
        }

        // Check if current path matches any allowed menu item
        if (menuSet.length > 0) {
            const allowed = menuSet.some(menu => {
                const menuPath = getPathByMenuCode(menu.menuCode);
                return currentPath === menuPath || currentPath.startsWith(`${menuPath}/`);
            });

            setIsAllowed(allowed);
            if (!allowed) {
                console.warn(`Access denied for path: ${currentPath}`);
            }
        } else {
            setIsAllowed(false);
        }
    }, [location.pathname, isAuthenticated, menuSet]);

    const handleLogout = () => {
        showConfirm({
            title: 'Konfirmasi Keluar',
            message: 'Apakah Anda yakin ingin keluar dari sistem SmashClub?',
            confirmText: 'Keluar Sekarang',
            cancelText: 'Batal',
            onConfirm: () => {
                logout();
                navigate('/login');
            }
        });
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
                                    title={isMinimized && !isMobileMenuOpen ? '' : item.name} // Disable default tooltip in minimized mode
                                    data-tooltip={isMinimized && !isMobileMenuOpen ? item.name : undefined}
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
                    </div>
                    <div className="header-right">
                        {/* <button className="icon-btn">
                            <Bell size={20} />
                            <div className="notification-dot"></div>
                        </button>
                        <button className="icon-btn hide-tablet">
                            <Settings size={20} />
                        </button> */}
                        <div className="user-profile" onClick={() => navigate('/profile')} style={{ cursor: 'pointer' }}>
                            <div className="user-info hide-mobile">
                                <span className="user-name">{user?.fullname || 'Admin'}</span>
                                <span className="user-role">{user?.adminRole?.roleName || 'Administrator'}</span>
                            </div>
                            <div className="user-avatar">
                                {user?.profilePicture ? (
                                    <img
                                        src={user.profilePicture}
                                        alt={user.fullname}
                                        className="header-user-avatar-img"
                                    />
                                ) : null}
                            </div>
                        </div>
                    </div>
                </header>
                <main className="content-container">
                    {isAllowed ? <Outlet /> : <AccessDenied />}
                </main>
            </div >
        </div >
    );
};

export default MainLayout;
