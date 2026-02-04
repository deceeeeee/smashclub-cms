import { useState } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import {
    User,
    ShieldCheck,
    ChevronDown,
    Camera,
    Eye,
    EyeOff,
    Save,
    ChevronLeft
} from 'lucide-react';
import './TrainerForm.css';

const TrainerForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = !!id;

    const [showPassword, setShowPassword] = useState(false);

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
                {/* Section 1: Profil */}
                <div className="form-section">
                    <div className="section-title">
                        <User size={20} className="section-icon" />
                        <h3>Informasi Profil</h3>
                    </div>

                    <div className="form-grid">
                        <div className="form-group">
                            <label>Nama Lengkap</label>
                            <input type="text" placeholder="Contoh: Budi Santoso" />
                        </div>

                        <div className="form-group">
                            <label>Spesialisasi</label>
                            <div className="select-wrapper">
                                <select defaultValue="">
                                    <option value="" disabled>Pilih Cabang Olahraga</option>
                                    <option value="futsal">Futsal</option>
                                    <option value="badminton">Badminton</option>
                                    <option value="basket">Basket</option>
                                </select>
                                <ChevronDown className="select-icon" size={18} />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Nomor Telepon (WhatsApp)</label>
                            <div className="phone-input-group">
                                <span className="phone-prefix">+62</span>
                                <input type="text" placeholder="8123456789" />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Foto Profil Pelatih</label>
                            <div className="avatar-upload-group">
                                <div className="avatar-preview-circle">
                                    <Camera size={24} color="#94a3b8" />
                                </div>
                                <button className="btn-upload">Unggah Foto</button>
                                <span className="upload-hint">JPG, PNG max. 2MB (Rasio 1:1)</span>
                            </div>
                        </div>

                        <div className="form-group full-width">
                            <label>Bio Singkat & Pengalaman</label>
                            <textarea placeholder="Ceritakan singkat tentang pengalaman melatih dan prestasi..."></textarea>
                        </div>
                    </div>
                </div>

                <div className="section-divider"></div>

                {/* Section 2: Akses */}
                <div className="form-section">
                    <div className="section-title">
                        <ShieldCheck size={20} className="section-icon" />
                        <h3>Akses Portal Pelatih</h3>
                    </div>

                    <div className="form-grid">
                        <div className="form-group">
                            <label>Email (untuk login)</label>
                            <input type="email" placeholder="pelatih@smashclub.id" />
                        </div>

                        <div className="form-group">
                            <label>Kata Sandi Sementara</label>
                            <div className="password-input-group">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="********"
                                />
                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="form-actions">
                    <button className="btn-batal" onClick={() => navigate('/trainers')}>Batal</button>
                    <button className="btn-simpan">
                        <Save size={18} />
                        {isEdit ? 'Simpan Perubahan' : 'Simpan Data Pelatih'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TrainerForm;
