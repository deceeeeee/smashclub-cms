import { useState, useEffect } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import {
    ChevronDown,
    Eye,
    EyeOff,
    ChevronLeft,
    Save,
    Loader2
} from 'lucide-react';
import { useUsersStore } from '../../features/users/users.store';
import { useRolesStore } from '../../features/roles/roles.store';
import { useAlertStore } from '../../app/alert.store';
import { STATUS_FLAGS, getStatusLabel } from '../../constant/flags';
import './UserForm.css';

const UserForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = !!id;

    const { getUser, submitUser, isLoading } = useUsersStore();
    const { getRoles, roles } = useRolesStore();
    const { showSuccess, showError } = useAlertStore();

    const [fullName, setFullName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [status, setStatus] = useState(STATUS_FLAGS.ACTIVE);
    const [roleId, setRoleId] = useState<string | number>('');

    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        getRoles('', 0, 100);
        if (isEdit && id) {
            getUser(id).then(data => {
                if (data) {
                    setFullName(data.fullName);
                    setUsername(data.username);
                    setStatus(data.status);
                    setRoleId(data.adminRole.id);
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
        };

        const result = await submitUser(payload, id);
        if (result.success) {
            showSuccess('Berhasil', isEdit ? 'Data pengguna diperbarui.' : 'Pengguna baru didaftarkan.');
            navigate('/users');
        } else {
            showError('Gagal', result.message);
        }
    };

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
                    {/* Nama Lengkap */}
                    <div className="form-group">
                        <label>Nama Lengkap</label>
                        <input
                            type="text"
                            placeholder="Masukkan nama lengkap"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                        />
                    </div>

                    {/* Username / Email */}
                    <div className="form-group">
                        <label>Email / Username</label>
                        <input
                            type="text"
                            placeholder="contoh@email.com"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>

                    {/* Peran */}
                    <div className="form-group">
                        <label>Peran</label>
                        <div className="select-wrapper">
                            <select
                                value={roleId}
                                onChange={(e) => setRoleId(e.target.value)}
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
                    </div>

                    {/* Kata Sandi */}
                    <div className="form-group">
                        <label>Kata Sandi</label>
                        <div className="password-input-group">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder={isEdit ? "********" : "Minimum 8 karakter"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
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
