import { useState } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import {
    UserPlus,
    User,
    Fingerprint,
    Mail,
    Calendar,
    Save,
    ChevronLeft
} from 'lucide-react';
import { STATUS_FLAGS, getStatusLabel } from '../../constant/flags';
import { useAuthStore } from '../../features/auth/auth.store';
import AccessDenied from '../../components/common/AccessDenied';
import './PlayerForm.css';

const PlayerForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = !!id;
    const { hasPermission } = useAuthStore();

    // Players only has EDIT/READ/DELETE in API docs, so we use EDIT for form access
    const canAccess = hasPermission('PLAYER_EDIT');

    const [status, setStatus] = useState(STATUS_FLAGS.ACTIVE);

    if (!canAccess) {
        return <AccessDenied />;
    }

    return (
        <div className="player-form-page">
            {/* Breadcrumbs */}
            <nav className="breadcrumbs">
                <Link to="/dashboard">Beranda</Link>
                <span className="separator">›</span>
                <span>Laporan</span>
                <span className="separator">›</span>
                <Link to="/players">Pemain</Link>
                <span className="separator">›</span>
                <span className="current">{isEdit ? 'Ubah Pemain' : 'Tambah Pemain'}</span>
            </nav>

            {/* Header */}
            <div className="page-header">
                <div className="header-info">
                    <h1>{isEdit ? `Ubah Data Pemain ${id}` : 'Tambah Pemain Baru'}</h1>
                    <p>{isEdit ? 'Perbarui informasi detail pemain dan status keanggotaan SmashClub.' : 'Isi informasi detail pemain di bawah ini untuk didaftarkan ke sistem SmashClub.'}</p>
                </div>
                <button className="btn-secondary" onClick={() => navigate('/players')}>
                    <ChevronLeft size={18} />
                    <span>Kembali</span>
                </button>
            </div>

            {/* Form Content */}
            <div className="form-card">
                <div className="section-title">
                    <UserPlus size={20} className="section-icon" />
                    <span>Informasi Pribadi & Keanggotaan</span>
                </div>

                <div className="form-grid">
                    {/* Nama Lengkap */}
                    <div className="form-group">
                        <label>NAMA LENGKAP</label>
                        <div className="input-with-icon">
                            <User size={18} className="field-icon" />
                            <input type="text" placeholder="Contoh: Budi Santoso" />
                        </div>
                    </div>

                    {/* ID Member */}
                    <div className="form-group">
                        <label>ID MEMBER</label>
                        <div className="input-with-icon">
                            <Fingerprint size={18} className="field-icon" />
                            <input type="text" placeholder="SC-2024-XXXX" />
                        </div>
                    </div>

                    {/* Email Address */}
                    <div className="form-group">
                        <label>EMAIL ADDRESS</label>
                        <div className="input-with-icon">
                            <Mail size={18} className="field-icon" />
                            <input type="email" placeholder="budi.santoso@email.com" />
                        </div>
                    </div>

                    {/* Tanggal Bergabung */}
                    <div className="form-group">
                        <label>TANGGAL BERGABUNG</label>
                        <div className="input-with-icon">
                            <Calendar size={18} className="field-icon" />
                            <input type="date" />
                        </div>
                    </div>

                    {/* Status Keanggotaan */}
                    <div className="form-group full-width">
                        <label>STATUS KEANGGOTAAN</label>
                        <div className="toggle-container">
                            <label className="switch">
                                <input
                                    type="checkbox"
                                    checked={status === STATUS_FLAGS.ACTIVE}
                                    onChange={(e) => setStatus(e.target.checked ? STATUS_FLAGS.ACTIVE : STATUS_FLAGS.INACTIVE)}
                                />
                                <span className="slider"></span>
                            </label>
                            <span className={`status-text ${status === STATUS_FLAGS.ACTIVE ? 'active' : 'inactive'}`}>
                                {getStatusLabel(status)}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="form-actions">
                    <button className="btn-batal" onClick={() => navigate('/players')}>Batalkan</button>
                    <button className="btn-simpan">
                        <Save size={18} />
                        {isEdit ? 'Simpan Perubahan' : 'Simpan Data Pemain'}
                    </button>
                </div>
            </div>

            {/* Help Banner */}
            {/* <div className="help-banner">
                <div className="help-content">
                    <h3>Butuh Bantuan?</h3>
                    <p>Hubungi IT Support SmashClub jika mengalami kendala input data.</p>
                </div>
                <div className="help-icon-wrapper">
                    <HelpCircle size={48} />
                </div>
            </div> */}
        </div>
    );
};

export default PlayerForm;
