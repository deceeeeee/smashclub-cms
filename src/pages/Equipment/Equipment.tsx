import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    Plus,
    Search,
    Edit2,
    Trash2,
    ChevronLeft,
    ChevronRight,
    Package,
    Loader2,
    AlertCircle
} from 'lucide-react';
import { useAuthStore } from '../../features/auth/auth.store';
import { useConfirmStore } from '../../app/confirm.store';
import { useEquipmentStore } from '../../features/equipment/equipment.store';
import { useDebounce } from '../../hooks/useDebounce';
import { PAGE_SIZE_OPTIONS } from '../../constant/pagination';
import './Equipment.css';

const Equipment = () => {
    const navigate = useNavigate();
    const { equipment, isLoading, getEquipment, deleteEquipment, totalElements, totalPages } = useEquipmentStore();
    const { showConfirm } = useConfirmStore();
    const { hasPermission } = useAuthStore();

    const [search, setSearch] = useState('');
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);

    const canCreate = hasPermission('EQUIPMENT_CREATE');
    const canEdit = hasPermission('EQUIPMENT_EDIT');
    const canDelete = hasPermission('EQUIPMENT_DELETE');

    const debouncedSearch = useDebounce(search, 500);

    useEffect(() => {
        getEquipment(debouncedSearch, page, size);
    }, [debouncedSearch, page, size, getEquipment]);

    const handleEdit = (id: number) => {
        navigate(`/equipment/edit/${id}`);
    };

    const handleDelete = (id: number) => {
        showConfirm({
            title: 'Hapus Data?',
            message: 'Apakah Anda yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan dan data akan hilang permanen dari sistem SmashClub.',
            onConfirm: async () => {
                const result = await deleteEquipment(id);
                if (result.success) {
                    getEquipment(debouncedSearch, page, size);
                }
            }
        });
    };

    const handlePageChange = (newPage: number) => {
        if (newPage >= 0 && newPage < totalPages) {
            setPage(newPage);
        }
    };

    // Helper for placeholder colors
    const getPlaceholderColor = (id: number) => {
        const colors = ['#2d3748', '#171717', '#65a30d', '#0891b2', '#7c3aed', '#db2777'];
        return colors[id % colors.length];
    };

    return (
        <div className="equipment-page">
            {/* Breadcrumbs */}
            <nav className="breadcrumbs">
                <Link to="/dashboard">Beranda</Link>
                <span className="separator">›</span>
                <span>Master Data</span>
                <span className="separator">›</span>
                <span className="current">Peralatan</span>
            </nav>

            {/* Header Section */}
            <div className="page-header">
                <div className="header-text">
                    <h1>Manajemen Peralatan</h1>
                    <p>Kelola dan pantau inventaris peralatan olahraga Anda.</p>
                </div>
                {canCreate && (
                    <button className="btn-primary" onClick={() => navigate('/equipment/add')}>
                        <Plus size={18} />
                        <span>Tambah Peralatan</span>
                    </button>
                )}
            </div>
            {/* Main Content Card */}
            <div className="content-card">
                {/* Search Bar only - per image design */}
                <div className="toolbar-simple">
                    <div className="search-bar">
                        <Search size={18} className="search-icon" />
                        <input
                            type="text"
                            placeholder="Cari nama alat..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="size-selector">
                        <span>Tampilkan:</span>
                        <select
                            value={size}
                            onChange={(e) => {
                                setSize(Number(e.target.value));
                                setPage(0);
                            }}
                            className="page-size-select"
                        >
                            {PAGE_SIZE_OPTIONS.map((option) => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>
                        <span>per halaman</span>
                    </div>
                </div>
                {/* Table */}
                <div className="table-container">
                    <table className="equipment-table">
                        <thead>
                            <tr>
                                <th style={{ width: '20%' }}>FOTO ALAT</th>
                                <th style={{ width: '20%' }}>NAMA ALAT</th>
                                <th style={{ width: '15%' }}>KATEGORI</th>
                                <th style={{ width: '10%' }}>STOK</th>
                                <th style={{ width: '15%' }}>STATUS</th>
                                <th style={{ width: '15%' }}>BIAYA SEWA</th>
                                <th style={{ width: '10%', textAlign: 'center' }}>AKSI</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan={7} style={{ textAlign: 'center', padding: '3rem' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                                            <Loader2 className="animate-spin" size={32} />
                                            <span>Memuat data peralatan...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : equipment.length === 0 ? (
                                <tr>
                                    <td colSpan={7} style={{ textAlign: 'center', padding: '3rem' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', opacity: 0.5 }}>
                                            <AlertCircle size={40} />
                                            <span>Tidak ada data peralatan ditemukan.</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                equipment.map((item) => (
                                    <tr key={item.id}>
                                        <td>
                                            <div className="img-cell">
                                                <div className="equipment-img-placeholder" style={{ backgroundColor: getPlaceholderColor(item.id) }}>
                                                    <Package size={20} color="#cbd5e1" />
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="equipment-info">
                                                <span className="equipment-name">{item.equipmentName}</span>
                                                <span className="equipment-brand">{item.brand} • {item.type}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <span className="category-tag">{item.equipmentCategory?.categoryName || 'N/A'}</span>
                                        </td>
                                        <td>
                                            <span className="stock-value">{item.stock}</span>
                                        </td>
                                        <td>
                                            <div className={`status-indicator ${item.status === 1 ? 'status-ok' : 'status-warning'}`}>
                                                <span className="status-dot"></span>
                                                {item.status === 1 ? 'Tersedia' : 'Tidak Tersedia'}
                                            </div>
                                        </td>
                                        <td>
                                            <span className="price-text">Rp {item.price.toLocaleString('id-ID')}</span>
                                        </td>
                                        <td>
                                            <div className="action-buttons">
                                                {canEdit && (
                                                    <button className="btn-icon-action" onClick={() => handleEdit(item.id)} title="Edit">
                                                        <Edit2 size={16} />
                                                    </button>
                                                )}
                                                {canDelete && (
                                                    <button className="btn-icon-action btn-delete" onClick={() => handleDelete(item.id)} title="Hapus">
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
                                Menampilkan <strong>{page * size + 1}</strong> sampai <strong>{Math.min((page + 1) * size, totalElements)}</strong> dari <strong>{totalElements}</strong> peralatan
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
                                        className={`pagination-btn ${page === i ? 'active-page' : ''}`}
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
export default Equipment;