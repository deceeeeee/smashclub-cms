import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    Plus,
    Search,
    Edit2,
    Trash2,
    ChevronLeft,
    ChevronRight,
    Package
} from 'lucide-react';
import { useConfirmStore } from '../../app/confirm.store';
import './Products.css';

// Mock Data
const productsData = [
    {
        id: 1,
        name: 'Raket Yonex Astrox 99 Pro',
        category: 'Alat Olahraga',
        price: 2450000,
        stock: 12,
        unit: 'unit',
        status: 'Normal',
        imageColor: '#2d3748'
    },
    {
        id: 2,
        name: 'Shuttlecock JP Gold (12pcs)',
        category: 'Alat Olahraga',
        price: 125000,
        stock: 4,
        unit: '',
        status: 'Menipis',
        imageColor: '#fef3c7'
    },
    {
        id: 3,
        name: 'Pocari Sweat 500ml',
        category: 'Minuman',
        price: 8000,
        stock: 48,
        unit: 'botol',
        status: 'Normal',
        imageColor: '#e0f2fe'
    },
    {
        id: 4,
        name: 'Grip Karet RS Premium',
        category: 'Alat Olahraga',
        price: 15000,
        stock: 0,
        unit: '',
        status: 'Habis',
        imageColor: '#fed7aa'
    }
];

const Products = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState(productsData);
    const [activeFilter, setActiveFilter] = useState('Semua');

    const { showConfirm } = useConfirmStore();

    const handleEdit = (id: number) => {
        navigate(`/products/edit/${id}`);
    };

    const handleDelete = (id: number) => {
        showConfirm({
            title: 'Hapus Data?',
            message: 'Apakah Anda yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan dan data akan hilang permanen dari sistem SmashClub.',
            onConfirm: () => {
                setProducts(products.filter(p => p.id !== id));
            }
        });
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
                <button className="btn-primary" onClick={() => navigate('/products/add')}>
                    <Plus size={18} />
                    <span>Tambah Produk Baru</span>
                </button>
            </div>
            {/* Main Content Card */}
            <div className="content-card">
                {/* Toolbar: Search & Filter */}
                <div className="toolbar">
                    <div className="search-bar">
                        <Search size={18} className="search-icon" />
                        <input type="text" placeholder="Cari nama produk atau kode..." />
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
                            className={`filter-btn ${activeFilter === 'Alat Olahraga' ? 'active' : ''}`}
                            onClick={() => setActiveFilter('Alat Olahraga')}
                        >
                            Alat Olahraga
                        </button>
                    </div>
                </div>
                {/* Table */}
                <div className="table-container">
                    <table className="product-table">
                        <thead>
                            <tr>
                                <th style={{ width: '40%' }}>NAMA PRODUK</th>
                                <th style={{ width: '15%' }}>KATEGORI</th>
                                <th style={{ width: '15%' }}>HARGA</th>
                                <th style={{ width: '15%' }}>STOK</th>
                                <th style={{ width: '15%', textAlign: 'center' }}>AKSI</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.map((product) => (
                                <tr key={product.id}>
                                    <td>
                                        <div className="product-cell">
                                            <div className="product-img-placeholder" style={{ backgroundColor: product.imageColor }}>
                                                <Package size={20} color="#64748b" />
                                            </div>
                                            <span className="product-name">{product.name}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="category-badge">{product.category}</span>
                                    </td>
                                    <td>
                                        <span className="price-text">Rp {product.price.toLocaleString('id-ID')}</span>
                                    </td>
                                    <td>
                                        <div className="stock-cell">
                                            <span className={`stock-value ${product.stock === 0 ? 'text-red' : ''}`}>
                                                {product.stock}
                                            </span>
                                            {product.stock > 0 && product.unit && <span className="stock-unit">{product.unit}</span>}

                                            {product.status === 'Menipis' && (
                                                <span className="stock-status status-warning">MENIPIS</span>
                                            )}

                                            {product.status === 'Habis' && (
                                                <span className="stock-status status-danger">HABIS</span>
                                            )}
                                        </div>
                                    </td>
                                    <td>
                                        <div className="action-buttons">
                                            <button className="btn-icon-action" onClick={() => handleEdit(product.id)}><Edit2 size={16} /></button>
                                            <button className="btn-icon-action btn-delete" onClick={() => handleDelete(product.id)}><Trash2 size={16} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {/* Pagination */}
                    <div className="pagination-bar">
                        <div className="pagination-info">
                            Menampilkan 1 - 4 dari 32 produk
                        </div>
                        <div className="pagination-controls">
                            <button className="pagination-btn"><ChevronLeft size={16} /></button>
                            <button className="pagination-btn active-page">1</button>
                            <button className="pagination-btn">2</button>
                            <button className="pagination-btn">3</button>
                            <button className="pagination-btn"><ChevronRight size={16} /></button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Products;