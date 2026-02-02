import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    Plus,
    Edit2,
    Trash2,
    Users,
    Key,
    Clock,
    Search
} from 'lucide-react';
import './Roles.css';

const rolesData = [
    {
        id: 1,
        name: 'Super Admin',
        userCount: 2,
        description: 'Akses penuh ke seluruh fitur dan pengaturan sistem, termasuk laporan finansial.',
        icon: '🛡️',
        color: '#10b981'
    },
    {
        id: 2,
        name: 'Admin Lapangan',
        userCount: 5,
        description: 'Mengelola jadwal, booking, dan status operasional lapangan secara real-time.',
        icon: '🏟️',
        color: '#3b82f6'
    },
    {
        id: 3,
        name: 'Kasir',
        userCount: 3,
        description: 'Menangani transaksi pembayaran member, tamu, dan laporan harian POS.',
        icon: '💰',
        color: '#f59e0b'
    }
];

const Roles = () => {
    const navigate = useNavigate();
    const [roles, setRoles] = useState(rolesData);

    const handleEdit = (id: number) => {
        navigate(`/roles/edit/${id}`);
    };

    const handleDelete = (id: number) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus peran ini?')) {
            setRoles(roles.filter(r => r.id !== id));
        }
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

                {/* Filter & Search Bar */}
                <div className="filter-bar">
                    <div className="search-bar">
                        <Search size={18} className="search-icon" />
                        <input type="text" placeholder="Cari fitur, peran, atau user..." />
                    </div>
                </div>

                {/* Table Card */}
                <div className="table-card">
                    <table className="roles-table">
                        <thead>
                            <tr>
                                <th>NAMA PERAN</th>
                                <th>JUMLAH PENGGUNA</th>
                                <th>DESKRIPSI SINGKAT</th>
                                <th style={{ textAlign: 'center' }}>AKSI</th>
                            </tr>
                        </thead>
                        <tbody>
                            {roles.map((role) => (
                                <tr key={role.id}>
                                    <td>
                                        <div className="role-name-cell">
                                            <div className="role-icon-box" style={{ backgroundColor: `${role.color}20` }}>
                                                <span style={{ fontSize: '1.2rem' }}>{role.icon}</span>
                                            </div>
                                            <span className="role-name">{role.name}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="user-count-badge">{role.userCount} Pengguna</span>
                                    </td>
                                    <td>
                                        <p className="role-desc">{role.description}</p>
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
                            ))}
                        </tbody>
                    </table>

                    {/* Footer Info & Pagination */}
                    <div className="table-footer">
                        <div className="count-info">
                            Menampilkan {roles.length} dari {roles.length} peran terdaftar
                        </div>
                        <div className="pagination">
                            <button className="p-btn">Sebelumnya</button>
                            <button className="p-btn active">1</button>
                            <button className="p-btn">Selanjutnya</button>
                        </div>
                    </div>
                </div>

                {/* Bottom Stats Grid */}
                <div className="stats-grid">
                    <div className="stats-card">
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
                    </div>
                    <div className="stats-card">
                        <div className="stats-icon green">
                            <Clock size={24} />
                        </div>
                        <div className="stats-info">
                            <span className="stats-label">UPDATE TERAKHIR</span>
                            <span className="stats-value">2 Jam Lalu</span>
                        </div>
                    </div>
                </div>

                <div className="copyright-footer">
                    © 2024 SmashClub CMS. Versi 2.4.0-Stable. Dibuat dengan dedikasi untuk olahraga Indonesia.
                </div>
            </div>
        </div>
    );
};

export default Roles;
