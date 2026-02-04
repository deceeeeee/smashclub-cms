import { useState } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import {
    ChevronDown,
    Info,
    Save,
    ChevronLeft
} from 'lucide-react';
import { STATUS_FLAGS, getStatusLabel } from '../../constant/flags';
import './EquipmentForm.css';

const EquipmentForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = !!id;
    const [status, setStatus] = useState(STATUS_FLAGS.ACTIVE);

    return (
        <div className="equipment-form-page">
            {/* Breadcrumbs */}
            <nav className="breadcrumbs">
                <Link to="/dashboard">Beranda</Link>
                <span className="separator">›</span>
                <span>Master Data</span>
                <span className="separator">›</span>
                <Link to="/equipment">Peralatan</Link>
                <span className="separator">›</span>
                <span className="current">{isEdit ? 'Ubah Alat' : 'Tambah Alat'}</span>
            </nav>

            {/* Header Section */}
            <div className="page-header">
                <div className="header-info">
                    <h1>{isEdit ? `Ubah Data Peralatan ${id}` : 'Tambah Peralatan'}</h1>
                    <p>{isEdit ? 'Perbarui informasi detail stok atau biaya sewa peralatan olahraga Anda.' : 'Lengkapi detail di bawah ini untuk memperbarui stok atau menambahkan alat olahraga baru ke dalam sistem.'}</p>
                </div>
                <button className="btn-secondary" onClick={() => navigate('/equipment')}>
                    <ChevronLeft size={18} />
                    <span>Kembali</span>
                </button>
            </div>

            {/* Form Content */}
            <div className="form-card">
                <div className="form-grid">
                    {/* Nama Alat */}
                    <div className="form-group full-width">
                        <label>Nama Alat</label>
                        <input type="text" placeholder="Raket Yonex Astrox" />
                    </div>

                    {/* Kategori */}
                    <div className="form-group">
                        <label>Kategori</label>
                        <div className="select-wrapper">
                            <select defaultValue="raket">
                                <option value="raket">Raket</option>
                                <option value="bola">Bola</option>
                                <option value="aksesori">Aksesori</option>
                            </select>
                            <ChevronDown className="select-icon" size={18} />
                        </div>
                    </div>

                    {/* Jumlah Stok */}
                    <div className="form-group">
                        <label>Jumlah Stok</label>
                        <div className="input-with-label">
                            <input type="number" placeholder="12" />
                            <span className="input-suffix">Unit</span>
                        </div>
                    </div>

                    {/* Biaya Sewa */}
                    <div className="form-group">
                        <label>Biaya Sewa (Per Jam)</label>
                        <div className="input-with-label">
                            <span className="input-prefix">Rp</span>
                            <input type="number" placeholder="25.000" />
                        </div>
                    </div>

                    {/* Status */}
                    <div className="form-group">
                        <label>Status Alat</label>
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

                {/* Separator */}
                <div className="form-divider"></div>

                {/* Form Actions */}
                <div className="form-actions">
                    <button className="btn-batal" onClick={() => navigate('/equipment')}>Batal</button>
                    <button className="btn-simpan">
                        <Save size={18} />
                        {isEdit ? 'Update Peralatan' : 'Simpan Peralatan'}
                    </button>
                </div>
            </div>

            {/* Tips Section */}
            <div className="tips-card">
                <div className="tips-icon">
                    <Info size={20} />
                </div>
                <div className="tips-content">
                    <p><strong>Tips:</strong> Pastikan biaya sewa sudah termasuk pajak fasilitas. Stok akan otomatis berkurang jika ada penyewaan aktif yang tercatat di sistem.</p>
                </div>
            </div>
        </div>
    );
};

export default EquipmentForm;
