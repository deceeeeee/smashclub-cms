import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    Plus,
    Edit2,
    Trash2,
    CheckCircle2,
    AlertCircle,
    ChevronLeft,
    ChevronRight,
    Search,
    Filter,
    ChevronDown
} from 'lucide-react';
import { useConfirmStore } from '../../app/confirm.store';
import './Fields.css';

// Mock Data
const fieldsData = [
    { id: 1, name: 'Lapangan Futsal A', type: 'Futsal', price: 150000, status: 'Tersedia', icon: '⚽' },
    { id: 2, name: 'Lapangan Futsal B', type: 'Futsal', price: 150000, status: 'Maintenance', icon: '⚽' },
    { id: 3, name: 'Court Badminton 1', type: 'Badminton', price: 50000, status: 'Tersedia', icon: '🏸' },
];

const Fields = () => {

    const navigate = useNavigate();
    const [fields, setFields] = useState(fieldsData);
    const [activeFilter, setActiveFilter] = useState('Semua');
    const { showConfirm } = useConfirmStore();

    const handleEdit = (id: number) => {
        navigate(`/fields/edit/${id}`);
    };

    const handleDelete = (id: number) => {
        showConfirm({
            title: 'Hapus Data?',
            message: 'Apakah Anda yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan dan data akan hilang permanen dari sistem SmashClub.',
            onConfirm: () => {
                setFields(fields.filter(f => f.id !== id));
            }
        });
    };


    const filteredFields = activeFilter === 'Semua'
        ? fields
        : fields.filter(f => f.type === activeFilter);

    return (
        <div className="fields-page">
            {/* Breadcrumbs */}
            <nav className="breadcrumbs">
                <Link to="/dashboard">Beranda</Link>
                <span className="separator">›</span>
                <span>Master Data</span>
                <span className="separator">›</span>
                <span className="current">Lapangan</span>
            </nav>

            {/* Header Section */}
            <div className="page-header">
                <div className="header-text">
                    <h1>Manajemen Lapangan</h1>
                    <p>Kelola detail, harga, dan ketersediaan lapangan SmashClub secara real-time.</p>
                </div>
                <button className="btn-primary" onClick={() => navigate('/fields/add')}>
                    <Plus size={18} />
                    <span>Tambah Lapangan Baru</span>
                </button>
            </div>

            {/* Content Card with Filters and Table */}
            <div className="content-card">
                {/* Filter Bar */}
                <div className="filter-bar">
                    <div className="filter-tabs">
                        <button
                            className={`filter-tab ${activeFilter === 'Semua' ? 'active' : ''}`}
                            onClick={() => setActiveFilter('Semua')}
                        >
                            SEMUA <ChevronDown size={14} style={{ marginLeft: 4 }} />
                        </button>
                        <button
                            className={`filter-tab ${activeFilter === 'Futsal' ? 'active' : ''}`}
                            onClick={() => setActiveFilter('Futsal')}
                        >
                            FUTSAL <span className="tab-icon">⚽</span>
                        </button>
                        <button
                            className={`filter-tab ${activeFilter === 'Badminton' ? 'active' : ''}`}
                            onClick={() => setActiveFilter('Badminton')}
                        >
                            BADMINTON <span className="tab-icon">🏸</span>
                        </button>
                        <button
                            className={`filter-tab ${activeFilter === 'Basket' ? 'active' : ''}`}
                            onClick={() => setActiveFilter('Basket')}
                        >
                            BASKET <span className="tab-icon">🏀</span>
                        </button>
                    </div>

                    <div className="search-bar">
                        <Search size={18} className="search-icon" />
                        <input type="text" placeholder="Cari nama lapangan..." />
                    </div>

                    <div className="sort-control">
                        <span>Urutkan: Terbaru</span>
                        <Filter size={14} style={{ marginLeft: 8 }} />
                    </div>
                </div>

                {/* Table Container */}
                <div className="table-container">
                    <table className="custom-table">
                        <thead>
                            <tr>
                                <th style={{ width: '35%' }}>NAMA LAPANGAN</th>
                                <th style={{ width: '15%' }}>TIPE</th>
                                <th style={{ width: '20%' }}>HARGA PER JAM</th>
                                <th style={{ width: '20%' }}>STATUS</th>
                                <th style={{ width: '10%', textAlign: 'center' }}>AKSI</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredFields.map((field) => (
                                <tr key={field.id}>
                                    <td>
                                        <div className="field-name-cell">
                                            <div className="field-icon-wrapper">
                                                <span className="field-emoji-icon">{field.icon}</span>
                                            </div>
                                            <span className="field-name">{field.name}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="type-badge">{field.type}</span>
                                    </td>
                                    <td>
                                        <span className="price-text">Rp {field.price.toLocaleString('id-ID')}</span>
                                    </td>
                                    <td>
                                        <div className={`status-badge ${field.status === 'Tersedia' ? 'status-active' : 'status-maintenance'}`}>
                                            <span className="status-dot"></span>
                                            {field.status}
                                        </div>
                                    </td>
                                    <td>
                                        <div className="action-buttons">
                                            <button className="btn-icon-action" onClick={() => handleEdit(field.id)}>
                                                <Edit2 size={16} />
                                            </button>
                                            <button className="btn-icon-action btn-delete" onClick={() => handleDelete(field.id)}>
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Pagination */}
                    <div className="pagination-bar">
                        <div className="pagination-info">
                            Menampilkan <strong>1</strong> - <strong>{filteredFields.length}</strong> dari <strong>{fields.length}</strong> lapangan
                        </div>
                        <div className="pagination-controls">
                            <button className="pagination-btn"><ChevronLeft size={16} /></button>
                            <button className="pagination-btn active">1</button>
                            <button className="pagination-btn">2</button>
                            <button className="pagination-btn"><ChevronRight size={16} /></button>
                        </div>
                    </div>
                </div>

            </div>

            {/* Summary Grid at Bottom */}
            <div className="summary-grid">
                <div className="summary-card">
                    <div className="summary-icon icon-blue">
                        <span style={{ fontSize: 24 }}>🏟️</span>
                    </div>
                    <div className="summary-text">
                        <span className="summary-label">TOTAL LAPANGAN</span>
                        <span className="summary-value">{fields.length}</span>
                    </div>
                </div>
                <div className="summary-card">
                    <div className="summary-icon icon-green">
                        <CheckCircle2 size={24} />
                    </div>
                    <div className="summary-text">
                        <span className="summary-label">TERSEDIA</span>
                        <span className="summary-value">{fields.filter(f => f.status === 'Tersedia').length}</span>
                    </div>
                </div>
                <div className="summary-card">
                    <div className="summary-icon icon-orange">
                        <AlertCircle size={24} />
                    </div>
                    <div className="summary-text">
                        <span className="summary-label">MAINTENANCE</span>
                        <span className="summary-value">{fields.filter(f => f.status === 'Maintenance').length}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Fields;
