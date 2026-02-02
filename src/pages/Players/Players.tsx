import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    Search,
    Filter,
    Download,
    ChevronLeft,
    ChevronRight,
    Edit2,
    Trash2
} from 'lucide-react';
import './Players.css';

const playersData = [
    { id: 'SC-001', name: 'Budi Santoso', contact: '+62 812-3456-7890', joinDate: '12 Jan 2024', status: 'Aktif', avatar: 'BS', avatarColor: '#0d9488' },
    { id: 'SC-002', name: 'Siti Aminah', contact: 'siti.a@email.com', joinDate: '15 Jan 2024', status: 'Aktif', avatar: 'SA', avatarColor: '#0f766e' },
    { id: 'SC-003', name: 'Andi Wijaya', contact: '+62 857-1122-3344', joinDate: '02 Feb 2024', status: 'Non-Aktif', avatar: 'AW', avatarColor: '#115e59' },
    { id: 'SC-004', name: 'Dewi Lestari', contact: 'dewi.l@email.com', joinDate: '10 Feb 2024', status: 'Aktif', avatar: 'DL', avatarColor: '#134e4a' },
    { id: 'SC-005', name: 'Rizky Pratama', contact: '+62 813-9988-7766', joinDate: '20 Feb 2024', status: 'Aktif', avatar: 'RP', avatarColor: '#0f766e' },
];

const Players = () => {
    const navigate = useNavigate();
    const [players, setPlayers] = useState(playersData);

    const handleEdit = (id: string) => {
        navigate(`/players/edit/${id}`);
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus data pemain ini?')) {
            setPlayers(players.filter(p => p.id !== id));
        }
    };

    return (
        <div className="players-page">
            {/* Breadcrumbs */}
            <nav className="breadcrumbs">
                <Link to="/dashboard">Beranda</Link>
                <span className="separator">›</span>
                <span>Laporan</span>
                <span className="separator">›</span>
                <span className="current">Data Pemain</span>
            </nav>

            {/* Header Section */}
            <div className="page-header">
                <div className="header-text">
                    <h1>Manajemen Pemain</h1>
                    <p>Kelola informasi anggota dan status keanggotaan SmashClub.</p>
                </div>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <span className="stat-label">Total Pemain</span>
                    <h2 className="stat-value">1,248</h2>
                </div>
                <div className="stat-card">
                    <span className="stat-label">Pemain Aktif</span>
                    <h2 className="stat-value">1,102</h2>
                </div>
                <div className="stat-card">
                    <span className="stat-label">Baru (Bulan Ini)</span>
                    <h2 className="stat-value text-primary">+34</h2>
                </div>
            </div>

            <div className="content-container-card">
                <div className="toolbar">
                    <div className="search-bar">
                        <Search size={18} className="search-icon" />
                        <input type="text" placeholder="Cari nama atau ID pemain..." />
                    </div>
                    <div className="toolbar-actions">
                        <button className="btn-secondary">
                            <Filter size={18} />
                            <span>Filter</span>
                        </button>
                        <button className="btn-secondary">
                            <Download size={18} />
                            <span>Ekspor</span>
                        </button>
                    </div>
                </div>

                <div className="table-responsive">
                    <table className="players-table">
                        <thead>
                            <tr>
                                <th>ID KEANGGOTAAN</th>
                                <th>NAMA LENGKAP</th>
                                <th>KONTAK</th>
                                <th>BERGABUNG</th>
                                <th>STATUS</th>
                                <th>AKSI</th>
                            </tr>
                        </thead>
                        <tbody>
                            {players.map((player) => (
                                <tr key={player.id}>
                                    <td>{player.id}</td>
                                    <td>
                                        <div className="player-info-cell">
                                            <div className="player-avatar-circle" style={{ backgroundColor: player.avatarColor }}>
                                                {player.avatar}
                                            </div>
                                            <span className="player-name-text">{player.name}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <span className={player.contact.includes('@') ? 'email-text' : 'phone-text'}>
                                            {player.contact}
                                        </span>
                                    </td>
                                    <td>{player.joinDate}</td>
                                    <td>
                                        <span className={`status-badge ${player.status === 'Aktif' ? 'status-active' : 'status-inactive'}`}>
                                            {player.status}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="action-buttons">
                                            <button className="btn-icon-action" onClick={() => handleEdit(player.id)}><Edit2 size={16} /></button>
                                            <button className="btn-icon-action btn-delete" onClick={() => handleDelete(player.id)}><Trash2 size={16} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="pagination-wrapper">
                    <span className="pagination-info">Menampilkan 1-5 dari 1,248 pemain</span>
                    <div className="pagination-controls">
                        <button className="pagination-btn"><ChevronLeft size={16} /></button>
                        <button className="pagination-btn active">1</button>
                        <button className="pagination-btn">2</button>
                        <button className="pagination-btn">3</button>
                        <span className="pagination-ellipsis">...</span>
                        <button className="pagination-btn">250</button>
                        <button className="pagination-btn"><ChevronRight size={16} /></button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Players;
