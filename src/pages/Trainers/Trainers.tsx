import { useState } from 'react';
import {
    Plus,
    Search,
    Star,
    Edit2,
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
    const [activeFilter, setActiveFilter] = useState('Semua');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    return (
        <div className="trainers-page">
            {/* Page Header */}
            <div className="trainers-header">
                <div className="header-title-block">
                    <h1>Manajemen Pelatih</h1>
                </div>

                <div className="header-actions">
                    <div className="search-bar-trainers">
                        <Search size={18} className="search-icon" />
                        <input type="text" placeholder="Cari pelatih berdasarkan nama..." />
                    </div>

                    <button className="btn-add-trainer">
                        <Plus size={18} />
                        <span>Tambah Pelatih Baru</span>
                    </button>

                    <button className="btn-icon-header">
                        <Bell size={20} />
                    </button>
                </div>
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
                {trainersData.map((trainer) => (
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
                                <button className="btn-edit-trainer">
                                    <Edit2 size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Add New Trainer Card (Dashed) */}
                <div className="add-trainer-card">
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
