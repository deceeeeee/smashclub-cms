import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    Plus,
    Search,
    Edit2,
    Trash2,
    ChevronLeft,
    ChevronRight,
    Tag,
    Loader2,
    AlertCircle
} from 'lucide-react';
import { useConfirmStore } from '../../app/confirm.store';
import { useEquipmentCategoryStore } from '../../features/equipment-category/equipment-category.store';
import { useDebounce } from '../../hooks/useDebounce';
import './EquipmentCategory.css';

const EquipmentCategory = () => {
    const navigate = useNavigate();
    const { categories, isLoading, getCategories, deleteCategory, totalElements, totalPages } = useEquipmentCategoryStore();
    const { showConfirm } = useConfirmStore();

    const [search, setSearch] = useState('');
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);

    const debouncedSearch = useDebounce(search, 500);

    useEffect(() => {
        getCategories(debouncedSearch, page, size);
    }, [debouncedSearch, page, size, getCategories]);

    const handleEdit = (id: number) => {
        navigate(`/equipment-categories/edit/${id}`);
    };

    const handleDelete = (id: number) => {
        showConfirm({
            title: 'Hapus Data?',
            message: 'Apakah Anda yakin ingin menghapus kategori ini? Tindakan ini tidak dapat dibatalkan.',
            onConfirm: async () => {
                const result = await deleteCategory(id);
                if (result.success) {
                    getCategories(debouncedSearch, page, size);
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
        <div className="equipment-category-page">
            {/* Breadcrumbs */}
            <nav className="breadcrumbs">
                <Link to="/dashboard">Beranda</Link>
                <span className="separator">›</span>
                <span>Master Data</span>
                <span className="separator">›</span>
                <span className="current">Kategori Peralatan</span>
            </nav>

            {/* Header Section */}
            <div className="page-header">
                <div className="header-text">
                    <h1>Manajemen Kategori Peralatan</h1>
                    <p>Kelola kategori untuk inventaris peralatan olahraga Anda.</p>
                </div>
                <button className="btn-primary" onClick={() => navigate('/equipment-categories/add')}>
                    <Plus size={18} />
                    <span>Tambah Kategori</span>
                </button>
            </div>

            {/* Main Content Card */}
            <div className="content-card">
                <div className="toolbar-simple">
                    <div className="search-bar">
                        <Search size={18} className="search-icon" />
                        <input
                            type="text"
                            placeholder="Cari kategori..."
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
                            <option value={10}>10</option>
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                        </select>
                        <span>per halaman</span>
                    </div>
                </div>

                {/* Table */}
                <div className="table-container">
                    <table className="equipment-category-table">
                        <thead>
                            <tr>
                                <th style={{ width: '10%' }}>ID</th>
                                <th style={{ width: '50%' }}>NAMA KATEGORI</th>
                                <th style={{ width: '20%' }}>STATUS</th>
                                <th style={{ width: '20%', textAlign: 'center' }}>AKSI</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan={4} style={{ textAlign: 'center', padding: '3rem' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                                            <Loader2 className="animate-spin" size={32} />
                                            <span>Memuat data kategori...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : categories.length === 0 ? (
                                <tr>
                                    <td colSpan={4} style={{ textAlign: 'center', padding: '3rem' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', opacity: 0.5 }}>
                                            <AlertCircle size={40} />
                                            <span>Tidak ada data kategori ditemukan.</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                categories.map((item) => (
                                    <tr key={item.id}>
                                        <td>
                                            <span className="category-id">#{item.id}</span>
                                        </td>
                                        <td>
                                            <div className="category-info">
                                                <Tag size={16} className="category-icon" />
                                                <span className="category-name">{item.categoryName}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className={`status-badge ${item.status === 1 ? 'status-active' : 'status-inactive'}`}>
                                                <span className="status-dot"></span>
                                                {item.status === 1 ? 'Aktif' : 'Tidak Aktif'}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="action-buttons">
                                                <button className="btn-icon-action" onClick={() => handleEdit(item.id)}><Edit2 size={16} /></button>
                                                <button className="btn-icon-action btn-delete" onClick={() => handleDelete(item.id)}><Trash2 size={16} /></button>
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
                                Menampilkan <strong>{page * size + 1}</strong> sampai <strong>{Math.min((page + 1) * size, totalElements)}</strong> dari <strong>{totalElements}</strong> kategori
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

export default EquipmentCategory;
