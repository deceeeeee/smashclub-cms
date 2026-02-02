import { useState } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import {
    ChevronDown,
    Info,
    Upload,
    X,
    Image as ImageIcon,
    Save
} from 'lucide-react';
import './ProductForm.css';

const ProductForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = !!id;

    const [images, _setImages] = useState([
        { id: 1, url: 'https://images.unsplash.com/photo-1617083281297-af33e2501717?auto=format&fit=crop&q=80&w=200&h=200', isMain: true }
    ]);

    return (
        <div className="product-form-page">
            {/* Breadcrumbs */}
            <nav className="breadcrumbs">
                <Link to="/dashboard">Beranda</Link>
                <span className="separator">›</span>
                <span>Master Data</span>
                <span className="separator">›</span>
                <Link to="/products">Produk</Link>
                <span className="separator">›</span>
                <span className="current">{isEdit ? 'Ubah Produk' : 'Tambah Produk'}</span>
            </nav>

            {/* Header */}
            <div className="page-header">
                <h1>{isEdit ? `Ubah Data Produk ${id}` : 'Tambah Produk Baru'}</h1>
                <p>{isEdit ? 'Perbarui informasi detail produk dan inventaris toko Anda.' : 'Lengkapi informasi detail produk dan unggah foto produk di bawah ini.'}</p>
            </div>

            {/* Form Content */}
            <div className="form-card">
                <div className="section-header">
                    <Info size={18} className="info-icon" />
                    <span>Informasi Detail Produk</span>
                </div>

                <div className="form-grid">
                    {/* Nama Produk */}
                    <div className="form-group">
                        <label>NAMA PRODUK</label>
                        <input type="text" placeholder="Contoh: Raket Badminton Pro" />
                    </div>

                    {/* Kategori Produk */}
                    <div className="form-group">
                        <label>KATEGORI PRODUK</label>
                        <div className="select-wrapper">
                            <select defaultValue="">
                                <option value="" disabled>Pilih Kategori</option>
                                <option value="raket">Raket</option>
                                <option value="shuttlecock">Shuttlecock</option>
                                <option value="sepatu">Sepatu</option>
                                <option value="aksesori">Aksesori</option>
                            </select>
                            <ChevronDown className="select-icon" size={18} />
                        </div>
                    </div>

                    {/* Harga Jual */}
                    <div className="form-group">
                        <label>HARGA JUAL (IDR)</label>
                        <div className="input-with-label">
                            <span className="input-prefix">Rp</span>
                            <input type="number" placeholder="0" />
                        </div>
                    </div>

                    {/* Stok Tersedia */}
                    <div className="form-group">
                        <label>STOK TERSEDIA</label>
                        <div className="input-with-label">
                            <input type="number" placeholder="0" />
                            <span className="input-suffix">UNIT</span>
                        </div>
                    </div>

                    {/* Foto Produk */}
                    <div className="form-group full-width">
                        <label>FOTO PRODUK (MAKS. 5 FOTO)</label>
                        <div className="photo-upload-grid">
                            {/* Upload Trigger */}
                            <div className="upload-box-main">
                                <Upload size={32} className="upload-icon-form" />
                                <span className="upload-title">Unggah Foto Produk</span>
                                <span className="upload-label">Klik atau tarik foto ke sini</span>
                                <span className="upload-hint">PNG, JPG, WEBP (MAX 5MB)</span>
                            </div>

                            {/* Image Previews */}
                            {images.map(img => (
                                <div key={img.id} className="image-preview-box">
                                    <img src={img.url} alt="Product" />
                                    {img.isMain && <div className="main-indicator">UTAMA</div>}
                                    <button className="delete-photo-btn">
                                        <X size={14} />
                                    </button>
                                </div>
                            ))}

                            {/* Empty Placeholders */}
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="image-placeholder-box">
                                    <ImageIcon size={24} className="placeholder-icon" />
                                </div>
                            ))}
                        </div>
                        <p className="photo-note">
                            *Gunakan foto dengan rasio 1:1 untuk hasil tampilan terbaik di aplikasi member.
                        </p>
                    </div>
                </div>

                <div className="form-actions">
                    <button className="btn-batal" onClick={() => navigate('/products')}>Batal</button>
                    <button className="btn-simpan">
                        <Save size={18} />
                        {isEdit ? 'Simpan Perubahan' : 'Simpan Produk'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductForm;
