import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    Search,
    Filter,
    Download,
    ChevronLeft,
    ChevronRight,
    Edit2,
    Trash2,
    Loader2,
    AlertCircle
} from 'lucide-react';
import { useConfirmStore } from '../../app/confirm.store';
import { useAuthStore } from '../../features/auth/auth.store';
import './Players.css';
import { usePlayerStore } from '../../features/player/player.store';
import { useDebounce } from '../../hooks/useDebounce';
import { PAGE_SIZE_OPTIONS } from '../../constant/pagination';

const Players = () => {
    const navigate = useNavigate();
    const {
        players,
        isLoading,
        getPlayers,
        // deletePlayer, 
        totalElements,
        totalPages
    } = usePlayerStore();

    const { showConfirm } = useConfirmStore();
    const { hasPermission } = useAuthStore();

    const [search, setSearch] = useState('');
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(25);

    const canEdit = hasPermission('PLAYER_EDIT');
    const canDelete = hasPermission('PLAYER_DELETE');

    const debouncedSearch = useDebounce(search, 500);

    useEffect(() => {
        getPlayers(debouncedSearch, page, size);
    }, [debouncedSearch, page, size, getPlayers]);

    const handleEdit = (id: string) => {
        navigate(`/players/edit/${id}`);
    };

    const handleDelete = (
        id: string
    ) => {
        showConfirm({
            title: 'Hapus Data?',
            message: 'Apakah Anda yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan dan data akan hilang permanen dari sistem SmashClub.',
            onConfirm: () => {
                // deletePlayer(id);
                console.log(id);
            }
        });
    };

    const handlePageChange = (newPage: number) => {
        if (newPage >= 0 && newPage < totalPages) {
            setPage(newPage);
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
                    <h2 className="stat-value">{totalElements}</h2>
                </div>
                <div className="stat-card">
                    <span className="stat-label">Pemain Aktif</span>
                    <h2 className="stat-value">{totalElements}</h2>
                </div>
            </div>

            <div className="content-container-card">
                <div className="toolbar">
                    <div className="search-bar">
                        <Search size={18} className="search-icon" />
                        <input
                            type="text"
                            placeholder="Cari nama atau ID pemain..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="toolbar-actions">
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
                        </div>
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
                            {isLoading ? (
                                <tr>
                                    <td colSpan={6} style={{ textAlign: 'center', padding: '3rem' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                                            <Loader2 className="animate-spin" size={32} />
                                            <span>Memuat data pemain...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : players.length === 0 ? (
                                <tr>
                                    <td colSpan={6} style={{ textAlign: 'center', padding: '3rem' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', opacity: 0.5 }}>
                                            <AlertCircle size={40} />
                                            <span>Tidak ada data pemain ditemukan.</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                players.map((player) => (
                                    <tr key={player.id}>
                                        <td>{player.id}</td>
                                        <td>
                                            <div className="player-info-cell">
                                                <span className="player-name-text">{player.fullName}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <span className={'email-text'}>
                                                {player.email}
                                            </span>
                                        </td>
                                        <td>{player.createdAt}</td>
                                        <td>
                                            <span className={`status-badge ${player.status ? 'status-active' : 'status-inactive'}`}>
                                                {player.status ? 'Aktif' : 'Tidak Aktif'}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="action-buttons">
                                                {canEdit && (
                                                    <button className="btn-icon-action" onClick={() => handleEdit(player.id)} title="Edit">
                                                        <Edit2 size={16} />
                                                    </button>
                                                )}
                                                {canDelete && (
                                                    <button className="btn-icon-action btn-delete" onClick={() => handleDelete(player.id)} title="Hapus">
                                                        <Trash2 size={16} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>

                    {/* Pagination */}
                    {!isLoading && totalElements > 0 && (
                        <div className="pagination-bar">
                            <div className="pagination-info">
                                Menampilkan <strong>{(page * size) + 1}</strong> - <strong>{Math.min((page + 1) * size, totalElements)}</strong> dari <strong>{totalElements}</strong> pemain
                            </div>
                            <div className="pagination-controls">
                                <button
                                    className="pagination-btn"
                                    onClick={() => handlePageChange(page - 1)}
                                    disabled={page === 0}
                                >
                                    <ChevronLeft size={16} />
                                </button>
                                {[...Array(totalPages)].map((_, i) => (
                                    <button
                                        key={i}
                                        className={`pagination-btn ${page === i ? 'active' : ''}`}
                                        onClick={() => handlePageChange(i)}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                                <button
                                    className="pagination-btn"
                                    onClick={() => handlePageChange(page + 1)}
                                    disabled={page === totalPages - 1}
                                >
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Players;
