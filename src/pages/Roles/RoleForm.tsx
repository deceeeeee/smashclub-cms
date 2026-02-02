import { useState } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import {
    Info,
    Shield,
    ChevronLeft,
    Check,
    Save,
    MapPin,
    DollarSign,
    Users
} from 'lucide-react';
import './RoleForm.css';

const RoleForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = !!id;

    const [permissions, setPermissions] = useState({
        fields: { view: true, add: false, edit: false, delete: false },
        finance: { view: false, add: false, edit: false, delete: false },
        users: { view: false, add: false, edit: false, delete: false },
    });

    const togglePermission = (module: string, action: string) => {
        setPermissions(prev => ({
            ...prev,
            [module]: {
                ...prev[module as keyof typeof prev],
                [action]: !prev[module as keyof typeof prev][action as keyof (typeof prev)['fields']]
            }
        }));
    };

    const toggleAll = (module: string) => {
        const mod = permissions[module as keyof typeof permissions];
        const allChecked = Object.values(mod).every(v => v);
        setPermissions(prev => ({
            ...prev,
            [module]: {
                view: !allChecked,
                add: !allChecked,
                edit: !allChecked,
                delete: !allChecked
            }
        }));
    };

    return (
        <div className="role-form-page">
            {/* Breadcrumbs */}
            <nav className="breadcrumbs">
                <Link to="/dashboard">Beranda</Link>
                <span className="separator">›</span>
                <span>Pengaturan</span>
                <span className="separator">›</span>
                <Link to="/roles">Manajemen Peran</Link>
                <span className="separator">›</span>
                <span className="current">{isEdit ? 'Ubah Peran' : 'Tambah Peran'}</span>
            </nav>

            {/* Header */}
            <div className="page-header">
                <div className="header-left">
                    <h1>{isEdit ? 'Ubah Data Peran' : 'Tambah Peran Baru'}</h1>
                    <p>Tentukan nama peran dan atur hak akses spesifik untuk modul CMS SmashClub.</p>
                </div>
                <button className="btn-secondary" onClick={() => navigate('/roles')}>
                    <ChevronLeft size={18} />
                    <span>Kembali</span>
                </button>
            </div>

            <div className="form-container">
                {/* Basic Info Section */}
                <div className="form-section">
                    <div className="section-header">
                        <Info size={20} className="section-icon teal" />
                        <h3>Informasi Dasar</h3>
                    </div>
                    <div className="form-group">
                        <label>NAMA PERAN</label>
                        <input type="text" placeholder="Contoh: Admin Lapangan, Kasir, atau Manager" />
                        <span className="input-hint">Nama peran harus unik dan mudah diidentifikasi.</span>
                    </div>
                </div>

                {/* Permissions Section */}
                <div className="permissions-container">
                    <div className="section-header">
                        <Shield size={20} className="section-icon teal" />
                        <h3>Konfigurasi Hak Akses</h3>
                    </div>

                    {/* Module: Management Lapangan */}
                    <div className="module-card">
                        <div className="module-header">
                            <div className="module-title">
                                <MapPin size={18} className="module-icon" />
                                <span>Manajemen Lapangan</span>
                            </div>
                            <label className="select-all">
                                <span>PILIH SEMUA</span>
                                <input
                                    type="checkbox"
                                    checked={Object.values(permissions.fields).every(v => v)}
                                    onChange={() => toggleAll('fields')}
                                />
                                <span className="checkbox-custom"></span>
                            </label>
                        </div>
                        <div className="permission-grid">
                            {['view', 'add', 'edit', 'delete'].map(action => (
                                <div
                                    key={action}
                                    className={`permission-item ${permissions.fields[action as keyof typeof permissions.fields] ? 'active' : ''}`}
                                    onClick={() => togglePermission('fields', action)}
                                >
                                    <div className="checkbox-box">
                                        {permissions.fields[action as keyof typeof permissions.fields] && <Check size={14} />}
                                    </div>
                                    <span>{action === 'view' ? 'Lihat' : action === 'add' ? 'Tambah' : action === 'edit' ? 'Edit' : 'Hapus'} Lapangan</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Module: Manajemen Keuangan */}
                    <div className="module-card">
                        <div className="module-header">
                            <div className="module-title">
                                <DollarSign size={18} className="module-icon" />
                                <span>Manajemen Keuangan</span>
                            </div>
                            <label className="select-all">
                                <span>PILIH SEMUA</span>
                                <input
                                    type="checkbox"
                                    checked={Object.values(permissions.finance).every(v => v)}
                                    onChange={() => toggleAll('finance')}
                                />
                                <span className="checkbox-custom"></span>
                            </label>
                        </div>
                        <div className="permission-grid">
                            <div
                                className={`permission-item ${permissions.finance.view ? 'active' : ''}`}
                                onClick={() => togglePermission('finance', 'view')}
                            >
                                <div className="checkbox-box">
                                    {permissions.finance.view && <Check size={14} />}
                                </div>
                                <span>Lihat Laporan</span>
                            </div>
                            <div
                                className={`permission-item ${permissions.finance.add ? 'active' : ''}`}
                                onClick={() => togglePermission('finance', 'add')}
                            >
                                <div className="checkbox-box">
                                    {permissions.finance.add && <Check size={14} />}
                                </div>
                                <span>Input Transaksi</span>
                            </div>
                            <div
                                className={`permission-item ${permissions.finance.edit ? 'active' : ''}`}
                                onClick={() => togglePermission('finance', 'edit')}
                            >
                                <div className="checkbox-box">
                                    {permissions.finance.edit && <Check size={14} />}
                                </div>
                                <span>Proses Refund</span>
                            </div>
                        </div>
                    </div>

                    {/* Module: Manajemen Pengguna */}
                    <div className="module-card">
                        <div className="module-header">
                            <div className="module-title">
                                <Users size={18} className="module-icon" />
                                <span>Manajemen Pengguna</span>
                            </div>
                            <label className="select-all">
                                <span>PILIH SEMUA</span>
                                <input
                                    type="checkbox"
                                    checked={Object.values(permissions.users).every(v => v)}
                                    onChange={() => toggleAll('users')}
                                />
                                <span className="checkbox-custom"></span>
                            </label>
                        </div>
                        <div className="permission-grid">
                            <div
                                className={`permission-item ${permissions.users.view ? 'active' : ''}`}
                                onClick={() => togglePermission('users', 'view')}
                            >
                                <div className="checkbox-box">
                                    {permissions.users.view && <Check size={14} />}
                                </div>
                                <span>Lihat Profil</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sticky Actions Footer */}
            <div className="sticky-footer">
                <div className="footer-left">
                    <Shield size={16} className="shield-icon" />
                    <span>Pastikan hak akses diberikan sesuai tanggung jawab peran tersebut.</span>
                </div>
                <div className="footer-actions">
                    <button className="btn-outline" onClick={() => navigate('/roles')}>Batal</button>
                    <button className="btn-primary-teal">
                        <Save size={18} />
                        <span>Simpan Perubahan</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RoleForm;
