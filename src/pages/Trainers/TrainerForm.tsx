import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import {
    User,
    Save,
    ChevronLeft,
    Loader2,
    Upload,
    X
} from 'lucide-react';
import { useTrainersStore } from '../../features/trainers/trainers.store';
import { useAuthStore } from '../../features/auth/auth.store';
import { useAlertStore } from '../../app/alert.store';
import { STATUS_FLAGS } from '../../constant/flags';
import AccessDenied from '../../components/common/AccessDenied';
import { formatNumber, parseFormattedNumber } from '../../utils/format';
import './TrainerForm.css';

const TrainerForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = !!id;

    const { getTrainer, submitTrainer, isLoading } = useTrainersStore();
    const { showAlert } = useAlertStore();
    const { hasPermission } = useAuthStore();

    const canAccess = isEdit ? hasPermission('COACH_EDIT') : hasPermission('COACH_CREATE');

    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        coachCode: '',
        coachName: '',
        pricePerHour: 0,
        status: STATUS_FLAGS.ACTIVE,
        coachImgLink: null as File | string | null
    });

    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [errors, setErrors] = useState<Record<string, string>>({});

    // Load trainer data if editing
    useEffect(() => {
        if (isEdit && id) {
            loadTrainerData();
        }
    }, [id, isEdit]);

    const loadTrainerData = async () => {
        if (!id) return;

        const response = await getTrainer(Number(id));
        if (response && response.success) {
            const trainer = response.data;
            setFormData({
                coachCode: trainer.coachCode,
                coachName: trainer.coachName,
                pricePerHour: trainer.pricePerHour,
                status: trainer.status,
                coachImgLink: trainer.coachImgLink
            });
            if (trainer.coachImgLink) {
                setPreviewUrl(trainer.coachImgLink);
            }
        } else {
            showAlert('error', 'Error', 'Gagal memuat data pelatih');
            navigate('/trainers');
        }
    };

    const handleInputChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                showAlert('error', 'Format Salah', 'Hanya diperbolehkan mengupload file gambar');
                return;
            }
            setFormData(prev => ({ ...prev, coachImgLink: file }));
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const clearImage = () => {
        setFormData(prev => ({ ...prev, coachImgLink: null }));
        setPreviewUrl(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.coachCode.trim()) {
            newErrors.coachCode = 'Kode pelatih harus diisi';
        }

        if (!formData.coachName.trim()) {
            newErrors.coachName = 'Nama pelatih harus diisi';
        }

        if (!formData.pricePerHour || formData.pricePerHour <= 0) {
            newErrors.pricePerHour = 'Harga per jam harus lebih dari 0';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            showAlert('error', 'Validasi Gagal', 'Mohon lengkapi semua field yang wajib diisi');
            return;
        }

        setIsSubmitting(true);

        try {
            const payload = {
                ...formData,
                coachImgLink: formData.coachImgLink instanceof File ? formData.coachImgLink : null
            };
            const result = await submitTrainer(payload, id ? Number(id) : undefined);

            if (result.success) {
                showAlert('success', 'Berhasil', isEdit ? 'Data pelatih berhasil diperbarui' : 'Pelatih baru berhasil ditambahkan');
                navigate('/trainers');
            } else {
                if (result.errors) {
                    setErrors(result.errors);
                }
                showAlert('error', 'Gagal', result.message || 'Terjadi kesalahan saat menyimpan data');
            }
        } catch (error: any) {
            showAlert('error', 'Error', error.message || 'Terjadi kesalahan pada sistem');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!canAccess) {
        return <AccessDenied />;
    }

    return (
        <div className="trainer-form-page">
            {/* Breadcrumbs */}
            <nav className="breadcrumbs">
                <Link to="/dashboard">Beranda</Link>
                <span className="separator">›</span>
                <span>Master Data</span>
                <span className="separator">›</span>
                <Link to="/trainers">Pelatih</Link>
                <span className="separator">›</span>
                <span className="current">{isEdit ? 'Ubah Pelatih' : 'Tambah Pelatih'}</span>
            </nav>

            {/* Header */}
            <div className="page-header">
                <div className="header-info">
                    <h1>{isEdit ? `Ubah Profil Pelatih ${id}` : 'Tambah Pelatih Baru'}</h1>
                    <p>{isEdit ? 'Perbarui informasi profil dan hak akses pelatih SmashClub.' : 'Lengkapi informasi profil pelatih SmashClub di bawah ini untuk didaftarkan ke sistem.'}</p>
                </div>
                <button className="btn-secondary" onClick={() => navigate('/trainers')}>
                    <ChevronLeft size={18} />
                    <span>Kembali</span>
                </button>
            </div>

            {/* Form Content */}
            <div className="form-card">
                <form onSubmit={handleSubmit}>
                    {/* Section 1: Profil */}
                    <div className="form-section">
                        <div className="section-title">
                            <User size={20} className="section-icon" />
                            <h3>Informasi Profil</h3>
                        </div>

                        <div className="form-grid">
                            {/* Kode Pelatih */}
                            <div className="form-group">
                                <label>Kode Pelatih <span style={{ color: '#ef4444' }}>*</span></label>
                                <input
                                    type="text"
                                    placeholder="Contoh: CCH-01"
                                    value={formData.coachCode}
                                    onChange={(e) => handleInputChange('coachCode', e.target.value)}
                                    disabled={isLoading || isSubmitting}
                                    className={errors.coachCode ? 'error-input' : ''}
                                />
                                {errors.coachCode && <span className="error-text">{errors.coachCode}</span>}
                            </div>

                            {/* Nama Lengkap */}
                            <div className="form-group">
                                <label>Nama Lengkap <span style={{ color: '#ef4444' }}>*</span></label>
                                <input
                                    type="text"
                                    placeholder="Contoh: Budi Santoso"
                                    value={formData.coachName}
                                    onChange={(e) => handleInputChange('coachName', e.target.value)}
                                    disabled={isLoading || isSubmitting}
                                    className={errors.coachName ? 'error-input' : ''}
                                />
                                {errors.coachName && <span className="error-text">{errors.coachName}</span>}
                            </div>

                            {/* Harga per Jam */}
                            <div className="form-group">
                                <label>Harga per Jam (Rp) <span style={{ color: '#ef4444' }}>*</span></label>
                                <div className={`price-input-group ${errors.pricePerHour ? 'error-input' : ''}`}>
                                    <span className="price-prefix">Rp</span>
                                    <input
                                        type="text"
                                        placeholder="200.000"
                                        value={formatNumber(formData.pricePerHour)}
                                        onChange={(e) => handleInputChange('pricePerHour', parseFormattedNumber(e.target.value))}
                                        disabled={isLoading || isSubmitting}
                                    />
                                </div>
                                {errors.pricePerHour && <span className="error-text">{errors.pricePerHour}</span>}
                            </div>

                            {/* Status */}
                            <div className="form-group">
                                <label>Status</label>
                                <div className={`toggle-container ${errors.status ? 'error-input' : ''}`}>
                                    <label className="switch">
                                        <input
                                            type="checkbox"
                                            checked={formData.status === STATUS_FLAGS.ACTIVE}
                                            onChange={(e) => handleInputChange('status', e.target.checked ? STATUS_FLAGS.ACTIVE : STATUS_FLAGS.INACTIVE)}
                                            disabled={isLoading || isSubmitting}
                                        />
                                        <span className="slider"></span>
                                    </label>
                                    <span className={`status-text ${formData.status === STATUS_FLAGS.ACTIVE ? 'active' : 'inactive'}`}>
                                        {formData.status === STATUS_FLAGS.ACTIVE ? 'Aktif' : 'Tidak Aktif'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="form-group full-width" style={{ marginTop: '1.5rem' }}>
                        <label>Foto Pelatih</label>
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
                                    <span className="upload-title">Unggah Foto Pelatih</span>
                                    <span className="upload-label">Klik untuk memilih gambar</span>
                                </div>
                            ) : (
                                <div className="photo-previews-grid">
                                    <div className="image-preview-box">
                                        <img src={previewUrl} alt="Coach Preview" />
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

                    <div className="section-divider"></div>

                    {/* Form Actions */}
                    <div className="form-actions">
                        <button
                            type="button"
                            className="btn-batal"
                            onClick={() => navigate('/trainers')}
                            disabled={isSubmitting}
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            className="btn-simpan"
                            disabled={isLoading || isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" />
                                    <span>{isEdit ? 'Memperbarui...' : 'Menyimpan...'}</span>
                                </>
                            ) : (
                                <>
                                    <Save size={18} />
                                    {isEdit ? 'Simpan Perubahan' : 'Simpan Data Pelatih'}
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TrainerForm;
