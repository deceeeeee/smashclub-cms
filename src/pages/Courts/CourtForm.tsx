import { useState } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import {
    ChevronDown,
    Image as ImageIcon,
    Info,
    ChevronLeft
} from 'lucide-react';
import { STATUS_FLAGS, getStatusLabel } from '../../constant/flags';
import './CourtForm.css';

const CourtForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = !!id;
    const [status, setStatus] = useState(STATUS_FLAGS.ACTIVE);

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
                <div className="form-grid">
                    {/* Nama Lapangan */}
                    <div className="form-group">
                        <label>Nama Lapangan</label>
                        <input type="text" placeholder="Contoh: Lapangan Badminton A1" />
                    </div>

                    {/* Tipe Olahraga */}
                    <div className="form-group">
                        <label>Tipe Olahraga</label>
                        <div className="select-wrapper">
                            <select defaultValue="">
                                <option value="" disabled>Pilih jenis olahraga</option>
                                <option value="futsal">Futsal</option>
                                <option value="badminton">Badminton</option>
                                <option value="basket">Basket</option>
                            </select>
                            <ChevronDown className="select-icon" size={18} />
                        </div>
                    </div>

                    {/* Harga per Jam */}
                    <div className="form-group">
                        <label>Harga per Jam (Rp)</label>
                        <div className="input-with-label">
                            <span className="input-prefix">Rp</span>
                            <input type="number" placeholder="Contoh: 50.000" />
                        </div>
                    </div>

                    {/* Status Lapangan */}
                    <div className="form-group">
                        <label>Status Lapangan</label>
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

                    {/* Deskripsi */}
                    <div className="form-group full-width">
                        <label>Catatan / Deskripsi Fasilitas</label>
                        <textarea placeholder="Tambahkan detail jika perlu..."></textarea>
                    </div>

                    {/* Foto Lapangan */}
                    <div className="form-group full-width">
                        <label>Foto Lapangan</label>
                        <div className="upload-area">
                            <div className="upload-content">
                                <ImageIcon size={32} className="upload-icon" />
                                <p>Klik untuk unggah atau seret gambar ke sini</p>
                                <span>PNG, JPG up to 5MB</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Form Actions */}
                <div className="form-actions">
                    <button className="btn-batal" onClick={() => navigate('/courts')}>Batal</button>
                    <button className="btn-simpan">{isEdit ? 'Update Lapangan' : 'Simpan Lapangan'}</button>
                </div>
            </div>

            {/* Management Tips */}
            <div className="tips-card">
                <div className="tips-icon">
                    <Info size={20} />
                </div>
                <div className="tips-content">
                    <h4>Tips Manajemen</h4>
                    <p>Pastikan tipe olahraga sesuai karena akan mempengaruhi tampilan di aplikasi pemesanan pelanggan.</p>
                </div>
            </div>
        </div>
    );
};

export default CourtForm;
