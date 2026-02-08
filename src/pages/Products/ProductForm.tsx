import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import {
    ChevronDown,
    Info,
    Upload,
    X,
    Image as ImageIcon,
    Save,
    ChevronLeft,
    Loader2,
    Plus,
    Trash2
} from 'lucide-react';
import { useProductsStore } from '../../features/products/products.store';
import { useAuthStore } from '../../features/auth/auth.store';
import { useAlertStore } from '../../app/alert.store';
import { STATUS_FLAGS, getStatusLabel } from '../../constant/flags';
import { formatNumber, parseFormattedNumber } from '../../utils/format';
import AccessDenied from '../../components/common/AccessDenied';
import './ProductForm.css';

const ProductForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = !!id;

    const { getProductDetail, submitProduct } = useProductsStore();
    const { showAlert } = useAlertStore();
    const { hasPermission } = useAuthStore();

    const canAccess = isEdit ? hasPermission('PRODUCT_EDIT') : hasPermission('PRODUCT_CREATE');

    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        productName: '',
        category: '',
        status: STATUS_FLAGS.ACTIVE,
        productDesc: '',
        defaultImgLink: null as File | string | null,
        productVariants: [] as any[]
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [images, setImages] = useState<{ id: number; url: string; isMain: boolean }[]>([]);

    const mainFilePickerRef = useRef<HTMLInputElement>(null);
    const variantFilePickerRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        if (isEdit) {
            loadProductData();
        }
    }, [id]);

    const loadProductData = async () => {
        setIsLoading(true);
        try {
            const response = await getProductDetail(Number(id));
            if (response && response.success) {
                const data = response.data;
                setFormData({
                    productName: data.productName,
                    category: data.category,
                    status: data.status,
                    productDesc: data.productDesc || '',
                    defaultImgLink: data.defaultImgLink || null,
                    productVariants: data.productVariants || []
                });

                if (data.defaultImgLink) {
                    setImages([{ id: Date.now(), url: data.defaultImgLink, isMain: true }]);
                }
            } else {
                showAlert('error', 'Gagal', 'Gagal memuat data produk');
                navigate('/products');
            }
        } catch (error) {
            showAlert('error', 'Error', 'Terjadi kesalahan sistem');
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user changes input
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleAddVariant = () => {
        setFormData(prev => ({
            ...prev,
            productVariants: [
                ...prev.productVariants,
                { id: 0, name: '', sku: '', price: 0, stock: 0, variantImgLink: '' }
            ]
        }));
    };

    const handleRemoveVariant = (index: number) => {
        setFormData(prev => ({
            ...prev,
            productVariants: prev.productVariants.filter((_, i) => i !== index)
        }));
    };

    const handleVariantChange = (index: number, field: string, value: any) => {
        setFormData(prev => {
            const newVariants = [...prev.productVariants];
            newVariants[index] = { ...newVariants[index], [field]: value };
            return { ...prev, productVariants: newVariants };
        });
    };

    const processFile = (file: File, type: 'main' | 'variant', index?: number) => {
        if (!file.type.startsWith('image/')) {
            showAlert('error', 'Format Salah', 'Hanya diperbolehkan mengupload file gambar');
            return;
        }



        if (type === 'main') {
            const imageUrl = URL.createObjectURL(file);
            setImages([{ id: Date.now(), url: imageUrl, isMain: true }]);
            setFormData(prev => ({ ...prev, defaultImgLink: file }));
        } else if (type === 'variant' && index !== undefined) {
            handleVariantChange(index, 'variantImgLink', file);
        }
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'main' | 'variant', index?: number) => {
        const file = e.target.files?.[0];
        if (file) processFile(file, type, index);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e: React.DragEvent, type: 'main' | 'variant', index?: number) => {
        e.preventDefault();
        e.stopPropagation();

        const file = e.dataTransfer.files?.[0];
        if (file) processFile(file, type, index);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.productName || !formData.category) {
            showAlert('error', 'Validasi Gagal', 'Nama produk dan kategori wajib diisi');
            return;
        }

        setIsSubmitting(true);
        try {
            const payload = {
                ...formData,
                defaultImgLink: formData.defaultImgLink instanceof File ? formData.defaultImgLink : null
            };
            const result = await submitProduct(payload, id ? Number(id) : undefined);
            if (result.success) {
                navigate('/products');
            } else {
                if (result.errors) {
                    setErrors(result.errors);
                }
                showAlert('error', 'Gagal', result.message || 'Gagal menyimpan produk');
            }
        } catch (error: any) {
            showAlert('error', 'Error', error.message || 'Terjadi kesalahan sistem');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!canAccess) {
        return <AccessDenied />;
    }

    if (isLoading) {
        return (
            <div className="loading-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <Loader2 className="animate-spin" size={40} />
            </div>
        );
    }

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
                <div className="header-info">
                    <h1>{isEdit ? `Ubah Data Produk` : 'Tambah Produk Baru'}</h1>
                    <p>{isEdit ? 'Perbarui informasi detail produk dan inventaris toko Anda.' : 'Lengkapi informasi detail produk dan unggah foto produk di bawah ini.'}</p>
                </div>
                <button className="btn-secondary" onClick={() => navigate('/products')}>
                    <ChevronLeft size={18} />
                    <span>Kembali</span>
                </button>
            </div>

            {/* Form Content */}
            <div className="form-card">
                <div className="section-header">
                    <Info size={18} className="info-icon" />
                    <span>Informasi Detail Produk</span>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-grid">
                        {/* Nama Produk */}
                        <div className="form-group">
                            <label>NAMA PRODUK</label>
                            <input
                                type="text"
                                name="productName"
                                placeholder="Contoh: Raket Badminton Pro"
                                value={formData.productName}
                                onChange={handleInputChange}
                                required
                                className={errors.productName ? 'error-input' : ''}
                            />
                            {errors.productName && <span className="error-text">{errors.productName}</span>}
                        </div>

                        {/* Kategori Produk */}
                        <div className="form-group">
                            <label>KATEGORI PRODUK</label>
                            <div className="select-wrapper">
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    required
                                    className={errors.category ? 'error-input' : ''}
                                >
                                    <option value="" disabled>Pilih Kategori</option>
                                    <option value="Makanan">Makanan</option>
                                    <option value="Minuman">Minuman</option>
                                    <option value="Raket">Raket</option>
                                    <option value="Shuttlecock">Shuttlecock</option>
                                    <option value="Sepatu">Sepatu</option>
                                    <option value="Aksesori">Aksesori</option>
                                </select>
                                <ChevronDown className="select-icon" size={18} />
                            </div>
                            {errors.category && <span className="error-text">{errors.category}</span>}
                        </div>

                        {/* Status */}
                        <div className="form-group">
                            <label>STATUS PRODUK</label>
                            <div className={`toggle-container ${errors.status ? 'error-input' : ''}`}>
                                <label className="switch">
                                    <input
                                        type="checkbox"
                                        checked={formData.status === STATUS_FLAGS.ACTIVE}
                                        onChange={(e) => setFormData(prev => ({
                                            ...prev,
                                            status: e.target.checked ? STATUS_FLAGS.ACTIVE : STATUS_FLAGS.INACTIVE
                                        }))}
                                    />
                                    <span className="slider"></span>
                                </label>
                                <span className={`status-text ${formData.status === STATUS_FLAGS.ACTIVE ? 'active' : 'inactive'}`}>
                                    {getStatusLabel(formData.status)}
                                </span>
                            </div>
                        </div>

                        {/* Deskripsi Produk */}
                        <div className="form-group full-width">
                            <label>DESKRIPSI PRODUK</label>
                            <textarea
                                name="productDesc"
                                placeholder="Masukkan deskripsi produk..."
                                value={formData.productDesc}
                                onChange={handleInputChange}
                                rows={3}
                                className={`form-textarea ${errors.productDesc ? 'error-input' : ''}`}
                            />
                            {errors.productDesc && <span className="error-text">{errors.productDesc}</span>}
                        </div>

                        {/* Foto Utama */}
                        <div className="form-group full-width">
                            <label>FOTO UTAMA PRODUK</label>
                            <div className="photo-upload-container">
                                <input
                                    type="file"
                                    ref={mainFilePickerRef}
                                    style={{ display: 'none' }}
                                    accept="image/*"
                                    onChange={(e) => handleFileUpload(e, 'main')}
                                />
                                <div
                                    className="upload-box-main"
                                    onClick={() => mainFilePickerRef.current?.click()}
                                    onDragOver={handleDragOver}
                                    onDrop={(e) => handleDrop(e, 'main')}
                                >
                                    <Upload size={32} className="upload-icon-form" />
                                    <span className="upload-title">Unggah Foto Utama</span>
                                    <span className="upload-label">Klik atau tarik ke sini</span>
                                </div>

                                <div className="photo-previews-grid">
                                    {images.map(img => (
                                        <div key={img.id} className="image-preview-box product-preview-box">
                                            <img src={img.url} alt="Product" />
                                            <button type="button" className="delete-photo-btn" onClick={() => {
                                                setImages([]);
                                                setFormData(prev => ({ ...prev, defaultImgLink: null }));
                                            }}>
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ))}
                                    {images.length === 0 && (
                                        <div className="image-placeholder-box">
                                            <ImageIcon size={24} className="placeholder-icon" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Varian Section */}
                    <div className="variants-section">
                        <div className="section-header-variants">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <Info size={18} className="info-icon" />
                                <span>Varian Produk</span>
                            </div>
                            <button type="button" className="btn-add-variant" onClick={handleAddVariant}>
                                <Plus size={16} />
                                <span>Tambah Varian</span>
                            </button>
                        </div>

                        {formData.productVariants.length === 0 && (
                            <div className="empty-variants">
                                <p>Belum ada varian produk. Klik "Tambah Varian" untuk mulai menambahkan.</p>
                            </div>
                        )}

                        <div className="variants-list">
                            {formData.productVariants.map((variant, index) => (
                                <div key={index} className="variant-item-card">
                                    <div className="variant-header">
                                        <h4>Varian #{index + 1}</h4>
                                        <button type="button" className="btn-remove-variant" onClick={() => handleRemoveVariant(index)}>
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                    <div className="variant-content-wrapper">
                                        <div className="variant-photo-section">
                                            <input
                                                type="file"
                                                ref={el => { variantFilePickerRefs.current[index] = el; }}
                                                style={{ display: 'none' }}
                                                accept="image/*"
                                                onChange={(e) => handleFileUpload(e, 'variant', index)}
                                                name={`productVariants[${index}].variantImgLink`}
                                            />
                                            <div
                                                className="variant-upload-box"
                                                onClick={() => variantFilePickerRefs.current[index]?.click()}
                                                onDragOver={handleDragOver}
                                                onDrop={(e) => handleDrop(e, 'variant', index)}
                                            >
                                                {variant.variantImgLink ? (
                                                    <div className="variant-image-preview">
                                                        <img
                                                            src={
                                                                variant.variantImgLink instanceof File
                                                                    ? URL.createObjectURL(variant.variantImgLink)
                                                                    : variant.variantImgLink
                                                            }
                                                            alt="Variant"
                                                        />
                                                        <button type="button" className="btn-remove-photo" onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleVariantChange(index, 'variantImgLink', '');
                                                        }}>
                                                            <X size={12} />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="variant-upload-placeholder">
                                                        <Upload size={20} />
                                                        <span>Foto Varian</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="variant-grid">
                                            <div className="form-group">
                                                <label>Nama Varian</label>
                                                <input
                                                    type="text"
                                                    placeholder="Contoh: Rasa Ayam Bawang"
                                                    value={variant.name}
                                                    onChange={(e) => handleVariantChange(index, 'name', e.target.value)}
                                                    required
                                                    className={errors[`productVariants[${index}].name`] ? 'error-input' : ''}
                                                    name={`productVariants[${index}].name`}
                                                />
                                                {errors[`productVariants[${index}].name`] && <span className="error-text">{errors[`productVariants[${index}].name`]}</span>}
                                            </div>
                                            <div className="form-group">
                                                <label>SKU</label>
                                                <input
                                                    type="text"
                                                    placeholder="INDM-001"
                                                    value={variant.sku}
                                                    onChange={(e) => handleVariantChange(index, 'sku', e.target.value)}
                                                    className={errors[`productVariants[${index}].sku`] ? 'error-input' : ''}
                                                    name={`productVariants[${index}].sku`}
                                                />
                                                {errors[`productVariants[${index}].sku`] && <span className="error-text">{errors[`productVariants[${index}].sku`]}</span>}
                                            </div>
                                            <div className="form-group">
                                                <label>Harga (Rp)</label>
                                                <div className="input-with-label">
                                                    <span className="input-prefix">Rp</span>
                                                    <input
                                                        type="text"
                                                        placeholder="0"
                                                        value={formatNumber(variant.price)}
                                                        onChange={(e) => handleVariantChange(index, 'price', parseFormattedNumber(e.target.value))}
                                                        className={errors[`productVariants[${index}].price`] ? 'error-input' : ''}
                                                        name={`productVariants[${index}].price`}
                                                    />
                                                </div>
                                                {errors[`productVariants[${index}].price`] && <span className="error-text">{errors[`productVariants[${index}].price`]}</span>}
                                            </div>
                                            <div className="form-group">
                                                <label>Stok</label>
                                                <input
                                                    type="number"
                                                    placeholder="0"
                                                    value={variant.stock}
                                                    onChange={(e) => handleVariantChange(index, 'stock', Number(e.target.value))}
                                                    className={errors[`productVariants[${index}].stock`] ? 'error-input' : ''}
                                                    name={`productVariants[${index}].stock`}
                                                />
                                                {errors[`productVariants[${index}].stock`] && <span className="error-text">{errors[`productVariants[${index}].stock`]}</span>}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="button" className="btn-batal" onClick={() => navigate('/products')}>Batal</button>
                        <button type="submit" className="btn-simpan" disabled={isSubmitting}>
                            {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                            <span>{isEdit ? 'Simpan Perubahan' : 'Simpan Produk'}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductForm;
