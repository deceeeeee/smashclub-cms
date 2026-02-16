import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    Plus,
    Search,
    Edit2,
    Trash2,
    ChevronLeft,
    ChevronRight,
    ShieldCheck,
    Loader2,
    AlertCircle
} from 'lucide-react';
import { useAuthStore } from '../../features/auth/auth.store';
import { useUsersStore } from '../../features/users/users.store';
import { useConfirmStore } from '../../app/confirm.store';
import { STATUS_OPTIONS, getStatusLabel } from '../../constant/flags';
import { PAGE_SIZE_OPTIONS } from '../../constant/pagination';
import './Users.css';

const Users = () => {
    const navigate = useNavigate();
    const { users, isLoading, getUsers, deleteUser, totalElements, totalPages } = useUsersStore();
    const { showConfirm } = useConfirmStore();
    const { hasPermission } = useAuthStore();

    const [search, setSearch] = useState('');
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(25);
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [status, setStatus] = useState<number | null>(null);

    const canCreate = hasPermission('USERS_CREATE');
    const canEdit = hasPermission('USERS_EDIT');
    const canDelete = hasPermission('USERS_DELETE');

    // Debounce search input
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
            setPage(0); // Reset to first page on new search
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    useEffect(() => {
        getUsers(debouncedSearch, status, page, size);
    }, [getUsers, debouncedSearch, status, page, size]);

    const handleEdit = (id: number) => {
        navigate(`/users/edit/${id}`);
    };

    const handleDelete = (id: number) => {
        showConfirm({
            title: 'Hapus Data?',
            message: 'Apakah Anda yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan dan data akan hilang permanen dari sistem SmashClub.',
            onConfirm: async () => {
                const result = await deleteUser(id);
                if (result.success) {
                    getUsers(debouncedSearch, page, size);
                }
            }
        });
    };

    return (
        <div className="users-page">
            {/* Breadcrumbs */}
            <nav className="breadcrumbs">
                <Link to="/dashboard">Beranda</Link>
                <span className="separator">›</span>
                <span>Manajemen Pengguna</span>
                <span className="separator">›</span>
                <span className="current">Pengguna</span>
            </nav>

            {/* Header Section */}
            <div className="page-header">
                <div className="header-text">
                    <h1>Manajemen Pengguna Dashboard</h1>
                    <p>Kelola akses dan peran admin untuk sistem SmashClub</p>
                </div>
                {canCreate && (
                    <button className="btn-primary" onClick={() => navigate('/users/add')}>
                        <Plus size={18} />
                        <span>Tambah Pengguna</span>
                    </button>
                )}
            </div>
            {/* Stats Cards */}
            <div className="stats-row">
                <div className="stat-card-simple bg-dark-teal">
                    <div className="stat-icon-square icon-teal">
                        <ShieldCheck size={20} />
                    </div>
                    <div className="stat-info">
                        <span className="stat-label-sm">Total User</span>
                        <span className="stat-number">{totalElements}</span>
                    </div>
                </div>
            </div>
            {/* Main Content Card */}
            <div className="content-card">
                {/* Filter & Search Bar */}
                <div className="filter-bar">
                    <div className="toolbar-actions">
                        <div className="search-bar">
                            <Search size={18} className="search-icon" />
                            <input
                                type="text"
                                placeholder="Cari user..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <div className="custom-selector">
                            <span>Status:</span>
                            <select
                                value={status != null ? status : ""}
                                onChange={(e) => {
                                    setStatus(Number(e.target.value));
                                    setPage(0);
                                }}
                                className="custom-select"
                            >
                                <option value="">Semua</option>
                                {
                                    STATUS_OPTIONS.map((item, index) => {
                                        return (
                                            <option key={index} value={item.value}>{item.label}</option>
                                        )
                                    })
                                }
                            </select>
                        </div>
                    </div>
                    <div className="custom-selector">
                        <span>Tampilkan:</span>
                        <select
                            value={size}
                            onChange={(e) => {
                                setSize(Number(e.target.value));
                                setPage(0);
                            }}
                            className="custom-select"
                        >
                            {PAGE_SIZE_OPTIONS.map((option) => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>
                        <span>per halaman</span>
                    </div>
                </div>
                {/* Table */}
                <div className="table-container">
                    <table className="user-table">
                        <thead>
                            <tr>
                                <th className="col-avatar">AVATAR</th>
                                <th style={{ width: '40%' }}>NAMA PENGGUNA</th>
                                <th style={{ width: '15%' }}>PERAN</th>
                                <th style={{ width: '15%' }}>STATUS</th>
                                <th style={{ width: '15%', textAlign: 'center' }}>AKSI</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="loading-cell-container">
                                        <div className="loading-cell-content">
                                            <Loader2 className="animate-spin" size={32} />
                                            <span>Memuat data...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : users.length === 0 ? (
                                <tr>
                                    <td colSpan={5} style={{ textAlign: 'center', padding: '3rem' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', opacity: 0.5 }}>
                                            <AlertCircle size={40} />
                                            <span>Tidak ada data pengguna ditemukan.</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                users.map((user) => (
                                    <tr key={user.id}>
                                        <td>
                                            <div className="users-avatar-container">
                                                <div className="users-avatar-wrapper">
                                                    {user.profilePicture ? (
                                                        <img
                                                            src={user.profilePicture}
                                                            alt={user.fullName}
                                                            className="users-avatar-img"
                                                        />
                                                    ) : (
                                                        <span className="users-avatar-placeholder">NA</span>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="user-cell">
                                                <div className="user-info-text">
                                                    <span className="user-name">{user.fullName}</span>
                                                    <span className="user-email-text">{user.username}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`role-badge ${user.adminRole.roleCode === 'DEV' ? 'role-super' : 'role-editor'}`}>
                                                {user.adminRole.roleName}
                                            </span>
                                        </td>
                                        <td>
                                            <div className={`status-badge ${user.status === 1 ? 'status-active' : 'status-inactive'}`}>
                                                <span className="status-dot"></span>
                                                <span className="status-text">{getStatusLabel(user.status)}</span>
                                            </div>
                                        </td>
                                        <td>
                                            {
                                                user.adminRole.roleCode === "DEV" ? "" : (
                                                    <div className="action-buttons">
                                                        {canEdit && (
                                                            <button className="btn-icon-action" onClick={() => handleEdit(user.id)} title="Edit">
                                                                <Edit2 size={16} />
                                                            </button>
                                                        )}
                                                        {canDelete && (
                                                            <button className="btn-icon-action btn-delete" onClick={() => handleDelete(user.id)} title="Hapus">
                                                                <Trash2 size={16} />
                                                            </button>
                                                        )}
                                                    </div>
                                                )
                                            }
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                    {/* Pagination */}
                    <div className="pagination-bar">
                        <div className="pagination-info">
                            Menampilkan <strong>{users.length > 0 ? page * size + 1 : 0}</strong> - <strong>{page * size + users.length}</strong> dari <strong>{totalElements}</strong> pengguna
                        </div>
                        <div className="pagination-controls">
                            <button
                                className="pagination-btn"
                                disabled={page === 0 || isLoading}
                                onClick={() => setPage(p => p - 1)}
                            >
                                <ChevronLeft size={16} />
                            </button>

                            {[...Array(totalPages)].map((_, i) => (
                                <button
                                    key={i}
                                    className={`pagination-btn ${page === i ? 'active-page' : ''}`}
                                    onClick={() => setPage(i)}
                                    disabled={isLoading}
                                >
                                    {i + 1}
                                </button>
                            ))}

                            <button
                                className="pagination-btn"
                                disabled={page >= totalPages - 1 || isLoading}
                                onClick={() => setPage(p => p + 1)}
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Users;