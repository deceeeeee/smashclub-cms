import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    Plus,
    Search,
    Edit2,
    Trash2,
    ChevronLeft,
    ChevronRight,
    Loader2,
    AlertCircle
} from 'lucide-react';
import { useAuthStore } from '../../features/auth/auth.store';
import { useConfirmStore } from '../../app/confirm.store';
import { useProductsStore } from '../../features/products/products.store';
import { useDebounce } from '../../hooks/useDebounce';
import { PAGE_SIZE_OPTIONS } from '../../constant/pagination';
import './Products.css';

const Products = () => {
    const navigate = useNavigate();
    const { products, isLoading, getProducts, deleteProduct, totalElements, totalPages } = useProductsStore();
    const { showConfirm } = useConfirmStore();
    const { hasPermission } = useAuthStore();

    const [search, setSearch] = useState('');
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);
    const [activeFilter, setActiveFilter] = useState('Semua');

    const canCreate = hasPermission('PRODUCT_CREATE');
    const canEdit = hasPermission('PRODUCT_EDIT');
    const canDelete = hasPermission('PRODUCT_DELETE');

    const debouncedSearch = useDebounce(search, 500);

    useEffect(() => {
        getProducts(debouncedSearch, page, size);
    }, [debouncedSearch, page, size, getProducts]);

    const handleEdit = (id: number) => {
        navigate(`/products/edit/${id}`);
    };

    const handleDelete = (id: number) => {
        showConfirm({
            title: 'Hapus Data?',
            message: 'Apakah Anda yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan dan data akan hilang permanen dari sistem SmashClub.',
            onConfirm: async () => {
                const result = await deleteProduct(id);
                if (result.success) {
                    getProducts(debouncedSearch, page, size);
                }
            }
        });
    };

    const handlePageChange = (newPage: number) => {
        if (newPage >= 0 && newPage < totalPages) {
            setPage(newPage);
        }
    };

    const filteredProducts = activeFilter === 'Semua'
        ? products
        : products.filter(p => p.category === activeFilter);

    return (
        <div className="products-page">
            {/* Breadcrumbs */}
            <nav className="breadcrumbs">
                <Link to="/dashboard">Beranda</Link>
                <span className="separator">›</span>
                <span>Master Data</span>
                <span className="separator">›</span>
                <span className="current">Produk</span>
            </nav>

            {/* Header Section */}
            <div className="page-header">
                <div className="header-text">
                    <h1>Manajemen Produk</h1>
                    <p>Kelola inventaris pro-shop dan kantin fasilitas olahraga Anda</p>
                </div>
                {canCreate && (
                    <button className="btn-primary" onClick={() => navigate('/products/add')}>
                        <Plus size={18} />
                        <span>Tambah Produk Baru</span>
                    </button>
                )}
            </div>
            {/* Main Content Card */}
            <div className="content-card">
                {/* Toolbar: Search & Filter */}
                <div className="filter-bar">
                    <div className="search-bar">
                        <Search size={18} className="search-icon" />
                        <input
                            type="text"
                            placeholder="Cari nama produk..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="filter-group">
                        <button
                            className={`filter-btn ${activeFilter === 'Semua' ? 'active' : ''}`}
                            onClick={() => setActiveFilter('Semua')}
                        >
                            Semua
                        </button>
                        <button
                            className={`filter-btn ${activeFilter === 'Minuman' ? 'active' : ''}`}
                            onClick={() => setActiveFilter('Minuman')}
                        >
                            Minuman
                        </button>
                        <button
                            className={`filter-btn ${activeFilter === 'Makanan' ? 'active' : ''}`}
                            onClick={() => setActiveFilter('Makanan')}
                        >
                            Makanan
                        </button>
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
                    <table className="product-table">
                        <thead>
                            <tr>
                                <th style={{ width: '45%' }}>NAMA PRODUK</th>
                                <th style={{ width: '20%' }}>KATEGORI</th>
                                <th style={{ width: '20%' }}>STATUS</th>
                                <th style={{ width: '15%', textAlign: 'center' }}>AKSI</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan={4} style={{ textAlign: 'center', padding: '3rem' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                                            <Loader2 className="animate-spin" size={32} />
                                            <span>Memuat data produk...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredProducts.length === 0 ? (
                                <tr>
                                    <td colSpan={4} style={{ textAlign: 'center', padding: '3rem' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', opacity: 0.5 }}>
                                            <AlertCircle size={40} />
                                            <span>Tidak ada data produk ditemukan.</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredProducts.map((product) => (
                                    <tr key={product.id}>
                                        <td>
                                            <div className="product-cell">
                                                <div className="product-img">
                                                    <img src={product.defaultImgLink} alt={product.productName} />
                                                </div>
                                                <span className="product-name">{product.productName}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <span className="category-badge">{product.category}</span>
                                        </td>
                                        <td>
                                            <div className={`status-badge ${product.status === 1 ? 'status-active' : 'status-inactive'}`}>
                                                {product.status === 1 ? 'Aktif' : 'Tidak Aktif'}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="action-buttons">
                                                {canEdit && (
                                                    <button className="btn-icon-action" onClick={() => handleEdit(product.id)} title="Edit">
                                                        <Edit2 size={16} />
                                                    </button>
                                                )}
                                                {canDelete && (
                                                    <button className="btn-icon-action btn-delete" onClick={() => handleDelete(product.id)} title="Hapus">
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
                                Menampilkan <strong>{page * size + 1}</strong> - <strong>{Math.min((page + 1) * size, totalElements)}</strong> dari <strong>{totalElements}</strong> produk
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
export default Products;