import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    Plus,
    Search,
    ChevronDown,
    Edit2,
    Trash2,
    ChevronLeft,
    ChevronRight,
    ShieldCheck,
    Edit3,
    Mail
} from 'lucide-react';
import { useConfirmStore } from '../../app/confirm.store';
import './Users.css';

// Mock Data
const usersData = [
    {
        id: 1,
        name: 'Budi Santoso',
        email: 'budi.santoso@smashclub.com',
        role: 'Admin',
        status: 'Aktif',
        avatarColor: '#fde047' // Yellowish
    },
    {
        id: 2,
        name: 'Siti Aminah',
        email: 'siti.a@smashclub.com',
        role: 'User',
        status: 'Aktif',
        avatarColor: '#bfdbfe' // Light Blue
    },
    {
        id: 3,
        name: 'Rian Hidayat',
        email: 'rian.hidayat@smashclub.com',
        role: 'User',
        status: 'Non-aktif',
        avatarColor: '#bbf7d0' // Light Green
    },
    {
        id: 4,
        name: 'Maya Sari',
        email: 'maya.sari@smashclub.com',
        role: 'Admin',
        status: 'Pending',
        avatarColor: '#fed7aa' // Light Orange
    },
];

const Users = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState(usersData);
    const [activeTab, setActiveTab] = useState('Semua Peran');

    const { showConfirm } = useConfirmStore();

    const handleEdit = (id: number) => {
        navigate(`/users/edit/${id}`);
    };

    const handleDelete = (id: number) => {
        showConfirm({
            title: 'Hapus Data?',
            message: 'Apakah Anda yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan dan data akan hilang permanen dari sistem SmashClub.',
            onConfirm: () => {
                setUsers(users.filter(u => u.id !== id));
            }
        });
    };

    const filteredUsers = users.filter((item) => {
        if (activeTab == "Semua Peran") {
            return item;
        }
        return item.role == activeTab;
    });

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
                <button className="btn-primary" onClick={() => navigate('/users/add')}>
                    <Plus size={18} />
                    <span>Tambah Pengguna</span>
                </button>
            </div>
            {/* Stats Cards */}
            <div className="stats-row">
                <div className="stat-card-simple bg-dark-teal">
                    <div className="stat-icon-square icon-teal">
                        <ShieldCheck size={20} />
                    </div>
                    <div className="stat-info">
                        <span className="stat-label-sm">Total User</span>
                        <span className="stat-number">24</span>
                    </div>
                </div>
            </div>
            {/* Main Content Card */}
            <div className="content-card">
                {/* Toolbar */}
                <div className="toolbar">
                    <div className="search-bar">
                        <Search size={18} className="search-icon" />
                        <input type="text" placeholder="Cari nama atau email pengguna..." />
                    </div>
                    <div className="filter-group">
                        <button
                            className={`${activeTab === 'Semua Peran' ? 'filter-btn-teal' : 'filter-btn-dark'}`}
                            onClick={() => setActiveTab('Semua Peran')}
                        >
                            Semua Peran
                        </button>
                        <button className={`${activeTab === 'Admin' ? 'filter-btn-teal' : 'filter-btn-dark'}`} onClick={() => setActiveTab('Admin')}>
                            Admin
                        </button>
                        <button className={`${activeTab === 'User' ? 'filter-btn-teal' : 'filter-btn-dark'}`} onClick={() => setActiveTab('User')}>
                            User
                        </button>
                    </div>
                </div>
                {/* Table */}
                <div className="table-container">
                    <table className="user-table">
                        <thead>
                            <tr>
                                <th style={{ width: '25%' }}>NAMA PENGGUNA</th>
                                <th style={{ width: '15%' }}>PERAN</th>
                                <th style={{ width: '15%' }}>STATUS</th>
                                <th style={{ width: '15%', textAlign: 'center' }}>AKSI</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map((user) => (
                                <tr key={user.id}>
                                    <td>
                                        <div className="user-cell">
                                            <span className="user-name">{user.name}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`role-badge ${user.role === 'Admin' ? 'role-super' : 'role-editor'}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="status-cell">
                                            <span className={`status-dot ${user.status === 'Aktif' ? 'dot-active' :
                                                user.status === 'Non-aktif' ? 'dot-inactive' : 'dot-pending'
                                                }`}></span>
                                            <span className="status-text">{user.status}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="action-buttons">
                                            <button className="btn-icon-action" onClick={() => handleEdit(user.id)}><Edit2 size={16} /></button>
                                            <button className="btn-icon-action btn-delete" onClick={() => handleDelete(user.id)}><Trash2 size={16} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {/* Pagination */}
                    <div className="pagination-bar">
                        <div className="pagination-info">
                            Menampilkan 1 sampai 4 dari {filteredUsers.length} pengguna
                        </div>
                        <div className="pagination-controls">
                            <button className="pagination-btn"><ChevronLeft size={16} /></button>
                            <button className="pagination-btn active-page">1</button>
                            <button className="pagination-btn">2</button>
                            <button className="pagination-btn">3</button>
                            <button className="pagination-btn"><ChevronRight size={16} /></button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Users;