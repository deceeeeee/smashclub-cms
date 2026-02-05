import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    Plus,
    Search,
    Star,
    Edit2,
    Trash2,
    LayoutGrid,
    List,
    UserPlus,
    ChevronLeft,
    ChevronRight,
    Loader2,
    AlertCircle
} from 'lucide-react';
import { useConfirmStore } from '../../app/confirm.store';
import { useTrainersStore } from '../../features/trainers/trainers.store';
import { useDebounce } from '../../hooks/useDebounce';
import './Trainers.css';

const Trainers = () => {
    const navigate = useNavigate();
    const { trainers, isLoading, getTrainers, deleteTrainer, totalElements, totalPages } = useTrainersStore();
    const { showConfirm } = useConfirmStore();

    const [search, setSearch] = useState('');
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(12);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    const debouncedSearch = useDebounce(search, 500);

    useEffect(() => {
        getTrainers(debouncedSearch, page, size);
    }, [debouncedSearch, page, size, getTrainers]);

    const handleEdit = (id: number) => {
        navigate(`/trainers/edit/${id}`);
    };

    const handleDelete = (id: number) => {
        showConfirm({
            title: 'Hapus Data?',
            message: 'Apakah Anda yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan dan data akan hilang permanen dari sistem SmashClub.',
            onConfirm: async () => {
                const result = await deleteTrainer(id);
                if (result.success) {
                    getTrainers(debouncedSearch, page, size);
                }
            }
        });
    };

    const handlePageChange = (newPage: number) => {
        if (newPage >= 0 && newPage < totalPages) {
            setPage(newPage);
        }
    };

    // Helper to get random avatar URL based on coachCode/ID
    const avatarSeeds: Record<number | string, string> = {
        1: "a042",
        2: "a045",
        3: "trainer-3"
    };

    const getAvatarUrl = (id: number | string) => {
        const seed = avatarSeeds[id as keyof typeof avatarSeeds] || `trainer-${id}`;
        return `https://i.pravatar.cc/300?u=${seed}`;
    };

    return (
        <div className="trainers-page">
            {/* Breadcrumbs */}
            <nav className="breadcrumbs">
                <Link to="/dashboard">Beranda</Link>
                <span className="separator">›</span>
                <span>Master Data</span>
                <span className="separator">›</span>
                <span className="current">Pelatih</span>
            </nav>

            {/* Page Header */}
            <div className="page-header">
                <div className="header-text">
                    <h1>Manajemen Pelatih</h1>
                    <p>Kelola data pelatih, spesialisasi, dan jadwal ketersediaan mereka.</p>
                </div>
                <button className="btn-primary" onClick={() => navigate('/trainers/add')}>
                    <Plus size={18} />
                    <span>Tambah Pelatih Baru</span>
                </button>
            </div>

            {/* Filter & View Toggle */}
            <div className="filters-toolbar">
                <div className="search-bar">
                    <Search size={18} className="search-icon" />
                    <input
                        type="text"
                        placeholder="Cari pelatih berdasarkan nama..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="view-toggle">
                    <span className="view-label">Tampilan:</span>
                    <div className="toggle-group">
                        <button
                            className={`toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
                            onClick={() => setViewMode('grid')}
                        >
                            <LayoutGrid size={18} />
                        </button>
                        <button
                            className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
                            onClick={() => setViewMode('list')}
                        >
                            <List size={18} />
                        </button>
                    </div>
                </div>
            </div>
            {/* Main Content */}
            {isLoading ? (
                <div className="loading-container" style={{ display: 'flex', justifyContent: 'center', padding: '5rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                        <Loader2 className="animate-spin" size={40} />
                        <span>Memuat data pelatih...</span>
                    </div>
                </div>
            ) : trainers.length === 0 ? (
                <div className="empty-container" style={{ display: 'flex', justifyContent: 'center', padding: '5rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', opacity: 0.5 }}>
                        <AlertCircle size={48} />
                        <span>Tidak ada data pelatih ditemukan.</span>
                    </div>
                </div>
            ) : viewMode === 'grid' ? (
                <div className="trainers-grid">
                    {trainers.map((trainer) => (
                        <div key={trainer.id} className="trainer-card">
                            <div className="card-image-container">
                                <div className="rating-badge">
                                    <Star size={12} fill="#fbbf24" stroke="#fbbf24" />
                                    <span>{4.5 + (trainer.id % 5) / 10}</span>
                                </div>
                                <div className="trainer-img-wrapper">
                                    <img src={getAvatarUrl(trainer.id)} alt={trainer.coachName} className="trainer-avatar-img" />
                                </div>
                            </div>

                            <div className="card-content">
                                <h3 className="trainer-name">{trainer.coachName}</h3>
                                <p className="trainer-specialist">{trainer.coachCode}</p>

                                <div className="card-actions">
                                    <button className="btn-icon" onClick={() => handleEdit(trainer.id)} title="Ubah">
                                        <Edit2 size={16} />
                                    </button>
                                    <button className="btn-icon btn-delete" onClick={() => handleDelete(trainer.id)} title="Hapus">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Add New Trainer Card (Dashed) */}
                    <div className="add-trainer-card" onClick={() => navigate('/trainers/add')}>
                        <div className="add-content">
                            <div className="add-icon-circle">
                                <UserPlus size={32} />
                            </div>
                            <span>TAMBAH PELATIH</span>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="table-card">
                    <table className="trainers-table">
                        <thead>
                            <tr>
                                <th style={{ width: '25%' }}>KODE</th>
                                <th style={{ width: '40%' }}>NAMA PELATIH</th>
                                <th style={{ width: '15%' }}>RATING</th>
                                <th style={{ width: '20%', textAlign: 'center' }}>AKSI</th>
                            </tr>
                        </thead>
                        <tbody>
                            {trainers.map((trainer) => (
                                <tr key={trainer.id}>
                                    <td>
                                        <span className="specialist-badge">{trainer.coachCode}</span>
                                    </td>
                                    <td>
                                        <div className="trainer-info-cell">
                                            <div className="trainer-avatar-mini">
                                                <img src={getAvatarUrl(trainer.id)} alt={trainer.coachName} />
                                            </div>
                                            <span className="trainer-name-row">{trainer.coachName}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="rating-cell">
                                            <Star size={14} fill="#fbbf24" stroke="#fbbf24" />
                                            <span>{4.5 + (trainer.id % 5) / 10}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="action-buttons">
                                            <button className="btn-icon-action" onClick={() => handleEdit(trainer.id)} title="Ubah">
                                                <Edit2 size={16} />
                                            </button>
                                            <button className="btn-icon-action btn-delete" onClick={() => handleDelete(trainer.id)} title="Hapus">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            {/* Pagination */}
            {!isLoading && totalElements > 0 && (
                <div className="pagination-footer">
                    <span className="pagination-text">
                        Menampilkan <strong>{page * size + 1}</strong> - <strong>{Math.min((page + 1) * size, totalElements)}</strong> dari <strong>{totalElements}</strong> pelatih terdaftar
                    </span>
                    <div className="pagination-buttons">
                        <button
                            className="page-btn"
                            onClick={() => handlePageChange(page - 1)}
                            disabled={page === 0}
                        >
                            <ChevronLeft size={16} />
                        </button>
                        {[...Array(totalPages)].map((_, i) => (
                            <button
                                key={i}
                                className={`page-btn ${page === i ? 'active-page' : ''}`}
                                onClick={() => handlePageChange(i)}
                            >
                                {i + 1}
                            </button>
                        ))}
                        <button
                            className="page-btn"
                            onClick={() => handlePageChange(page + 1)}
                            disabled={page === totalPages - 1}
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Trainers;
