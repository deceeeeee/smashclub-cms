import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    Plus,
    Edit2,
    Trash2,
    Users,
    Key,
    Clock,
    Search,
    Loader2,
    ChevronRight,
    ChevronLeft
} from 'lucide-react';
import { useRolesStore } from '../../features/roles/roles.store';
import { useConfirmStore } from '../../app/confirm.store';
import { roleStyleMap } from '../../components/icons/RoleStyles';
import './Roles.css';

const Roles = () => {
    const navigate = useNavigate();
    const { roles, isLoading, error, getRoles, deleteRole, totalElements, totalPages } = useRolesStore();
    const { showConfirm } = useConfirmStore();

    const [search, setSearch] = useState('');
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(25);
    const [debouncedSearch, setDebouncedSearch] = useState('');

    // Debounce search input
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
            setPage(0); // Reset to first page on new search
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    useEffect(() => {
        getRoles(debouncedSearch, page, size);
    }, [getRoles, debouncedSearch, page, size]);

    const handleEdit = (id: number) => {
        navigate(`/roles/edit/${id}`);
    };

    const handleDelete = (id: number) => {
        showConfirm({
            title: 'Hapus Data?',
            message: 'Apakah Anda yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan dan data akan hilang permanen dari sistem SmashClub.',
            onConfirm: async () => {
                const result = await deleteRole(id);
                if (result.success) {
                    getRoles(debouncedSearch, page, size);
                }
            }
        });
    };

    return (
        <div className="roles-page">
            <div className="page-content">
                {/* Breadcrumbs */}
                <nav className="breadcrumbs">
                    <Link to="/dashboard">Beranda</Link>
                    <span className="separator">›</span>
                    <span>Pengaturan</span>
                    <span className="separator">›</span>
                    <span className="current">Manajemen Peran</span>
                </nav>

                {/* Header Section */}
                <div className="page-header">
                    <div className="header-text">
                        <h1>Manajemen Peran</h1>
                        <p>Kelola hak akses dan tanggung jawab pengguna dalam sistem SmashClub untuk menjaga keamanan data operasional.</p>
                    </div>
                    <button className="btn-primary" onClick={() => navigate('/roles/add')}>
                        <Plus size={18} />
                        <span>Tambah Peran Baru</span>
                    </button>
                </div>

                <div className="content-card">
                    {/* Filter & Search Bar */}
                    <div className="filter-bar">
                        <div className="search-bar">
                            <Search size={18} className="search-icon" />
                            <input
                                type="text"
                                placeholder="Cari fitur, peran, atau user..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <div className="size-selector">
                            <span>Tampilkan:</span>
                            <select
                                value={size}
                                onChange={(e) => {
                                    setSize(Number(e.target.value));
                                    setPage(0);
                                }}
                                className="page-size-select"
                            >
                                <option value={1}>1</option>
                                <option value={10}>10</option>
                                <option value={25}>25</option>
                                <option value={50}>50</option>
                                <option value={100}>100</option>
                            </select>
                            <span>per halaman</span>
                        </div>
                    </div>

                    {/* Table Card */}
                    <div className="table-card">
                        {error && (
                            <div className="error-message" style={{ padding: '1rem', color: '#ef4444', textAlign: 'center' }}>
                                {error}
                            </div>
                        )}

                        <table className="roles-table">
                            <thead>
                                <tr>
                                    <th>NAMA PERAN</th>
                                    <th style={{ textAlign: 'center' }}>AKSI</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={2} style={{ textAlign: 'center', padding: '3rem' }}>
                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                                                <Loader2 className="animate-spin" size={32} />
                                                <span>Memuat data...</span>
                                            </div>
                                        </td>
                                    </tr>
                                ) : roles.length === 0 ? (
                                    <tr>
                                        <td colSpan={2} style={{ textAlign: 'center', padding: '3rem' }}>
                                            Belum ada data peran.
                                        </td>
                                    </tr>
                                ) : (
                                    roles.map((role) => {
                                        const style = roleStyleMap[role.roleCode] || { icons: '👤', color: '#94a3b8' };
                                        return (
                                            <tr key={role.id}>
                                                <td>
                                                    <div className="role-name-cell">
                                                        <div className="role-icon-box" style={{ backgroundColor: `${style.color}20` }}>
                                                            <span style={{ fontSize: '1.2rem' }}>{style.icons}</span>
                                                        </div>
                                                        <span className="role-name">{role.roleName}</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="action-buttons">
                                                        <button className="btn-icon" onClick={() => handleEdit(role.id)}>
                                                            <Edit2 size={16} />
                                                        </button>
                                                        <button className="btn-icon" onClick={() => handleDelete(role.id)}>
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>

                        {/* Footer Info & Pagination */}
                        {/* Pagination */}
                        <div className="pagination-bar">
                            <div className="pagination-info">
                                Menampilkan <strong>{roles.length > 0 ? page * size + 1 : 0}</strong> - <strong>{page * size + roles.length}</strong> dari <strong>{totalElements}</strong> peran
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

                {/* Bottom Stats Grid */}
                <div className="stats-grid">
                    {/* <div className="stats-card">
                        <div className="stats-icon green">
                            <Users size={24} />
                        </div>
                        <div className="stats-info">
                            <span className="stats-label">TOTAL USER AKTIF</span>
                            <span className="stats-value">10</span>
                        </div>
                    </div>
                    <div className="stats-card">
                        <div className="stats-icon green">
                            <Key size={24} />
                        </div>
                        <div className="stats-info">
                            <span className="stats-label">IZIN TERKONFIGURASI</span>
                            <span className="stats-value">42</span>
                        </div>
                    </div> */}
                    {/* <div className="stats-card">
                        <div className="stats-icon green">
                            <Clock size={24} />
                        </div>
                        <div className="stats-info">
                            <span className="stats-label">UPDATE TERAKHIR</span>
                            <span className="stats-value">2 Jam Lalu</span>
                        </div>
                    </div> */}
                </div>

                <div className="copyright-footer">
                    © 2024 SmashClub CMS. Versi 2.4.0-Stable. Dibuat dengan dedikasi untuk olahraga Indonesia.
                </div>
            </div>
        </div>
    );
};

export default Roles;

