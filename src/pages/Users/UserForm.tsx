import { useState, useEffect } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import {
    ChevronDown,
    Eye,
    EyeOff,
    ChevronLeft,
    Save,
    Loader2,
    Upload,
    X,
} from 'lucide-react';
import { useUsersStore } from '../../features/users/users.store';
import { useRolesStore } from '../../features/roles/roles.store';
import { useAuthStore } from '../../features/auth/auth.store';
import { useAlertStore } from '../../app/alert.store';
import { STATUS_FLAGS, getStatusLabel } from '../../constant/flags';
import AccessDenied from '../../components/common/AccessDenied';
import './UserForm.css';

const UserForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = !!id;

    const { getUser, submitUser, isLoading } = useUsersStore();
    const { getRoles, roles } = useRolesStore();
    const { showSuccess, showError } = useAlertStore();
    const { hasPermission } = useAuthStore();

    const canAccess = isEdit ? hasPermission('USERS_EDIT') : hasPermission('USERS_CREATE');

    const [fullName, setFullName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [status, setStatus] = useState(STATUS_FLAGS.ACTIVE);
    const [roleId, setRoleId] = useState<string | number>('');
    const [profilePicture, setProfilePicture] = useState<File | null>(null);
    const [previewImg, setPreviewImg] = useState<string>('');

    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        getRoles('', null, 0, 100);
        if (isEdit && id) {
            getUser(id).then(data => {
                if (data) {
                    setFullName(data.fullName);
                    setUsername(data.username);
                    setStatus(data.status);
                    setRoleId(data.adminRole.id);
                    if (data.profilePicture) {
                        setPreviewImg(data.profilePicture);
                    }
                }
            });
        }
    }, [isEdit, id, getUser, getRoles]);

    const handleSave = async () => {
        if (!fullName || !username || (!isEdit && !password) || !roleId) {
            showError('Batal', 'Mohon lengkapi semua data yang wajib diisi.');
            return;
        }

        const payload = {
            fullName,
            username,
            status,
            adminRole: { id: roleId },
            password: password || '',
            profilePicture: profilePicture || null
        };

        const result = await submitUser(payload, id);
        if (result.success) {
            showSuccess('Berhasil', isEdit ? 'Data pengguna diperbarui.' : 'Pengguna baru didaftarkan.');
            navigate('/users');
        } else {
            if (result.errors) {
                setErrors(result.errors);
            }
            showError('Gagal', result.message);
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setProfilePicture(file);
            setPreviewImg(URL.createObjectURL(file));
        }
    };

    const handleRemoveImage = () => {
        setProfilePicture(null);
        setPreviewImg('');
    };

    if (!canAccess) {
        return <AccessDenied />;
    }

    return (
        <div className="user-form-page">
            {/* Breadcrumbs */}
            <nav className="breadcrumbs">
                <Link to="/dashboard">Beranda</Link>
                <span className="separator">›</span>
                <span>Manajemen Pengguna</span>
                <span className="separator">›</span>
                <Link to="/users">Pengguna</Link>
                <span className="separator">›</span>
                <span className="current">{isEdit ? 'Ubah Pengguna' : 'Tambah Pengguna'}</span>
            </nav>

            {/* Header */}
            <div className="page-header">
                <div className="header-info">
                    <h1>{isEdit ? `Ubah Data ${fullName}` : 'Tambah Pengguna Baru'}</h1>
                    <p>{isEdit ? 'Perbarui akses dan informasi profil admin dashboard SmashClub.' : 'Silakan lengkapi formulir di bawah ini untuk mengelola akses dashboard SmashClub.'}</p>
                </div>
                <button className="btn-secondary" onClick={() => navigate('/users')}>
                    <ChevronLeft size={18} />
                    <span>Kembali</span>
                </button>
            </div>

            {/* Main Form Card */}
            <div className="form-card">
                <div className="form-grid">
                    {/* Profile Picture Upload */}
                    <div className="form-group full-width">
                        <label>Foto Profil</label>
                        <div className="image-upload-container">
                            <div
                                className="image-upload-box"
                                onClick={() => document.getElementById('profile-upload')?.click()}
                            >
                                <input
                                    type="file"
                                    id="profile-upload"
                                    hidden
                                    accept="image/*"
                                    onChange={handleImageChange}
                                />
                                {previewImg ? (
                                    <div className="image-preview-wrapper-large">
                                        <img src={previewImg} alt="Preview" />
                                        <button
                                            type="button"
                                            className="btn-remove-image"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleRemoveImage();
                                            }}
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="upload-placeholder">
                                        <div className="upload-icon-circle">
                                            <Upload size={24} />
                                        </div>
                                        <span>Klik untuk unggah foto</span>
                                        <span className="upload-hint">JPG, PNG max 2MB</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Nama Lengkap */}
                    <div className="form-group">
                        <label>Nama Lengkap</label>
                        <input
                            type="text"
                            placeholder="Masukkan nama lengkap"
                            value={fullName}
                            onChange={(e) => {
                                setFullName(e.target.value);
                                if (errors.fullName) setErrors(prev => ({ ...prev, fullName: '' }));
                            }}
                            className={errors.fullName ? 'error-input' : ''}
                        />
                        {errors.fullName && <span className="error-text">{errors.fullName}</span>}
                    </div>

                    {/* Username / Email */}
                    <div className="form-group">
                        <label>Email / Username</label>
                        <input
                            type="text"
                            placeholder="contoh@email.com"
                            value={username}
                            onChange={(e) => {
                                setUsername(e.target.value);
                                if (errors.username) setErrors(prev => ({ ...prev, username: '' }));
                            }}
                            className={errors.username ? 'error-input' : ''}
                        />
                        {errors.username && <span className="error-text">{errors.username}</span>}
                    </div>

                    {/* Peran */}
                    <div className="form-group">
                        <label>Peran</label>
                        <div className="select-wrapper">
                            <select
                                value={roleId}
                                onChange={(e) => {
                                    setRoleId(e.target.value);
                                    if (errors.adminRole) setErrors(prev => ({ ...prev, adminRole: '' }));
                                }}
                                className={errors.adminRole ? 'error-input' : ''}
                            >
                                <option value="" disabled>Pilih Peran</option>
                                {roles.map(role => (
                                    <option key={role.id} value={role.id}>
                                        {role.roleName}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="select-icon" size={18} />
                        </div>
                        {errors.adminRole && <span className="error-text">{errors.adminRole}</span>}
                    </div>

                    {/* Kata Sandi */}
                    <div className="form-group">
                        <label>Kata Sandi</label>
                        <div className="password-input-group">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder={isEdit ? "********" : "Minimum 8 karakter"}
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    if (errors.password) setErrors(prev => ({ ...prev, password: '' }));
                                }}
                                className={errors.password ? 'error-input' : ''}
                            />
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                        {errors.password && <span className="error-text">{errors.password}</span>}
                        <p className="input-hint">Gunakan kombinasi huruf, angka, dan simbol.</p>
                        <p className="input-hint">{isEdit && 'Kosongkan jika tidak ingin mengubah'}</p>
                    </div>

                    {/* Status */}
                    <div className="form-group">
                        <label>Status Pengguna</label>
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

                <div className="form-divider"></div>

                <div className="form-actions">
                    <button className="btn-batal" onClick={() => navigate('/users')}>Batal</button>
                    <button
                        className="btn-submit"
                        onClick={handleSave}
                        disabled={isLoading}
                    >
                        {isLoading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                        <span>{isEdit ? 'Simpan Perubahan' : 'Daftarkan Pengguna'}</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserForm;
