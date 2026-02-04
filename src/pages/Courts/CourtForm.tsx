import { useState, useEffect } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import {
    ChevronDown,
    Image as ImageIcon,
    Info,
    ChevronLeft,
    Loader2
} from 'lucide-react';
import { STATUS_FLAGS, getStatusLabel } from '../../constant/flags';
import { useCourtsStore } from '../../features/courts/courts.store';
import { useAlertStore } from '../../app/alert.store';
import './CourtForm.css';

const CourtForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = !!id;

    const { getCourt, submitCourt, isLoading } = useCourtsStore();
    const { showAlert } = useAlertStore();

    // Form state
    const [formData, setFormData] = useState({
        courtCode: '',
        courtName: '',
        openTime: '08:00',
        closeTime: '17:00',
        status: STATUS_FLAGS.ACTIVE
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Load court data if editing
    useEffect(() => {
        if (isEdit && id) {
            loadCourtData();
        }
    }, [id, isEdit]);

    const loadCourtData = async () => {
        if (!id) return;

        const court = await getCourt(id);
        if (court) {
            setFormData({
                courtCode: court.courtCode,
                courtName: court.courtName,
                openTime: court.openTime,
                closeTime: court.closeTime,
                status: court.status
            });
        } else {
            showAlert('error', 'Error', 'Gagal memuat data lapangan');
        }
    };

    const handleInputChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.courtCode.trim()) {
            newErrors.courtCode = 'Kode lapangan harus diisi';
        }

        if (!formData.courtName.trim()) {
            newErrors.courtName = 'Nama lapangan harus diisi';
        }

        if (!formData.openTime) {
            newErrors.openTime = 'Jam buka harus diisi';
        }

        if (!formData.closeTime) {
            newErrors.closeTime = 'Jam tutup harus diisi';
        }

        if (formData.openTime && formData.closeTime && formData.openTime >= formData.closeTime) {
            newErrors.closeTime = 'Jam tutup harus lebih besar dari jam buka';
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
            const result = await submitCourt(formData, id);

            if (result.success) {
                showAlert('success', 'Berhasil', isEdit ? 'Data lapangan berhasil diperbarui' : 'Lapangan baru berhasil ditambahkan');
                navigate('/courts');
            } else {
                showAlert('error', 'Gagal', result.message || 'Terjadi kesalahan saat menyimpan data');
            }
        } catch (error: any) {
            showAlert('error', 'Error', error.message || 'Terjadi kesalahan pada sistem');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="court-form-page">
            {/* Breadcrumbs */}
            <nav className="breadcrumbs">
                <Link to="/dashboard">Beranda</Link>
                <span className="separator">›</span>
                <span>Master Data</span>
                <span className="separator">›</span>
                <Link to="/courts">Lapangan</Link>
                <span className="separator">›</span>
                <span className="current">{isEdit ? 'Ubah Lapangan' : 'Tambah Lapangan'}</span>
            </nav>

            {/* Header Section */}
            <div className="page-header">
                <div className="header-info">
                    <h1>{isEdit ? `Ubah Data Lapangan ${id}` : 'Tambah Lapangan Baru'}</h1>
                    <p>{isEdit ? 'Perbarui informasi fasilitas lapangan Anda di bawah ini.' : 'Silakan isi formulir di bawah untuk menambah fasilitas baru ke sistem SmashClub.'}</p>
                </div>
                <button className="btn-secondary" onClick={() => navigate('/courts')}>
                    <ChevronLeft size={18} />
                    <span>Kembali</span>
                </button>
            </div>

            {/* Form Content */}
            <div className="form-card">
                <form onSubmit={handleSubmit}>
                    <div className="form-grid">
                        {/* Kode Lapangan */}
                        <div className="form-group">
                            <label>Kode Lapangan <span style={{ color: '#ef4444' }}>*</span></label>
                            <input
                                type="text"
                                placeholder="Contoh: CC"
                                value={formData.courtCode}
                                onChange={(e) => handleInputChange('courtCode', e.target.value)}
                                disabled={isLoading || isSubmitting}
                            />
                            {errors.courtCode && <span className="error-text">{errors.courtCode}</span>}
                        </div>

                        {/* Nama Lapangan */}
                        <div className="form-group">
                            <label>Nama Lapangan <span style={{ color: '#ef4444' }}>*</span></label>
                            <input
                                type="text"
                                placeholder="Contoh: Court C"
                                value={formData.courtName}
                                onChange={(e) => handleInputChange('courtName', e.target.value)}
                                disabled={isLoading || isSubmitting}
                            />
                            {errors.courtName && <span className="error-text">{errors.courtName}</span>}
                        </div>

                        {/* Jam Buka */}
                        <div className="form-group">
                            <label>Jam Buka <span style={{ color: '#ef4444' }}>*</span></label>
                            <input
                                type="time"
                                value={formData.openTime}
                                onChange={(e) => handleInputChange('openTime', e.target.value)}
                                disabled={isLoading || isSubmitting}
                            />
                            {errors.openTime && <span className="error-text">{errors.openTime}</span>}
                        </div>

                        {/* Jam Tutup */}
                        <div className="form-group">
                            <label>Jam Tutup <span style={{ color: '#ef4444' }}>*</span></label>
                            <input
                                type="time"
                                value={formData.closeTime}
                                onChange={(e) => handleInputChange('closeTime', e.target.value)}
                                disabled={isLoading || isSubmitting}
                            />
                            {errors.closeTime && <span className="error-text">{errors.closeTime}</span>}
                        </div>
                    </div>

                    {/* Status Lapangan */}
                    <div className="form-group full-width">
                        <label>Status Lapangan</label>
                        <div className="toggle-container">
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
                                {getStatusLabel(formData.status)}
                            </span>
                        </div>
                    </div>
                </form>
            </div>

            {/* Form Actions */}
            <div className="form-actions">
                <button
                    type="button"
                    className="btn-batal"
                    onClick={() => navigate('/courts')}
                    disabled={isSubmitting}
                >
                    Batal
                </button>
                <button
                    type="submit"
                    className="btn-simpan"
                    disabled={isLoading || isSubmitting}
                    onClick={handleSubmit}
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 size={18} className="animate-spin" />
                            <span>{isEdit ? 'Memperbarui...' : 'Menyimpan...'}</span>
                        </>
                    ) : (
                        <span>{isEdit ? 'Update Lapangan' : 'Simpan Lapangan'}</span>
                    )}
                </button>
            </div>
        </div>
    );
};

export default CourtForm;
