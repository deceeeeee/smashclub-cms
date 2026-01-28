import { useState } from 'react';
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
import './Users.css';
// Mock Data
const usersData = [
    {
        id: 1,
        name: 'Budi Santoso',
        email: 'budi.santoso@smashclub.com',
        role: 'SUPER ADMIN',
        status: 'Aktif',
        avatarColor: '#fde047' // Yellowish
    },
    {
        id: 2,
        name: 'Siti Aminah',
        email: 'siti.a@smashclub.com',
        role: 'EDITOR',
        status: 'Aktif',
        avatarColor: '#bfdbfe' // Light Blue
    },
    {
        id: 3,
        name: 'Rian Hidayat',
        email: 'rian.hidayat@smashclub.com',
        role: 'EDITOR',
        status: 'Non-aktif',
        avatarColor: '#bbf7d0' // Light Green
    },
    {
        id: 4,
        name: 'Maya Sari',
        email: 'maya.sari@smashclub.com',
        role: 'SUPER ADMIN',
        status: 'Pending',
        avatarColor: '#fed7aa' // Light Orange
    },
];
const Users = () => {
    const [activeTab, _] = useState('Semua Peran');
    return (
        <div className="users-page">
            {/* Header Section */}
            <div className="page-header">
                <div className="header-text">
                    <h1>Manajemen Pengguna Dashboard</h1>
                    <p>Kelola akses dan peran admin untuk sistem SmashClub</p>
                </div>
                <button className="btn-primary">
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
                        <span className="stat-label-sm">Total Admin</span>
                        <span className="stat-number">24</span>
                    </div>
                </div>
                <div className="stat-card-simple bg-dark-teal">
                    <div className="stat-icon-square icon-green">
                        <Edit3 size={20} />
                    </div>
                    <div className="stat-info">
                        <span className="stat-label-sm">Editor Aktif</span>
                        <span className="stat-number">18</span>
                    </div>
                </div>
                <div className="stat-card-simple bg-dark-teal">
                    <div className="stat-icon-square icon-yellow">
                        <Mail size={20} />
                    </div>
                    <div className="stat-info">
                        <span className="stat-label-sm">Undangan Tertunda</span>
                        <span className="stat-number">2</span>
                    </div>
                </div>
            </div>
            {/* Main Content Card */}
            <div className="content-card">
                {/* Toolbar */}
                <div className="toolbar">
                    <div className="search-bar-user">
                        <Search size={18} className="search-icon" />
                        <input type="text" placeholder="Cari nama atau email pengguna..." />
                    </div>
                    <div className="filter-group">
                        <button
                            className={`filter-btn-teal ${activeTab === 'Semua Peran' ? 'active' : ''}`}
                        >
                            Semua Peran <ChevronDown size={14} className="ml-1" />
                        </button>
                        <button className="filter-btn-dark">
                            Super Admin <ChevronDown size={14} className="ml-1" />
                        </button>
                        <button className="filter-btn-dark">
                            Editor <ChevronDown size={14} className="ml-1" />
                        </button>
                    </div>
                </div>
                {/* Table */}
                <div className="table-container">
                    <table className="user-table">
                        <thead>
                            <tr>
                                <th style={{ width: '25%' }}>NAMA PENGGUNA</th>
                                <th style={{ width: '30%' }}>EMAIL</th>
                                <th style={{ width: '15%' }}>PERAN</th>
                                <th style={{ width: '15%' }}>STATUS</th>
                                <th style={{ width: '15%', textAlign: 'center' }}>AKSI</th>
                            </tr>
                        </thead>
                        <tbody>
                            {usersData.map((user) => (
                                <tr key={user.id}>
                                    <td>
                                        <div className="user-cell">
                                            <div className="user-avatar-sm" style={{ backgroundColor: user.avatarColor }}>
                                                {/* Avatar placeholder with initials or image */}
                                                <img
                                                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                                                    alt="avatar"
                                                    className="avatar-img"
                                                />
                                            </div>
                                            <span className="user-name">{user.name}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="email-text">{user.email}</span>
                                    </td>
                                    <td>
                                        <span className={`role-badge ${user.role === 'SUPER ADMIN' ? 'role-super' : 'role-editor'}`}>
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
                                            <button className="btn-icon-action"><Edit2 size={16} /></button>
                                            <button className="btn-icon-action btn-delete"><Trash2 size={16} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {/* Pagination */}
                <div className="pagination-bar">
                    <div className="pagination-info">
                        Menampilkan 1 sampai 4 dari 24 pengguna
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
    );
};
export default Users;