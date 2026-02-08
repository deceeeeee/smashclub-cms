import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ShieldCheck, Loader2 } from 'lucide-react';
import { useAuthStore } from '../../features/auth/auth.store';
import { loginAdmin } from '../../features/auth/auth.api';
import './Login.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuthStore();

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);
    try {
      const result = await loginAdmin({ username, password });

      if (result.success) {
        login(
          {
            fullname: result.data.fullname,
            username: result.data.username,
            adminRole: result.data.adminRole
          },
          result.data.accessToken
        );
        navigate('/dashboard');
      } else {
        // Redundant with axios interceptor if whitelisted
        // showAlert('error', 'Login Gagal', result.message || 'Username atau password salah');
      }
    } catch (error) {
      // showAlert('error', 'Error', 'Terjadi kesalahan sistem');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Navbar */}
      <header className="login-header">
        <div className="logo-container">
          <div className="logo-icon">
            <ShieldCheck size={24} color="var(--color-primary)" />
          </div>
          <span className="logo-text">SmashClub</span>
        </div>
        <button className="btn-help">Bantuan</button>
      </header>

      {/* Main Content */}
      <main className="login-container">
        <div className="login-header-text">
          <h1>Selamat Datang</h1>
          <p>Silakan masuk ke akun administrator SmashClub Anda</p>
        </div>

        <div className="login-card">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                placeholder="Masukkan username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <div className="label-row">
                <label htmlFor="password">Kata Sandi</label>
              </div>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* <div className="form-check">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label htmlFor="remember">Ingat saya di perangkat ini</label>
            </div> */}

            <button type="submit" className="btn-submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  <span>Sedang Masuk...</span>
                </>
              ) : (
                'Masuk Sekarang'
              )}
            </button>
          </form>

          <div className="card-footer">
            <p>Belum punya akses? <a href="#">Hubungi IT Support</a></p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="login-footer">
        <div className="language-selector">
          <span className="active">Bahasa Indonesia</span>
          <span className="separator">|</span>
          <span>English</span>
        </div>
        <p className="copyright">© 2026 SmashClub CMS. Hak Cipta Dilindungi.</p>
      </footer>
    </div>
  );
};

export default LoginPage;