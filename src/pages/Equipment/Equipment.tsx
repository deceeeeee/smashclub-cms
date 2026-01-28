import {
    Plus,
    Search,
    Edit2,
    Trash2,
    ChevronLeft,
    ChevronRight,
    Package
} from 'lucide-react';
import './Equipment.css';
// Mock Data
const equipmentData = [
    {
        id: 1,
        name: 'Yonex Arcsaber 11',
        category: 'Raket',
        stock: 10,
        status: 'Tersedia',
        rentPrice: 25000,
        imageColor: '#2d3748'
    },
    {
        id: 2,
        name: 'Shuttlecock Alpha',
        category: 'Bola',
        stock: 50,
        status: 'Tersedia',
        rentPrice: 5000,
        imageColor: '#171717'
    },
    {
        id: 3,
        name: 'Net Portabel',
        category: 'Aksesori',
        stock: 2,
        status: 'Perlu Perbaikan',
        rentPrice: 0,
        imageColor: '#65a30d'
    },
];
const Equipment = () => {
    return (
        <div className="equipment-page">
            {/* Header Section */}
            <div className="page-header">
                <div className="header-text">
                    <h1>Manajemen Peralatan</h1>
                    <p>Kelola dan pantau inventaris peralatan olahraga Anda.</p>
                </div>
                <button className="btn-primary">
                    <Plus size={18} />
                    <span>Tambah Peralatan</span>
                </button>
            </div>
            {/* Main Content Card */}
            <div className="content-card">
                {/* Search Bar only - per image design */}
                <div className="toolbar-simple">
                    <div className="search-bar-equipment">
                        <Search size={18} className="search-icon" />
                        <input type="text" placeholder="Cari nama alat, kategori, atau status..." />
                    </div>
                </div>
                {/* Table */}
                <div className="table-container">
                    <table className="equipment-table">
                        <thead>
                            <tr>
                                <th style={{ width: '25%' }}>FOTO ALAT</th>
                                <th style={{ width: '25%' }}>NAMA ALAT</th>
                                <th style={{ width: '15%' }}>KATEGORI</th>
                                <th style={{ width: '10%' }}>STOK</th>
                                <th style={{ width: '15%' }}>STATUS</th>
                                <th style={{ width: '15%' }}>BIAYA SEWA</th>
                                <th style={{ width: '10%', textAlign: 'center' }}>AKSI</th>
                            </tr>
                        </thead>
                        <tbody>
                            {equipmentData.map((item) => (
                                <tr key={item.id}>
                                    <td>
                                        <div className="img-cell">
                                            <div className="equipment-img-placeholder" style={{ backgroundColor: item.imageColor }}>
                                                {/* Placeholder icon since we don't have real images */}
                                                <Package size={20} color="#cbd5e1" />
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="equipment-name">{item.name}</span>
                                    </td>
                                    <td>
                                        <span className="category-tag">{item.category}</span>
                                    </td>
                                    <td>
                                        <span className="stock-value">{item.stock}</span>
                                    </td>
                                    <td>
                                        <div className={`status-indicator ${item.status === 'Tersedia' ? 'status-ok' : 'status-warning'}`}>
                                            <span className="status-dot"></span>
                                            {item.status}
                                        </div>
                                    </td>
                                    <td>
                                        <span className="price-text">Rp {item.rentPrice.toLocaleString('id-ID')}</span>
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
                        Menampilkan 1 sampai 3 dari 12 peralatan
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
    );
};
export default Equipment;