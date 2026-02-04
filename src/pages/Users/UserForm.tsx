import { useState } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import {
    ChevronDown,
    Eye,
    EyeOff,
    ChevronLeft
} from 'lucide-react';
import './UserForm.css';

const UserForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = !!id;

    const [showPassword, setShowPassword] = useState(false);

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
                    <h1>{isEdit ? `Ubah Data Pengguna ${id}` : 'Tambah Pengguna Baru'}</h1>
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
                        <input type="text" placeholder="Masukkan nama lengkap" />
                    </div>

                    {/* Alamat Email */}
                    <div className="form-group">
                        <label>Alamat Email</label>
                        <input type="email" placeholder="contoh@email.com" />
                    </div>

                    {/* Peran */}
                    <div className="form-group">
                        <label>Peran</label>
                        <div className="select-wrapper">
                            <select defaultValue="">
                                <option value="" disabled>Pilih Peran</option>
                                <option value="super-admin">Super Admin</option>
                                <option value="editor">Editor</option>
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
                                placeholder="Minimum 8 karakter"
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
                    </div>
                </div>

                <div className="form-divider"></div>

                <div className="form-actions">
                    <button className="btn-batal" onClick={() => navigate('/users')}>Batal</button>
                    <button className="btn-submit">{isEdit ? 'Simpan Perubahan' : 'Daftarkan Pengguna'}</button>
                </div>
            </div>
        </div>
    );
};

export default UserForm;
