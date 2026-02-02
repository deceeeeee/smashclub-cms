import { useState } from 'react';
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
    Bell
} from 'lucide-react';
import './Trainers.css';

// Mock Data
const trainersData = [
    { id: 1, name: 'Budi Santoso', role: 'Bulutangkis', rating: 4.8, imageColor: '#1e3a8a' },
    { id: 2, name: 'Sari Wijaya', role: 'Tenis', rating: 4.9, imageColor: '#9d174d' },
    { id: 3, name: 'Andi Wijaya', role: 'Basket', rating: 4.7, imageColor: '#0f766e' },
    { id: 4, name: 'Dewi Lestari', role: 'Voli', rating: 4.5, imageColor: '#ea580c' },
    { id: 5, name: 'Rahmat Hidayat', role: 'Futsal', rating: 4.9, imageColor: '#0e7490' },
    { id: 6, name: 'Siska Putri', role: 'Bulutangkis', rating: 4.6, imageColor: '#be185d' },
];

const Trainers = () => {
    const navigate = useNavigate();
    const [trainers, setTrainers] = useState(trainersData);
    const [activeFilter, setActiveFilter] = useState('Semua');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    const handleEdit = (id: number) => {
        navigate(`/trainers/edit/${id}`);
    };

    const handleDelete = (id: number) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus pelatih ini?')) {
            setTrainers(trainers.filter(t => t.id !== id));
        }
    };

    const filteredTrainers = activeFilter === 'Semua'
        ? trainers
        : trainers.filter(t => t.role === activeFilter);

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
                <div className="category-filters">
                    {['Semua', 'Bulutangkis', 'Tenis', 'Basket', 'Futsal', 'Voli'].map(filter => (
                        <button
                            key={filter}
                            className={`filter-chip ${activeFilter === filter ? 'active' : ''}`}
                            onClick={() => setActiveFilter(filter)}
                        >
                            {filter}
                        </button>
                    ))}
                </div>
                <div className="search-bar">
                    <Search size={18} className="search-icon" />
                    <input type="text" placeholder="Cari pelatih berdasarkan nama..." />
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
            {/* Grid Content */}
            <div className="trainers-grid">
                {filteredTrainers.map((trainer) => (
                    <div key={trainer.id} className="trainer-card">
                        <div className="card-image-container" style={{ backgroundColor: trainer.imageColor }}>
                            <div className="rating-badge">
                                <Star size={12} fill="#fbbf24" stroke="#fbbf24" />
                                <span>{trainer.rating}</span>
                            </div>
                            {/* Placeholder for trainer image - using simple initials or just color for now as per "slicing" without assets */}
                            <div className="trainer-img-placeholder">
                                {/* Image would go here */}
                            </div>
                        </div>

                        <div className="card-content">
                            <h3 className="trainer-name">{trainer.name}</h3>
                            <p className="trainer-specialist">Spesialis: {trainer.role}</p>

                            <div className="card-actions">
                                <button className="btn-schedule">Lihat Jadwal</button>
                                <div className="card-action-btns">
                                    <button className="btn-icon" onClick={() => handleEdit(trainer.id)} title="Ubah">
                                        <Edit2 size={16} />
                                    </button>
                                    <button className="btn-icon btn-delete" onClick={() => handleDelete(trainer.id)} title="Hapus">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
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
            {/* Pagination */}
            <div className="pagination-footer">
                <span className="pagination-text">Menampilkan 6 dari 24 pelatih terdaftar</span>
                <div className="pagination-buttons">
                    <button className="page-btn"><ChevronLeft size={16} /></button>
                    <button className="page-btn active-page">1</button>
                    <button className="page-btn">2</button>
                    <button className="page-btn">3</button>
                    <button className="page-btn"><ChevronRight size={16} /></button>
                </div>
            </div>
        </div>
    );
};

export default Trainers;
