import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
    Save,
    Loader2,
    Eye,
    EyeOff,
    User,
    Upload,
    X
} from 'lucide-react';
import { useAuthStore } from '../../features/auth/auth.store';
import { useAlertStore } from '../../app/alert.store';
import { updateProfile } from '../../features/auth/auth.api';
import './ProfileForm.css';

const ProfileForm = () => {
    const navigate = useNavigate();
    const { user, login, token } = useAuthStore();
    const { showSuccess, showError } = useAlertStore();

    const [fullName, setFullName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [profilePicture, setProfilePicture] = useState<File | null>(null);
    const [previewImg, setPreviewImg] = useState<string>('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (user) {
            setFullName(user.fullname || '');
            setUsername(user.username || '');
            if (user.profilePicture) {
                setPreviewImg(user.profilePicture);
            }
        }
    }, [user]);

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

    const handleSave = async () => {
        if (!fullName || !username) {
            showError('Validasi Gagal', 'Nama lengkap dan username wajib diisi.');
            return;
        }

        setIsLoading(true);
        setErrors({});

        try {
            const payload = {
                fullName,
                username,
                password: password || undefined,
                profilePicture: profilePicture || null
            };

            const response = await updateProfile(payload);

            if (response.success) {
                // Update local auth state with new details
                // We need to keep the existing token and role info, just update user details
                if (user && token) {
                    const updatedUser = {
                        ...user,
                        fullname: fullName,
                        username: username,
                        profilePicture: response.data.profilePicture
                    };
                    login(updatedUser, token);
                }

                showSuccess('Berhasil', 'Profil Anda berhasil diperbarui.');
                setPassword(''); // Clear password field after success
            } else {
                showError('Gagal', response.message || 'Gagal memperbarui profil.');
            }
        } catch (error: any) {
            const errorData = error.response?.data;
            if (errorData?.errors) {
                setErrors(errorData.errors);
            }
            showError('Error', error.response?.data?.message || 'Terjadi kesalahan saat memperbarui profil.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="user-form-page">
            {/* Header */}
            <div className="page-header">
                <div className="header-info">
                    <h1>Profil Saya</h1>
                    <p>Kelola informasi akun dan kata sandi Anda.</p>
                </div>
            </div>

            {/* Main Form Card */}
            <div className="form-card">
                <div className="form-grid">
                    {/* Access Level Badge */}
                    <div className="form-group full-width">
                        <div className="profile-badge-container">
                            <div className="profile-badge-icon">
                                <User size={20} />
                            </div>
                            <div>
                                <h4 className="profile-badge-title">Anda Masuk Sebagai</h4>
                                <span className="profile-badge-role">
                                    {user?.adminRole?.roleName || 'Pengguna'}
                                </span>
                            </div>
                        </div>
                    </div>

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

                    {/* Username */}
                    <div className="form-group">
                        <label>Username</label>
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => {
                                setUsername(e.target.value);
                                if (errors.username) setErrors(prev => ({ ...prev, username: '' }));
                            }}
                            className={errors.username ? 'error-input' : ''}
                        />
                        {errors.username && <span className="error-text">{errors.username}</span>}
                    </div>

                    {/* Kata Sandi */}
                    <div className="form-group">
                        <label>Kata Sandi Baru</label>
                        <div className="password-input-group">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Kosongkan jika tidak ingin mengubah"
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
                        <p className="input-hint">Minimal 8 karakter. Kosongkan jika tidak ingin mengubah password.</p>
                    </div>
                </div>

                <div className="form-divider"></div>

                <div className="form-actions">
                    <button className="btn-batal" onClick={() => navigate('/dashboard')}>Kembali</button>
                    <button
                        className="btn-submit"
                        onClick={handleSave}
                        disabled={isLoading}
                    >
                        {isLoading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                        <span>Simpan Profil</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfileForm;
