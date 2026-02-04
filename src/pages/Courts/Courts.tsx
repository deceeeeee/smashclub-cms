import { useState, useEffect } from 'react';
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
    Loader2
} from 'lucide-react';
import { useCourtsStore } from '../../features/courts/courts.store';
import { useConfirmStore } from '../../app/confirm.store';
import { useDebounce } from '../../hooks/useDebounce';
import { STATUS_FLAGS, getStatusLabel } from '../../constant/flags';
import './Courts.css';

const Courts = () => {
    const navigate = useNavigate();
    const { courts, isLoading, getCourts, deleteCourt, totalElements, totalPages } = useCourtsStore();
    const { showConfirm } = useConfirmStore();

    const [search, setSearch] = useState('');
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(25);

    const debouncedSearch = useDebounce(search, 500);

    useEffect(() => {
        getCourts(debouncedSearch, page, size);
    }, [debouncedSearch, page, size, getCourts]);

    const handleEdit = (id: number) => {
        navigate(`/courts/edit/${id}`);
    };

    const handleDelete = (id: number) => {
        showConfirm({
            title: 'Hapus Data?',
            message: 'Apakah Anda yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan dan data akan hilang permanen dari sistem SmashClub.',
            onConfirm: async () => {
                const result = await deleteCourt(id);
                if (result.success) {
                    getCourts(debouncedSearch, page, size);
                }
            }
        });
    };

    const handlePageChange = (newPage: number) => {
        if (newPage >= 0 && newPage < totalPages) {
            setPage(newPage);
        }
    };

    return (
        <div className="courts-page">
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
                <button className="btn-primary" onClick={() => navigate('/courts/add')}>
                    <Plus size={18} />
                    <span>Tambah Lapangan Baru</span>
                </button>
            </div>

            {/* Content Card with Filters and Table */}
            <div className="content-card">
                {/* Filter Bar */}
                <div className="filter-bar">

                    <div className="search-bar">
                        <Search size={18} className="search-icon" />
                        <input
                            type="text"
                            placeholder="Cari nama atau kode lapangan..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="toolbar-actions">
                        <div className="size-selector">
                            <span>Tampilkan:</span>
                            <select
                                value={size}
                                onChange={(e) => { setSize(Number(e.target.value)); setPage(0); }}
                                className="page-size-select"
                            >
                                <option value={10}>10</option>
                                <option value={25}>25</option>
                                <option value={50}>50</option>
                            </select>
                            <span>per halaman</span>
                        </div>
                        {/* <div className="sort-control">
                            <span>Urutkan: Terbaru</span>
                            <Filter size={14} style={{ marginLeft: 8 }} />
                        </div> */}
                    </div>
                </div>

                {/* Table Container */}
                <div className="table-container">
                    <table className="custom-table">
                        <thead>
                            <tr>
                                <th style={{ width: '15%' }}>KODE</th>
                                <th style={{ width: '30%' }}>NAMA LAPANGAN</th>
                                <th style={{ width: '25%' }}>JAM OPERASIONAL</th>
                                <th style={{ width: '20%' }}>STATUS</th>
                                <th style={{ width: '10%', textAlign: 'center' }}>AKSI</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="loading-cell">
                                        <div className="loading-content">
                                            <Loader2 className="animate-spin" size={24} />
                                            <span>Memuat data lapangan...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : courts.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="empty-cell">
                                        <div className="empty-content">
                                            <AlertCircle size={40} />
                                            <p>Tidak ada data lapangan ditemukan.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                courts.map((court) => (
                                    <tr key={court.id}>
                                        <td>
                                            <span className="court-code">{court.courtCode}</span>
                                        </td>
                                        <td>
                                            <div className="court-name-cell">
                                                <span className="court-name">{court.courtName}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <span className="time-text">{court.openTime} - {court.closeTime}</span>
                                        </td>
                                        <td>
                                            <div className={`status-badge ${court.status === STATUS_FLAGS.ACTIVE ? 'status-active' : 'status-maintenance'}`}>
                                                <span className="status-dot"></span>
                                                {getStatusLabel(court.status)}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="action-buttons">
                                                <button className="btn-icon-action" onClick={() => handleEdit(court.id)}>
                                                    <Edit2 size={16} />
                                                </button>
                                                <button className="btn-icon-action btn-delete" onClick={() => handleDelete(court.id)}>
                                                    <Trash2 size={16} />
                                                </button>
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
                                Menampilkan <strong>{(page * size) + 1}</strong> - <strong>{Math.min((page + 1) * size, totalElements)}</strong> dari <strong>{totalElements}</strong> lapangan
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

            {/* Summary Grid at Bottom */}
            <div className="summary-grid">
                <div className="summary-card">
                    <div className="summary-icon icon-blue">
                        <span style={{ fontSize: 24 }}>🏟️</span>
                    </div>
                    <div className="summary-text">
                        <span className="summary-label">TOTAL LAPANGAN</span>
                        <span className="summary-value">{totalElements}</span>
                    </div>
                </div>
                <div className="summary-card">
                    <div className="summary-icon icon-green">
                        <CheckCircle2 size={24} />
                    </div>
                    <div className="summary-text">
                        <span className="summary-label">AKTIF</span>
                        <span className="summary-value">
                            {courts.filter(c => c.status === STATUS_FLAGS.ACTIVE).length}
                        </span>
                    </div>
                </div>
                <div className="summary-card">
                    <div className="summary-icon icon-orange">
                        <AlertCircle size={24} />
                    </div>
                    <div className="summary-text">
                        <span className="summary-label">NON-AKTIF</span>
                        <span className="summary-value">
                            {courts.filter(c => c.status === STATUS_FLAGS.INACTIVE).length}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Courts;
