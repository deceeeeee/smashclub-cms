import { useState } from 'react';
import {
    Plus,
    Filter,
    ChevronDown,
    Edit2,
    Trash2,
    CheckCircle2,
    AlertCircle,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import './Fields.css';
// Mock Data
const fieldsData = [
    { id: 1, name: 'Lapangan Futsal A', type: 'Futsal', price: 150000, status: 'Tersedia', icon: '⚽' },
    { id: 2, name: 'Lapangan Futsal B', type: 'Futsal', price: 150000, status: 'Maintenance', icon: '⚽' },
    { id: 3, name: 'Court Badminton 1', type: 'Badminton', price: 50000, status: 'Tersedia', icon: '🏸' },
];
const Fields = () => {
    const [activeFilter, setActiveFilter] = useState('Semua');
    return (
        <div className="fields-page">
            {/* Header Section */}
            <div className="page-header">
                <div className="header-text">
                    <h1>Manajemen Lapangan</h1>
                    <p>Kelola detail, harga, dan ketersediaan lapangan SmashClub secara real-time.</p>
                </div>
                <button className="btn-primary">
                    <Plus size={18} />
                    <span>Tambah Lapangan Baru</span>
                </button>
            </div>
            {/* Filter and Content Card */}
            <div className="content-card">
                {/* Filter Bar */}
                <div className="filter-bar">
                    <div className="filter-tabs">
                        <button
                            className={`filter-tab ${activeFilter === 'Semua' ? 'active' : ''}`}
                            onClick={() => setActiveFilter('Semua')}
                        >
                            SEMUA LAPANGAN <ChevronDown size={14} style={{ marginLeft: 4 }} />
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

                    <div className="sort-control">
                        <span>Urutkan: Terbaru</span>
                        <Filter size={14} className="ml-2" />
                    </div>
                </div>
                {/* Table */}
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
                            {fieldsData.map((field) => (
                                <tr key={field.id}>
                                    <td>
                                        <div className="field-name-cell">
                                            <div className="field-icon-wrapper">
                                                {field.icon === '⚽' && <span className="field-emoji-icon">⚽</span>}
                                                {field.icon === '🏸' && <span className="field-emoji-icon">🏸</span>}
                                                {/* Fallback icon if needed */}
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
                        Menampilkan <strong>1</strong> sampai <strong>3</strong> dari <strong>12</strong> data
                    </div>
                    <div className="pagination-controls">
                        <button className="pagination-btn"><ChevronLeft size={16} /></button>
                        <button className="pagination-btn active">1</button>
                        <button className="pagination-btn">2</button>
                        <button className="pagination-btn">3</button>
                        <button className="pagination-btn"><ChevronRight size={16} /></button>
                    </div>
                </div>
            </div>
            {/* Bottom Summary Cards */}
            <div className="summary-grid">
                <div className="summary-card">
                    <div className="summary-icon icon-blue">
                        <span style={{ fontSize: 24 }}>🏟️</span>
                    </div>
                    <div className="summary-text">
                        <span className="summary-label">TOTAL LAPANGAN</span>
                        <span className="summary-value">12</span>
                    </div>
                </div>
                <div className="summary-card">
                    <div className="summary-icon icon-green">
                        <CheckCircle2 size={24} color="#10b981" />
                    </div>
                    <div className="summary-text">
                        <span className="summary-label">TERSEDIA</span>
                        <span className="summary-value">10</span>
                    </div>
                </div>
                <div className="summary-card">
                    <div className="summary-icon icon-orange">
                        <AlertCircle size={24} color="#f59e0b" />
                    </div>
                    <div className="summary-text">
                        <span className="summary-label">MAINTENANCE</span>
                        <span className="summary-value">2</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Fields;
