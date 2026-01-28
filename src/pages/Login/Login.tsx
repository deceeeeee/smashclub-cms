import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ShieldCheck } from 'lucide-react';
import './Login.css';
const LoginPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login attempt:', { email, password, rememberMe });
    // TODO: Implement actual login logic
    navigate('/dashboard');
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
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                placeholder="nama@perusahaan.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <div className="label-row">
                <label htmlFor="password">Kata Sandi</label>
                <a href="#" className="forgot-password">Lupa Kata Sandi?</a>
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
            <div className="form-check">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label htmlFor="remember">Ingat saya di perangkat ini</label>
            </div>
            <button type="submit" className="btn-submit">
              Masuk Sekarang
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