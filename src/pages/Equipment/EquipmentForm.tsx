import { useState, useEffect } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import {
    ChevronDown,
    Info,
    Save,
    ChevronLeft,
    Loader2
} from 'lucide-react';
import { STATUS_FLAGS, getStatusLabel } from '../../constant/flags';
import { useEquipmentStore } from '../../features/equipment/equipment.store';
import { useEquipmentCategoryStore } from '../../features/equipment-category/equipment-category.store';
import { useAlertStore } from '../../app/alert.store';
import { formatNumber, parseFormattedNumber } from '../../utils/format';
import './EquipmentForm.css';

const EquipmentForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = !!id;

    const { getEquipmentDetail, submitEquipment } = useEquipmentStore();
    const { categories, getCategories } = useEquipmentCategoryStore();
    const { showAlert } = useAlertStore();

    const [formData, setFormData] = useState({
        equipmentName: '',
        brand: '',
        type: '',
        stock: 0,
        price: 0,
        status: STATUS_FLAGS.ACTIVE,
        categoryId: 0
    });

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
                    categoryId: data.equipmentCategory?.id || 0
                });
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
                }
            };
            const result = await submitEquipment(payload, id ? Number(id) : undefined);
            if (result.success) {
                // Success alert is handled by axios interceptor whitelisted paths
                navigate('/equipment');
            }
        } catch (error: any) {
            showAlert('error', 'Error', error.message || 'Terjadi kesalahan sistem');
        } finally {
            setIsSubmitting(false);
        }
    };

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
                            />
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
                            />
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
                            />
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
                                >
                                    <option value={0} disabled>Pilih Kategori</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.categoryName}</option>
                                    ))}
                                </select>
                                <ChevronDown className="select-icon" size={18} />
                            </div>
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
                                />
                                <span className="input-suffix">Unit</span>
                            </div>
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
                                    }}
                                    required
                                />
                            </div>
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
