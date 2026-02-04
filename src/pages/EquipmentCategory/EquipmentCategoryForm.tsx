import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ChevronLeft, Save, Loader2 } from 'lucide-react';
import { useEquipmentCategoryStore } from '../../features/equipment-category/equipment-category.store';
import './EquipmentCategoryForm.css';

const EquipmentCategoryForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = !!id;

    const { getCategoryDetail, submitCategory } = useEquipmentCategoryStore();

    const [formData, setFormData] = useState({
        categoryName: '',
        status: 1
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (isEdit) {
            loadDetail();
        }
    }, [id]);

    const loadDetail = async () => {
        const response = await getCategoryDetail(Number(id));
        if (response?.success) {
            setFormData({
                categoryName: response.data.categoryName,
                status: response.data.status
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const result = await submitCategory(formData, id ? Number(id) : undefined);

        if (result.success) {
            // success is handled by axios interceptor usually, but let's be safe
            navigate('/equipment-categories');
        }

        setIsSubmitting(false);
    };

    return (
        <div className="equipment-category-form-page">
            {/* Breadcrumbs */}
            <nav className="breadcrumbs">
                <Link to="/dashboard">Beranda</Link>
                <span className="separator">›</span>
                <span>Master Data</span>
                <span className="separator">›</span>
                <Link to="/equipment-categories">Kategori Peralatan</Link>
                <span className="separator">›</span>
                <span className="current">{isEdit ? 'Ubah Kategori' : 'Tambah Kategori'}</span>
            </nav>

            {/* Header Section */}
            <div className="page-header">
                <div className="header-text">
                    <h1>{isEdit ? 'Ubah Kategori' : 'Tambah Kategori Baru'}</h1>
                    <p>Silakan {isEdit ? 'perbarui' : 'isi'} informasi kategori di bawah ini.</p>
                </div>
                <button className="btn-secondary" onClick={() => navigate('/equipment-categories')}>
                    <ChevronLeft size={18} />
                    <span>Kembali</span>
                </button>
            </div>

            <div className="form-card">
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="categoryName">Nama Kategori</label>
                        <input
                            id="categoryName"
                            type="text"
                            placeholder="Contoh: Raket, Bola, dll."
                            value={formData.categoryName}
                            onChange={(e) => setFormData({ ...formData, categoryName: e.target.value })}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Status</label>
                        <div className="toggle-container">
                            <label className="switch">
                                <input
                                    type="checkbox"
                                    checked={formData.status === 1}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.checked ? 1 : 0 })}
                                />
                                <span className="slider"></span>
                            </label>
                            <span className={`status-text ${formData.status === 1 ? 'active' : 'inactive'}`}>
                                {formData.status === 1 ? 'Aktif' : 'Tidak Aktif'}
                            </span>
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="button" className="btn-batal" onClick={() => navigate('/equipment-categories')}>
                            Batal
                        </button>
                        <button type="submit" className="btn-simpan" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <Loader2 className="animate-spin" size={18} />
                            ) : (
                                <Save size={18} />
                            )}
                            <span>{isEdit ? 'Simpan Perubahan' : 'Tambah Kategori'}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EquipmentCategoryForm;
