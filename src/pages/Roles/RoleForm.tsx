import { useState, useEffect } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import {
    Info,
    Shield,
    ChevronLeft,
    Check,
    Save,
    Loader2
} from 'lucide-react';
import { useRolesStore } from '../../features/roles/roles.store';
import { usePermissionsStore } from '../../features/permissions/permissions.store';
import { useAuthStore } from '../../features/auth/auth.store';
import { useAlertStore } from '../../app/alert.store';
import { getMenuIcon } from '../../components/icons/MenuIcons';
import { STATUS_FLAGS, getStatusLabel } from '../../constant/flags';
import AccessDenied from '../../components/common/AccessDenied';
import './RoleForm.css';

const RoleForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = !!id;

    const { getRole, submitRole, isLoading } = useRolesStore();
    const { getPermissions, permissions: availablePermissions, isLoading: isLoadingPermissions } = usePermissionsStore();
    const { showSuccess, showError } = useAlertStore();
    const { hasPermission } = useAuthStore();

    const canAccess = isEdit ? hasPermission('ROLES_EDIT') : hasPermission('ROLES_CREATE');

    const [roleName, setRoleName] = useState('');
    const [roleCode, setRoleCode] = useState('');
    const [status, setStatus] = useState(1);

    const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);
    const [selectedMenuIds, setSelectedMenuIds] = useState<number[]>([]);
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        getPermissions();
        if (isEdit && id) {
            getRole(id).then(data => {
                if (data) {
                    setRoleName(data.roleName);
                    setRoleCode(data.roleCode);
                    setStatus(data.status);
                    // Map existing permissions and menus to state
                    const existingPermIds = data.permissionSet?.map(p => p.id) || [];
                    const existingMenuIds = data.menuSet?.map(m => m.id) || [];
                    setSelectedPermissions(existingPermIds);
                    setSelectedMenuIds(existingMenuIds);
                }
            });
        }
    }, [isEdit, id, getRole, getPermissions]);

    // Group permissions by menuCode
    const groupedPermissions = availablePermissions.reduce((acc, permission) => {
        const menuCode = permission.menu.menuCode;
        if (!acc[menuCode]) {
            acc[menuCode] = {
                menuName: permission.menu.menuName,
                permissions: []
            };
        }
        acc[menuCode].permissions.push(permission);
        return acc;
    }, {} as Record<string, { menuName: string; permissions: any[] }>);

    const togglePermissionId = (id: number) => {
        const permission = availablePermissions.find(p => p.id === id);
        if (!permission) return;

        const menuId = permission.menu.id;

        setSelectedPermissions(prev => {
            const isRemoving = prev.includes(id);
            const next = isRemoving ? prev.filter(pId => pId !== id) : [...prev, id];

            // Update menuIds
            if (!isRemoving) {
                setSelectedMenuIds(mPrev => mPrev.includes(menuId) ? mPrev : [...mPrev, menuId]);
            } else {
                const hasOtherPermInSameMenu = availablePermissions.some(p =>
                    p.menu.id === menuId && next.includes(p.id)
                );
                if (!hasOtherPermInSameMenu) {
                    setSelectedMenuIds(mPrev => mPrev.filter(mId => mId !== menuId));
                }
            }
            return next;
        });
    };

    const toggleMenuAll = (permissionIds: number[]) => {
        if (permissionIds.length === 0) return;

        const firstPermission = availablePermissions.find(p => p.id === permissionIds[0]);
        if (!firstPermission) return;
        const menuId = firstPermission.menu.id;

        const allSelected = permissionIds.every(id => selectedPermissions.includes(id));
        if (allSelected) {
            setSelectedPermissions(prev => prev.filter(id => !permissionIds.includes(id)));
            setSelectedMenuIds(mPrev => mPrev.filter(mId => mId !== menuId));
        } else {
            setSelectedPermissions(prev => [...new Set([...prev, ...permissionIds])]);
            setSelectedMenuIds(mPrev => mPrev.includes(menuId) ? mPrev : [...mPrev, menuId]);
        }
    };

    const handleSave = async () => {
        if (!roleName || !roleCode) {
            showError('Validasi Gagal', 'Nama Peran dan Kode Peran harus diisi.');
            return;
        }

        // Use explicitly managed selectedMenuIds

        const payload = {
            roleName,
            roleCode,
            status,
            menuSet: selectedMenuIds.map(id => ({ id })),
            permissionSet: selectedPermissions.map(id => ({ id }))
        };

        const result = await submitRole(payload, id);
        if (result.success) {
            showSuccess('Berhasil', isEdit ? 'Data peran berhasil diperbarui.' : 'Data peran baru berhasil disimpan.');
            navigate('/roles');
        } else {
            if (result.errors) {
                setErrors(result.errors);
            }
            showError('Gagal Menyimpan', result.message);
        }
    };

    if (!canAccess) {
        return <AccessDenied />;
    }

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
                <div className="header-info">
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
                    <div className="basic-info-grid">
                        <div className="form-group">
                            <label>NAMA PERAN</label>
                            <input
                                type="text"
                                placeholder="Contoh: Admin Lapangan"
                                value={roleName}
                                onChange={(e) => {
                                    setRoleName(e.target.value);
                                    if (errors.roleName) setErrors(prev => ({ ...prev, roleName: '' }));
                                }}
                                className={errors.roleName ? 'error-input' : ''}
                            />
                            {errors.roleName && <span className="error-text">{errors.roleName}</span>}
                        </div>
                        <div className="form-group">
                            <label>KODE PERAN</label>
                            <input
                                type="text"
                                placeholder="Contoh: ADM_LAP"
                                value={roleCode}
                                onChange={(e) => {
                                    setRoleCode(e.target.value);
                                    if (errors.roleCode) setErrors(prev => ({ ...prev, roleCode: '' }));
                                }}
                                className={errors.roleCode ? 'error-input' : ''}
                            />
                            {errors.roleCode && <span className="error-text">{errors.roleCode}</span>}
                        </div>
                        <div className="form-group">
                            <label>STATUS</label>
                            <div className={`toggle-container ${errors.status ? 'error-input' : ''}`}>
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
                    <span className="input-hint">Nama dan kode peran harus unik dalam sistem.</span>
                </div>

                {/* Permissions Section */}
                <div className="permissions-container">
                    <div className="section-header">
                        <Shield size={20} className="section-icon teal" />
                        <h3>Konfigurasi Hak Akses</h3>
                    </div>

                    {isLoadingPermissions ? (
                        <div className="loading-state">
                            <Loader2 className="animate-spin" size={24} />
                            <span>Memuat daftar hak akses...</span>
                        </div>
                    ) : Object.keys(groupedPermissions).length === 0 ? (
                        <div className="empty-state">
                            Tidak ada data hak akses yang tersedia.
                        </div>
                    ) : (
                        Object.entries(groupedPermissions).map(([menuCode, data]) => {
                            const permissionIds = data.permissions.map(p => p.id);
                            const selectedCount = permissionIds.filter(id => selectedPermissions.includes(id)).length;
                            const isAllSelected = permissionIds.length > 0 && selectedCount === permissionIds.length;
                            const MenuIcon = getMenuIcon(menuCode);

                            return (
                                <div className="module-card" key={menuCode}>
                                    <div className="module-header">
                                        <div className="module-title">
                                            <MenuIcon size={18} className="module-icon" />
                                            <span>{data.menuName}</span>
                                            <span className="selection-badge">{selectedCount} terpilih</span>
                                        </div>
                                        <label className="select-all">
                                            <span>PILIH SEMUA</span>
                                            <input
                                                type="checkbox"
                                                checked={isAllSelected}
                                                onChange={() => toggleMenuAll(permissionIds)}
                                            />
                                            <span className="checkbox-custom"></span>
                                        </label>
                                    </div>
                                    <div className="permission-grid">
                                        {data.permissions.map(p => (
                                            <div
                                                key={p.id}
                                                className={`permission-item ${selectedPermissions.includes(p.id) ? 'active' : ''}`}
                                                onClick={() => togglePermissionId(p.id)}
                                            >
                                                <div className="checkbox-box">
                                                    {selectedPermissions.includes(p.id) && <Check size={14} />}
                                                </div>
                                                <span>{p.permissionName}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })
                    )}
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
                    <button
                        className="btn-primary-teal"
                        onClick={handleSave}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <Loader2 size={18} className="animate-spin" />
                        ) : (
                            <Save size={18} />
                        )}
                        <span>{isLoading ? 'Menyimpan...' : (isEdit ? 'Ubah Sekarang' : 'Simpan Peran')}</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RoleForm;

