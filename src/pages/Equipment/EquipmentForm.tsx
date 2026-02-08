import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import {
    ChevronDown,
    Info,
    Save,
    ChevronLeft,
    Loader2,
    Upload,
    X
} from 'lucide-react';
import { STATUS_FLAGS, getStatusLabel } from '../../constant/flags';
import { useEquipmentStore } from '../../features/equipment/equipment.store';
import { useEquipmentCategoryStore } from '../../features/equipment-category/equipment-category.store';
import { useAuthStore } from '../../features/auth/auth.store';
import { useAlertStore } from '../../app/alert.store';
import { formatNumber, parseFormattedNumber } from '../../utils/format';
import AccessDenied from '../../components/common/AccessDenied';
import './EquipmentForm.css';

const EquipmentForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = !!id;

    const { getEquipmentDetail, submitEquipment } = useEquipmentStore();
    const { categories, getCategories } = useEquipmentCategoryStore();
    const { showAlert } = useAlertStore();
    const { hasPermission } = useAuthStore();

    const canAccess = isEdit ? hasPermission('EQUIPMENT_EDIT') : hasPermission('EQUIPMENT_CREATE');

    const [formData, setFormData] = useState({
        equipmentName: '',
        brand: '',
        type: '',
        stock: 0,
        price: 0,
        status: STATUS_FLAGS.ACTIVE,
        categoryId: 0,
        equipmentImgLink: null as File | string | null
    });

    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        loadInitialData();
    }, [id]);

    const loadInitialData = async () => {
        setIsLoading(true);
        // Load categories first for the dropdown
        await getCategories('', 0, 100);

        if (isEdit) {
            const response = await getEquipmentDetail(Number(id));
            if (response && response.success) {
                const data = response.data;
                setFormData({
                    equipmentName: data.equipmentName,
                    brand: data.brand,
                    type: data.type,
                    stock: data.stock,
                    price: data.price,
                    status: data.status,
                    categoryId: data.equipmentCategory?.id || 0,
                    equipmentImgLink: data.equipmentImgLink
                });
                if (data.equipmentImgLink) {
                    setPreviewUrl(data.equipmentImgLink);
                }
            } else {
                showAlert('error', 'Gagal', 'Gagal memuat data peralatan');
                navigate('/equipment');
            }
        }
        setIsLoading(false);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'stock' || name === 'price' || name === 'categoryId' ? Number(value) : value
        }));
        // Clear error when user changes input
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                showAlert('error', 'Format Salah', 'Hanya diperbolehkan mengupload file gambar');
                return;
            }
            setFormData(prev => ({ ...prev, equipmentImgLink: file }));
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const clearImage = () => {
        setFormData(prev => ({ ...prev, equipmentImgLink: null }));
        setPreviewUrl(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.equipmentName || !formData.categoryId || formData.price <= 0) {
            showAlert('error', 'Validasi Gagal', 'Mohon lengkapi data yang wajib diisi');
            return;
        }

        setIsSubmitting(true);
        try {
            const payload = {
                equipmentName: formData.equipmentName,
                brand: formData.brand,
                type: formData.type,
                stock: formData.stock,
                price: formData.price,
                status: formData.status,
                equipmentCategory: {
                    id: formData.categoryId
                },
                equipmentImgLink: formData.equipmentImgLink instanceof File ? formData.equipmentImgLink : null
            };
            const result = await submitEquipment(payload, id ? Number(id) : undefined);
            if (result.success) {
                // Success alert is handled by axios interceptor whitelisted paths
                navigate('/equipment');
            } else {
                if (result.errors) {
                    setErrors(result.errors);
                }
                showAlert('error', 'Gagal', result.message || 'Gagal menyimpan peralatan');
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
        <div className="equipment-form-page">
            {/* Breadcrumbs */}
            <nav className="breadcrumbs">
                <Link to="/dashboard">Beranda</Link>
                <span className="separator">›</span>
                <span>Master Data</span>
                <span className="separator">›</span>
                <Link to="/equipment">Peralatan</Link>
                <span className="separator">›</span>
                <span className="current">{isEdit ? 'Ubah Alat' : 'Tambah Alat'}</span>
            </nav>

            {/* Header Section */}
            <div className="page-header">
                <div className="header-info">
                    <h1>{isEdit ? `Ubah Data Peralatan` : 'Tambah Peralatan'}</h1>
                    <p>{isEdit ? 'Perbarui informasi detail stok atau biaya sewa peralatan olahraga Anda.' : 'Lengkapi detail di bawah ini untuk memperbarui stok atau menambahkan alat olahraga baru ke dalam sistem.'}</p>
                </div>
                <button className="btn-secondary" onClick={() => navigate('/equipment')}>
                    <ChevronLeft size={18} />
                    <span>Kembali</span>
                </button>
            </div>

            {/* Form Content */}
            <div className="form-card">
                <form onSubmit={handleSubmit}>
                    <div className="form-grid">
                        {/* Nama Alat */}
                        <div className="form-group full-width">
                            <label>Nama Alat</label>
                            <input
                                type="text"
                                name="equipmentName"
                                placeholder="Raket Yonex Astrox"
                                value={formData.equipmentName}
                                onChange={handleInputChange}
                                required
                                className={errors.equipmentName ? 'error-input' : ''}
                            />
                            {errors.equipmentName && <span className="error-text">{errors.equipmentName}</span>}
                        </div>

                        {/* Brand */}
                        <div className="form-group">
                            <label>Merek (Brand)</label>
                            <input
                                type="text"
                                name="brand"
                                placeholder="Yonex"
                                value={formData.brand}
                                onChange={handleInputChange}
                                className={errors.brand ? 'error-input' : ''}
                            />
                            {errors.brand && <span className="error-text">{errors.brand}</span>}
                        </div>

                        {/* Type */}
                        <div className="form-group">
                            <label>Tipe Alat</label>
                            <input
                                type="text"
                                name="type"
                                placeholder="Astrox 88D Pro"
                                value={formData.type}
                                onChange={handleInputChange}
                                className={errors.type ? 'error-input' : ''}
                            />
                            {errors.type && <span className="error-text">{errors.type}</span>}
                        </div>

                        {/* Kategori */}
                        <div className="form-group">
                            <label>Kategori</label>
                            <div className="select-wrapper">
                                <select
                                    name="categoryId"
                                    value={formData.categoryId}
                                    onChange={handleInputChange}
                                    required
                                    className={errors.categoryId ? 'error-input' : ''}
                                >
                                    <option value={0} disabled>Pilih Kategori</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.categoryName}</option>
                                    ))}
                                </select>
                                <ChevronDown className="select-icon" size={18} />
                            </div>
                            {errors.categoryId && <span className="error-text">{errors.categoryId}</span>}
                        </div>

                        {/* Jumlah Stok */}
                        <div className="form-group">
                            <label>Jumlah Stok</label>
                            <div className="input-with-label">
                                <input
                                    type="number"
                                    name="stock"
                                    placeholder="12"
                                    value={formData.stock}
                                    onChange={handleInputChange}
                                    className={errors.stock ? 'error-input' : ''}
                                />
                                <span className="input-suffix">Unit</span>
                            </div>
                            {errors.stock && <span className="error-text">{errors.stock}</span>}
                        </div>

                        {/* Biaya Sewa */}
                        <div className="form-group">
                            <label>Biaya Sewa (Per Jam)</label>
                            <div className="input-with-label">
                                <span className="input-prefix">Rp</span>
                                <input
                                    type="text"
                                    name="price"
                                    placeholder="25.000"
                                    value={formatNumber(formData.price)}
                                    onChange={(e) => {
                                        const parsed = parseFormattedNumber(e.target.value);
                                        setFormData(prev => ({ ...prev, price: parsed }));
                                        if (errors.price) setErrors(prev => ({ ...prev, price: '' }));
                                    }}
                                    required
                                    className={errors.price ? 'error-input' : ''}
                                />
                            </div>
                            {errors.price && <span className="error-text">{errors.price}</span>}
                        </div>

                        {/* Status */}
                        <div className="form-group">
                            <label>Status Alat</label>
                            <div className="toggle-container">
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

                        {/* Image Upload */}
                        <div className="form-group full-width" style={{ marginTop: '1.5rem', gridColumn: 'span 2' }}>
                            <label>Foto Peralatan</label>
                            <div className="photo-upload-container">
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    style={{ display: 'none' }}
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />

                                {!previewUrl ? (
                                    <div
                                        className="upload-box-main"
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        <Upload size={32} className="upload-icon-form" />
                                        <span className="upload-title">Unggah Foto Peralatan</span>
                                        <span className="upload-label">Klik untuk memilih gambar</span>
                                    </div>
                                ) : (
                                    <div className="photo-previews-grid">
                                        <div className="image-preview-box">
                                            <img src={previewUrl} alt="Equipment Preview" />
                                            <button
                                                type="button"
                                                className="delete-photo-btn"
                                                onClick={clearImage}
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Separator */}
                    <div className="form-divider"></div>

                    {/* Form Actions */}
                    <div className="form-actions">
                        <button type="button" className="btn-batal" onClick={() => navigate('/equipment')}>Batal</button>
                        <button type="submit" className="btn-simpan" disabled={isSubmitting}>
                            {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                            <span>{isEdit ? 'Update Peralatan' : 'Simpan Peralatan'}</span>
                        </button>
                    </div>
                </form>
            </div>

            {/* Tips Section */}
            <div className="tips-card">
                <div className="tips-icon">
                    <Info size={20} />
                </div>
                <div className="tips-content">
                    <p><strong>Tips:</strong> Pastikan biaya sewa sudah termasuk pajak fasilitas. Stok akan otomatis berkurang jika ada penyewaan aktif yang tercatat di sistem.</p>
                </div>
            </div>
        </div>
    );
};

export default EquipmentForm;
